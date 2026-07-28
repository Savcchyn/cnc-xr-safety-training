// Screenshot-Automation: fährt den Prototyp per Deep-Link in definierte
// States und legt Thumbnails für die Präsentation in public/thumbs/ ab.
//
//   node scripts/capture-thumbs.mjs [nur-diese-namen...]
//
// Voraussetzung: Dev-Server auf http://localhost:5173
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = 'http://localhost:5173/prototyp/'
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../public/thumbs')

// name → { query, state (worauf gewartet wird), settle (ms nach State) }
const SHOTS = {
  start: { query: '', state: 'start', settle: 2500 },
  onboarding: { query: 'machine=0&level=0&space=1&state=onboarding', state: 'onboarding', settle: 4000 },
  konsequenz: { query: 'state=consequence&scenario=fire', state: 'consequence', settle: 3500 },
  zeitdruck: { query: 'state=simulation&notifs=1', state: 'simulation', settle: 3500 },
  training: { query: 'state=simulation', state: 'simulation', settle: 3500 },
  quiz: { query: 'state=simulation&task=1', state: 'simulation', settle: 5500 },
  checklisten: { query: 'state=checklist', state: 'checklist', settle: 3000 },
  spatial: { query: 'machine=0&space=2&state=modules', state: 'modules', settle: 4000 },
  mini: { query: 'machine=0&space=2&state=simulation', state: 'simulation', settle: 4000 },
  module: { query: 'state=modules', state: 'modules', settle: 3500 },
  precheck: { query: 'state=preChecklist', state: 'preChecklist', settle: 3000 },
  review: { query: 'state=review', state: 'review', settle: 3000 },
  cms: { query: 'state=cms', state: 'cms', settle: 3500 },
  maschine2: { query: 'machine=1&state=modules', state: 'modules', settle: 5000 },
  maschine3: { query: 'machine=2&state=modules', state: 'modules', settle: 6000 },
}

const only = process.argv.slice(2)
const list = Object.entries(SHOTS).filter(([n]) => !only.length || only.includes(n))

mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1600, height: 900 })

for (const [name, shot] of list) {
  const url = `${BASE}?shot=1&${shot.query}`
  process.stdout.write(`${name} … `)
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(
    (target) => window.__flow && window.__flow.state === target,
    { timeout: 40000 },
    shot.state
  )
  await new Promise((r) => setTimeout(r, shot.settle))
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log('ok')
}

await browser.close()
console.log(`fertig → ${OUT}`)
