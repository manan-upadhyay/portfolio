import { Resend } from 'resend';

// Shared, transport-agnostic sender used by both the Vercel serverless function
// (api/send-raven.js) and the Vite dev middleware (vite.config.js). Files under
// api/_lib are ignored by Vercel's route builder and only imported as a library.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Escape user input before it lands in the email HTML.
const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Tiny stable hash → idempotency key, so an accidental double-submit of the same
// message within 24h doesn't deliver twice.
const hash = (s) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
};

const emailHtml = ({ name, email, message, inquiry }) => `
  <div style="background:#0B0F1A;padding:32px 0;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#141B2C;border:1px solid rgba(129,140,248,0.18);border-radius:16px;overflow:hidden;">
      <div style="padding:24px 28px;border-bottom:1px solid rgba(129,140,248,0.15);">
        <p style="margin:0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#E8965A;">A raven has landed</p>
        <h1 style="margin:6px 0 0;font-size:22px;color:#ECE7DB;font-family:Georgia,serif;">New message from the Chronicle</h1>
      </div>
      <div style="padding:24px 28px;color:#ECE7DB;">
        ${inquiry ? `<p style="margin:0 0 14px;"><span style="display:inline-block;padding:4px 12px;border-radius:999px;background:rgba(232,150,90,0.14);border:1px solid rgba(232,150,90,0.4);color:#E8965A;font-size:12px;">${esc(inquiry)}</span></p>` : ''}
        <p style="margin:0 0 4px;font-size:13px;color:#9AA3B5;">From</p>
        <p style="margin:0 0 18px;font-size:15px;">${esc(name)} &lt;<a href="mailto:${esc(email)}" style="color:#818CF8;text-decoration:none;">${esc(email)}</a>&gt;</p>
        <p style="margin:0 0 4px;font-size:13px;color:#9AA3B5;">Message</p>
        <div style="font-size:15px;line-height:1.6;white-space:pre-wrap;border-left:2px solid rgba(232,150,90,0.5);padding-left:14px;">${esc(message)}</div>
      </div>
      <div style="padding:16px 28px;border-top:1px solid rgba(129,140,248,0.15);">
        <p style="margin:0;font-size:12px;color:#9AA3B5;font-style:italic;font-family:Georgia,serif;">Reply directly to this email to answer ${esc(name)}.</p>
      </div>
    </div>
  </div>`;

/**
 * @returns {{ ok: true, id?: string } | { ok: false, code: 'NOT_CONFIGURED'|'INVALID'|'SEND_FAILED' }}
 */
export async function sendRaven({ name, email, message, inquiry } = {}) {
  const apiKey = process.env.RESEND_API_KEY;
  // Missing or still the placeholder from .env.example → not wired up yet.
  if (!apiKey || apiKey === 're_xxxxxxxxx') return { ok: false, code: 'NOT_CONFIGURED' };

  // Never trust the client — validate server-side too.
  if (!name || !email || !message || !EMAIL_RE.test(email)) return { ok: false, code: 'INVALID' };

  const resend = new Resend(apiKey);
  const to = process.env.RESEND_TO || 'upadhyaymanan01@gmail.com';
  const from = process.env.RESEND_FROM || 'The Chronicle <onboarding@resend.dev>';

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `${inquiry ? `[${inquiry}] ` : ''}New raven from ${name}`,
    text: `${inquiry ? `Inquiry: ${inquiry}\n` : ''}From: ${name} <${email}>\n\n${message}`,
    html: emailHtml({ name, email, message, inquiry }),
    idempotencyKey: `contact/${hash(`${email}|${inquiry}|${message}`)}`,
  });

  if (error) {
    console.error('Resend error:', error);
    return { ok: false, code: 'SEND_FAILED' };
  }
  return { ok: true, id: data?.id };
}

// Map a sendRaven result to an HTTP status, shared by both transports.
export const statusFor = (result) =>
  result.ok ? 200 : result.code === 'NOT_CONFIGURED' ? 503 : result.code === 'INVALID' ? 422 : 502;
