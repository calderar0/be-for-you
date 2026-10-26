# Be For You

Site portfólio da Be For You, em português (`/`) e inglês (`/en/`).
Feito com [Astro](https://astro.build): gera páginas estáticas, rápidas e fáceis de hospedar.

## Rodar no computador

```bash
npm install
npm run dev
```

Abra http://localhost:4321. Em desenvolvimento aparece, no canto inferior esquerdo, um seletor para comparar as duas assinaturas visuais (esferas e fio).

## Onde editar cada coisa

| O que | Arquivo |
|---|---|
| WhatsApp, e-mail, analytics e assinatura padrão | `src/data/site.ts` |
| Projetos do portfólio | `src/data/projects.ts` |
| Logos de clientes e depoimentos | `src/data/clients.ts` |
| Todos os textos (PT e EN) | `src/i18n/strings.ts` |
| Cores e tipografia | `src/styles/global.css` |

### Portfólio

O portfólio tem um card por cliente. Ao clicar, abre o case com o site, a identidade visual e os carrosséis.
Cada cliente é um item em `src/data/projects.ts`.

**Adicionar ou trocar carrosséis do Canva**

1. Baixe o carrossel do Canva (.zip) para a pasta de downloads do Canva, mantendo o nome (ex.: `Alba 10 - 05-11-2026.zip`).
2. No cliente, em `carousels`, acrescente `{ src: 'Alba 10' }`, usando o começo do nome do arquivo.
3. Rode o comando abaixo, com o caminho da pasta:

```bash
npm run portfolio -- "C:\Users\zer0s\Downloads\Downloads Canva\Downloads Canva"
```

O comando converte os slides para WebP (bem mais leves), remove os slides de legenda e atualiza `src/data/portfolio-media.json`. Para tirar outro slide, use `drop` com a posição: `{ src: 'Micha 16', drop: [9] }`.

**Imagens de sites e identidades**: coloque o arquivo em `public/portfolio/` e informe o caminho (ex.: `'/portfolio/cafe.png'`). O mesmo comando gera a versão otimizada.

**Tamanho do card**: `size: 'wide'` (largo), `'tall'` (alto) ou `'normal'`.

### Clientes e depoimentos

A seção só aparece quando houver pelo menos um item em `src/data/clients.ts`. Logos ficam em `public/clientes/`, de preferência em SVG.

### Analytics (Google Analytics e Meta Pixel)

Preencha `analytics.ga4` e/ou `analytics.metaPixel` em `src/data/site.ts`. O aviso de cookies aparece automaticamente, e os scripts só carregam depois que o visitante aceita (LGPD).

### Assinatura visual

Em `src/data/site.ts`, `signature` pode ser `'esferas'` ou `'fio'`. Para comparar sem editar, acrescente `?assinatura=fio` ou `?assinatura=esferas` ao endereço.

## Marca

Os arquivos ficam em `public/brand/`:

- `simbolo.svg`: o B infinito em violeta
- `nome.svg`: "BE FOR YOU" com as letras desenhadas para a marca
- `assinatura.svg`: símbolo e nome juntos
- `icone.svg`: o B infinito em degradê (água para violeta)

Para regerar esses arquivos, o favicon e a imagem de compartilhamento (`public/og.png`), rode `npm run brand`.

## Publicar

**GitHub Pages (automático):** cada `git push` na branch `main` publica o site em
https://calderar0.github.io/be-for-you/ pelo workflow `.github/workflows/deploy.yml`.
Na primeira vez, ative em **Settings → Pages → Build and deployment → Source: GitHub Actions**.

**Outra hospedagem:** rode `npm run build` e envie o conteúdo da pasta `dist/` (por FTP ou pelo
gerenciador de arquivos, na pasta pública, geralmente `public_html`).

**Domínio próprio:** quando registrar, troque no workflow `SITE_URL` pelo domínio e `BASE_PATH` por `/`
(e, no GitHub Pages, configure o domínio em Settings → Pages → Custom domain).
