import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],
  server: {
    proxy: {
      
      '/tactive': {
        target: 'http://164.52.217.157:8089',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
