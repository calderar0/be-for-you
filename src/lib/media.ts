// Resolve as imagens do portfólio para as versões otimizadas geradas por `npm run portfolio`.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import media from '../data/portfolio-media.json';
import { setId, type SourceRef } from '../data/projects';
import { withBase } from './url';

type Slide = { src: string; thumb: string };
type MediaSet = { w: number; h: number; slides: Slide[] };

const sets = media.sets as Record<string, MediaSet>;
const images = media.images as Record<string, { src: string; w: number; h: number }>;

// Arquivo apagado à mão de public/ não deve virar uma imagem quebrada no site.
const publicDir = join(process.cwd(), 'public');
const exists = (path: string) => existsSync(join(publicDir, path));

export const image = (path: string) => withBase(images[path]?.src ?? path);

export const getSet = (ref: SourceRef): MediaSet | undefined => {
  const set = sets[setId(ref.src)];
  if (!set) return undefined;
  const slides = set.slides.filter((sl) => exists(sl.src)).map((sl) => ({ src: withBase(sl.src), thumb: withBase(sl.thumb) }));
  return slides.length ? { ...set, slides } : undefined;
};
