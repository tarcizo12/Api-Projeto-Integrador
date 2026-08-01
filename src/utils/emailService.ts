type SendMailPayload = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function isEmailDeliveryConfigured(): boolean {
  return smtpConfigured();
}

async function enviarViaSmtp(payload: SendMailPayload): Promise<void> {
  // Carrega só quando SMTP está configurado, para a API subir sem a lib em ambientes locais.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodemailer = require('nodemailer') as {
    createTransport: (options: Record<string, unknown>) => {
      sendMail: (mail: SendMailPayload) => Promise<unknown>;
    };
  };

  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail(payload);
}

export async function enviarCodigoRecuperacaoSenha(
  destinatario: string,
  codigo: string
): Promise<void> {
  const assunto = 'Código para redefinir sua senha — MenteClara';
  const texto = [
    'Olá,',
    '',
    `Seu código de recuperação de senha é: ${codigo}`,
    '',
    'Ele expira em 10 minutos. Se você não solicitou isso, ignore este e-mail.',
    '',
    'Equipe MenteClara',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1a2e2b; line-height: 1.5;">
      <h2 style="color: #1f6f63;">MenteClara</h2>
      <p>Olá,</p>
      <p>Use o código abaixo para redefinir sua senha:</p>
      <p style="font-size: 28px; letter-spacing: 6px; font-weight: bold; color: #1f6f63;">${codigo}</p>
      <p>Ele expira em <strong>10 minutos</strong>.</p>
      <p style="color: #667">Se você não solicitou isso, ignore este e-mail.</p>
    </div>
  `;

  if (!smtpConfigured()) {
    console.log('[emailService] SMTP não configurado. Código de recuperação:');
    console.log(`  Para: ${destinatario}`);
    console.log(`  Código: ${codigo}`);
    return;
  }

  await enviarViaSmtp({
    from: process.env.SMTP_FROM || String(process.env.SMTP_USER),
    to: destinatario,
    subject: assunto,
    text: texto,
    html,
  });
}
