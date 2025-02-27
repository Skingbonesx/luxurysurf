import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://example.com', // Sesuaikan dengan API yang digunakan
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
