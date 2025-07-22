// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['axios', 'react-router-dom'],
          pdfjs: ['pdfjs-dist'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
      },
      onwarn(warning, warn) {
        if (
          warning.code === 'SOURCEMAP_ERROR' ||
          warning.message.includes('Use of eval')
        ) return;
        warn(warning);
      },
    },
  },
  server: {
    historyApiFallback: true, // <- This fixes 404s on refresh or direct links
  }
});
