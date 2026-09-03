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

function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT || 465)
  const secure =
    process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1' || port === 465

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
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

  const to =
    process.env.ENQUIRY_NOTIFY_TO ||
    notifyTo ||
    process.env.SMTP_USER ||
    'info@racegeneraltrading.com'
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || to

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
