import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
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
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'animation-vendor': ['framer-motion'],
          'ui-vendor': ['react-tilt', 'react-vertical-timeline-component'],
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
});
