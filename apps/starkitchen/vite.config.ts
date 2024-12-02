import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env,
  },
  plugins: [react()],
  base: '',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
