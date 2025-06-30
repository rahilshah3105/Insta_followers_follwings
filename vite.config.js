import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false
    }
  },
  // This ensures JSON files are properly served
  assetsInclude: ['**/*.json'],
  // This helps with resolving public assets
  publicDir: 'public'
});