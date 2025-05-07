import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174, // Different from original to avoid conflicts
    strictPort: true,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});