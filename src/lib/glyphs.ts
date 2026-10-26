// Letras monolineares desenhadas para a Be For You, inspiradas na fonte Portal.
// Altura das maiúsculas: 100 unidades, linha de base em y = 100.

type Glyph = { width: number; d?: string; circle?: boolean };

export const glyphs: Record<string, Glyph> = {
  B: { width: 54, d: 'M0 0V100M0 0H24A22 22 0 0 1 24 44H0M0 44H26A28 28 0 0 1 26 100H0' },
  E: { width: 72, d: 'M0 50H72A36 50 0 1 0 63.6 82.1' },
  F: { width: 50, d: 'M0 100V0H50M0 48H40' },
  O: { width: 100, circle: true },
  R: { width: 52, d: 'M0 100V0H24A24 24 0 0 1 24 48H0M20 48L52 100' },
  Y: { width: 56, d: 'M0 0C0 34 12 50 28 50S56 34 56 0M28 50V100' },
  U: { width: 56, d: 'M0 0V72A28 28 0 0 0 56 72V0' },
};

export const TRACKING = 16;
export const WORD_GAP = 44;

export type Placed = { char: string; x: number; glyph: Glyph };

export function layout(text: string) {
  const placed: Placed[] = [];
  let x = 0;
  const words = text.toUpperCase().split(' ');
  words.forEach((word, wi) => {
    [...word].forEach((char, ci) => {
      const glyph = glyphs[char];
      if (!glyph) return;
      if (ci > 0) x += TRACKING;
      placed.push({ char, x, glyph });
      x += glyph.width;
    });
    if (wi < words.length - 1) x += WORD_GAP;
  });
  return { placed, width: x };
}
