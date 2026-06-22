import { sendRaven, statusFor } from './_lib/sendRaven.js';

// Vercel serverless function — POST /api/send-raven
// The RESEND_API_KEY lives only here (server-side env), never in the client bundle.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  const { name, email, message, inquiry } = body;

  const result = await sendRaven({ name, email, message, inquiry });
  return res.status(statusFor(result)).json(result);
}

const safeParse = (s) => {
  try { return JSON.parse(s); } catch { return {}; }
};
