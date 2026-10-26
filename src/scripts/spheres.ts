// Esferas da marca: dois campos (água e violeta) que se fundem como no símbolo.
// Renderizado em WebGL; sem suporte, o CSS mostra uma versão estática em SVG.

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform vec2 u_c1;
uniform vec2 u_c2;
uniform float u_r1;
uniform float u_r2;
uniform float u_k;
uniform vec3 u_colA;
uniform vec3 u_colB;

void main() {
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  // Distância até cada círculo, unidas por uma "mínima suave": nasce a ponte entre eles.
  float a = length(p - u_c1) - u_r1;
  float b = length(p - u_c2) - u_r2;
  float h = max(u_k - abs(a - b), 0.0) / u_k;
  float d = min(a, b) - h * h * u_k * 0.25;
  float alpha = clamp(0.5 - d, 0.0, 1.0);

  vec2 axis = u_c2 - u_c1;
  float s = clamp(dot(p - u_c1, axis) / max(dot(axis, axis), 1.0), 0.0, 1.0);
  vec3 col = mix(u_colA, u_colB, smoothstep(0.15, 0.85, s));
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

type Mode = 'hero' | 'finale';

const hex = (h: string) => {
  const n = parseInt(h.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function setup(canvas: HTMLCanvasElement) {
  const mode = (canvas.dataset.mode as Mode) ?? 'hero';
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false, alpha: true });
  if (!gl) return;

  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const U = {
    res: u('u_res'),
    c1: u('u_c1'),
    c2: u('u_c2'),
    r1: u('u_r1'),
    r2: u('u_r2'),
    k: u('u_k'),
  };
  gl.uniform3fv(u('u_colA'), hex('#88bfbf'));
  gl.uniform3fv(u('u_colB'), hex('#7b5da6'));

  canvas.classList.add('is-live');
  // Com o WebGL ativo, a versão estática de reserva sai de cena.
  canvas.parentElement?.querySelector('.sig-static')?.remove();

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0;
  let h = 0;
  let dpr = 1;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  new ResizeObserver(resize).observe(canvas);

  // Ponteiro, em coordenadas do canvas.
  const pointer = { x: 0, y: 0, active: false };
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = pointer.x > -80 && pointer.y > -80 && pointer.x < r.width + 80 && pointer.y < r.height + 80;
    },
    { passive: true },
  );

  // Posições suavizadas (molas simples).
  const c1 = { x: 0, y: 0 };
  const c2 = { x: 0, y: 0 };
  let first = true;
  let visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '80px' }).observe(canvas);

  const progress = () => {
    const r = canvas.getBoundingClientRect();
    const vh = window.innerHeight;
    return Math.min(Math.max((vh - r.top) / (vh * 0.5 + r.height * 0.5), 0), 1);
  };

  const draw = (now: number) => {
    requestAnimationFrame(draw);
    if (!visible || document.hidden) return;
    const t = reduce ? 6 : now / 1000;
    const R = Math.min(w, h * 2.2) * (mode === 'hero' ? 0.19 : 0.2);
    // Distância entre as bordas das esferas.
    let edge: number;
    if (mode === 'hero') {
      // Respiração: a ponte se forma e se desfaz devagar.
      edge = R * (0.25 + 0.35 * Math.sin(t * 0.45));
    } else {
      // No contato, as esferas se aproximam com o scroll até se fundirem.
      const p = reduce ? 1 : progress();
      edge = R * (1.4 - 1.75 * (1 - Math.pow(1 - p, 3)));
    }
    const gap = R * 2.04 + edge;
    const cx = w / 2;
    const cy = h / 2;
    const bob = reduce ? 0 : R * 0.06;
    const t1 = { x: cx - gap / 2 + Math.cos(t * 0.6) * bob, y: cy + Math.sin(t * 0.7) * bob };
    const t2 = { x: cx + gap / 2 + Math.cos(t * 0.5 + 2) * bob, y: cy + Math.sin(t * 0.55 + 1) * bob };

    if (pointer.active && !reduce) {
      // A esfera mais próxima do cursor se inclina na direção dele.
      const near = Math.hypot(pointer.x - t1.x, pointer.y - t1.y) < Math.hypot(pointer.x - t2.x, pointer.y - t2.y) ? t1 : t2;
      near.x += (pointer.x - near.x) * 0.22;
      near.y += (pointer.y - near.y) * 0.22;
    }

    // Mantém as esferas inteiras dentro do canvas, sem cortes nas bordas.
    const m = R * 1.08;
    const fit = (v: number, size: number) => (size > m * 2 ? Math.min(Math.max(v, m), size - m) : size / 2);
    [t1, t2].forEach((c) => {
      c.x = fit(c.x, w);
      c.y = fit(c.y, h);
    });

    const k = first ? 1 : 0.08;
    first = false;
    c1.x += (t1.x - c1.x) * k;
    c1.y += (t1.y - c1.y) * k;
    c2.x += (t2.x - c2.x) * k;
    c2.y += (t2.y - c2.y) * k;

    gl.uniform2f(U.res, canvas.width, canvas.height);
    gl.uniform2f(U.c1, c1.x * dpr, c1.y * dpr);
    gl.uniform2f(U.c2, c2.x * dpr, c2.y * dpr);
    gl.uniform1f(U.r1, R * dpr);
    gl.uniform1f(U.r2, R * 1.04 * dpr);
    gl.uniform1f(U.k, R * 0.8 * dpr);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  requestAnimationFrame(draw);
}

export function initSpheres() {
  if (document.documentElement.dataset.signature !== 'esferas') return;
  document.querySelectorAll<HTMLCanvasElement>('canvas.spheres').forEach(setup);
}
