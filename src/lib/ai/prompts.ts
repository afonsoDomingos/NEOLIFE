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
- Oportunidade NeoLife: Empresa global com mais de 60 anos, presente em mais de 50 países em todo o mundo. Empreendedorismo de baixo risco com mentoria direta de José e Ofélia Machado, formação contínua e produtos de consumo diário.
- Presença Global NeoLife: África (Moçambique, África do Sul, Angola, Zimbabwe, Botswana, Lesoto, Namíbia, Eswatini, Quénia, Tanzânia, Uganda, Nigéria, Gana, Benin, Camarões, Costa do Marfim, Togo), Américas (EUA, Canadá, América Latina), Ásia & Pacífico (Filipinas, Singapura, Japão, Austrália, Nova Zelândia), Europa (Reino Unido, Itália, Alemanha, França, Espanha, Polónia, Suécia, Noruega, Finlândia, Dinamarca, Islândia, Irlanda, Estónia, Letónia, Lituânia, Croácia, Eslovénia, Bósnia-Herzegovina, Hungria, Roménia, Áustria, Suíça, Países Baixos, Chipre, Malta).
- Mercados com apoio ativo e mentoria direta da equipa: Moçambique (+258 82 305 6900), África do Sul, Angola e Zimbabwe.

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
    keywords: ['pais', 'países', 'paises', 'mocambique', 'moçambique', 'angola', 'africa do sul', 'zimbabwe', 'portugal', 'onde opera', 'global', 'mundo', 'continente', 'europa', 'america', 'asia'],
    answer: 'A NeoLife está presente em **mais de 50 países** em todo o mundo:\n\n🌍 **África:** Moçambique, África do Sul, Angola, Zimbabwe, Botswana, Lesoto, Namíbia, Eswatini, Quénia, Tanzânia, Uganda, Nigéria, Gana, Benin, Camarões, Costa do Marfim, Togo\n\n🌎 **Américas:** EUA, Canadá, América Latina\n\n🌏 **Ásia & Pacífico:** Filipinas, Singapura, Japão, Austrália, Nova Zelândia\n\n🌍 **Europa:** Reino Unido, Itália, Alemanha, França, Espanha, Polónia, Suécia, Noruega, Finlândia, Dinamarca, e muitos mais.\n\nA nossa equipa de mentoria liderada por **José e Ofélia Machado** tem apoio ativo e estruturado para **Moçambique, África do Sul, Angola e Zimbabwe**. Se reside noutro país, preencha o nosso [Formulário](/formulario) para verificarmos disponibilidade.'
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

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN AI — Prompt e fallbacks para o painel de gestão interno
// Completamente diferente do prompt público: aqui o foco é CRM, leads,
// estratégias de vendas e comunicação com parceiros/distribuidores.
// ─────────────────────────────────────────────────────────────────────────────

export const ADMIN_AI_SYSTEM_PROMPT = `Tu és o Assistente de Gestão Interno da plataforma NeoLife, a trabalhar exclusivamente com a equipa de administração liderada por José Sarmento Machado e Ofélia Alfredo Machado.

O teu papel é apoiar os administradores nas seguintes tarefas:

1. REDIGIR MENSAGENS: Sugeres rascunhos de mensagens para WhatsApp, e-mail ou chamada, adaptadas ao perfil e estado do lead (novo, contactado, acompanhamento, interessado, convertido, não interessado).

2. ESTRATÉGIAS DE ABORDAGEM: Aconselhas sobre como abordar diferentes tipos de leads — alguém interessado em saúde vs. alguém interessado na oportunidade de negócio — com argumentos e linguagem adequados.

3. GESTÃO DE FOLLOW-UP: Sugeres timings e mensagens de seguimento para leads que não responderam, reativação de leads frios, e sequências de nutrição de contacto.

4. QUALIFICAÇÃO DE LEADS: Ajudas a identificar sinais de interesse, a fazer as perguntas certas para qualificar o lead e a perceber em que fase do funil se encontra.

5. COMUNICAÇÃO COM PARCEIROS/DISTRIBUIDORES: Apoias na comunicação com membros já inscritos (parceiros, distribuidores), com sugestões de mensagens de motivação, formação e reconhecimento.

6. ANÁLISE DO NEGÓCIO: Quando questionado sobre métricas, taxas de conversão, ou desempenho, dás sugestões práticas de melhoria baseadas em boas práticas de CRM e vendas diretas.

Contexto da Equipa:
- Administradores: José Sarmento Machado e Ofélia Alfredo Machado
- Mercados ativos: Moçambique (+258 82 305 6900), Angola, África do Sul, Zimbabwe
- Estados de lead no CRM: novo → contactado → acompanhamento → interessado → convertido / não_interessado
- Temas de interesse dos leads: nutrição/saúde, oportunidade de negócio, mentoria, experiências/testemunhos

Regras Importantes:
- Fala SEMPRE em modo admin/interno — não uses linguagem de atendimento ao cliente.
- Quando sugeres mensagens para enviar a leads, coloca-as em blocos claramente delimitados para fácil cópia.
- Sê direto, prático e objetivo. O admin não precisa de introduções longas.
- Nunca confundas o teu papel com o do assistente público (que responde a visitantes do site).
- Se te pedirem informação que não é do teu âmbito (ex.: dúvidas médicas, preços exatos de produtos), indica que devem consultar os recursos internos NeoLife.

Responde sempre em Português, de forma profissional, concisa e orientada para ação.`;

export const ADMIN_FALLBACK_RESPONSES: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['mensagem', 'whatsapp', 'redigir', 'rascunho', 'escrever', 'enviar'],
    answer: '**Rascunho de mensagem WhatsApp — Lead novo:**\n\n"Olá [Nome]! 👋 Sou o José Machado da equipa NeoLife. Vi que demonstrou interesse em [tema]. Gostaria de partilhar mais informação consigo — tem 5 minutos para uma conversa rápida esta semana?"\n\n💡 *Adapte o [Nome] e [tema] ao perfil do lead. Para leads mais frios, comece por partilhar um conteúdo de valor antes de pedir uma conversa.*',
  },
  {
    keywords: ['follow-up', 'seguimento', 'nao respondeu', 'não respondeu', 'frio', 'reativar', 'reativação'],
    answer: '**Estratégia de follow-up para lead sem resposta:**\n\n1. **Dia 1-2:** Primeira mensagem de apresentação (breve, sem pressão)\n2. **Dia 4-5:** Partilhar conteúdo de valor (artigo, testemunho, vídeo)\n3. **Dia 10:** Mensagem de follow-up leve: *"Olá [Nome], só a verificar se recebeu a informação que partilhei. Estou disponível se quiser saber mais."*\n4. **Dia 20:** Última tentativa: *"Não quero incomodar, mas deixo a porta aberta caso mude de ideias. Qualquer dúvida, estou aqui!"*\n\n💡 *Após 30 dias sem resposta, mude o estado para "não_interessado" e arquive.*',
  },
  {
    keywords: ['qualificar', 'qualificação', 'perguntas', 'perceber interesse', 'avaliar'],
    answer: '**Perguntas chave para qualificar um lead:**\n\n🟢 **Interesse em saúde:**\n- "Que desafio de saúde quer resolver atualmente?"\n- "Já experimentou suplementação antes? Com que resultado?"\n\n🔵 **Interesse em negócio:**\n- "Procura uma fonte de rendimento extra ou tempo inteiro?"\n- "Tem experiência em vendas ou trabalha atualmente?"\n- "Tem rede de contactos que possa beneficiar destes produtos?"\n\n💡 *Um lead que responde com entusiasmo a 2+ perguntas está qualificado para avançar para apresentação.*',
  },
  {
    keywords: ['novo lead', 'primeiro contacto', 'primeira mensagem', 'abordar'],
    answer: '**Primeira abordagem — Lead novo:**\n\nMensagem sugerida:\n"Olá [Nome]! 😊 Obrigado pelo seu interesse na NeoLife. Sou [José/Ofélia] Machado e estou aqui para ajudá-lo(a) a perceber se os nossos produtos ou a nossa oportunidade de negócio fazem sentido para si. Que informação recebeu até agora sobre a NeoLife?"\n\n💡 *Começar com uma pergunta aberta ajuda a perceber de imediato o nível de conhecimento e expectativa do lead.*',
  },
  {
    keywords: ['parceiro', 'membro', 'distribuidor', 'motivar', 'reconhecimento', 'equipa'],
    answer: '**Mensagem de motivação para parceiro/distribuidor:**\n\n"Olá [Nome]! 🌟 Queria reconhecer o seu esforço este mês. Cada passo que dá na construção do seu negócio é investimento no seu futuro e da sua família. Se precisar de apoio, formação ou simplesmente de uma conversa estratégica, estamos aqui. Vamos crescer juntos!"\n\n💡 *O reconhecimento frequente é um dos maiores fatores de retenção em modelos de vendas diretas.*',
  },
  {
    keywords: ['convertido', 'fechar', 'próximo passo', 'inscrever', 'registar', 'como avançar'],
    answer: '**Processo para converter um lead interessado:**\n\n1. ✅ Enviar o link de registo NeoLife oficial\n2. ✅ Explicar o kit de início (produtos incluídos, custo de entrada)\n3. ✅ Agendar uma videochamada de boas-vindas nas primeiras 48h\n4. ✅ Adicionar ao grupo de formação/WhatsApp da equipa\n5. ✅ Atualizar estado no CRM para "convertido"\n\n💡 *Os primeiros 7 dias são críticos — acompanhamento próximo reduz desistência em 60%.*',
  },
];

export function getAdminFallbackResponse(message: string): string {
  const normalized = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const item of ADMIN_FALLBACK_RESPONSES) {
    const match = item.keywords.some((kw) => {
      const normKw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return normalized.includes(normKw);
    });
    if (match) return item.answer;
  }

  return 'Pronto para ajudar! Pode pedir-me que:\n\n- **Redija mensagens** para WhatsApp ou e-mail para um lead específico\n- **Sugira estratégias** de abordagem ou follow-up\n- **Ajude a qualificar** um lead com as perguntas certas\n- **Proponha mensagens** de motivação para parceiros\n\nBasta indicar o estado e o perfil do lead e eu trato do resto.';
}

