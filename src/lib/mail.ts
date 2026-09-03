import nodemailer from 'nodemailer'

export type EnquiryMailPayload = {
  company: string
  contactName: string
  email: string
  phone: string
  commodityInterest: string
  originPreference: string
  volume: string
  destination: string
  message: string
}

function env(name: string): string {
  // Bracket access so Next does not inline these at build time.
  const raw = process.env[name] || ''
  return raw.trim().replace(/^['"]|['"]$/g, '')
}

function smtpConfigured(): boolean {
  return Boolean(env('SMTP_HOST') && env('SMTP_USER') && env('SMTP_PASS'))
}

function createTransport() {
  const port = Number(env('SMTP_PORT') || 465)
  const secure = env('SMTP_SECURE') === 'true' || env('SMTP_SECURE') === '1' || port === 465

  return nodemailer.createTransport({
    host: env('SMTP_HOST'),
    port,
    secure,
    requireTLS: !secure && port === 587,
    auth: {
      user: env('SMTP_USER'),
      pass: env('SMTP_PASS'),
    },
  })
}

export async function sendEnquiryNotification(
  enquiry: EnquiryMailPayload,
  notifyTo?: string | null,
): Promise<{ sent: boolean; error?: string }> {
  if (!smtpConfigured()) {
    return {
      sent: false,
      error: 'SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.',
    }
  }

  const to = env('ENQUIRY_NOTIFY_TO') || notifyTo || env('SMTP_USER') || 'info@racegeneraltrading.com'
  const from = env('SMTP_FROM') || env('SMTP_USER') || to

  const lines = [
    'New trade enquiry from the website',
    '',
    `Company: ${enquiry.company}`,
    `Contact: ${enquiry.contactName}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone || '—'}`,
    `Commodity: ${enquiry.commodityInterest}`,
    `Origin: ${enquiry.originPreference || '—'}`,
    `Volume: ${enquiry.volume || '—'}`,
    `Destination: ${enquiry.destination || '—'}`,
    '',
    'Message:',
    enquiry.message,
    '',
    'Also stored under Enquiries in /admin.',
  ]

  try {
    const transport = createTransport()
    await transport.sendMail({
      from,
      to,
      replyTo: enquiry.email,
      subject: `Enquiry · ${enquiry.company} · ${enquiry.commodityInterest}`,
      text: lines.join('\n'),
    })
    return { sent: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown mail error'
    return { sent: false, error: message }
  }
}
