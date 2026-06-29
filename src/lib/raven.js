// Shared "raven" dispatch — the single network path for every form that sends a
// message to the cartographer (the Contact form AND the Voice Hall "summon a
// voice" request). The form POSTs to a server-side endpoint (Vercel function in
// prod, Vite dev middleware locally) that holds the Resend API key, so the key
// never touches the client bundle. See api/send-raven.js + api/_lib/sendRaven.js.
//
// This owns the duplicated bits: the endpoint, the response parsing, the
// "not configured" (503) detection, and the flight/refused SOUND cues. Each
// caller keeps its own UI state + its own (voiced) copy + its own client-side
// validation — including the 'error' cue for a failed validation, since that
// path never reaches the network.

import { playCue } from './sound';

export const RAVEN_ENDPOINT = '/api/send-raven';
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Send a raven. Plays the `raven` cue on success / the `error` cue on failure,
 * and resolves to the outcome so the caller can show its own voiced feedback.
 * Never throws — a network error resolves as `{ ok: false, code: 'failed' }`.
 *
 * @param {{ name: string, email: string, message: string, inquiry?: string, company?: string }} payload
 * @returns {Promise<{ ok: true } | { ok: false, code: 'notConfigured' | 'failed' }>}
 */
export async function sendRaven(payload) {
  try {
    const res = await fetch(RAVEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) {
      playCue('raven'); // the raven takes flight
      return { ok: true };
    }
    // Server has no RESEND_API_KEY yet → a distinct, recoverable state.
    const code = res.status === 503 || data.code === 'NOT_CONFIGURED' ? 'notConfigured' : 'failed';
    playCue('error'); // the raven is refused
    return { ok: false, code };
  } catch (err) {
    console.error('Raven dispatch failed:', err);
    playCue('error');
    return { ok: false, code: 'failed' };
  }
}
