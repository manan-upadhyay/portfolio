import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

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
        req.on('data', (c) => (raw += c));
        req.on('end', async () => {
          const reply = (status, payload) => {
            res.statusCode = status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
          };
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

    // Path aliases
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@store': path.resolve(__dirname, './src/store'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@constants': path.resolve(__dirname, './src/constants'),
      },
    },

    // Build optimizations
    build: {
      rollupOptions: {
        output: {
          // Manual chunks for better caching
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom'],
            'animation-vendor': ['framer-motion', 'gsap', 'lenis'],
          },
        },
      },
      // Increase chunk size warning (Three.js is large)
      chunkSizeWarningLimit: 1000,
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
