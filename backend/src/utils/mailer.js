import nodemailer from 'nodemailer';
import logger from './logger.js';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function buildPasswordResetEmail(resetUrl) {
  const safeResetUrl = escapeHtml(resetUrl);
  const text = [
    'AZZUNIQUE CRM & Sales - Password reset',
    '',
    'We received a request to reset your password.',
    `Reset your password: ${resetUrl}`,
    '',
    'This secure link expires in 15 minutes and can only be used once.',
    'If you did not request this, you can ignore this email. Your password will not change.',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <title>Reset your password</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f3f8;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      Reset your AZZUNIQUE password securely. This link expires in 15 minutes.
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f3f8;">
      <tr>
        <td align="center" style="padding:36px 16px;">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;">
            <tr>
              <td style="padding:0 12px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td width="44" height="44" align="center" valign="middle" style="width:44px;height:44px;border-radius:12px;background-color:#7f22fe;color:#ffffff;font-size:21px;font-weight:700;">A</td>
                    <td style="padding-left:12px;">
                      <div style="font-size:16px;line-height:20px;font-weight:700;letter-spacing:0.02em;color:#1f2937;">AZZUNIQUE</div>
                      <div style="font-size:12px;line-height:18px;color:#64748b;">CRM &amp; Sales</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="overflow:hidden;border:1px solid #e8e5f0;border-radius:18px;background-color:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="padding:34px 32px 14px;">
                      <div style="margin-bottom:12px;font-size:11px;line-height:16px;font-weight:700;letter-spacing:0.12em;color:#7f22fe;">ACCOUNT SECURITY</div>
                      <h1 style="margin:0 0 12px;font-size:26px;line-height:34px;font-weight:700;letter-spacing:-0.02em;color:#111827;">Reset your password</h1>
                      <p style="margin:0;font-size:15px;line-height:24px;color:#475569;">We received a request to reset your AZZUNIQUE account password. Use the secure button below to choose a new one.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 32px 24px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td align="center" style="border-radius:10px;background-color:#7f22fe;">
                            <a href="${safeResetUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 24px;border:1px solid #7f22fe;border-radius:10px;color:#ffffff;font-size:15px;line-height:20px;font-weight:700;text-decoration:none;">Reset password</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 32px 24px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-left:3px solid #7f22fe;background-color:#f7f5ff;">
                        <tr>
                          <td style="padding:14px 16px;">
                            <div style="margin-bottom:4px;font-size:13px;line-height:19px;font-weight:700;color:#312e81;">This link expires in 15 minutes</div>
                            <div style="font-size:13px;line-height:20px;color:#5b5b75;">For your security, it can only be used once.</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 32px 28px;">
                      <p style="margin:0 0 8px;font-size:12px;line-height:18px;color:#64748b;">If the button doesn't work, copy and paste this link into your browser:</p>
                      <a href="${safeResetUrl}" target="_blank" rel="noopener noreferrer" style="color:#6b21d1;font-size:12px;line-height:19px;word-break:break-all;text-decoration:underline;">${safeResetUrl}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 32px;border-top:1px solid #eeeaf5;background-color:#fbfaff;">
                      <p style="margin:0;font-size:13px;line-height:21px;color:#64748b;">Didn't request a password reset? You can safely ignore this email. Your password will not change.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 12px 0;font-size:11px;line-height:18px;color:#94a3b8;">
                This is an automated security email from AZZUNIQUE CRM &amp; Sales.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { text, html };
}

export async function sendPasswordResetEmail({ to, resetUrl }) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || 'AZZUNIQUE Security <no-reply@azzunique.com>';
  const secureValue = process.env.SMTP_SECURE?.toLowerCase();
  if (secureValue && secureValue !== 'true' && secureValue !== 'false') {
    throw new Error('SMTP_SECURE must be either true or false.');
  }
  const smtpSecure = secureValue ? secureValue === 'true' : smtpPort === 465;

  if (!smtpHost || !smtpUser || !smtpPass || !Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) {
    throw new Error('Password reset email is not configured. Set valid SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS values.');
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPass },
  });
  const emailContent = buildPasswordResetEmail(resetUrl);

  try {
    const info = await transporter.sendMail({
      from: smtpFrom,
      to,
      subject: 'Reset your AZZUNIQUE password',
      ...emailContent,
    });
    logger.info(`[Mailer] Password reset email sent (message ${info.messageId}).`);
    return { sent: true };
  } catch (err) {
    logger.error(`[Mailer] Failed to send password reset email: ${err.message}`);
    throw err;
  }
}

export default { sendPasswordResetEmail };
