import { USPS, FEATURES, USERFLOW, WORKFLOW, SHAPESXR_URL } from './data.js'
import './style.css'

/* ---------------- Slide Controller ---------------- */

const slides = [...document.querySelectorAll('.slide')]
const titles = {
  start: 'Start',
  auftrag: 'Der Auftrag',
  produkt: 'Das Produkt',
  userflow: 'Der Userflow',
  webdemo: 'Live Demo',
  arapp: 'AR App',
  workflow: 'Workflow',
}

const nav = document.getElementById('deck-nav')
const dotsEl = nav.querySelector('.nav-dots')
let current = 0

slides.forEach((s, i) => {
  const dot = document.createElement('button')
  dot.setAttribute('aria-label', titles[s.id] || s.id)
  dot.addEventListener('click', () => goTo(i))
  dotsEl.appendChild(dot)
})

function goTo(index) {
  current = Math.max(0, Math.min(slides.length - 1, index))
  slides.forEach((s, i) => s.classList.toggle('active', i === current))
  dotsEl.querySelectorAll('button').forEach((d, i) => d.classList.toggle('active', i === current))
  nav.classList.toggle('on-start', current === 0)
  history.replaceState(null, '', `#${slides[current].id}`)
  if (slides[current].id === 'webdemo') mountDemo()
}

nav.querySelector('.nav-prev').addEventListener('click', () => goTo(current - 1))
nav.querySelector('.nav-next').addEventListener('click', () => goTo(current + 1))
nav.querySelector('.nav-home').addEventListener('click', () => goTo(0))
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') goTo(current + 1)
  if (e.key === 'ArrowLeft') goTo(current - 1)
})

/* Kapitel-Hub auf dem Startscreen */
const hub = document.querySelector('.hub')
slides.slice(1).forEach((s) => {
  const btn = document.createElement('button')
  btn.className = 'glass'
  btn.textContent = titles[s.id] || s.id
  btn.addEventListener('click', () => goTo(slides.indexOf(s)))
  hub.appendChild(btn)
})

/* ---------------- Das Produkt ---------------- */

const uspByKey = Object.fromEntries(USPS.map((u) => [u.key, u]))
const chipWrap = document.querySelector('.usp-chips')
const activeFilters = new Set()

for (const usp of USPS) {
  const chip = document.createElement('button')
  chip.className = 'usp-chip'
  chip.textContent = usp.label
  chip.style.setProperty('--chip-color', usp.color)
  chip.addEventListener('click', () => {
    chip.classList.toggle('on')
    activeFilters.has(usp.key) ? activeFilters.delete(usp.key) : activeFilters.add(usp.key)
    applyFilters()
  })
  chipWrap.appendChild(chip)
}

const grid = document.querySelector('.feature-grid')
const detailThumb = document.querySelector('.detail-thumb')
const detailImg = detailThumb.querySelector('img')
const detailText = document.querySelector('.detail-text')
const blocks = []

for (const row of FEATURES) {
  const rowEl = document.createElement('div')
  rowEl.className = 'feature-row'
  for (const item of row.items) {
    const block = document.createElement('button')
    block.className = 'feature-block'
    block.style.setProperty('--block-color', uspByKey[item.usp].color)
    if (item.split) {
      block.classList.add('split')
      block.innerHTML = item.split.map((s) => `<span>${s}</span>`).join('')
    } else {
      block.textContent = item.label
    }
    block.addEventListener('click', () => selectFeature(item, block))
    rowEl.appendChild(block)
    blocks.push({ item, block })
  }
  grid.appendChild(rowEl)
}

function applyFilters() {
  for (const { item, block } of blocks) {
    block.classList.toggle('filtered', activeFilters.has(item.usp))
  }
}

function selectFeature(item, block) {
  blocks.forEach(({ block: b }) => b.classList.remove('selected'))
  block.classList.add('selected')
  detailImg.src = `/thumbs/${item.thumb}.png`
  detailImg.alt = item.label
  detailThumb.classList.add('has-img')
  detailText.innerHTML = `<b>${item.label}.</b> ${item.text}`
}

/* ---------------- Der Userflow (geführter Walkthrough) ---------------- */

let flowIndex = 0
const flowImg = document.querySelector('.flow-figure img')
const flowTitle = document.querySelector('.flow-step-title')
const flowText = document.querySelector('.flow-step-text')
const strip = document.querySelector('.flow-strip')

USERFLOW.forEach((station, i) => {
  const thumb = document.createElement('button')
  thumb.className = 'flow-thumb'
  thumb.innerHTML = `<img src="/thumbs/${station.thumb}.png" alt="" /><span>${i + 1} · ${station.title}</span>`
  thumb.addEventListener('click', () => setFlowStep(i))
  strip.appendChild(thumb)
})

function setFlowStep(i) {
  flowIndex = (i + USERFLOW.length) % USERFLOW.length
  const station = USERFLOW[flowIndex]
  flowImg.src = `/thumbs/${station.thumb}.png`
  flowImg.alt = station.title
  flowTitle.textContent = `${flowIndex + 1} · ${station.title}`
  flowText.textContent = station.text
  strip.querySelectorAll('.flow-thumb').forEach((t, idx) => {
    t.classList.toggle('active', idx === flowIndex)
  })
  strip.children[flowIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
}

document.querySelector('.flow-prev').addEventListener('click', () => setFlowStep(flowIndex - 1))
document.querySelector('.flow-next').addEventListener('click', () => setFlowStep(flowIndex + 1))
setFlowStep(0)

/* ---------------- Web Demo (iframe lazy) ---------------- */

let demoMounted = false
function mountDemo() {
  if (demoMounted) return
  demoMounted = true
  const frame = document.querySelector('.demo-frame')
  const iframe = document.createElement('iframe')
  iframe.src = '/prototyp/'
  iframe.title = 'Web 3D Prototyp'
  iframe.allow = 'fullscreen'
  frame.appendChild(iframe)
}

/* ---------------- Workflow ---------------- */

const wfRow = document.querySelector('.workflow-row')
WORKFLOW.forEach((station, i) => {
  const card = document.createElement('div')
  card.className = 'wf-card'
  card.innerHTML = `<span class="wf-num">${station.n}</span><h3>${station.title}</h3><p>${station.text}</p>`
  wfRow.appendChild(card)
  if (i < WORKFLOW.length - 1) {
    const sep = document.createElement('span')
    sep.className = 'wf-sep'
    sep.textContent = '→'
    wfRow.appendChild(sep)
  }
})

const shapesLink = document.querySelector('.shapes-link')
if (SHAPESXR_URL) {
  shapesLink.href = SHAPESXR_URL
} else {
  document.querySelector('.shapes-note').textContent = 'Link zum Demo Space wird ergänzt.'
  shapesLink.addEventListener('click', (e) => e.preventDefault())
}

/* ---------------- Start ---------------- */

const initial = slides.findIndex((s) => `#${s.id}` === location.hash)
goTo(initial >= 0 ? initial : 0)
