import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      'api': 'https://api.football-data.org/v4/'
    }
  },
  plugins: [react()],
})
