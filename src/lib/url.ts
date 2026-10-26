// Prefixa caminhos internos com a base do site (ex.: '/be-for-you' no GitHub Pages).
// Com domínio próprio, a base volta a ser '/' e nada muda.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const withBase = (path: string) => (path.startsWith('/') && !path.startsWith('//') ? `${base}${path}` : path);
