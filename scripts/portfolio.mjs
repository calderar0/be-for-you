// Converte o material do Canva usado no portfólio em imagens leves (WebP).
//
//   npm run portfolio -- "C:\caminho\da\pasta\do\canva"
//
// Lê os carrosséis e galerias citados em src/data/projects.ts, encontra o .zip ou a imagem
// correspondente na pasta informada, remove os slides de legenda e grava em
// public/portfolio/sets/<id>/. Também otimiza as imagens soltas de public/portfolio/.
// O resultado é listado em src/data/portfolio-media.json, que o site usa para montar a galeria.

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, statSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unzipSync } from 'fflate';
import sharp from 'sharp';
import { projects, setId } from '../src/data/projects.ts';

const source = process.argv[2];
if (!source || !existsSync(source)) {
  console.error('Informe a pasta do Canva. Ex.: npm run portfolio -- "C:\\Users\\voce\\Downloads\\Canva"');
  process.exit(1);
}

const root = new URL('../', import.meta.url);
const publicDir = new URL('public/', root);
const setsDir = new URL('public/portfolio/sets/', root);
const manifestFile = new URL('src/data/portfolio-media.json', root);
const IMG = /\.(png|jpe?g|webp)$/i;
const WIDTH = 1080;
const THUMB = 420;
// Abaixo disso (entropia em tons de cinza), o slide é praticamente uma cor só com texto: legenda.
const CAPTION_ENTROPY = 1.25;

// Todos os arquivos da pasta do Canva, em até dois níveis.
const files = readdirSync(source).flatMap((entry) => {
  const p = join(source, entry);
  return statSync(p).isDirectory() ? readdirSync(p).map((f) => join(p, f)) : [p];
});

const findSource = (name) =>
  files.find((f) => {
    const b = basename(f, extname(f));
    return (b === name || b.startsWith(`${name} `)) && /\.(zip|png|jpe?g)$/i.test(f);
  });

const byNumber = (a, b) => (parseInt(a.name, 10) || 0) - (parseInt(b.name, 10) || 0) || a.name.localeCompare(b.name);

// Devolve as imagens do arquivo, na ordem dos slides.
const readImages = (file) => {
  if (/\.zip$/i.test(file)) {
    const entries = unzipSync(readFileSync(file));
    return Object.entries(entries)
      .filter(([name]) => IMG.test(name) && !name.endsWith('/'))
      .map(([name, data]) => ({ name: basename(name), data: Buffer.from(data) }))
      .sort(byNumber);
  }
  return [{ name: basename(file), data: readFileSync(file) }];
};

const isCaption = async (buf) => {
  const { entropy } = await sharp(buf).resize(200).greyscale().stats();
  return entropy < CAPTION_ENTROPY;
};

// Referências usadas no site.
const refs = new Map();
for (const p of projects) {
  for (const r of [p.stack, ...(p.carousels ?? []), ...(p.identity ?? [])]) {
    if (r && typeof r === 'object') refs.set(setId(r.src), { ...refs.get(setId(r.src)), ...r });
  }
}

const manifest = { sets: {}, images: {} };
rmSync(setsDir, { recursive: true, force: true });

for (const [id, ref] of refs) {
  const file = findSource(ref.src);
  if (!file) {
    console.warn(`! Não encontrei "${ref.src}" na pasta do Canva.`);
    continue;
  }
  const images = readImages(file);
  const keep = [];
  for (const [i, img] of images.entries()) {
    const pos = i + 1;
    if (ref.drop?.includes(pos)) continue;
    const atEnd = images.length > 1 && (i === 0 || i === images.length - 1);
    if (atEnd && (await isCaption(img.data))) continue;
    keep.push({ pos, data: img.data });
  }

  // Ordem definida à mão (posições originais); as não listadas seguem depois, na ordem do Canva.
  if (ref.order?.length) {
    const rank = (pos) => (ref.order.includes(pos) ? ref.order.indexOf(pos) : ref.order.length + pos);
    keep.sort((a, b) => rank(a.pos) - rank(b.pos));
  }

  const dir = new URL(`${id}/`, setsDir);
  mkdirSync(dir, { recursive: true });
  const slides = [];
  let size = null;
  for (const { pos, data } of keep) {
    const full = sharp(data).resize({ width: WIDTH, withoutEnlargement: true }).webp({ quality: 80 });
    const info = await full.toFile(fileURLToPath(new URL(`${pos}.webp`, dir)));
    await sharp(data).resize({ width: THUMB }).webp({ quality: 74 }).toFile(fileURLToPath(new URL(`${pos}-t.webp`, dir)));
    size ??= { w: info.width, h: info.height };
    slides.push({ src: `/portfolio/sets/${id}/${pos}.webp`, thumb: `/portfolio/sets/${id}/${pos}-t.webp` });
  }
  manifest.sets[id] = { ...size, slides };
  console.log(`${ref.src.padEnd(20)} ${slides.length}/${images.length} slides`);
}

// Imagens soltas (sites, identidades): uma versão WebP ao lado do original.
const loose = new Set(projects.flatMap((p) => [p.cover, p.site?.image, ...(p.identity ?? [])]).filter((v) => typeof v === 'string'));
for (const path of loose) {
  if (path.startsWith('/portfolio/sets/') || !/\.(png|jpe?g)$/i.test(path)) continue;
  const input = new URL(`.${path}`, publicDir);
  if (!existsSync(input)) continue;
  const out = path.replace(/\.(png|jpe?g)$/i, '.webp');
  const info = await sharp(readFileSync(input)).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(fileURLToPath(new URL(`.${out}`, publicDir)));
  manifest.images[path] = { src: out, w: info.width, h: info.height };
}

writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\nPronto: ${Object.keys(manifest.sets).length} conjuntos e ${Object.keys(manifest.images).length} imagens.`);
