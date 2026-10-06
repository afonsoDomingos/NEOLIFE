import { Resend } from 'resend';

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured');
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const resend = getResend();
    if (!resend) {
      console.error('[EMAIL] RESEND_API_KEY not configured');
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    console.log('[EMAIL] Sending email:', { to, subject, from: process.env.RESEND_FROM_EMAIL });

    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to,
      subject,
      html,
    });

    console.log('[EMAIL] Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('[EMAIL] Error sending email via Resend:', error);
    return { success: false, error };
  }
}

export async function sendBulkEmail({
  to,
  subject,
  html,
}: {
  to: string[];
  subject: string;
  html: string;
}) {
  try {
    const resend = getResend();
    if (!resend) {
      console.error('[EMAIL BULK] RESEND_API_KEY not configured');
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    console.log('[EMAIL BULK] Sending bulk email:', { count: to.length, subject, from: process.env.RESEND_FROM_EMAIL });

    const emailsArray = to.map(email => ({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject,
      html,
    }));

    const data = await resend.batch.send(emailsArray);
    console.log('[EMAIL BULK] Bulk email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('[EMAIL BULK] Error sending bulk email via Resend:', error);
    return { success: false, error };
  }
}

export async function sendAdminNotification({
  subject,
  content,
}: {
  subject: string;
  content: string;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.RESEND_FROM_EMAIL;
  if (!adminEmail) {
    console.error('[ADMIN NOTIFICATION] ADMIN_NOTIFICATION_EMAIL not configured');
    return { success: false, error: 'Admin email not configured' };
  }

  console.log('[ADMIN NOTIFICATION] Sending admin notification:', { adminEmail, subject });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">NeoLife Admin</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Notificação do Sistema</p>
      </div>
      <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        ${content.replace(/\n/g, '<br>')}
      </div>
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>Esta é uma notificação automática do sistema NeoLife.</p>
        <p>&copy; ${new Date().getFullYear()} NeoLife. Todos os direitos reservados.</p>
      </div>
    </body>
    </html>
  `;

  const result = await sendEmail({
    to: adminEmail,
    subject: `[NeoLife Admin] ${subject}`,
    html,
  });

  console.log('[ADMIN NOTIFICATION] Result:', result);
  return result;
}
