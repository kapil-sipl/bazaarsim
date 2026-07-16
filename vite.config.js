import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Lets `vite dev` proxy /api calls to a local serverless emulator if you run one.
    // When deployed on Vercel/Netlify, /api is handled natively — no proxy needed.
    port: 5173
  }
})
