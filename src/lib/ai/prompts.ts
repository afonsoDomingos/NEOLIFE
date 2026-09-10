export const AI_SYSTEM_PROMPT = `Tu és o Assistente Virtual Consultivo da plataforma de Bem-Estar e Oportunidade NeoLife, representando a equipa de mentoria liderada pelo casal José Sarmento Machado e Ofélia Alfredo Machado.

O teu papel é:
1. EDUCAR: Partilhar conhecimento acessível sobre saúde, vitalidade, nutrição celular e prevenção.
2. ORIENTAR: Esclarecer com rigor e empatia como funciona a suplementação celular baseada em alimentos integrais e a ciência do Scientific Advisory Board (SAB).
3. INSPIRAR: Apresentar a oportunidade de negócio independente NeoLife como um caminho de mentoria prática com José Sarmento Machado e Ofélia Alfredo Machado, desenvolvimento pessoal e construção de rendimento sustentável em família.
4. ATENDER COM RESPEITO: Nunca pressionar vendas, nunca prometer curas milagrosas (os produtos são suplementos nutricionais e alimentos concentrados de alta absorção, não medicamentos).
5. DIRECIONAR: Quando o utilizador demonstrar vontade de dar o próximo passo (encomendar, tirar dúvidas específicas do seu caso, ou conhecer a mentoria de negócio), convida-o amavelmente a preencher o formulário no site (/formulario ou /oportunidade) para receber os guias detalhados e contacto personalizado via WhatsApp.

Conhecimentos Chave:
- Mentores da Plataforma: José Sarmento Machado e Ofélia Alfredo Machado, casal dedicado à consultoria de bem-estar e mentoria de novos parceiros empreendedores.
- Nutrição Celular: A saúde começa nas células. Se a membrana celular for rígida (por falta de lípidos e esteróis essenciais presentes nos grãos integrais, como no Tre-en-en), os nutrientes não entram e as toxinas não saem.
- Oportunidade NeoLife: Empresa global com mais de 60 anos, presente em dezenas de países. Empreendedorismo de baixo risco com mentoria direta de José e Ofélia Machado, formação contínua e produtos de consumo diário.
- Mercados com apoio ativo imediato: Moçambique (+258), África do Sul (+27), Angola (+244), Zimbabwe (+263).

Responde sempre em Português claro, cordial e conciso, com formatação limpa (tópicos curtos quando aplicável).`;

export interface FallbackFAQ {
  keywords: string[];
  answer: string;
}

export const FALLBACK_FAQS: FallbackFAQ[] = [
  {
    keywords: ['quem sao', 'quem são', 'casal', 'jose', 'josé', 'ofelia', 'ofélia', 'machado', 'mentores', 'consultores'],
    answer: 'Esta plataforma é dinamizada pelo casal **José Sarmento Machado** e **Ofélia Alfredo Machado**, consultores e mentores independentes de bem-estar NeoLife. A sua missão é partilhar conhecimento sobre saúde preventiva e nutrição celular, além de apoiar novas famílias e empreendedores a construir um negócio sustentável e rentável com presença em Moçambique, África do Sul, Angola e Zimbabwe.'
  },
  {
    keywords: ['o que é', 'neolife', 'empresa', 'historia', 'história'],
    answer: 'A **NeoLife** é uma empresa global pioneira em nutrição celular e bem-estar há mais de 60 anos, presente em mais de 50 países. Todos os produtos são desenvolvidos por cientistas de renome mundial através do *Scientific Advisory Board (SAB)*, fundado pelo Dr. Arthur Furst. A nossa missão nesta plataforma é educar, orientar e prestar consultoria personalizada a famílias e novos empreendedores com a mentoria de José e Ofélia Machado.'
  },
  {
    keywords: ['nutricao celular', 'nutrição celular', 'celula', 'célula', 'tre-en-en', 'treenen'],
    answer: 'A **Nutrição Celular** assenta no princípio de que o corpo só é saudável se as suas 73 biliões de células forem saudáveis. Para isso, a membrana celular precisa de estar permeável para absorver nutrientes e expelir toxinas. O produto emblemático da NeoLife, o **Tre-en-en**, fornece lípidos e esteróis extraídos de grãos integrais essenciais que foram retirados da alimentação moderna, devolvendo energia e vitalidade ao organismo.'
  },
  {
    keywords: ['negocio', 'negócio', 'oportunidade', 'renda', 'ganhar dinheiro', 'revender', 'distribuidor', 'mentoria'],
    answer: 'A **Oportunidade NeoLife** permite-lhe construir um negócio independente de bem-estar com o apoio direto da mentoria de **José Sarmento Machado & Ofélia Alfredo Machado**. Terá acesso a formação passo a passo, plataforma digital própria, produtos patenteados de alta procura e um plano de compensação transparente. Pode iniciar em regime de tempo parcial. Saiba mais na nossa página de [Oportunidade](/oportunidade) ou preencha o formulário para falarmos diretamente.'
  },
  {
    keywords: ['pais', 'países', 'paises', 'mocambique', 'moçambique', 'angola', 'africa do sul', 'zimbabwe', 'portugal', 'onde opera'],
    answer: 'Atualmente temos acompanhamento ativo e estruturado para: **Moçambique**, **África do Sul**, **Angola** e **Zimbabwe**. Se reside num destes países, podemos apoiá-lo diretamente com entregas locais e mentoria. Outras regiões podem ser avaliadas sob consulta.'
  },
  {
    keywords: ['como comprar', 'como encomendar', 'preco', 'preço', 'comprar', 'encomenda', 'valor'],
    answer: 'Para encomendar com segurança e receber orientação adequada às suas necessidades, pode preencher o nosso [Formulário de Interesse](/formulario). Iremos analisar o que procura e enviar-lhe o catálogo oficial com os preços do seu país e opções de entrega segura.'
  },
  {
    keywords: ['sab', 'cientifico', 'científico', 'medico', 'médico', 'seguranca', 'segurança', 'qualidade'],
    answer: 'O **Scientific Advisory Board (SAB)** da NeoLife foi fundado pelo Dr. Arthur Furst (um dos pais da quimioterapia e toxicologia moderna). Ao contrário de muitas marcas que subcontratam a produção, a NeoLife pesquisa, desenvolve e testa os seus próprios produtos com base em ingredientes de origem alimentar humana e ensaios clínicos publicados em revistas científicas internacionais.'
  },
  {
    keywords: ['contacto', 'contato', 'whatsapp', 'falar', 'telefone', 'mensagem', 'facebook', 'redes sociais'],
    answer: 'Será um enorme prazer conversar consigo! Pode contactar-nos via WhatsApp através do número **+258 82 305 6900**, ou por chamada para **+258 84 305 6900**. Pode também submeter os seus dados no nosso [Formulário de Contacto](/formulario). Visite também a nossa página no [Facebook](https://www.facebook.com/profile.php?id=61581591080342&locale=pt_BR) para nos acompanhar de perto.'
  }
];

export function getSmartFallbackResponse(userMessage: string): string {
  const normalized = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  for (const faq of FALLBACK_FAQS) {
    const match = faq.keywords.some(kw => {
      const normKw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return normalized.includes(normKw);
    });
    if (match) {
      return faq.answer;
    }
  }

  return 'Olá! Agradeço a sua mensagem. Como assistente consultivo da equipa de mentoria NeoLife, estou aqui para esclarecer dúvidas sobre nutrição celular, saúde preventiva ou o nosso modelo de negócio independente. Gostaria de saber mais sobre como melhorar a sua vitalidade através dos produtos, ou deseja conhecer a nossa mentoria para empreender com a NeoLife? Pode também preencher o nosso [Formulário](/formulario) para um contacto direto.';
}
