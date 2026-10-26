// Fio da seção de serviços: duas linhas (água e violeta) descem entre as metades como uma
// corrente de pequenos ∞, sempre se cruzando na altura do título de cada serviço.
// O fio se desenha conforme a página rola; ao passar o mouse em um serviço,
// as voltas ao redor do título dele se abrem.

const AMP = 16; // largura de cada volta, a partir do centro
const BUMP = 1.1; // quanto as voltas crescem perto do serviço em destaque
const WAVE = 260; // altura aproximada de cada volta
const TAPER = 70; // as pontas do fio afinam ao longo desta distância

export function initServicesAxis() {
  const wrap = document.querySelector<HTMLElement>('#servicos .rows-wrap');
  if (!wrap) return;
  const list = wrap.querySelector<HTMLElement>('.rows')!;
  const svg = wrap.querySelector<SVGSVGElement>('.axis')!;
  const [pa, pb] = [...svg.querySelectorAll<SVGPathElement>('path')];
  const rows = [...wrap.querySelectorAll<HTMLElement>('.row')];
  const knots = rows.map((r) => r.querySelector<SVGElement>('.knot')!);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let cx = 0;
  let height = 0;
  let bounds: number[] = [];
  let halves: number[] = [];
  let titles: number[] = [];
  let active = -1;
  let focusY = 0; // altura do serviço em destaque (suavizada)
  let bump = 0; // intensidade do destaque (suavizada)
  let visible = false;
  let dirty = true;

  const measure = () => {
    const box = wrap.getBoundingClientRect();
    height = box.height;
    svg.setAttribute('viewBox', `0 0 ${box.width} ${height}`);
    const k = knots[0].getBoundingClientRect();
    cx = k.left + k.width / 2 - box.left;
    titles = knots.map((n) => {
      const r = n.getBoundingClientRect();
      return r.top + r.height / 2 - box.top;
    });
    // Entre dois cruzamentos cabe um número inteiro de meias-voltas, para o fio
    // cruzar exatamente em cada título.
    bounds = [0, ...titles, height];
    halves = bounds.slice(1).map((y, i) => Math.max(1, Math.round((y - bounds[i]) / (WAVE / 2))));
    dirty = true;
  };

  const phaseAt = (y: number) => {
    let acc = 0;
    for (let i = 0; i < bounds.length - 1; i++) {
      const y0 = bounds[i];
      const y1 = bounds[i + 1];
      if (y <= y1) return (acc + ((y - y0) / (y1 - y0)) * halves[i]) * Math.PI;
      acc += halves[i];
    }
    return acc * Math.PI;
  };

  const build = () => {
    let a = '';
    let b = '';
    for (let y = 0; y <= height; y += 3) {
      const taper = Math.min(1, y / TAPER, (height - y) / TAPER);
      const ease = taper * taper * (3 - 2 * taper);
      const near = bump * BUMP * Math.exp(-(((y - focusY) / 110) ** 2));
      const dx = AMP * ease * (1 + near) * Math.sin(phaseAt(y));
      const cmd = a ? 'L' : 'M';
      a += `${cmd}${(cx + dx).toFixed(1)} ${y}`;
      b += `${cmd}${(cx - dx).toFixed(1)} ${y}`;
    }
    pa.setAttribute('d', a);
    pb.setAttribute('d', b);
  };

  const progress = () => {
    if (reduce) return 1;
    const r = wrap.getBoundingClientRect();
    return Math.min(Math.max((window.innerHeight * 0.95 - r.top) / r.height, 0), 1);
  };

  const frame = () => {
    requestAnimationFrame(frame);
    if (!visible) return;

    const targetBump = active >= 0 ? 1 : 0;
    if (active >= 0) focusY += (titles[active] - focusY) * (reduce ? 1 : 0.18);
    const nextBump = reduce ? targetBump : bump + (targetBump - bump) * 0.12;
    if (Math.abs(nextBump - bump) > 0.002 || dirty) {
      bump = Math.abs(nextBump - targetBump) < 0.002 ? targetBump : nextBump;
      build();
      dirty = false;
    }

    const off = String(1 - progress());
    pa.style.strokeDashoffset = off;
    pb.style.strokeDashoffset = off;
  };

  const setActive = (i: number) => {
    if (i >= 0 && active < 0) focusY = titles[i];
    active = i;
    rows.forEach((r, j) => r.classList.toggle('is-active', j === i));
    list.classList.toggle('has-active', i >= 0);
  };

  if (window.matchMedia('(hover: hover)').matches) {
    rows.forEach((row, i) => {
      row.addEventListener('pointerenter', () => setActive(i));
      row.addEventListener('pointerleave', () => setActive(-1));
    });
  }

  // No celular, o nó de cada serviço se desenha quando aparece na tela.
  if (reduce) rows.forEach((r) => r.classList.add('is-in'));
  else {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.35 },
    );
    rows.forEach((r) => io.observe(r));
  }

  new ResizeObserver(measure).observe(wrap);
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '120px' }).observe(wrap);
  measure();
  requestAnimationFrame(frame);
}
