// Configurações gerais do site. Edite aqui contatos, analytics e a assinatura visual.

export const site = {
  name: 'Be For You',

  // Somente números, com DDI e DDD. Ex.: 5511912345678
  whatsapp: '5517996743322',
  // Como o número aparece escrito no site.
  whatsappDisplay: '(17) 99674-3322',
  email: 'beforyoucontato@gmail.com',

  // Assinatura visual do topo e do contato:
  //   'esferas' → as duas esferas (água e violeta) que se fundem
  //   'fio'     → as duas linhas que se cruzam, como no símbolo
  // Para comparar sem editar o código, acrescente ?assinatura=fio ou ?assinatura=esferas ao endereço.
  signature: 'esferas' as 'esferas' | 'fio',

  // Analytics. Deixe vazio para desativar. O aviso de cookies só aparece se houver algum ID.
  analytics: {
    ga4: '', // Ex.: 'G-XXXXXXXXXX'
    metaPixel: '', // Ex.: '123456789012345'
  },
};

export const whatsappLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
