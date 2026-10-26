// Portfólio: um item por cliente.
//
// Cada cliente pode ter um site, uma identidade visual e carrosséis para redes sociais.
// Carrosséis e galerias vêm da pasta de downloads do Canva e são convertidos com:
//   npm run portfolio -- "C:\caminho\da\pasta\do\canva"
// Em `src`, use o começo do nome do arquivo (ex.: 'Alba 01' para "Alba 01 - 30-01-2026.zip").
// Slides de legenda (só texto, no início ou no fim) são removidos automaticamente.
// Para tirar outros slides, informe as posições em `drop` (a contagem começa em 1, na ordem do Canva).
// Para mudar a ordem, liste as posições em `order` (ex.: [2, 1, 3]); as que não aparecerem vão para o fim.
// Apagar um arquivo de public/portfolio/sets/ também funciona: o site ignora slides que não existem.
//
// size: tamanho do card na grade. 'wide' (largo), 'tall' (alto) ou 'normal'.
// cover: imagem do card. Para usar um slide convertido: '/portfolio/sets/<id>/<n>.webp'.

export type Category = 'identidade' | 'interfaces' | 'social' | 'dev';

export type SourceRef = { src: string; drop?: number[]; order?: number[] };

export type Project = {
  id: string;
  client: string;
  summary: { pt: string; en: string };
  services: Category[];
  year: string;
  size: 'wide' | 'tall' | 'normal';
  cover: string;
  // Mostra slides empilhados atrás da capa (bom para quem tem só redes sociais).
  stack?: SourceRef;
  site?: { url: string; image: string };
  // Imagens soltas (caminho em public/) ou galerias convertidas do Canva.
  identity?: (string | SourceRef)[];
  carousels?: SourceRef[];
};

export const categories: Category[] = ['identidade', 'interfaces', 'social', 'dev'];

export const projects: Project[] = [
  {
    id: 'paes-de-sal',
    client: 'Pães de Sal',
    summary: {
      pt: 'Site com catálogo e gerenciamento de produtos, e conteúdo para o Instagram que conta a história da fermentação natural.',
      en: 'A website with a product catalog and management, plus Instagram content that tells the story of natural fermentation.',
    },
    services: ['interfaces', 'dev', 'social'],
    year: '2026',
    size: 'wide',
    cover: '/portfolio/paes-de-sal.png',
    site: { url: 'https://paesdesal.com/', image: '/portfolio/paes-de-sal.png' },
    carousels: [{ src: 'Paes de sal 02' }, { src: 'Paes de sal 07' }, { src: 'Paes de sal 05' }, { src: 'Paes de sal 06' }, { src: 'Paes de sal 11' }],
  },
  {
    id: 'alba-gelati',
    client: 'Alba Gelati',
    summary: {
      pt: 'Conteúdo para o Instagram, da contagem regressiva para a inauguração aos eventos, com o jeito divertido da marca.',
      en: 'Instagram content, from the countdown to the grand opening to events, in the brand’s playful voice.',
    },
    services: ['social'],
    year: '2026',
    size: 'tall',
    cover: '/portfolio/sets/alba-08/1.webp',
    stack: { src: 'Alba 09', drop: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
    carousels: [{ src: 'Alba 08' }, { src: 'Alba 09', drop: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] }, { src: 'Alba 05' }, { src: 'Alba 01' }, { src: 'Alba 06' }, { src: 'Alba 02' }],
  },
  {
    id: 'dra-caroline-tomas',
    client: 'Dra. Caroline Tomas',
    summary: {
      pt: 'Site institucional e conteúdo para o Instagram sobre saúde digestiva, com fotografia editorial.',
      en: 'A company website and Instagram content on digestive health, with editorial photography.',
    },
    services: ['interfaces', 'dev', 'social'],
    year: '2025–2026',
    size: 'wide',
    cover: '/portfolio/dracarolinegastro.png',
    site: { url: 'https://www.dracarolinegastro.com.br/', image: '/portfolio/dracarolinegastro.png' },
    carousels: [{ src: 'Carol 06' }, { src: 'Carol 09' }, { src: 'Carol 12' }, { src: 'Carol 04' }, { src: 'Carol 05' }, { src: 'Carol 14' }],
  },
  {
    id: 'dra-michaela',
    client: 'Dra. Michaela',
    summary: {
      pt: 'Identidade visual completa e conteúdo educativo para o Instagram, com a mesma linguagem em cada publicação.',
      en: 'A complete brand identity and educational Instagram content, with the same visual language in every post.',
    },
    services: ['identidade', 'social'],
    year: '2024–2026',
    size: 'normal',
    cover: '/portfolio/ID-Michaela.png',
    identity: ['/portfolio/ID-Michaela.png'],
    carousels: [{ src: 'Micha 15' }, { src: 'Micha 11' }, { src: 'Micha 12' }, { src: 'Micha 02' }, { src: 'Micha 04' }, { src: 'Micha 16', drop: [9] }],
  },
  {
    id: 'papel-laranja',
    client: 'Papel Laranja',
    summary: {
      pt: 'Identidade visual para papelaria personalizada e banner para o site.',
      en: 'Brand identity for a custom stationery shop, plus a website banner.',
    },
    services: ['identidade'],
    year: '2025',
    size: 'normal',
    cover: '/portfolio/ID-Papel-Laranja.png',
    identity: ['/portfolio/ID-Papel-Laranja.png', { src: 'Banner site' }],
  },
  {
    id: 'angel-valenciani',
    client: 'Angel Valenciani',
    summary: {
      pt: 'Carrosséis que valorizam cada detalhe dos topos de bolo feitos à mão, do ateliê à festa.',
      en: 'Carousels that highlight every detail of handmade cake toppers, from the studio to the party.',
    },
    services: ['social'],
    year: '2025–2026',
    size: 'normal',
    cover: '/portfolio/sets/angel-02/1.webp',
    stack: { src: 'Angel 01' },
    carousels: [{ src: 'Angel 02' }, { src: 'Angel 01' }, { src: 'Angel 03' }, { src: 'Angel 06' }],
  },
];

// Identificador usado nas pastas convertidas: 'Alba 01' → 'alba-01'.
export const setId = (src: string) =>
  src
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
