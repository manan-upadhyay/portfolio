import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Dev-only: serve POST /api/send-raven (the same handler Vercel runs in prod) so
// the contact form works under `npm run dev`, not just `vercel dev`.
function ravenApiDev() {
  return {
    name: 'raven-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/send-raven', (req, res, next) => {
        if (req.method !== 'POST') return next();
        let raw = '';
        let aborted = false;
        const MAX_BODY = 64 * 1024; // 64 KB — generous for a contact form, caps abuse
        const reply = (status, payload) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(payload));
        };
        req.on('data', (c) => {
          if (aborted) return;
          raw += c;
          if (raw.length > MAX_BODY) {
            aborted = true;
            reply(413, { ok: false, code: 'PAYLOAD_TOO_LARGE' });
            req.destroy();
          }
        });
        req.on('end', async () => {
          if (aborted) return;
          try {
            const { sendRaven, statusFor } = await server.ssrLoadModule('/api/_lib/sendRaven.js');
            const body = raw ? JSON.parse(raw) : {};
            const result = await sendRaven(body);
            reply(statusFor(result), result);
          } catch (e) {
            console.error('raven-api-dev error:', e);
            reply(502, { ok: false, code: 'SEND_FAILED' });
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Expose server-only secrets (no VITE_ prefix) to the dev middleware via
  // process.env. On Vercel these already live in process.env.
  const env = loadEnv(mode, process.cwd(), '');
  for (const k of ['RESEND_API_KEY', 'RESEND_TO', 'RESEND_FROM']) {
    if (!process.env[k] && env[k]) process.env[k] = env[k];
  }

  return {
    plugins: [react(), ravenApiDev()],

    // Build optimizations
    build: {
      rollupOptions: {
        output: {
          // Manual chunks for better caching
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom'],
            'animation-vendor': ['framer-motion', 'gsap', 'lenis'],
            'analytics-vendor': ['posthog-js', '@posthog/react'],
          },
        },
      },
      chunkSizeWarningLimit: 600,
      // Minification using esbuild (built-in, faster than terser)
      minify: 'esbuild',
      // Source maps for production debugging
      sourcemap: false,
    },

    // Development server
    server: {
      port: 5173,
      open: true,
      cors: true,
    },

    // Preview server (for production preview)
    preview: {
      port: 4173,
      open: true,
    },

    // Environment variable prefix
    envPrefix: 'VITE_',
  };
});
