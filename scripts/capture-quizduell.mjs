// Screenshot des Quiz-Duell-Screens der AR App (16:9, App-Spalte zentriert)
// für das Quiz-Thumbnail der Produkt-Slide.
//
//   node scripts/capture-quizduell.mjs
//
// Voraussetzung: Dev-Server auf http://localhost:5173
import puppeteer from 'puppeteer-core'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../public/thumbs')

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 })
await page.goto('http://localhost:5173/ar/', { waitUntil: 'domcontentloaded' })

// Splash → Quiz → Quiz Duell
await page.waitForSelector('.splash-start', { timeout: 20000 })
await new Promise((r) => setTimeout(r, 1200))
await page.click('.splash-start')
await new Promise((r) => setTimeout(r, 400))
await page.click('[data-go="quizmenu"]')
await new Promise((r) => setTimeout(r, 400))
await page.click('[data-go="duell"]')
await new Promise((r) => setTimeout(r, 1200))

// Eine Antwort auswählen, damit der Selected-State sichtbar ist
await page.click('.quiz-grid button')
await new Promise((r) => setTimeout(r, 400))

await page.screenshot({ path: `${OUT}/quizduell.png` })
await browser.close()
console.log(`fertig → ${OUT}/quizduell.png`)
