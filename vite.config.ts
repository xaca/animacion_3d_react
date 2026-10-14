import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Build id stored in every room; devices on an older build reload themselves (see useRoom.ts)
    __APP_VERSION__: JSON.stringify(Date.now().toString()),
  },
})
