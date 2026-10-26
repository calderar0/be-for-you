// Símbolo da Be For You: o B desenhado como um ∞ em pé, num traço contínuo.
// As duas barrigas do B são as voltas de uma lemniscata, que se cruzam no meio.
// Usado pelo componente Logo.astro e pelo gerador dos arquivos da marca (scripts/brand.mjs).

const CX = 60;
const CY = 70;
const HALF_H = 60; // metade da altura do símbolo
const HALF_W = 40; // largura de cada barriga, a partir do centro

// Lemniscata de Bernoulli em pé, começando e terminando na ponta de baixo.
const lemniscate = (steps = 180) => {
  const k = HALF_W / 0.3536;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const d = 1 + Math.sin(t) ** 2;
    const x = CX + (k * Math.sin(t) * Math.cos(t)) / d;
    const y = CY + (HALF_H * Math.cos(t)) / d;
    pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return pts.join('L');
};

const x0 = CX - HALF_W;

// Haste com as barras de cima e de baixo (a parte "reta" do B).
export const framePath = `M${CX} ${CY - HALF_H}H${x0}V${CY + HALF_H}H${CX}`;
// O ∞ em pé, que passa pelas pontas das duas barras.
export const loopPath = `M${lemniscate()}`;
// As duas partes num traço só (para os arquivos da marca).
export const markPath = `${framePath}L${lemniscate()}`;
// Centro do ∞: ponto em torno do qual ele gira na animação.
export const markCenter = { x: CX, y: CY };

// Área do desenho (sem contar a espessura do traço).
export const markBox = { x: x0, y: CY - HALF_H, w: HALF_W * 2, h: HALF_H * 2 };

// viewBox com folga para a espessura do traço.
export const markViewBox = (stroke: number) => {
  const p = stroke / 2 + 1;
  return `${markBox.x - p} ${markBox.y - p} ${markBox.w + p * 2} ${markBox.h + p * 2}`;
};
