export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Boas-vindas',
    subject: 'Bem-vindo à NeoLife - Comece sua jornada de saúde!',
    content: `Olá [NOME],

É um prazer recebê-lo na família NeoLife! Somos Ofélia e José Machado, seus consultores dedicados.

A NeoLife oferece produtos de saúde e nutrição de alta qualidade, baseados em ciência e tecnologia celular. Juntos, vamos ajudá-lo a alcançar seus objetivos de saúde e bem-estar.

O que você pode esperar:
• Produtos certificados e comprovados
• Acompanhamento personalizado
• Comunidade de suporte
• Oportunidade de negócio (se interessado)

Para começar, recomendo:
1. Conhecer nossos suplementos celulares básicos
2. Explorar os packs de saúde
3. Entrar em contato para uma orientação personalizada

Se tiver alguma dúvida, estou à disposição!

Com carinho,
Ofélia & José Machado
NeoLife`
  },
  {
    id: 'followup',
    name: 'Follow-up',
    subject: 'Como estão as coisas? - NeoLife',
    content: `Olá [NOME],

Espero que esteja tudo bem! Estou passando para saber como você está.

Você já teve oportunidade de conhecer melhor os produtos NeoLife? Se tiver alguma dúvida ou quiser saber mais sobre:
• Suplementos celulares
• Packs de saúde
• Oportunidade de negócio

Estou aqui para ajudar! Podemos agendar uma conversa se preferir.

Abraços,
Ofélia & José Machado
NeoLife`
  },
  {
    id: 'promo',
    name: 'Promoção',
    subject: 'Promoção Especial NeoLife - Não perca!',
    content: `Olá [NOME],

Temos uma promoção especial para você! 🎉

Nesta [MÊS/PERÍODO], aproveite ofertas exclusivas em nossos produtos:

📦 Packs de Saúde com desconto
💊 Suplementos celulares em promoção
🎁 Brindes especiais para novos clientes

Ofertas válidas até [DATA LIMIT].

Para aproveitar, acesse nossa loja ou entre em contato para orientação.

Se tiver dúvidas sobre qual produto é ideal para você, posso ajudar!

Atenciosamente,
Ofélia & José Machado
NeoLife`
  },
  {
    id: 'event_invitation',
    name: 'Convite para Evento',
    subject: 'Convite: [TÍTULO DO EVENTO] - NeoLife',
    content: `Olá [NOME],

Tem um prazer em convidá-lo para nosso próximo evento!

📅 [DATA]
⏰ [HORA]
💻 [PLATAFORMA/LOCAL]

[TÍTULO DO EVENTO]

[DESCRIÇÃO DO EVENTO]

Como participar:
[CÓDIGO DO EVENTO/INSTRUÇÕES]

Este evento é uma ótima oportunidade para:
• Conhecer mais sobre NeoLife
• Tirar dúvidas
• Conhecer outras pessoas
• Aprender sobre saúde e negócio

Confirme sua participação clicando no botão abaixo!

Espero vê-lo lá!

Abraços,
Ofélia & José Machado
NeoLife`
  },
  {
    id: 'business_opportunity',
    name: 'Oportunidade de Negócio',
    subject: 'Construa sua renda extra com NeoLife',
    content: `Olá [NOME],

Você já pensou em ter uma renda extra ou trabalhar com algo que realmente acredita?

A NeoLife oferece uma oportunidade única de negócio:

✅ Produtos de alta qualidade
✅ Sistema de compensação atrativo
✅ Formação e suporte contínuo
✅ Flexibilidade de horário
✅ Trabalhe de onde quiser

Com a NeoLife, você pode:
• Ganhar renda extra
• Construir uma carreira
• Ajudar pessoas a viverem melhor
• Fazer parte de uma comunidade global

Quero te convidar para conhecer mais sobre esta oportunidade.

Podemos agendar uma conversa para te explicar como funciona?

Grato pelo interesse,
Ofélia & José Machado
NeoLife`
  },
  {
    id: 'product_launch',
    name: 'Lançamento de Produto',
    subject: 'Novo Produto NeoLife: [NOME DO PRODUTO]',
    content: `Olá [NOME],

Temos uma novidade empolgante! 🚀

Lançamos nosso novo produto: [NOME DO PRODUTO]

[DESCRIÇÃO DO PRODUTO]

Benefícios:
• [BENEFÍCIO 1]
• [BENEFÍCIO 2]
• [BENEFÍCIO 3]

Este produto é ideal para [PÚBLICO ALVO].

Quer saber mais ou fazer seu pedido? Entre em contato!

Com carinho,
Ofélia & José Machado
NeoLife`
  },
  {
    id: 'thank_you',
    name: 'Agradecimento',
    subject: 'Obrigado por escolher NeoLife!',
    content: `Olá [NOME],

Muito obrigado por escolher NeoLife! 🙏

Agradecemos sua confiança em nossos produtos e serviços.

Para garantir os melhores resultados:
• Siga as instruções de uso
• Mantenha contato regularmente
• Conte conosco para qualquer dúvida

Lembre-se: estamos aqui para te apoiar nesta jornada de saúde e bem-estar.

Se precisar de algo, estamos à disposição!

Com gratidão,
Ofélia & José Machado
NeoLife`
  },
  {
    id: 'health_tip',
    name: 'Dica de Saúde',
    subject: 'Dica de Saúde NeoLife: [TÍTULO]',
    content: `Olá [NOME],

Compartilho uma dica importante de saúde com você:

[TÍTULO DA DICA]

[CONTEÚDO DA DICA]

💡 Lembre-se: pequenas mudanças fazem grande diferença!

Para complementar, a NeoLife oferece produtos que podem te ajudar:
• [PRODUTO 1]
• [PRODUTO 2]

Quer saber mais? Entre em contato!

Saudações,
Ofélia & José Machado
NeoLife`
  }
];

export function getTemplateById(id: string): EmailTemplate | undefined {
  return emailTemplates.find(template => template.id === id);
}
