import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Split React into its own long-cached chunk; app code changes more often.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: { manualChunks: { react: ['react', 'react-dom'] } },
    },
  },
});
