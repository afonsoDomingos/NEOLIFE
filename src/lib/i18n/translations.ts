export type Language = 'pt' | 'en';

export interface TranslationDictionary {
  nav: {
    home: string;
    health: string;
    business: string;
    experiences: string;
    videos: string;
    membersArea: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    mentorshipBadge: string;
    mentorshipText: string;
    talkToUs: string;
    exploreHealth: string;
    exploreBusiness: string;
  };
  mentors: {
    badge: string;
    title: string;
    highlight: string;
    p1: string;
    p2: string;
    p3: string;
    coupleTitle: string;
    coupleSubtitle: string;
    coupleRegions: string;
    bullet1: string;
    bullet2: string;
    bullet3: string;
    bullet4: string;
    quote: string;
    alwaysAvailable: string;
  };
  health: {
    badge: string;
    title: string;
    subtitle: string;
    categoriesTitle: string;
    categoriesSubtitle: string;
    categories: {
      supplements: {
        title: string;
        desc: string;
        tag: string;
      };
      personalCare: {
        title: string;
        desc: string;
        tag: string;
      };
      homeCleaning: {
        title: string;
        desc: string;
        tag: string;
      };
      domesticUse: {
        title: string;
        desc: string;
        tag: string;
      };
      agriculture: {
        title: string;
        desc: string;
        tag: string;
      };
      otherSolutions: {
        title: string;
        desc: string;
        tag: string;
        prompt: string;
        inputPlaceholder: string;
        sendButton: string;
        successMsg: string;
      };
    };
    packsTitle: string;
    packsSubtitle: string;
    packs: {
      vitality: {
        title: string;
        desc: string;
        features: string[];
      };
      immunity: {
        title: string;
        desc: string;
        features: string[];
      };
      joints: {
        title: string;
        desc: string;
        features: string[];
      };
      digestive: {
        title: string;
        desc: string;
        features: string[];
      };
    };
    ctaButton: string;
  };
  business: {
    badge: string;
    title: string;
    subtitle: string;
    flowNotice: string;
    videoPlaceholderText: string;
    videoComingSoon: string;
    blocks: {
      intro: {
        number: string;
        theme: string;
        text: string;
        videoTitle: string;
        cta: string;
      };
      model: {
        number: string;
        theme: string;
        text: string;
        videoTitle: string;
        cta: string;
      };
      mentorship: {
        number: string;
        theme: string;
        text: string;
        videoTitle: string;
        cta: string;
      };
      earnings: {
        number: string;
        theme: string;
        text: string;
        videoTitle: string;
        cta: string;
      };
      start: {
        number: string;
        theme: string;
        text: string;
        videoTitle: string;
        cta: string;
      };
    };
  };
  experiences: {
    badge: string;
    title: string;
    subtitle: string;
    comingSoonBanner: string;
    items: {
      motivation: {
        title: string;
        desc: string;
        tag: string;
      };
      growth: {
        title: string;
        desc: string;
        tag: string;
      };
      travel: {
        title: string;
        desc: string;
        tag: string;
      };
      recognition: {
        title: string;
        desc: string;
        tag: string;
      };
      events: {
        title: string;
        desc: string;
        tag: string;
      };
      international: {
        title: string;
        desc: string;
        tag: string;
      };
    };
  };
  cta: {
    readyTitle: string;
    readyText: string;
    startNow: string;
    directContact: string;
  };
  footer: {
    slogan: string;
    quickLinks: string;
    rights: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  pt: {
    nav: {
      home: 'Início',
      health: 'Saúde',
      business: 'Business & Oportunidade',
      experiences: 'Outras Experiências',
      videos: 'Vídeos',
      membersArea: 'Área de Membros',
    },
    hero: {
      badge: 'NeoLife Global & África • Mentoria & Transformação',
      title: 'O que você está buscando para a sua vida hoje?',
      subtitle: 'Para a sua jornada, conte com a mentoria próxima e dedicada de Ofélia & José Machado.',
      mentorshipBadge: 'Mentoria Personalizada',
      mentorshipText: 'Ofélia & José Machado ao seu lado',
      talkToUs: 'Falar Connosco',
      exploreHealth: '1. Conhecer Soluções de Saúde',
      exploreBusiness: '2. Explorar Oportunidade de Negócio',
    },
    mentors: {
      badge: 'Quem Somos',
      title: 'Uma Equipa Real.',
      highlight: 'Partilha Genuína.',
      p1: 'Não somos uma corporação distante. Somos o José Sarmento Machado e a Ofélia Alfredo Machado, um casal que encontrou na NeoLife o caminho para transformar a saúde da nossa família e construir uma fonte de rendimento sustentável — e decidimos partilhar essa experiência e mentoria com quem está ao nosso redor.',
      p2: 'A nossa missão é simples: partilhar conhecimento prático e comprovado sobre nutrição celular, esclarecer dúvidas com transparência e acompanhar quem desejar empreender connosco — sem pressão, com acompanhamento próximo e respeito pelo seu tempo.',
      p3: 'Se tiver dúvidas, perguntas ou curiosidade sobre a nossa caminhada — estamos aqui. A conversa é gratuita e sem qualquer compromisso.',
      coupleTitle: 'José & Ofélia Machado',
      coupleSubtitle: 'Consultores & Mentores de Bem-Estar NeoLife',
      coupleRegions: 'Moçambique · África do Sul · Angola · Zimbabwe · Presença Global',
      bullet1: 'Informação educativa sobre saúde celular e bem-estar',
      bullet2: 'Resposta a dúvidas com total clareza e sem compromisso',
      bullet3: 'Acompanhamento e mentoria passo a passo',
      bullet4: 'Rede ativa e expansão em vários países',
      quote: '"A melhor decisão é uma decisão informada. Estamos aqui para garantir que a sua o seja."',
      alwaysAvailable: 'Sempre disponíveis via WhatsApp',
    },
    health: {
      badge: 'Pilar 01 • Saúde & Nutrição Celular',
      title: 'Soluções Completas para a Sua Saúde',
      subtitle: 'Organização simples para que encontre rapidamente exatamente aquilo que o seu corpo e lar precisam.',
      categoriesTitle: 'Categorias de Soluções NeoLife',
      categoriesSubtitle: 'Explore cada uma das nossas linhas de produtos pioneiros baseados na natureza e comprovados pela ciência.',
      categories: {
        supplements: {
          title: 'Suplementos Nutricionais',
          desc: 'Nutrição celular avançada, vitaminas essenciais, minerais e energia diária formulados com base na cadeia alimentar humana.',
          tag: 'Nutrição Celular',
        },
        personalCare: {
          title: 'Produtos de Higiene Pessoal',
          desc: 'Cuidados dermatológicos e corporais de alta qualidade, que nutrem e protegem a sua pele e cabelo diariamente.',
          tag: 'Cuidados Pessoais',
        },
        homeCleaning: {
          title: 'Produtos para Limpeza da Casa',
          desc: 'Fórmulas biodegradáveis, concentradas e ecológicas (como o Super 10 e LDC) que protegem a sua família e poupam dinheiro.',
          tag: 'Ecológicos & Concentrados',
        },
        domesticUse: {
          title: 'Produtos para Uso Doméstico',
          desc: 'Soluções práticas e seguras para a gestão diária do lar, com rentabilidade excecional e sem químicos agressivos.',
          tag: 'Casa Sustentável',
        },
        agriculture: {
          title: 'Jardinagem / Agricultura',
          desc: 'Soluções biológicas de alto rendimento (como o Super Gro) para maximizar colheitas, nutrir plantas e otimizar o uso da água.',
          tag: 'Super Gro & Culturas',
        },
        otherSolutions: {
          title: 'Outras Soluções',
          desc: 'Tem uma necessidade de saúde ou bem-estar específica que não encontrou acima?',
          tag: 'Atendimento Personalizado',
          prompt: 'Diz-nos o que procuras ou qual é a tua necessidade, e entraremos em contacto contigo para perceber melhor como podemos ajudar.',
          inputPlaceholder: 'Escreva aqui a sua dúvida, necessidade ou o produto que procura...',
          sendButton: 'Enviar Necessidade',
          successMsg: 'Mensagem recebida! Iremos responder com a melhor recomendação para si.',
        },
      },
      packsTitle: 'Pacotes de Saúde Oficiais Recomendados NeoLife',
      packsSubtitle: 'Combinações comprovadas pela equipa científica NeoLife (SAB) para resultados rápidos e sustentáveis.',
      packs: {
        vitality: {
          title: 'Pacote Vitalidade & Energia Celular',
          desc: 'A base diária que todo o organismo necessita com Tre-en-en, carotenoides, ómega-3 e micronutrientes fundamentais.',
          features: ['Nutrição à escala celular', 'Aumento de energia natural', 'Proteção antioxidante reforçada'],
        },
        immunity: {
          title: 'Pacote Defesa & Imunidade Total',
          desc: 'Combinação potente de fitonutrientes e antioxidantes clinicamente comprovados para fortalecer as defesas naturais.',
          features: ['Reforço do sistema imunitário', 'Carotenoid Complex original', 'Maior resistência a infeções'],
        },
        joints: {
          title: 'Pacote Articulações & Mobilidade',
          desc: 'Suporte nutricional específico para cartilagens saudáveis, flexibilidade e alívio do desconforto nas articulações.',
          features: ['Glucosamina de alta biodisponibilidade', 'Apoio à cartilagem e ossos', 'Conforto na locomoção'],
        },
        digestive: {
          title: 'Pacote Saúde Digestiva & Desintoxicação',
          desc: 'Equilíbrio da flora intestinal, melhoria da absorção de nutrientes e limpeza suave do trato digestivo.',
          features: ['Probióticos selecionados', 'Fibra natural e desintoxicação', 'Digestão leve e eficiente'],
        },
      },
      ctaButton: 'Saber Mais Sobre Este Pacote',
    },
    business: {
      badge: 'Pilar 02 • Oportunidade de Negócio',
      title: 'Oportunidade de Negócio & Liberdade Financeira',
      subtitle: 'Apresentação direta em pequenos blocos explicativos, acompanhados por vídeos curtos e guião passo a passo.',
      flowNotice: 'Estrutura do Guião: Tema ➔ Pequeno texto ➔ Vídeo explicativo ➔ Passo seguinte',
      videoPlaceholderText: 'Espaço reservado para o vídeo deste módulo',
      videoComingSoon: 'Vídeo em Produção • Clique para saber mais com os mentores',
      blocks: {
        intro: {
          number: '01',
          theme: 'O Que É a NeoLife & A Nossa Filosofia',
          text: 'Uma empresa com mais de 65 anos de história global sólida, com produtos pioneiros em nutrição e um modelo ético baseado na partilha de valor e melhoria de vidas.',
          videoTitle: 'Vídeo 1: Visão Geral da NeoLife',
          cta: 'Continuar para o Modelo ➔',
        },
        model: {
          number: '02',
          theme: 'Como Funciona o Modelo de Negócio',
          text: 'Você experimenta os produtos, partilha a sua recomendação genuína e desenvolve uma rede de clientes e parceiros. Sem armazéns obrigatórios, sem complicações operacionais.',
          videoTitle: 'Vídeo 2: O Modelo de Negócio Explicado',
          cta: 'Ver Apoio & Mentoria ➔',
        },
        mentorship: {
          number: '03',
          theme: 'Mentoria Dedicada de José & Ofélia Machado',
          text: 'Você nunca estará sozinho. Temos formações semanais, estratégias práticas de comunicação e orientação personalizada para ajudá-lo a alcançar os seus primeiros resultados.',
          videoTitle: 'Vídeo 3: O Nosso Plano de Acompanhamento',
          cta: 'Conhecer Potencial de Ganhos ➔',
        },
        earnings: {
          number: '04',
          theme: 'Fontes de Rendimento & Expansão Internacional',
          text: 'Margem de retalho, bónus de volume e rendimentos residuais crescentes em mais de 50 países com a mesma filiação internacional.',
          videoTitle: 'Vídeo 4: Planos de Compensação e Escala',
          cta: 'Como Posso Começar ➔',
        },
        start: {
          number: '05',
          theme: 'Como Começar Hoje Mesmo',
          text: 'O investimento inicial é muito acessível. Recebe o seu kit oficial, ativa a sua licença e começa a dar os primeiros passos com a nossa equipa.',
          videoTitle: 'Vídeo 5: Os Primeiros Passos Práticos',
          cta: 'Quero Registar-me / Falar Agora',
        },
      },
    },
    experiences: {
      badge: 'Pilar 03 • Experiências & Estilo de Vida',
      title: 'Mundo, Desenvolvimento & Outras Experiências',
      subtitle: 'Muito mais que um negócio: uma comunidade viva focada em desenvolvimento humano, reconhecimento e impacto global.',
      comingSoonBanner: 'Área em Desenvolvimento Contínuo • Novos conteúdos, testemunhos e galerias em breve!',
      items: {
        motivation: {
          title: 'Motivação & Mentalidade',
          desc: 'Workshops inspiradores e conteúdos práticos para cultivar a resiliência, foco e determinação diária.',
          tag: 'Mentalidade Positiva',
        },
        growth: {
          title: 'Desenvolvimento Pessoal',
          desc: 'Formações de liderança, comunicação interpessoal e gestão que valorizam as pessoas em todas as dimensões.',
          tag: 'Liderança',
        },
        travel: {
          title: 'Incentivos & Viagens',
          desc: 'Viagens anuais inesquecíveis para destinos de luxo internacionais totalmente custeadas para quem atinge metas de excelência.',
          tag: 'Viagens Globais',
        },
        recognition: {
          title: 'Reconhecimento & Celebrações',
          desc: 'Cada vitória e cada nova etapa alcançada é celebrada em convenções com prémios, distinções e mérito genuíno.',
          tag: 'Mérito & Prémios',
        },
        events: {
          title: 'Eventos & Convenções',
          desc: 'Encontros regionais e mundiais com líderes internacionais, médicos e cientistas do Conselho de Assessoria Científica (SAB).',
          tag: 'Networking Internacional',
        },
        international: {
          title: 'Oportunidades Internacionais',
          desc: 'Capacidade de construir equipas em Moçambique, África do Sul, Angola, Zimbabwe e dezenas de outros países.',
          tag: 'Presença Global',
        },
      },
    },
    cta: {
      readyTitle: 'Pronto para Transformar a Sua Saúde ou Iniciar o Seu Negócio?',
      readyText: 'Escolha a área que mais lhe interessa hoje. Estamos à sua disposição para esclarecer qualquer dúvida com honestidade e dedicação.',
      startNow: 'Conversar com José & Ofélia',
      directContact: 'WhatsApp Oficial: +258 82 305 6900',
    },
    footer: {
      slogan: 'Saúde, Vitalidade e Liberdade Financeira no Mercado Africano e Global',
      quickLinks: 'Links Rápidos',
      rights: 'Todos os direitos reservados. Website independente de partilha e promoção.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      health: 'Health',
      business: 'Business Opportunity',
      experiences: 'Other Experiences',
      videos: 'Videos',
      membersArea: 'Member Area',
    },
    hero: {
      badge: 'NeoLife Global & Africa • Mentorship & Transformation',
      title: 'What are you looking to transform in your life today?',
      subtitle: 'For your journey, count on the close and dedicated mentorship of Ofélia & José Machado.',
      mentorshipBadge: 'Personal Mentorship',
      mentorshipText: 'Ofélia & José Machado by your side',
      talkToUs: 'Contact Us',
      exploreHealth: '1. Discover Health Solutions',
      exploreBusiness: '2. Explore Business Opportunity',
    },
    mentors: {
      badge: 'About Us',
      title: 'A Real Team.',
      highlight: 'Genuine Sharing.',
      p1: 'We are not a distant corporation. We are José Sarmento Machado and Ofélia Alfredo Machado, a couple that found in NeoLife the path to transform our family’s health and build a sustainable income stream — and we decided to share this experience and mentorship with everyone around us.',
      p2: 'Our mission is simple: share practical, science-backed knowledge about cellular nutrition, clarify doubts with transparency, and mentor those who wish to build a business with us — without pressure, with close guidance and respect for your time.',
      p3: 'If you have questions or curiosity about our journey — we are here. A conversation is free and without obligation.',
      coupleTitle: 'José & Ofélia Machado',
      coupleSubtitle: 'NeoLife Wellness Mentors & Consultants',
      coupleRegions: 'Mozambique · South Africa · Angola · Zimbabwe · Global Presence',
      bullet1: 'Educational insight on cellular wellness and vitality',
      bullet2: 'Clear answers to your questions without pressure',
      bullet3: 'Step-by-step personalized mentoring and coaching',
      bullet4: 'Active community and presence in multiple countries',
      quote: '"The best decision is an informed decision. We are here to ensure yours is."',
      alwaysAvailable: 'Always available via WhatsApp',
    },
    health: {
      badge: 'Pillar 01 • Health & Cellular Nutrition',
      title: 'Complete Solutions for Your Health',
      subtitle: 'A straightforward layout so you can quickly identify exactly what your body and home need.',
      categoriesTitle: 'NeoLife Solution Categories',
      categoriesSubtitle: 'Explore our pioneering product lines, rooted in nature and validated by science.',
      categories: {
        supplements: {
          title: 'Nutritional Supplements',
          desc: 'Advanced cellular nutrition, vital vitamins, minerals, and sustained energy formulated based on the human food chain.',
          tag: 'Cellular Nutrition',
        },
        personalCare: {
          title: 'Personal Care Products',
          desc: 'High-quality dermatological and body care designed to nourish, protect, and revitalize skin and hair naturally.',
          tag: 'Personal Care',
        },
        homeCleaning: {
          title: 'Home Cleaning Products',
          desc: 'Biodegradable, concentrated, eco-friendly formulas (like Super 10 and LDC) that protect your family and save money.',
          tag: 'Eco & Concentrated',
        },
        domesticUse: {
          title: 'Domestic Use Solutions',
          desc: 'Safe, versatile, and economical products for everyday home care without harsh, harmful chemicals.',
          tag: 'Sustainable Home',
        },
        agriculture: {
          title: 'Gardening & Agriculture',
          desc: 'High-yield bio-formulations (such as Super Gro) to maximize crop yield, nourish plants, and optimize water usage.',
          tag: 'Super Gro & Crops',
        },
        otherSolutions: {
          title: 'Other Solutions',
          desc: 'Do you have a specific health or wellness need not listed above?',
          tag: 'Custom Assistance',
          prompt: 'Tell us what you are looking for or what your need is, and we will contact you to better understand how we can help.',
          inputPlaceholder: 'Write your question, specific requirement, or desired product here...',
          sendButton: 'Send Request',
          successMsg: 'Message received! We will follow up with the best recommendation for you.',
        },
      },
      packsTitle: 'Official NeoLife Recommended Health Packs',
      packsSubtitle: 'Scientifically validated combinations by the Scientific Advisory Board (SAB) for lasting results.',
      packs: {
        vitality: {
          title: 'Cellular Vitality & Energy Pack',
          desc: 'The essential daily foundation with Tre-en-en grain concentrates, carotenoids, omega-3, and key micronutrients.',
          features: ['Nutrition at the cellular level', 'Enhanced natural stamina', 'Antioxidant defense'],
        },
        immunity: {
          title: 'Total Immune Defense Pack',
          desc: 'A clinically proven combination of potent phytonutrients and antioxidants to bolster your body’s natural defenses.',
          features: ['Immune system boost', 'Original Carotenoid Complex', 'Resilience against infections'],
        },
        joints: {
          title: 'Joint Health & Mobility Pack',
          desc: 'Targeted nutritional support for cartilage comfort, flexible motion, and freedom of movement.',
          features: ['High bioavailability glucosamine', 'Joint & bone support', 'Active mobility comfort'],
        },
        digestive: {
          title: 'Digestive Health & Cleanse Pack',
          desc: 'Balanced intestinal flora, optimized nutrient absorption, and gentle, effective digestive tract renewal.',
          features: ['Targeted friendly probiotics', 'Natural cleansing fiber', 'Smooth, efficient digestion'],
        },
      },
      ctaButton: 'Learn More About This Pack',
    },
    business: {
      badge: 'Pillar 02 • Business Opportunity',
      title: 'Business Opportunity & Financial Freedom',
      subtitle: 'Presented in concise blocks with short companion videos and a step-by-step roadmap.',
      flowNotice: 'Roadmap Structure: Topic ➔ Short Text ➔ Video Window ➔ Next Step',
      videoPlaceholderText: 'Video player window for this module',
      videoComingSoon: 'Video in Production • Click to talk with our mentors',
      blocks: {
        intro: {
          number: '01',
          theme: 'What NeoLife Is & Our Core Values',
          text: 'A global company with over 65 years of stability, pioneering nutrition products, and an ethical model built on uplifting lives.',
          videoTitle: 'Video 1: NeoLife Global Overview',
          cta: 'Continue to Business Model ➔',
        },
        model: {
          number: '02',
          theme: 'How the Business Model Works',
          text: 'You experience the products, share genuine recommendations, and build a network of customers and partners. No inventory strain, no corporate friction.',
          videoTitle: 'Video 2: The Business Model Explained',
          cta: 'See Mentorship & Support ➔',
        },
        mentorship: {
          number: '03',
          theme: 'Dedicated Mentorship by José & Ofélia Machado',
          text: 'You are never alone. Benefit from weekly coaching sessions, proven communication assets, and direct guidance to achieve your first milestones.',
          videoTitle: 'Video 3: Our Mentorship Roadmap',
          cta: 'Explore Earnings Potential ➔',
        },
        earnings: {
          number: '04',
          theme: 'Income Streams & Global Expansion',
          text: 'Retail margins, volume bonuses, and compounding residual income across more than 50 countries with a single international license.',
          videoTitle: 'Video 4: Compensation & Scaling',
          cta: 'How to Get Started ➔',
        },
        start: {
          number: '05',
          theme: 'How to Start Today',
          text: 'Low startup costs, an official member kit, immediate digital tools, and active onboarding with our team from day one.',
          videoTitle: 'Video 5: Practical First Steps',
          cta: 'Sign Up / Speak to Mentors Now',
        },
      },
    },
    experiences: {
      badge: 'Pillar 03 • Lifestyle & Experiences',
      title: 'World, Growth & Other Experiences',
      subtitle: 'More than a business: a thriving community centered on personal growth, recognition, and global impact.',
      comingSoonBanner: 'Section Under Active Development • New stories, event galleries, and media coming soon!',
      items: {
        motivation: {
          title: 'Motivation & Mindset',
          desc: 'Inspiring workshops and practical insights to build consistency, mental resilience, and daily focus.',
          tag: 'Positive Mindset',
        },
        growth: {
          title: 'Personal Development',
          desc: 'Leadership, interpersonal communication, and management training that empower people in all aspects of life.',
          tag: 'Leadership',
        },
        travel: {
          title: 'Incentives & Travel',
          desc: 'Unforgettable annual all-expenses-paid trips to world-class luxury destinations for top achievers.',
          tag: 'Global Travel',
        },
        recognition: {
          title: 'Recognition & Celebrations',
          desc: 'Every milestone and promotion is recognized and celebrated on stage with awards, pins, and genuine applause.',
          tag: 'Merit & Awards',
        },
        events: {
          title: 'Global Events & Conventions',
          desc: 'Regional and international summits featuring global leaders, doctors, and Scientific Advisory Board members.',
          tag: 'International Networking',
        },
        international: {
          title: 'International Opportunities',
          desc: 'Build and lead teams in Mozambique, South Africa, Angola, Zimbabwe, and across 50+ countries worldwide.',
          tag: 'Global Footprint',
        },
      },
    },
    cta: {
      readyTitle: 'Ready to Elevate Your Health or Build Your Business?',
      readyText: 'Select your area of interest today. We are at your service to answer every question with honesty and dedication.',
      startNow: 'Talk to José & Ofélia',
      directContact: 'Official WhatsApp: +258 82 305 6900',
    },
    footer: {
      slogan: 'Health, Vitality, and Financial Freedom Across Africa and Globally',
      quickLinks: 'Quick Links',
      rights: 'All rights reserved. Independent distributor & sharing platform.',
    },
  },
};
