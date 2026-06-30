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
    plugins: [
      react(), 
      ravenApiDev(),
      {
        // Inline the built CSS into <head> to remove the render-blocking
        // stylesheet request (LCP win). ASSUMPTION: this SPA emits a single CSS
        // chunk — we concatenate any CSS assets by emit order, so if you ever
        // code-split CSS (per-route lazy CSS), revisit cascade ordering here.
        name: 'inline-css',
        enforce: 'post',
        generateBundle(opts, bundle) {
          const cssKeys = Object.keys(bundle).filter((k) => bundle[k].fileName.endsWith('.css'));
          if (cssKeys.length === 0) return;
          if (cssKeys.length > 1) {
            this.warn(`inline-css: ${cssKeys.length} CSS chunks found; concatenation order is not guaranteed.`);
          }
          const cssCode = cssKeys.map((k) => bundle[k].source).join('');
          for (const k of cssKeys) delete bundle[k];
          for (const key in bundle) {
            if (bundle[key].fileName.endsWith('.html')) {
              bundle[key].source = bundle[key].source
                .replace(/<link[^>]*rel="stylesheet"[^>]*>/g, '')
                .replace('</head>', `<style>${cssCode}</style></head>`);
            }
          }
        }
      }
    ],

    // Build optimizations
    build: {
      target: 'esnext',
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
