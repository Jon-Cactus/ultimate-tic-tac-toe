import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
  alias: {
    // Allow vite to see shared folder
    '@shared': path.resolve(__dirname, 'shared'),
  }
  }
  
})
