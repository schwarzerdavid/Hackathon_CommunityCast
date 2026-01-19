import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: process.env.PORT || 3000, // Use Render's PORT environment variable
    proxy: {
      '/api': {
        target: process.env.API_URL || 'https://hackathon-communitycast.onrender.com',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'build'
  }
})
