import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'log-admin-url',
      configureServer(server) {
        server.httpServer.once('listening', () => {
          setTimeout(() => {
            console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mAdmin:\x1b[0m    \x1b[36mhttp://localhost:5173/admin\x1b[0m`);
          }, 100);
        });
      }
    }
  ],
})
