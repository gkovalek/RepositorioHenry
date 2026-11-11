import type { VercelRequest, VercelResponse } from '@vercel/node'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const ses = new SESClient({
  region: process.env.AWS_REGION ?? 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

function buildHtml(pending: string[], done: string[], date: string): string {
  const pendingRows = pending.length
    ? pending
        .map(
          (t) => `
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #1e293b;color:#e2e8f0;font-size:14px;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#818cf8;margin-right:10px;vertical-align:middle;"></span>${t}
          </td>
        </tr>`,
        )
        .join('')
    : `<tr><td style="padding:10px 14px;color:#64748b;font-size:14px;font-style:italic;">Sin tareas pendientes</td></tr>`

  const doneRows = done.length
    ? done
        .map(
          (t) => `
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #1e293b;color:#94a3b8;font-size:14px;text-decoration:line-through;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#34d399;margin-right:10px;vertical-align:middle;text-decoration:none;"></span>${t}
          </td>
        </tr>`,
        )
        .join('')
    : `<tr><td style="padding:10px 14px;color:#64748b;font-size:14px;font-style:italic;">Sin tareas completadas</td></tr>`

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#020617;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#020617;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e1b4b 0%,#0f172a 100%);border-radius:16px 16px 0 0;padding:32px 32px 24px;border:1px solid #1e293b;border-bottom:none;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;color:#818cf8;text-transform:uppercase;font-weight:600;">MemoryClip</p>
            <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#f1f5f9;">Resumen de tareas</h1>
            <p style="margin:0;font-size:13px;color:#64748b;">${date}</p>
          </td>
        </tr>

        <!-- Stats -->
        <tr>
          <td style="background:#0f172a;padding:0 32px;border-left:1px solid #1e293b;border-right:1px solid #1e293b;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;padding:20px 0;">
              <tr>
                <td width="50%" style="padding:16px 12px 16px 0;">
                  <div style="background:#1e293b;border-radius:12px;padding:16px;text-align:center;">
                    <p style="margin:0;font-size:32px;font-weight:700;color:#818cf8;">${pending.length}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Pendientes</p>
                  </div>
                </td>
                <td width="50%" style="padding:16px 0 16px 12px;">
                  <div style="background:#1e293b;border-radius:12px;padding:16px;text-align:center;">
                    <p style="margin:0;font-size:32px;font-weight:700;color:#34d399;">${done.length}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Completadas</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Pending section -->
        <tr>
          <td style="background:#0f172a;padding:0 32px;border-left:1px solid #1e293b;border-right:1px solid #1e293b;">
            <p style="margin:0 0 10px;font-size:11px;letter-spacing:2px;color:#818cf8;text-transform:uppercase;font-weight:600;">Pendientes</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:10px;overflow:hidden;">
              ${pendingRows}
            </table>
          </td>
        </tr>

        <!-- Done section -->
        <tr>
          <td style="background:#0f172a;padding:20px 32px 24px;border-left:1px solid #1e293b;border-right:1px solid #1e293b;">
            <p style="margin:0 0 10px;font-size:11px;letter-spacing:2px;color:#34d399;text-transform:uppercase;font-weight:600;">Completadas</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:10px;overflow:hidden;">
              ${doneRows}
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0f172a;border-radius:0 0 16px 16px;padding:16px 32px;border:1px solid #1e293b;border-top:1px solid #1e293b;text-align:center;">
            <p style="margin:0;font-size:12px;color:#334155;">Enviado desde <span style="color:#818cf8;">MemoryClip</span></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { pending, done, date, userEmail } = req.body ?? {}

  const from = process.env.SES_FROM_EMAIL
  const to = process.env.SES_TO_EMAIL || userEmail

  if (!from || !to) {
    return res.status(500).json({ error: 'Email configuration missing' })
  }

  const html = buildHtml(pending ?? [], done ?? [], date ?? new Date().toLocaleDateString('es-AR'))
  const text =
    `Resumen de tareas — ${date}\n\n` +
    `Pendientes (${(pending ?? []).length}):\n` +
    (pending ?? []).map((t: string) => `• ${t}`).join('\n') +
    `\n\nCompletadas (${(done ?? []).length}):\n` +
    (done ?? []).map((t: string) => `✓ ${t}`).join('\n')

  try {
    await ses.send(
      new SendEmailCommand({
        Source: from,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: 'MemoryClip — Resumen de tareas', Charset: 'UTF-8' },
          Body: {
            Html: { Data: html, Charset: 'UTF-8' },
            Text: { Data: text, Charset: 'UTF-8' },
          },
        },
      }),
    )

    return res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error('SES error:', err)
    return res.status(500).json({ error: err.message ?? 'Failed to send email' })
  }
}
