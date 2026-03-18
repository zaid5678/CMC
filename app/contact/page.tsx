'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import PageHero from '@/components/PageHero';
import SectionReveal from '@/components/SectionReveal';
import OrnamentalDivider from '@/components/OrnamentalDivider';
import openingHoursData from '@/data/opening-hours.json';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false });

const SUBJECTS = [
  'General Enquiry',
  'Quran Classes',
  'Nikah',
  'Janazah',
  'Donation',
  'Media',
  'Safeguarding',
  'Other',
];

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!data.subject || !SUBJECTS.includes(data.subject)) {
    errors.subject = 'Please select a subject.';
  }
  if (!data.message.trim() || data.message.trim().length < 20) {
    errors.message = 'Please enter a message of at least 20 characters.';
  }
  if (data.message.trim().length > 2000) {
    errors.message = 'Message must be 2000 characters or fewer.';
  }
  return errors;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitError('Unable to send your message. Please email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText('14 Blantyre Street, Worlds End Estate, London SW10 0DS').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="We would love to hear from you. Get in touch with your questions, bookings, or simply to say hello."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <section className="section-padding px-6 lg:px-12" style={{ background: 'var(--color-ivory)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* ═══ CONTACT FORM ═══ */}
            <SectionReveal>
              <h2 className="mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                Send a Message
              </h2>
              <OrnamentalDivider className="my-4" />

              {submitted ? (
                <div
                  className="p-8 rounded-lg text-center mt-6"
                  style={{ background: 'rgba(45,122,71,0.08)', border: '1px solid rgba(45,122,71,0.3)' }}
                  role="alert"
                  aria-live="polite"
                >
                  <svg width="48" height="48" viewBox="0 0 48 48" className="mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <circle cx="24" cy="24" r="22" fill="rgba(45,122,71,0.15)" stroke="var(--color-green-mid)" strokeWidth="1.5"/>
                    <path d="M14 24L20 30L34 18" stroke="var(--color-green-mid)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                    Message received
                  </h3>
                  <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                    Thank you for getting in touch. We will respond as soon as possible, usually within 2 working days. For urgent matters, please call us directly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm nav-link"
                    style={{ color: 'var(--color-green-deep)', fontFamily: 'var(--font-body)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6 mt-6">
                  <div>
                    <label htmlFor="contact-name" className="form-label">Full Name *</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && <p id="name-error" className="form-error" role="alert">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="form-label">Email Address *</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && <p id="email-error" className="form-error" role="alert">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="form-label">Subject *</label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={`form-input ${errors.subject ? 'error' : ''}`}
                      required
                      aria-describedby={errors.subject ? 'subject-error' : undefined}
                      aria-invalid={!!errors.subject}
                    >
                      <option value="">Select a subject…</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.subject && <p id="subject-error" className="form-error" role="alert">{errors.subject}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="form-label">
                      Message *{' '}
                      <span className="text-xs ml-1 normal-case font-normal" style={{ color: 'var(--color-ink-soft)' }}>
                        ({form.message.length}/2000)
                      </span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      className={`form-input ${errors.message ? 'error' : ''}`}
                      placeholder="How can we help you?"
                      rows={6}
                      maxLength={2000}
                      required
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && <p id="message-error" className="form-error" role="alert">{errors.message}</p>}
                  </div>

                  {submitError && (
                    <div
                      className="p-4 rounded text-sm"
                      style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', color: '#c0392b', fontFamily: 'var(--font-body)' }}
                      role="alert"
                    >
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold w-full justify-center"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      opacity: submitting ? 0.7 : 1,
                      cursor: submitting ? 'wait' : 'pointer',
                    }}
                  >
                    {submitting ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </SectionReveal>

            {/* ═══ CONTACT INFO ═══ */}
            <SectionReveal delay={0.15}>
              <h2 className="mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                Find Us
              </h2>
              <OrnamentalDivider className="my-4" />

              <div className="mb-8" style={{ border: '1px solid rgba(201,168,76,0.3)' }}>
                <LeafletMap height={280} zoom={16} />
              </div>

              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>Address</h3>
                  <address className="not-italic text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)', lineHeight: 1.9 }}>
                    14 Blantyre Street<br />
                    Worlds End Estate<br />
                    London SW10 0DS
                  </address>
                </div>
                <button
                  onClick={copyAddress}
                  className="text-xs px-3 py-1.5 rounded flex-shrink-0 transition-all mt-7"
                  style={{
                    fontFamily: 'var(--font-body)',
                    background: copied ? 'rgba(45,122,71,0.15)' : 'rgba(201,168,76,0.1)',
                    border: `1px solid ${copied ? 'rgba(45,122,71,0.4)' : 'rgba(201,168,76,0.4)'}`,
                    color: copied ? 'var(--color-green-deep)' : 'var(--color-gold-dark)',
                    cursor: 'pointer',
                  }}
                  aria-label="Copy address to clipboard"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>Opening Hours</h3>
                <div className="space-y-2">
                  {openingHoursData.schedule.map(item => (
                    <div key={item.day} className="flex justify-between text-sm gap-4">
                      <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', fontWeight: 500, minWidth: '90px' }}>{item.day}</span>
                      <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)', textAlign: 'right' }}>{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                  <strong style={{ color: 'var(--color-ink)' }}>Email: </strong>
                  <a href="mailto:info@chelseamuslimcommunity.org.uk" style={{ color: 'var(--color-green-mid)' }}>
                    info@chelseamuslimcommunity.org.uk
                  </a>
                </p>
                <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                  <strong style={{ color: 'var(--color-ink)' }}>Phone: </strong>
                  <a href="tel:+442071234567" style={{ color: 'var(--color-green-mid)' }}>+44 (0)20 7123 4567</a>
                </p>
              </div>

              <div className="flex gap-6">
                {[
                  { label: 'Facebook', href: 'https://facebook.com' },
                  { label: 'Instagram', href: 'https://instagram.com' },
                  { label: 'WhatsApp', href: 'https://wa.me/447700000000' },
                ].map(social => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium nav-link"
                    style={{ color: 'var(--color-ink-soft)', fontFamily: 'var(--font-body)' }}
                    aria-label={`CMC on ${social.label}`}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </SectionReveal>
          </div>

          {/* ═══ SAFEGUARDING BOX ═══ */}
          <SectionReveal className="mt-16">
            <div
              className="p-8 rounded-lg"
              style={{ border: '2px solid rgba(201,168,76,0.5)', background: 'rgba(248,244,236,0.6)' }}
              role="complementary"
              aria-labelledby="safeguarding-heading"
            >
              <div className="flex items-start gap-4 flex-col sm:flex-row">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)' }}
                  aria-hidden="true"
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 2L3 6.5V12C3 16.14 6.41 19.99 11 21C15.59 19.99 19 16.14 19 12V6.5L11 2Z" fill="rgba(201,168,76,0.2)" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round"/>
                    <line x1="11" y1="9" x2="11" y2="13" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="11" cy="15.5" r="1" fill="#C9A84C"/>
                  </svg>
                </div>
                <div>
                  <h3 id="safeguarding-heading" className="text-xl mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-green-deep)' }}>
                    Safeguarding & Concerns
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                    Chelsea Muslim Community is committed to the safeguarding and wellbeing of all who use our services, particularly children and vulnerable adults. We have a designated Safeguarding Lead and take all concerns seriously and in confidence.
                  </p>
                  <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                    If you have a safeguarding concern — whether about a child, a vulnerable adult, or any situation within CMC — please contact our Safeguarding Lead directly:
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>Safeguarding Lead: Fatima Osman</p>
                    <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                      Email:{' '}
                      <a href="mailto:safeguarding@chelseamuslimcommunity.org.uk" style={{ color: 'var(--color-green-mid)' }}>
                        safeguarding@chelseamuslimcommunity.org.uk
                      </a>
                    </p>
                    <p className="text-sm mt-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}>
                      In cases of immediate risk, always call{' '}
                      <strong style={{ color: 'var(--color-ink)' }}>999</strong>
                      {' '}or the NSPCC Helpline on{' '}
                      <a href="tel:08088005000" style={{ color: 'var(--color-green-mid)', fontWeight: 500 }}>0808 800 5000</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
