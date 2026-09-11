import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sendEmail } from '@/lib/utils/email';

export async function POST(request: NextRequest) {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
      const cookieStore = await cookies();
      const session = cookieStore.get('admin_session');

      if (!session || session.value !== 'authenticated') {
        return NextResponse.json(
          { error: 'Não autorizado' },
          { status: 401 }
        );
      }
    }

    const body = await request.json();
    const { to, leadName, subject, message } = body;

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: destinatário, assunto e mensagem' },
        { status: 400 }
      );
    }

    const formattedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
          .header { background: linear-gradient(135deg, #065f46 0%, #047857 100%); color: white; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
          .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }
          .content { padding: 30px 25px; }
          .greeting { font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 16px; }
          .message-box { background-color: #f8fafc; border-left: 4px solid #10b981; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; white-space: pre-wrap; font-size: 15px; color: #374151; }
          .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
          .mentor-tag { display: inline-block; margin-top: 15px; padding: 8px 16px; background-color: #ecfdf5; color: #065f46; font-size: 13px; font-weight: 600; border-radius: 20px; border: 1px solid #a7f3d0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>NeoLife África</h1>
            <p>Mentoria & Oportunidade • José & Ofélia Machado</p>
          </div>
          <div class="content">
            <div class="greeting">Olá, ${leadName || 'Estimado(a)'}!</div>
            <div class="message-box">${message}</div>
            <div style="text-align: center;">
              <div class="mentor-tag">
                Atenciosamente, Ofélia & José Machado
              </div>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} NeoLife África. Todos os direitos reservados.</p>
            <p>Moçambique · África do Sul · Angola · Zimbabwe</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await sendEmail({
      to,
      subject,
      html: formattedHtml,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erro ao enviar e-mail' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'E-mail enviado com sucesso para o lead!',
      simulated: result.simulated
    });

  } catch (error: any) {
    console.error('Error sending direct lead email:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno ao processar envio de e-mail' },
      { status: 500 }
    );
  }
}
