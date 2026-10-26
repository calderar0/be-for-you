// Gera os arquivos da marca (SVG e PNG) em public/. Rode com: npm run brand
import { writeFileSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';
import { layout } from '../src/lib/glyphs.ts';
import { markPath, markBox, markViewBox } from '../src/lib/mark.ts';

const C = { porcelana: '#faf9fd', noite: '#15042a', violeta: '#320a59', ameixa: '#7b5da6', agua: '#88bfbf' };
const out = new URL('../public/', import.meta.url);
mkdirSync(new URL('brand/', out), { recursive: true });
const save = (name, svg) => writeFileSync(new URL(name, out), svg.trim() + '\n');

// Símbolo: o B desenhado como um ∞ em pé (mesmo desenho do componente Logo.astro).
const gradient = (id, c1, c2) =>
  `<defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${markBox.y}" x2="0" y2="${markBox.y + markBox.h}"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>`;
const mark = (paint, sw) => `<path d="${markPath}" fill="none" stroke="${paint}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;

const word = () => {
  const { placed, width } = layout('BE FOR YOU');
  const body = placed
    .map((p) => (p.glyph.circle ? `<circle cx="${p.x + 50}" cy="50" r="50"/>` : `<path d="${p.glyph.d}" transform="translate(${p.x} 0)"/>`))
    .join('');
  return { body, width };
};

const sw = 7;
const vb = markViewBox(sw);

// Ícone e favicon: o símbolo em degradê (no favicon, sobre o fundo noite).
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${gradient('g', C.agua, C.ameixa)}${mark('url(#g)', sw)}</svg>`;
const fb = 1.45; // folga ao redor do símbolo no favicon
const fw = markBox.w * fb + 20, fh = markBox.h * 1.45;
const fSide = Math.max(fw, fh);
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${markBox.x + markBox.w / 2 - fSide / 2} ${markBox.y + markBox.h / 2 - fSide / 2} ${fSide} ${fSide}">
  <rect x="${markBox.x + markBox.w / 2 - fSide / 2}" y="${markBox.y + markBox.h / 2 - fSide / 2}" width="${fSide}" height="${fSide}" rx="${fSide * 0.22}" fill="${C.noite}"/>
  ${gradient('g', C.agua, '#a58fd0')}${mark('url(#g)', 10)}</svg>`;

const logoMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${mark(C.violeta, sw)}</svg>`;

const w = word();
const wordmark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 ${w.width + 8} 108" fill="none" stroke="${C.violeta}" stroke-width="3" stroke-linecap="round">${w.body}</svg>`;

// Assinatura completa: símbolo à esquerda, nome à direita.
const wordH = 44; // altura do nome, em unidades do símbolo (que tem 120 de altura)
const wordScale = wordH / 100;
const lockW = markBox.w + 30 + w.width * wordScale;
const lockup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${markBox.x - 6} ${markBox.y - 6} ${lockW + 12} ${markBox.h + 12}">
  ${gradient('g', C.agua, C.ameixa)}${mark('url(#g)', sw)}
  <g transform="translate(${markBox.x + markBox.w + 30} ${markBox.y + (markBox.h - wordH) / 2}) scale(${wordScale})" fill="none" stroke="${C.violeta}" stroke-width="${2.2 / wordScale}" stroke-linecap="round">${w.body}</g>
</svg>`;

save('favicon.svg', favicon);
save('brand/icone.svg', icon);
save('brand/simbolo.svg', logoMark);
save('brand/nome.svg', wordmark);
save('brand/assinatura.svg', lockup);

// Imagem de compartilhamento (1200×630) e ícone para iPhone.
const ogScale = 900 / w.width;
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="210" x2="990"><stop offset=".2" stop-color="${C.agua}"/><stop offset=".8" stop-color="${C.ameixa}"/></linearGradient></defs>
  <rect width="1200" height="630" fill="${C.noite}"/>
  <circle cx="400" cy="315" r="190" fill="url(#g)"/>
  <circle cx="800" cy="315" r="190" fill="url(#g)"/>
  <path d="M570 230q30 85 60 0v170q-30-85-60 0Z" fill="url(#g)"/>
  <g transform="translate(150 ${315 - 50 * ogScale}) scale(${ogScale})" fill="none" stroke="${C.porcelana}" stroke-width="${2.4 / ogScale}" stroke-linecap="round">${w.body}</g>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(new URL('og.png', out).pathname.replace(/^\/([A-Z]:)/, '$1'));
await sharp(Buffer.from(favicon), { density: 400 })
  .resize(180, 180)
  .png()
  .toFile(new URL('apple-touch-icon.png', out).pathname.replace(/^\/([A-Z]:)/, '$1'));
console.log('Arquivos da marca gerados em public/');
