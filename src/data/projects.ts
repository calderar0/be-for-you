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
  // Nome do cliente ou, em projeto próprio, o nome do produto.
  client: string;
  // Projeto da própria Be For You, sem cliente.
  own?: boolean;
  summary: { pt: string; en: string };
  services: Category[];
  year: string;
  size: 'wide' | 'tall' | 'normal';
  cover: string;
  // Mostra slides empilhados atrás da capa (bom para quem tem só redes sociais).
  stack?: SourceRef;
  // Site: link (se estiver no ar), print principal, vídeo de navegação e páginas.
  // Em `pages`, `screen` é o print da tela e `full` a página inteira (que dá para rolar no case).
  site?: {
    url?: string;
    image?: string;
    video?: string;
    poster?: string;
    pages?: { name: { pt: string; en: string }; screen: string; full: string }[];
    // 'mobile' mostra o vídeo e as páginas numa moldura de celular.
    device?: 'desktop' | 'mobile';
  };
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
      pt: 'Identidade visual e loja virtual para papelaria personalizada, com catálogo, personalização de produtos e carrinho.',
      en: 'Brand identity and an online store for a custom stationery shop, with a catalog, product customization and a cart.',
    },
    services: ['identidade', 'interfaces', 'dev'],
    year: '2025',
    size: 'normal',
    cover: '/portfolio/ID-Papel-Laranja.png',
    site: {
      video: '/portfolio/papel-laranja/navegacao.mp4',
      poster: '/portfolio/papel-laranja/poster.webp',
      pages: [
        { name: { pt: 'Início', en: 'Home' }, screen: '/portfolio/papel-laranja/telas/01-home.webp', full: '/portfolio/papel-laranja/paginas/01-home.webp' },
        { name: { pt: 'Catálogo', en: 'Catalog' }, screen: '/portfolio/papel-laranja/telas/02-catalogo.webp', full: '/portfolio/papel-laranja/paginas/02-catalogo.webp' },
        { name: { pt: 'Produto', en: 'Product' }, screen: '/portfolio/papel-laranja/telas/03-produto.webp', full: '/portfolio/papel-laranja/paginas/03-produto.webp' },
        { name: { pt: 'Personalize', en: 'Customize' }, screen: '/portfolio/papel-laranja/telas/04-personalize.webp', full: '/portfolio/papel-laranja/paginas/04-personalize.webp' },
        { name: { pt: 'Carrinho', en: 'Cart' }, screen: '/portfolio/papel-laranja/telas/05-carrinho.webp', full: '/portfolio/papel-laranja/telas/05-carrinho.webp' },
        { name: { pt: 'Cadastro', en: 'Sign-up' }, screen: '/portfolio/papel-laranja/telas/06-cadastro.webp', full: '/portfolio/papel-laranja/paginas/06-cadastro.webp' },
      ],
    },
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
  {
    id: 'gastos',
    client: 'Gastos',
    own: true,
    summary: {
      pt: 'Aplicação web de finanças pessoais: orçamento por potes, importação de extratos, caronas, investimentos e histórico num só painel.',
      en: 'A personal finance web app: budgeting by pots, statement import, shared rides, investments and history in one dashboard.',
    },
    services: ['interfaces', 'dev'],
    year: '2026',
    size: 'wide',
    cover: '/portfolio/gastos/telas/01-dashboard.webp',
    site: {
      video: '/portfolio/gastos/navegacao.mp4',
      poster: '/portfolio/gastos/poster.webp',
      pages: [
        { name: { pt: 'Painel', en: 'Dashboard' }, screen: '/portfolio/gastos/telas/01-dashboard.webp', full: '/portfolio/gastos/telas/01-dashboard.webp' },
        { name: { pt: 'Mês atual', en: 'Current month' }, screen: '/portfolio/gastos/telas/02-mes-atual.webp', full: '/portfolio/gastos/telas/02-mes-atual.webp' },
        { name: { pt: 'Mês por pote', en: 'Month by pot' }, screen: '/portfolio/gastos/telas/03-mes-por-pote.webp', full: '/portfolio/gastos/telas/03-mes-por-pote.webp' },
        { name: { pt: 'Caronas', en: 'Rides' }, screen: '/portfolio/gastos/telas/04-caronas.webp', full: '/portfolio/gastos/telas/04-caronas.webp' },
        { name: { pt: 'Extrato do cartão', en: 'Card statement' }, screen: '/portfolio/gastos/telas/05-extrato-cartao.webp', full: '/portfolio/gastos/telas/05-extrato-cartao.webp' },
        { name: { pt: 'Extrato do banco', en: 'Bank statement' }, screen: '/portfolio/gastos/telas/06-extrato-banco-por-pote.webp', full: '/portfolio/gastos/telas/06-extrato-banco-por-pote.webp' },
        { name: { pt: 'Investimentos', en: 'Investments' }, screen: '/portfolio/gastos/telas/07-investimentos.webp', full: '/portfolio/gastos/telas/07-investimentos.webp' },
        { name: { pt: 'Histórico', en: 'History' }, screen: '/portfolio/gastos/telas/08-historico.webp', full: '/portfolio/gastos/telas/08-historico.webp' },
        { name: { pt: 'Ganhos', en: 'Income' }, screen: '/portfolio/gastos/telas/09-ganhos.webp', full: '/portfolio/gastos/telas/09-ganhos.webp' },
        { name: { pt: 'Contas', en: 'Bills' }, screen: '/portfolio/gastos/telas/10-contas.webp', full: '/portfolio/gastos/telas/10-contas.webp' },
      ],
    },
  },
  {
    id: 'divisao-de-viagem',
    client: 'Divisão de viagem',
    own: true,
    summary: {
      pt: 'App para dividir os gastos de viagens de carro: combustível calculado por quilômetro e consumo, pedágio, estacionamento e acerto de contas.',
      en: 'An app to split road trip costs: fuel calculated by distance and mileage, tolls, parking and settling up.',
    },
    services: ['interfaces', 'dev'],
    year: '2026',
    size: 'normal',
    cover: '/portfolio/divisao-de-viagem/telas/02-visao-geral.webp',
    site: {
      device: 'mobile',
      video: '/portfolio/divisao-de-viagem/navegacao.mp4',
      poster: '/portfolio/divisao-de-viagem/poster.webp',
      pages: [
        { name: { pt: 'Entrar', en: 'Sign in' }, screen: '/portfolio/divisao-de-viagem/telas/01-login.webp', full: '/portfolio/divisao-de-viagem/paginas/01-login.webp' },
        { name: { pt: 'Visão geral', en: 'Overview' }, screen: '/portfolio/divisao-de-viagem/telas/02-visao-geral.webp', full: '/portfolio/divisao-de-viagem/paginas/02-visao-geral.webp' },
        { name: { pt: 'Mês', en: 'Month' }, screen: '/portfolio/divisao-de-viagem/telas/03-mes.webp', full: '/portfolio/divisao-de-viagem/paginas/03-mes.webp' },
        { name: { pt: 'Viagem', en: 'Trip' }, screen: '/portfolio/divisao-de-viagem/telas/04-viagem-detalhe.webp', full: '/portfolio/divisao-de-viagem/paginas/04-viagem-detalhe.webp' },
        { name: { pt: 'Lançar combustível', en: 'Add fuel' }, screen: '/portfolio/divisao-de-viagem/telas/05-lancar-combustivel.webp', full: '/portfolio/divisao-de-viagem/paginas/05-lancar-combustivel.webp' },
        { name: { pt: 'Editar despesa', en: 'Edit expense' }, screen: '/portfolio/divisao-de-viagem/telas/06-editar-despesa.webp', full: '/portfolio/divisao-de-viagem/paginas/06-editar-despesa.webp' },
        { name: { pt: 'Análise', en: 'Analysis' }, screen: '/portfolio/divisao-de-viagem/telas/07-analise.webp', full: '/portfolio/divisao-de-viagem/paginas/07-analise.webp' },
      ],
    },
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
