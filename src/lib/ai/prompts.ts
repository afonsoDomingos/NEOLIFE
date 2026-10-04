export const AI_SYSTEM_PROMPT = `Tu és o Assistente Virtual Consultivo da plataforma de Bem-Estar e Oportunidade NeoLife, respondendo em nome dos representantes Ofélia e José Machado. Tu és a voz oficial da equipa de mentoria liderada por este casal.

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
- Como Ganhar Renda Extra: Inicie com um kit de início acessível, recomende produtos de consumo diário a familiares e amigos, construa uma equipa de parceiros, e beneficie de planos de compensação que pagam comissões em múltiplos níveis. Comece em tempo parcial, sem necessidade de stock prévio, com suporte da mentoria para cada passo.
- Plano de Compensação: Sistema transparente com comissões por vendas diretas (15-25%), bónus de equipa (quando os parceiros vendem), bónus de liderança (ao promover líderes), viagens internacionais e ajudas de custo para líderes activos. Os produtos são de consumo recorrente, criando rendimento passivo com o tempo.
- Formas de Ganhar: 1) Comissões de vendas pessoais, 2) Bónus de equipa, 3) Bónus de liderança, 4) Viagens e reconhecimentos, 5) Ajudas de custo para líderes activos.
- Investimento Inicial: Kit de início acessível que inclui produtos para uso pessoal e partilha. Sem stock obrigatório. Pode começar com investimento mínimo e reinvestir os lucros gradualmente.
- Presença Global NeoLife: África (Moçambique, África do Sul, Angola, Zimbabwe, Botswana, Lesoto, Namíbia, Eswatini, Quénia, Tanzânia, Uganda, Nigéria, Gana, Benin, Camarões, Costa do Marfim, Togo), Américas (EUA, Canadá, América Latina), Ásia & Pacífico (Filipinas, Singapura, Japão, Austrália, Nova Zelândia), Europa (Reino Unido, Itália, Alemanha, França, Espanha, Polónia, Suécia, Noruega, Finlândia, Dinamarca, Islândia, Irlanda, Estónia, Letónia, Lituânia, Croácia, Eslovénia, Bósnia-Herzegovina, Hungria, Roménia, Áustria, Suíça, Países Baixos, Chipre, Malta).
- Mercados com apoio ativo e mentoria direta da equipa: Moçambique (+258 82 305 6900), África do Sul, Angola e Zimbabwe.

Produtos Disponíveis:
Packs de Saúde:
- Pack de Pequeno Almoço (30 Dias): Para começar o dia com nutrição celular completa
- Pack de Gestão & Perda de Peso: Substitutos de refeição para gestão de peso saudável
- Omega-3 Salmon Oil Plus: Ácidos gordos ômega-3 para coração, cérebro e articulações
- Pack de Energia Celular: Combina Tre-en-en com outros suplementos para vitalidade
- Pack de Flexibilidade & Articulações: Para saúde das articulações e mobilidade
- Pack de Digestão: Apoio digestivo e regularidade intestinal
- Pack de Imunidade + PhytoDefence: Fortalece o sistema imunitário
- Pack para Mente Inteligente: Para foco e clareza mental
- Pack para Homens: Saúde masculina e vitalidade
- Pack para Mulheres: Equilíbrio feminino e bem-estar
- Pack Pré-Natal & Maternidade: Nutrição para gravidez e amamentação
- Pack Nutrição Infantil: Para crescimento e desenvolvimento de crianças
- Programa de Detox: Desintoxicação celular completa

Suplementos Celulares Básicos:
- Tre-en-en: Base celular - lípidos e esteróis de grãos integrais
- Carotenoid Complex: Defesa e imunidade - antioxidantes
- Omega-3 Salmon Oil Plus: Coração e cérebro - 8 ácidos gordos ômega-3
- Essential Vitamin & Mineral Complex: Metabolismo diário - vitaminas e minerais

Responde sempre em Português claro, cordial e conciso, com formatação limpa (tópicos curtos quando aplicável).`;


export interface FallbackFAQ {
  keywords: string[];
  answer: string;
}

export const FALLBACK_FAQS: FallbackFAQ[] = [
  {
    keywords: ['quem sao', 'quem são', 'casal', 'jose', 'josé', 'ofelia', 'ofélia', 'machado', 'mentores', 'consultores'],
    answer: 'Esta plataforma é dinamizada por nós, Ofélia e José Machado, consultores e mentores independentes de bem-estar NeoLife. A nossa missão é partilhar conhecimento sobre saúde preventiva e nutrição celular, além de apoiar novas famílias e empreendedores a construir um negócio sustentável e rentável com presença em Moçambique, África do Sul, Angola e Zimbabwe. Visite o nosso site em neolifemz.vercel.app.'
  },
  {
    keywords: ['o que é', 'neolife', 'empresa', 'historia', 'história'],
    answer: 'A NeoLife é uma empresa global pioneira em nutrição celular e bem-estar há mais de 60 anos, presente em mais de 50 países. Todos os produtos são desenvolvidos por cientistas de renome mundial através do Scientific Advisory Board (SAB), fundado pelo Dr. Arthur Furst. A nossa missão como Ofélia e José Machado é educar, orientar e prestar consultoria personalizada a famílias e novos empreendedores.'
  },
  {
    keywords: ['nutricao celular', 'nutrição celular', 'celula', 'célula', 'tre-en-en', 'treenen'],
    answer: 'A Nutrição Celular assenta no princípio de que o corpo só é saudável se as suas 73 biliões de células forem saudáveis. Para isso, a membrana celular precisa de estar permeável para absorver nutrientes e expelir toxinas. O produto emblemático da NeoLife, o Tre-en-en, fornece lípidos e esteróis extraídos de grãos integrais essenciais que foram retirados da alimentação moderna, devolvendo energia e vitalidade ao organismo.'
  },
  {
    keywords: ['negocio', 'negócio', 'oportunidade', 'renda', 'ganhar dinheiro', 'revender', 'distribuidor', 'mentoria'],
    answer: 'A Oportunidade NeoLife permite-lhe construir um negócio independente de bem-estar com o nosso apoio direto como Ofélia e José Machado. Terá acesso a formação passo a passo, plataforma digital própria, produtos patenteados de alta procura e um plano de compensação transparente. Pode iniciar em regime de tempo parcial. Saiba mais na nossa página de Oportunidade ou preencha o formulário para falarmos diretamente.'
  },
  {
    keywords: ['como ganhar dinheiro', 'renda extra', 'ganhar renda', 'rendimento', 'lucro', 'comissao', 'comissão'],
    answer: 'Para ganhar renda extra com a NeoLife, comece com um kit de início acessível que inclui produtos para uso pessoal e partilha. Ganhe comissões de 15 a 25% em vendas diretas. Construa uma equipa de parceiros e receba bónus de equipa quando eles venderem. Ao promover líderes, ganha bónus de liderança, ajudas de custo e viagens internacionais. Os produtos são de consumo recorrente, criando rendimento passivo com o tempo. Nós, Ofélia e José, vamos guiá-lo em cada passo.'
  },
  {
    keywords: ['plano de compensacao', 'plano de compensação', 'comissoes', 'comissões', 'bonus', 'bónus', 'quanto ganho'],
    answer: 'O plano de compensação NeoLife é transparente e pagas em múltiplos níveis. Ganha 15 a 25% em vendas pessoais. Quando constrói uma equipa, recebe bónus de equipa pelas vendas dos seus parceiros. Ao promover líderes, ganha bónus de liderança adicionais. Líderes activos recebem ajudas de custo e viagens internacionais gratuitas. Os produtos são de consumo mensal, criando rendimento recorrente que cresce com o tempo.'
  },
  {
    keywords: ['investimento', 'quanto custa', 'custo inicial', 'kit inicio', 'kit de início', 'dinheiro para começar'],
    answer: 'O investimento inicial é acessível através de um kit de início que inclui produtos para uso pessoal e partilha. Não é obrigatório manter stock. Pode começar com um investimento mínimo e reinvestir os lucros gradualmente. Nós, Ofélia e José, ensinamos a começar com pouco e crescer de forma sustentável. Preencha o formulário para receber informações detalhadas sobre os kits disponíveis.'
  },
  {
    keywords: ['tempo parcial', 'tempo integral', 'horario', 'horário', 'trabalhar', 'dedicar tempo'],
    answer: 'Pode começar o negócio NeoLife em tempo parcial, dedicando apenas algumas horas por semana. Muitos empreendedores começam enquanto trabalham noutro emprego. Nós, Ofélia e José, ensinamos estratégias para ser eficiente e maximizar resultados com pouco tempo. Conforme o negócio cresce, pode fazer a transição para tempo integral se desejar. A flexibilidade é uma das grandes vantagens deste modelo.'
  },
  {
    keywords: ['vender', 'como vender', 'estrategia', 'estratégia', 'clientes', 'encontrar clientes'],
    answer: 'Para vender produtos NeoLife, comece usando os produtos pessoalmente e partilhando a sua experiência com familiares e amigos. Os produtos de consumo diário como o Pack de Pequeno Almoço e Tre-en-en são fáceis de recomendar. Use os materiais de formação que nós oferecemos para aprender a abordar pessoas de forma natural. Organize pequenas apresentações, compartilhe testemunhos e use as redes sociais. Nós guiamos cada passo.'
  },
  {
    keywords: ['equipa', 'construir equipa', 'recrutar', 'parceiros', 'liderar'],
    answer: 'Para construir uma equipa bem-sucedida, comece identificando pessoas interessadas em saúde ou em renda extra. Apresente a oportunidade de forma honesta, sem pressão. Ofereça formação e apoio constante através da nossa mentoria como Ofélia e José. O sucesso da sua equipa é o seu sucesso. Quando os seus parceiros vendem, você ganha bónus de equipa. Foque em ajudar os outros a terem sucesso e o seu rendimento crescerá naturalmente.'
  },
  {
    keywords: ['primeiros passos', 'começar', 'como iniciar', 'primeiro passo', 'iniciar negocio'],
    answer: 'Os primeiros passos para começar são: 1) Preencha o formulário no site para contacto connosco, 2) Escolha o kit de início adequado ao seu orçamento, 3) Comece a usar os produtos pessoalmente, 4) Partilhe a sua experiência com pessoas próximas, 5) Participe das formações que nós oferecemos, 6) Defina objectivos realistas e trabalhe consistentemente. Nós, Ofélia e José, estamos disponíveis em cada etapa para garantir o seu sucesso.'
  },
  {
    keywords: ['link', 'comprar', 'encomendar', 'loja', 'shop', 'url', 'onde comprar'],
    answer: 'Para comprar produtos, pode aceder diretamente à nossa loja oficial em shopneolife.com/ofeliajosemachado. Aqui estão os links diretos dos principais produtos: [Pack Pequeno Almoço](https://shopneolife.com/ofeliajosemachado/shop/product/41062), [Pack Perda Peso](https://shopneolife.com/ofeliajosemachado/shop/weightmanagement), [Omega-3](https://shopneolife.com/ofeliajosemachado/shop/hearthealth), [Pensa Rápido](https://shopneolife.com/ofeliajosemachado/shop/sharpermind), [Feito para Homem](https://shopneolife.com/ofeliajosemachado/shop/menshealth), [Feito para Mulheres](https://shopneolife.com/ofeliajosemachado/shop/womenshealth), [Pré-Natal](https://shopneolife.com/ofeliajosemachado/shop/product/2671), [Energia](https://shopneolife.com/ofeliajosemachado/shop/energyfitness), [Flexibilidade](https://shopneolife.com/ofeliajosemachado/shop/bonejoint), [Digestão](https://shopneolife.com/ofeliajosemachado/shop/digestivehealth), [Imunidade](https://shopneolife.com/ofeliajosemachado/shop/immunedefense), [Nutrição Infantil](https://shopneolife.com/ofeliajosemachado/shop/childrenshealth). O Detox não tem link direto, pode contactar-nos via WhatsApp.'
  },
  {
    keywords: ['pais', 'países', 'paises', 'mocambique', 'moçambique', 'angola', 'africa do sul', 'zimbabwe', 'portugal', 'onde opera', 'global', 'mundo', 'continente', 'europa', 'america', 'asia'],
    answer: 'A NeoLife está presente em mais de 50 países em todo o mundo. África: Moçambique, África do Sul, Angola, Zimbabwe, Botswana, Lesoto, Namíbia, Eswatini, Quénia, Tanzânia, Uganda, Nigéria, Gana, Benin, Camarões, Costa do Marfim, Togo. Américas: EUA, Canadá, América Latina. Ásia & Pacífico: Filipinas, Singapura, Japão, Austrália, Nova Zelândia. Europa: Reino Unido, Itália, Alemanha, França, Espanha, Polónia, Suécia, Noruega, Finlândia, Dinamarca, e muitos mais. A nossa equipa de mentoria liderada por José e Ofélia Machado tem apoio ativo e estruturado para Moçambique, África do Sul, Angola e Zimbabwe. Se reside noutro país, preencha o nosso Formulário para verificarmos disponibilidade.'
  },
  {
    keywords: ['como comprar', 'como encomendar', 'preco', 'preço', 'comprar', 'encomenda', 'valor'],
    answer: 'Para encomendar com segurança e receber orientação adequada às suas necessidades, pode preencher o nosso Formulário de Interesse. Iremos analisar o que procura e enviar-lhe o catálogo oficial com os preços do seu país e opções de entrega segura.'
  },
  {
    keywords: ['sab', 'cientifico', 'científico', 'medico', 'médico', 'seguranca', 'segurança', 'qualidade'],
    answer: 'O Scientific Advisory Board (SAB) da NeoLife foi fundado pelo Dr. Arthur Furst (um dos pais da quimioterapia e toxicologia moderna). Ao contrário de muitas marcas que subcontratam a produção, a NeoLife pesquisa, desenvolve e testa os seus próprios produtos com base em ingredientes de origem alimentar humana e ensaios clínicos publicados em revistas científicas internacionais.'
  },
  {
    keywords: ['contacto', 'contato', 'whatsapp', 'falar', 'telefone', 'mensagem', 'facebook', 'redes sociais'],
    answer: 'Será um enorme prazer conversar consigo! Pode contactar-nos via WhatsApp através do número +258 82 305 6900, ou por chamada para +258 84 305 6900. Pode também submeter os seus dados no nosso Formulário de Contacto. Visite também a nossa página no Facebook para nos acompanhar de perto.'
  },
  {
    keywords: ['produtos', 'produto', 'disponivel', 'disponível', 'catalogo', 'catálogo', 'pack', 'packs', 'suplemento', 'suplementos'],
    answer: 'Temos uma variedade de Packs de Saúde e Suplementos Celulares disponíveis. Packs de Saúde: Pack de Pequeno Almoço (30 Dias), Pack de Gestão e Perda de Peso, Omega-3 Salmon Oil Plus, Pack de Energia Celular, Pack de Flexibilidade e Articulações, Pack de Digestão, Pack de Imunidade, Pack para Mente Inteligente, Pack para Homens, Pack para Mulheres, Pack Pré-Natal, Pack Nutrição Infantil, Programa de Detox. Suplementos Celulares Básicos: Tre-en-en (Base Celular), Carotenoid Complex (Defesa), Omega-3 Salmon Oil Plus (Coração e Cérebro), Essential Vitamin and Mineral Complex (Metabolismo). Visite a nossa página de Saúde para ver todos os detalhes.'
  },
  {
    keywords: ['energia', 'cansado', 'cansaço', 'fadiga', 'vitalidade', 'mais energia'],
    answer: 'Para aumentar a sua energia e vitalidade, recomendo o Pack de Energia Celular ou o Pack de Pequeno Almoço. O Tre-en-en é fundamental pois restaura a permeabilidade das membranas celulares, permitindo que os nutrientes entrem e as toxinas saiam, resultando em mais energia natural. Visite a nossa página de Saúde para ver estes produtos.'
  },
  {
    keywords: ['peso', 'perder peso', 'emagrecer', 'gordura', 'slimming', 'diet'],
    answer: 'Para gestão de peso, o Pack de Gestão e Perda de Peso é ideal. Combina suplementação celular com substitutos de refeição que ajudam a manter a saciedade e fornecer nutrição equilibrada. Recomendo também começar com o Tre-en-en para otimizar o metabolismo celular. Visite a nossa página de Saúde para mais detalhes.'
  },
  {
    keywords: ['coracao', 'coração', 'cardio', 'pressao', 'sangue', 'heart'],
    answer: 'Para saúde cardiovascular, o Omega-3 Salmon Oil Plus é essencial. Fornece ácidos gordos ômega-3 de alta qualidade que apoiam a saúde do coração, cérebro e articulações. Pode encontrá-lo na nossa página de Saúde.'
  },
  {
    keywords: ['imunidade', 'imune', 'defesa', 'doenca', 'doença', 'virus', 'resistencia'],
    answer: 'Para fortalecer o sistema imunitário, o Pack de Imunidade PhytoDefence é a melhor opção. Combina antioxidantes poderosos com fitonutrientes que protegem as células. O Carotenoid Complex também é fundamental para a defesa celular. Visite a nossa página de Saúde para ver estes produtos.'
  },
  {
    keywords: ['detox', 'desintoxicacao', 'desintoxicação', 'limpar', 'toxinas'],
    answer: 'O Programa de Detox Neolife é um programa completo de desintoxicação celular. Usa produtos naturais para ajudar o corpo a eliminar toxinas acumuladas e restaurar o equilíbrio. Visite a nossa página de Saúde para mais informações sobre o programa.'
  },
  {
    keywords: ['crianca', 'criança', 'crianças', 'kids', 'infantil', 'bebe', 'bebé'],
    answer: 'Para crianças, temos o Pack de Nutrição Infantil com produtos formulados especificamente para apoiar o crescimento e desenvolvimento saudável. Visite a nossa página de Saúde para ver os produtos infantis disponíveis.'
  },
  {
    keywords: ['gravidez', 'grávida', 'prenatal', 'pre-natal', 'mamae', 'mãe'],
    answer: 'Para o período pré-natal e amamentação, o Pack Pré-Natal e Maternidade fornece os nutrientes essenciais para a mãe e o bebé. Visite a nossa página de Saúde para mais detalhes sobre nutrição pré-natal.'
  },
];

export function getSmartFallbackResponse(userMessage: string, language: string = 'pt'): string {
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

  if (language === 'en') {
    return 'Hello! Thank you for your message. As a consultative assistant for the NeoLife mentorship team, I am here to clarify doubts about cellular nutrition, preventive health, or our independent business model. Would you like to know more about how to improve your vitality through our products, or would you like to learn about our mentorship to start a business with NeoLife? You can also fill out our [Form](/formulario) for direct contact.';
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
    answer: '**Rascunho de mensagem WhatsApp — Lead novo:**\n\n"Olá [Nome]! Sou o José Machado da equipa NeoLife. Vi que demonstrou interesse em [tema]. Gostaria de partilhar mais informação consigo — tem 5 minutos para uma conversa rápida esta semana?"\n\n*Adapte o [Nome] e [tema] ao perfil do lead. Para leads mais frios, comece por partilhar um conteúdo de valor antes de pedir uma conversa.*',
  },
  {
    keywords: ['follow-up', 'seguimento', 'nao respondeu', 'não respondeu', 'frio', 'reativar', 'reativação'],
    answer: '**Estratégia de follow-up para lead sem resposta:**\n\n1. **Dia 1-2:** Primeira mensagem de apresentação (breve, sem pressão)\n2. **Dia 4-5:** Partilhar conteúdo de valor (artigo, testemunho, vídeo)\n3. **Dia 10:** Mensagem de follow-up leve: *"Olá [Nome], só a verificar se recebeu a informação que partilhei. Estou disponível se quiser saber mais."*\n4. **Dia 20:** Última tentativa: *"Não quero incomodar, mas deixo a porta aberta caso mude de ideias. Qualquer dúvida, estou aqui!"*\n\n*Após 30 dias sem resposta, mude o estado para "não_interessado" e arquive.*',
  },
  {
    keywords: ['qualificar', 'qualificação', 'perguntas', 'perceber interesse', 'avaliar'],
    answer: '**Perguntas chave para qualificar um lead:**\n\n**Interesse em saúde:**\n- "Que desafio de saúde quer resolver atualmente?"\n- "Já experimentou suplementação antes? Com que resultado?"\n\n**Interesse em negócio:**\n- "Procura uma fonte de rendimento extra ou tempo inteiro?"\n- "Tem experiência em vendas ou trabalha atualmente?"\n- "Tem rede de contactos que possa beneficiar destes produtos?"\n\n*Um lead que responde com entusiasmo a 2+ perguntas está qualificado para avançar para apresentação.*',
  },
  {
    keywords: ['novo lead', 'primeiro contacto', 'primeira mensagem', 'abordar'],
    answer: '**Primeira abordagem — Lead novo:**\n\nMensagem sugerida:\n"Olá [Nome]! Obrigado pelo seu interesse na NeoLife. Sou [José/Ofélia] Machado e estou aqui para ajudá-lo(a) a perceber se os nossos produtos ou a nossa oportunidade de negócio fazem sentido para si. Que informação recebeu até agora sobre a NeoLife?"\n\n*Começar com uma pergunta aberta ajuda a perceber de imediato o nível de conhecimento e expectativa do lead.*',
  },
  {
    keywords: ['parceiro', 'membro', 'distribuidor', 'motivar', 'reconhecimento', 'equipa'],
    answer: '**Mensagem de motivação para parceiro/distribuidor:**\n\n"Olá [Nome]! Queria reconhecer o seu esforço este mês. Cada passo que dá na construção do seu negócio é investimento no seu futuro e da sua família. Se precisar de apoio, formação ou simplesmente de uma conversa estratégica, estamos aqui. Vamos crescer juntos!"\n\n*O reconhecimento frequente é um dos maiores fatores de retenção em modelos de vendas diretas.*',
  },
  {
    keywords: ['convertido', 'fechar', 'próximo passo', 'inscrever', 'registar', 'como avançar'],
    answer: '**Processo para converter um lead interessado:**\n\n1. Enviar o link de registo NeoLife oficial\n2. Explicar o kit de início (produtos incluídos, custo de entrada)\n3. Agendar uma videochamada de boas-vindas nas primeiras 48h\n4. Adicionar ao grupo de formação/WhatsApp da equipa\n5. Atualizar estado no CRM para "convertido"\n\n*Os primeiros 7 dias são críticos — acompanhamento próximo reduz desistência em 60%.*',
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

