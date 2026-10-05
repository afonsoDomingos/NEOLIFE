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
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email via Resend:', error);
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
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    const emailsArray = to.map(email => ({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject,
      html,
    }));
    
    const data = await resend.batch.send(emailsArray);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending bulk email via Resend:', error);
    return { success: false, error };
  }
}
