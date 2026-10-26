// Fio da marca: as duas linhas que se cruzam no símbolo B∞F.
// No topo, o cruzamento acompanha o cursor; no contato, os fios se fecham em um ∞.

type Pt = [number, number];
type Thread = [Pt, Pt, Pt, Pt, Pt, Pt, Pt]; // M + 2 curvas cúbicas

// Estado aberto: dois fios em S que se cruzam no centro (cx, cy).
const open = (cx: number, cy: number, sway: number): [Thread, Thread] => [
  [[0, 0.08], [cx * 0.62, 0.08 - sway], [cx * 0.7, cy], [cx, cy], [cx + (1 - cx) * 0.3, cy], [cx + (1 - cx) * 0.38, 0.92 + sway], [1, 0.92]],
  [[0, 0.92], [cx * 0.62, 0.92 + sway], [cx * 0.7, cy], [cx, cy], [cx + (1 - cx) * 0.3, cy], [cx + (1 - cx) * 0.38, 0.08 - sway], [1, 0.08]],
];

// Estado fechado: cada fio vira uma das voltas do infinito.
const closed: [Thread, Thread] = [
  [[0.5, 0.5], [0.64, 0.12], [1, 0.04], [1, 0.5], [1, 0.96], [0.64, 0.88], [0.5, 0.5]],
  [[0.5, 0.5], [0.36, 0.88], [0, 0.96], [0, 0.5], [0, 0.04], [0.36, 0.12], [0.5, 0.5]],
];

const mix = (a: Thread, b: Thread, k: number) => a.map((p, i) => [p[0] + (b[i][0] - p[0]) * k, p[1] + (b[i][1] - p[1]) * k] as Pt) as Thread;

const toPath = (t: Thread, w: number, h: number) => {
  const f = (p: Pt) => `${(p[0] * w).toFixed(1)} ${(p[1] * h).toFixed(1)}`;
  return `M${f(t[0])}C${f(t[1])} ${f(t[2])} ${f(t[3])}C${f(t[4])} ${f(t[5])} ${f(t[6])}`;
};

function setup(svg: SVGSVGElement) {
  const mode = svg.dataset.mode ?? 'hero';
  const paths = [...svg.querySelectorAll<SVGPathElement>('path')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  svg.classList.add('is-live');

  const pointer = { x: 0.5, y: 0.5, active: false };
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = svg.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width;
      pointer.y = (e.clientY - r.top) / r.height;
      pointer.active = pointer.x > -0.1 && pointer.x < 1.1 && pointer.y > -0.2 && pointer.y < 1.2;
    },
    { passive: true },
  );

  const cur = { x: 0.5, y: 0.5 };
  let visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '80px' }).observe(svg);

  const progress = () => {
    const r = svg.getBoundingClientRect();
    const vh = window.innerHeight;
    return Math.min(Math.max((vh - r.top) / (vh * 0.5 + r.height * 0.5), 0), 1);
  };

  const draw = (now: number) => {
    requestAnimationFrame(draw);
    if (!visible || document.hidden) return;
    const t = now / 1000;
    const { width: w, height: h } = svg.viewBox.baseVal;
    let threads: [Thread, Thread];

    if (mode === 'hero') {
      const tx = pointer.active && !reduce ? 0.2 + Math.min(Math.max(pointer.x, 0), 1) * 0.6 : 0.5;
      const ty = pointer.active && !reduce ? 0.35 + Math.min(Math.max(pointer.y, 0), 1) * 0.3 : 0.5;
      cur.x += (tx - cur.x) * 0.06;
      cur.y += (ty - cur.y) * 0.06;
      threads = open(cur.x, cur.y, reduce ? 0 : Math.sin(t * 0.5) * 0.05);
    } else {
      const p = reduce ? 1 : progress();
      const k = 1 - Math.pow(1 - p, 3);
      const [a, b] = open(0.5, 0.5, 0);
      threads = [mix(a, closed[0], k), mix(b, closed[1], k)];
    }

    paths[0].setAttribute('d', toPath(threads[0], w, h));
    paths[1].setAttribute('d', toPath(threads[1], w, h));
  };
  requestAnimationFrame(draw);
}

export function initThreads() {
  if (document.documentElement.dataset.signature !== 'fio') return;
  document.querySelectorAll<SVGSVGElement>('svg.threads').forEach(setup);
}
