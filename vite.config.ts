import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom'],
          // Material UI - largest dependency
          'vendor-mui': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],
          // Charting library
          'vendor-recharts': ['recharts'],
          // Data fetching
          'vendor-query': ['@tanstack/react-query', 'axios'],
          // Utilities
          'vendor-utils': ['date-fns'],
        },
      },
    },
    // Increase warning limit slightly (optional, but good for monitoring)
    chunkSizeWarningLimit: 600,
  },
})
