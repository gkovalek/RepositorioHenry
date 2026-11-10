import type { VercelRequest, VercelResponse } from '@vercel/node'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const ses = new SESClient({
  region: process.env.AWS_REGION ?? 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { summary, userEmail } = req.body ?? {}

  if (!summary) {
    return res.status(400).json({ error: 'Missing summary' })
  }

  const from = process.env.SES_FROM_EMAIL
  const to = process.env.SES_TO_EMAIL || userEmail

  if (!from || !to) {
    return res.status(500).json({ error: 'Email configuration missing' })
  }

  try {
    await ses.send(
      new SendEmailCommand({
        Source: from,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: 'MateCode Tasks — Resumen de tareas', Charset: 'UTF-8' },
          Body: {
            Text: { Data: summary, Charset: 'UTF-8' },
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
