import nodemailer from 'nodemailer';
import { sendAdminNotification as sendResendAdminNotification } from '@/lib/email/resend';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface LeadEmailData {
  name: string;
  email: string;
  countryName: string;
  themeTitle: string;
  themeSlug: string;
  videoUrl?: string;
  whatsappAdmin?: string;
}

interface AdminEmailData {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  country: string;
  theme: string;
  campaign?: string;
  notes?: string;
}

/**
 * Sends an email using Resend API or Nodemailer SMTP, with a development fallback
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpHost = process.env.SMTP_HOST;
  const fromEmail = process.env.EMAIL_FROM || 'NeoLife África <contato@neolife.com>';

  // 1. Send via Resend API if API key is provided
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Resend API error:', errorData);
        return { success: false, error: JSON.stringify(errorData) };
      }

      return { success: true };
    } catch (err: any) {
      console.error('Error sending email via Resend:', err);
      return { success: false, error: err.message };
    }
  }

  // 2. Send via SMTP with Nodemailer if SMTP_HOST is configured
  if (smtpHost) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: fromEmail,
        to,
        subject,
        html,
      });

      return { success: true };
    } catch (err: any) {
      console.error('Error sending email via SMTP:', err);
      return { success: false, error: err.message };
    }
  }

  // 3. Fallback / Simulation mode (when neither Resend nor SMTP is configured)
  // Silently simulate email - form will work without error
  return { success: true, simulated: true };
}

/**
 * Sends the automatic video/information link email to the lead
 */
export async function sendLeadConfirmationEmail(data: LeadEmailData): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neolife.com';
  const accessUrl = data.videoUrl && data.videoUrl.trim().length > 0
    ? data.videoUrl
    : `${siteUrl}/interesse?tema=${data.themeSlug}`;

  const whatsappNumber = data.whatsappAdmin || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Olá! Recebi as informações sobre "${data.themeTitle}" e gostaria de falar consigo.`)}`
    : '';

  const html = `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>O seu acesso NeoLife</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 0; color: #1a1a1a; }
        .wrapper { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        .header { background: linear-gradient(135deg, #16a34a, #0d9488); padding: 36px 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
        .content { padding: 36px 30px; }
        .greeting { font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111827; }
        .text { font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }
        .highlight-box { background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 28px; }
        .highlight-box h3 { margin: 0 0 8px 0; color: #15803d; font-size: 16px; }
        .btn-primary { display: inline-block; background-color: #16a34a; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; text-align: center; }
        .btn-whatsapp { display: inline-block; background-color: #25D366; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 10px; }
        .footer { background-color: #f9fafb; padding: 24px 30px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>NeoLife África</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 15px;">A sua jornada para uma vida com mais saúde e liberdade financeira</p>
        </div>
        <div class="content">
          <div class="greeting">Olá, ${data.name}!</div>
          <p class="text">
            Obrigado por demonstrar interesse na oportunidade e produtos da <strong>NeoLife</strong> em <strong>${data.countryName}</strong>.
          </p>
          
          <div class="highlight-box">
            <h3>Tema Selecionado: ${data.themeTitle}</h3>
            <p style="margin: 0; color: #166534; font-size: 14px;">
              Preparámos a explicação completa e os detalhes exclusivos para si. Clique no botão abaixo para assistir ou aceder ao material:
            </p>
            <div style="text-align: center; margin-top: 18px;">
              <a href="${accessUrl}" class="btn-primary" target="_blank">
                ▶ Assistir ao Conteúdo / Vídeo Explicativo
              </a>
            </div>
          </div>

          ${whatsappLink ? `
          <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #f3f4f6; text-align: center;">
            <p class="text" style="margin-bottom: 12px; font-size: 14px;">
              Prefere tirar dúvidas agora ou ter um acompanhamento direto?
            </p>
            <a href="${whatsappLink}" class="btn-whatsapp" target="_blank">
              Falar Connosco no WhatsApp
            </a>
          </div>
          ` : ''}

          <p class="text" style="margin-top: 30px; font-size: 13px; color: #6b7280;">
            Se o botão acima não funcionar, copie e cole este endereço no seu navegador:<br>
            <a href="${accessUrl}" style="color: #16a34a; word-break: break-all;">${accessUrl}</a>
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0 0 6px 0;">© ${new Date().getFullYear()} NeoLife África. Todos os direitos reservados.</p>
          <p style="margin: 0;">Recebeu este e-mail porque solicitou informações no nosso website oficial.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: data.email,
    subject: `O seu acesso à NeoLife: ${data.themeTitle}`,
    html,
  });
}

/**
 * Sends a notification email to the site administrator when a new lead is captured
 */
export async function sendAdminNotificationEmail(lead: AdminEmailData): Promise<void> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.NEXT_PUBLIC_EMAIL;
  if (!adminEmail) {
    return;
  }

  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
  const cleanWhatsapp = (lead.whatsapp || lead.phone).replace(/[^0-9]/g, '');

  const content = `
<h2>Novo Lead Registado!</h2>
<p>Um novo contacto acabou de submeter o formulário no website NeoLife África:</p>

<table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: bold; width: 35%; color: #4b5563;">Nome:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;"><strong>${lead.name}</strong></td></tr>
  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: bold; width: 35%; color: #4b5563;">País:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${lead.country}</td></tr>
  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: bold; width: 35%; color: #4b5563;">Telefone:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;"><a href="tel:${cleanPhone}">${lead.phone}</a></td></tr>
  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: bold; width: 35%; color: #4b5563;">Email:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: bold; width: 35%; color: #4b5563;">WhatsApp:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${lead.whatsapp || lead.phone}</td></tr>
  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: bold; width: 35%; color: #4b5563;">Tema de Interesse:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;"><strong>${lead.theme}</strong></td></tr>
  ${lead.campaign ? `<tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: bold; width: 35%; color: #4b5563;">Campanha:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${lead.campaign}</td></tr>` : ''}
  ${lead.notes ? `<tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: bold; width: 35%; color: #4b5563;">Observações:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${lead.notes}</td></tr>` : ''}
  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: bold; width: 35%; color: #4b5563;">Data/Hora:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${new Date().toLocaleString('pt-PT')}</td></tr>
</table>

<div style="text-align: center; margin-top: 16px;">
  <a href="https://wa.me/${cleanWhatsapp}" style="display: inline-block; background: #25D366; color: #fff !important; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; font-size: 14px;" target="_blank">
    Iniciar Conversa no WhatsApp
  </a>
</div>
`;

  await sendResendAdminNotification({
    subject: `Novo Lead: ${lead.name} (${lead.country}) - ${lead.theme}`,
    content,
  });
}
