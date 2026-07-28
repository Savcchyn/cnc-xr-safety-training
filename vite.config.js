import { defineConfig } from 'vite'
import { resolve } from 'path'

// Multi-Page-Setup: Präsentation auf der Root-URL, 3D-Prototyp unter /prototyp/
export default defineConfig({
  plugins: [
    {
      // Dev-Helfer für Screenshot-Automation: /hold?ms=15000 antwortet
      // verzögert und hält damit das load-Event der Seite auf, bis der
      // Deep-Link-State aufgebaut ist (headless firefox --screenshot).
      name: 'hold-endpoint',
      configureServer(server) {
        server.middlewares.use('/hold', (req, res) => {
          const ms = parseInt(
            new URL(req.url, 'http://localhost').searchParams.get('ms') || '10000',
            10
          )
          setTimeout(() => {
            res.setHeader('Content-Type', 'image/gif')
            res.end(Buffer.from('R0lGODlhAQABAAAAACwAAAAAAQABAAA=', 'base64'))
          }, Math.min(ms, 30000))
        })
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        prototyp: resolve(__dirname, 'prototyp/index.html'),
      },
    },
  },
})
