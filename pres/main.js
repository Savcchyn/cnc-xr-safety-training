import {
  USPS,
  FEATURES,
  UF_EXPLAIN,
  WORKFLOW,
  SHAPESXR_URL,
  PRODUKT_INTRO,
  USERFLOW_INTRO,
  WORKFLOW_INTRO,
} from './data.js'
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
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === current)
    s.classList.toggle('prev', i < current)
  })
  dotsEl.querySelectorAll('button').forEach((d, i) => d.classList.toggle('active', i === current))
  nav.classList.toggle('on-start', current === 0)
  nav.classList.toggle('fs-low', ['produkt', 'webdemo', 'arapp'].includes(slides[current].id))
  history.replaceState(null, '', `#${slides[current].id}`)
  if (slides[current].id === 'webdemo') mountDemo()
  if (slides[current].id === 'arapp') mountAr()
}

/* Leichte Aufbau-Animationen: Top-Level-Blöcke jeder Slide staffeln sich
   ein; ausgewählte Container staggern ihre Kinder einzeln. Elemente mit
   eigenem Transform (z.B. zentrierte Absolute) bleiben unangetastet. */
function prepAnimations() {
  const expand = ['.start-columns', '.brief', '.feature-grid', '.workflow-row']
  slides.forEach((slide) => {
    const list = []
    for (const el of slide.children) {
      if (expand.some((sel) => el.matches(sel))) list.push(...el.children)
      else list.push(el)
    }
    list.forEach((el, i) => {
      // Overlays und selbst-transformierte Elemente nicht staggern
      if (el.matches('.uf-zoom') || getComputedStyle(el).transform !== 'none') return
      el.classList.add('anim')
      el.style.setProperty('--d', `${0.3 + i * 0.07}s`)
    })
  })
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
    const nowOn = !activeFilters.has(usp.key)
    nowOn ? activeFilters.add(usp.key) : activeFilters.delete(usp.key)
    applyFilters()
    // USP-Beschreibung im Detail-Panel zeigen
    if (nowOn) {
      blocks.forEach(({ block: b }) => b.classList.remove('selected'))
      detailThumb.classList.remove('has-img')
      detailText.innerHTML = `<b style="color:${usp.color}">${usp.label}.</b> ${usp.text}`
    }
  })
  chipWrap.appendChild(chip)
}

const grid = document.querySelector('.feature-grid')
const detailThumb = document.querySelector('.detail-thumb')
const detailImg = detailThumb.querySelector('img')
const detailText = document.querySelector('.detail-text')
detailText.textContent = PRODUKT_INTRO
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

/* ---------------- Der Userflow (Carousel + Zoom) ---------------- */

document.querySelector('.flow-intro').textContent = USERFLOW_INTRO

const ufSlides = [...document.querySelectorAll('.uf-slide')]
let ufIndex = 0

function ufGo(i) {
  ufIndex = (i + ufSlides.length) % ufSlides.length
  ufSlides.forEach((s, idx) => s.classList.toggle('active', idx === ufIndex))
  document.querySelector('.uf-title').textContent = ufSlides[ufIndex].dataset.title
  document.querySelector('.uf-count').textContent = `${ufIndex + 1} / ${ufSlides.length}`
}

document.querySelector('.uf-prev').addEventListener('click', () => ufGo(ufIndex - 1))
document.querySelector('.uf-next').addEventListener('click', () => ufGo(ufIndex + 1))
ufGo(0)

// Klick auf einen State: vergrößern + Erklärtext im Zoom-Overlay
const ufZoom = document.querySelector('.uf-zoom')
document.querySelectorAll('.ufn').forEach((node) => {
  node.addEventListener('click', () => {
    const info = UF_EXPLAIN[node.dataset.key]
    if (!info) return
    ufZoom.querySelector('h4').textContent = info.title
    ufZoom.querySelector('p').textContent = info.text
    const imgWrap = ufZoom.querySelector('.uf-zoom-img')
    imgWrap.style.display = info.thumb ? 'block' : 'none'
    if (info.thumb) imgWrap.querySelector('img').src = `/thumbs/${info.thumb}.png`
    ufZoom.querySelector('.uf-zoom-card').style.borderColor =
      getComputedStyle(node).borderColor
    ufZoom.classList.add('open')
  })
})
ufZoom.addEventListener('click', () => ufZoom.classList.remove('open'))

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

/* ---------------- Fullscreen ---------------- */

function toggleFullscreen(el) {
  if (document.fullscreenElement) {
    document.exitFullscreen?.()
  } else {
    ;(el.requestFullscreen || el.webkitRequestFullscreen)?.call(el)
  }
}

document.querySelector('.nav-fs').addEventListener('click', () => {
  toggleFullscreen(document.documentElement)
})

document.querySelector('.demo-fullscreen').addEventListener('click', () => {
  mountDemo()
  toggleFullscreen(document.querySelector('.demo-frame'))
})

/* ---------------- AR App im Phone-Mock ---------------- */

let arMounted = false
function mountAr() {
  if (arMounted) return
  arMounted = true
  const screen = document.querySelector('.phone-live')
  const iframe = document.createElement('iframe')
  iframe.src = '/ar/'
  iframe.title = 'AR App Klick-Dummy'
  screen.appendChild(iframe)
}

/* ---------------- Workflow ---------------- */

document.querySelector('.workflow-intro').textContent = WORKFLOW_INTRO
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

prepAnimations()
const initial = slides.findIndex((s) => `#${s.id}` === location.hash)
goTo(initial >= 0 ? initial : 0)
