import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';

const VALID_SUBJECTS = [
  'General Enquiry',
  'Quran Classes',
  'Nikah',
  'Janazah',
  'Donation',
  'Media',
  'Safeguarding',
  'Other',
];

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { allowed } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, email, subject, message } = body as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };

  const errors: Record<string, string> = {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }
  if (!email || typeof email !== 'string' || !validateEmail(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!subject || !VALID_SUBJECTS.includes(subject as string)) {
    errors.subject = 'Please select a valid subject.';
  }
  if (!message || typeof message !== 'string' || message.trim().length < 20) {
    errors.message = 'Please enter a message of at least 20 characters.';
  }
  if (message && typeof message === 'string' && message.trim().length > 2000) {
    errors.message = 'Message must not exceed 2000 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Validation failed', errors }, { status: 422 });
  }

  const cleanName = (name as string).trim();
  const cleanEmail = (email as string).trim();
  const cleanSubject = subject as string;
  const cleanMessage = (message as string).trim();

  try {
    const nodemailer = await import('nodemailer');

    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"CMC Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: cleanEmail,
      subject: `[CMC Website] ${cleanSubject} from ${cleanName}`,
      text: `Name: ${cleanName}\nEmail: ${cleanEmail}\nSubject: ${cleanSubject}\n\nMessage:\n${cleanMessage}\n\n---\nSent from CMC website contact form. IP: ${ip}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; color: #1A1208; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #1E5631; padding: 20px; margin-bottom: 20px;">
    <h2 style="color: #C9A84C; margin: 0; font-family: Georgia, serif;">Chelsea Muslim Community</h2>
    <p style="color: #E8C97A; margin: 5px 0 0; font-size: 14px;">New Website Enquiry</p>
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr><td style="padding: 8px 12px; background: #F8F4EC; font-weight: bold; width: 120px; font-size: 14px;">Name</td><td style="padding: 8px 12px; border-bottom: 1px solid #EDE6D6; font-size: 14px;">${cleanName}</td></tr>
    <tr><td style="padding: 8px 12px; background: #F8F4EC; font-weight: bold; font-size: 14px;">Email</td><td style="padding: 8px 12px; border-bottom: 1px solid #EDE6D6; font-size: 14px;"><a href="mailto:${cleanEmail}">${cleanEmail}</a></td></tr>
    <tr><td style="padding: 8px 12px; background: #F8F4EC; font-weight: bold; font-size: 14px;">Subject</td><td style="padding: 8px 12px; border-bottom: 1px solid #EDE6D6; font-size: 14px;">${cleanSubject}</td></tr>
  </table>
  <div style="background: #F8F4EC; padding: 16px; border-left: 3px solid #C9A84C; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${cleanMessage}</div>
  <p style="color: #888; font-size: 11px; margin-top: 20px;">Sent from CMC website contact form. IP: ${ip}</p>
</body>
</html>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[CMC Contact] Email send failed:', err);
    return NextResponse.json(
      { error: 'We were unable to send your message. Please try contacting us directly by email.' },
      { status: 500 }
    );
  }
}
