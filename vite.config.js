import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'localized-document',
      transformIndexHtml(html) {
        const { meta } = JSON.parse(
          readFileSync(
            new URL('./src/locales/es.json', import.meta.url),
            'utf8',
          ),
        )
        const escape = (value) =>
          value
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
        return html
          .replace('__APP_TITLE__', escape(meta.title))
          .replace('__APP_DESCRIPTION__', escape(meta.description))
      },
    },
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
