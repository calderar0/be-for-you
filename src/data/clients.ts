// Logos de clientes e depoimentos.
// A seção "Quem confia na Be For You" só aparece quando houver pelo menos um item aqui.

export type Client = {
  name: string;
  // Arquivo em public/clientes/, de preferência SVG monocromático. Ex.: '/clientes/aurora.svg'
  logo: string;
};

export type Testimonial = {
  quote: { pt: string; en: string };
  author: string;
  role: { pt: string; en: string };
};

export const clients: Client[] = [
  // { name: 'Nome do cliente', logo: '/clientes/nome.svg' },
];

export const testimonials: Testimonial[] = [
  // {
  //   quote: { pt: 'Texto do depoimento.', en: 'Testimonial text.' },
  //   author: 'Nome da pessoa',
  //   role: { pt: 'Cargo, Empresa', en: 'Role, Company' },
  // },
];
