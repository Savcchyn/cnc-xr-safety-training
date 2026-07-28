// AR App — Klick-Dummy mit AR-Viewer-Simulation.
// Nutzt Maschinen-Modelle, Module, Tasks und Checklisten des XR-Prototyps.
import { content } from '../src/content.js'
import {
  playNotifSound,
  playWoodCrack,
  playFireSound,
  playWaterSound,
  playDrillSound,
} from '../src/audio.js'
import { HOTSPOTS, QUIZ_POOL, DUELL } from './data.js'
import { ArScene } from './scene.js'
import './style.css'

const GEAR_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`

/* ---------------- State ---------------- */

const app = {
  machine: 'm1',
  level: 1,
  mode: 'training', // 'training' | 'arquiz' | 'konsequenz'
  module: 2,
  stack: [],
  tasks: [],
  quiz: [],
  duell: null,
}

const $ = (sel) => document.querySelector(sel)
const $$ = (sel) => [...document.querySelectorAll(sel)]

function show(id) {
  $$('.screen').forEach((s) => s.classList.toggle('active', s.id === `s-${id}`))
}

function go(id, push = true) {
  const current = $$('.screen').find((s) => s.classList.contains('active'))?.id.slice(2)
  if (push && current && current !== id) app.stack.push(current)
  if (current === 'viewer' && id !== 'viewer') exitViewer()
  show(id)
  if (id === 'viewer') enterViewer()
  if (id === 'duell') startDuell()
  if (id === 'module') renderModuleList()
}

$$('[data-back]').forEach((b) =>
  b.addEventListener('click', () => {
    const prev = app.stack.pop()
    if (prev) go(prev, false)
  })
)

/* ---------------- Menü-Screens ---------------- */

$$('[data-machine]').forEach((b) =>
  b.addEventListener('click', () => {
    app.machine = b.dataset.machine
    go('level')
  })
)

$$('[data-level]').forEach((b) =>
  b.addEventListener('click', () => {
    app.level = parseInt(b.dataset.level, 10)
    go('home')
  })
)

$$('[data-go]').forEach((b) =>
  b.addEventListener('click', () => {
    if (b.dataset.mode) app.mode = b.dataset.mode
    go(b.dataset.go)
  })
)

/* ---------------- Checklisten ---------------- */

function renderModuleList() {
  $('#s-module .screen-sub').textContent = `Maschine ${app.machine.slice(1)} · ${
    ['Anfänger', 'Erfahren', 'Experte'][app.level]
  }`
  $('#s-module .module-list').innerHTML = content.modules
    .map(
      (m) =>
        `<button class="module-item" data-module="${m.n}"><span class="num">${m.n}</span>${m.title}</button>`
    )
    .join('')
  $$('#s-module .module-item').forEach((b) =>
    b.addEventListener('click', () => {
      app.module = parseInt(b.dataset.module, 10)
      renderChecklist($('#s-checkliste'), app.module)
      go('checkliste')
    })
  )
}

function renderChecklist(root, moduleN) {
  const items = content.checklists[app.machine]?.[moduleN] || []
  const title = content.modules.find((m) => m.n === moduleN)?.title || ''
  root.querySelector('.cl-kicker').textContent = `Checkliste Modul ${moduleN}`
  root.querySelector('.cl-title').textContent = title
  root.querySelector('.cl-items').innerHTML = items
    .map(
      (i) => `
      <div class="cl-item">
        <div class="box">✔</div>
        <div class="lbl">${i.label}${i.sub ? `<span class="sub">${i.sub}</span>` : ''}</div>
      </div>`
    )
    .join('')
  root.querySelectorAll('.cl-item').forEach((el) =>
    el.addEventListener('click', () => el.classList.toggle('checked'))
  )
}

/* ---------------- Kamera & AR Viewer ---------------- */

$('.camera-open').addEventListener('click', () => go('viewer'))

let scene = null
let gearEls = []
let activeIndex = -1
let scanTimer = null

function enterViewer() {
  if (!scene) {
    scene = new ArScene($('#ar-canvas'))
    scene.onFrame = updateGears
  }
  scene.clearConsequence()
  scene.placed = false
  scene.machine.visible = false
  scene.reset()

  const overlay = $('.scan-overlay')
  overlay.style.display = 'flex'
  overlay.classList.remove('ready')
  $('.scan-text').textContent = 'Bewege das Handy langsam über die Fläche …'
  closeSheets()
  buildGears(false)

  const ready = scene.loadMachine(app.machine)
  scanTimer = setTimeout(async () => {
    await ready
    overlay.classList.add('ready')
    $('.scan-text').textContent = 'Fläche erkannt — tippe, um das Modell zu platzieren'
    const place = () => {
      overlay.style.display = 'none'
      scene.place()
      startMode()
    }
    overlay.addEventListener('pointerdown', place, { once: true })
    if (app.mode === 'konsequenz') setTimeout(place, 900)
  }, 1600)
}

function exitViewer() {
  clearTimeout(scanTimer)
  scene?.clearConsequence()
  closeSheets()
}

function startMode() {
  if (app.mode === 'training') {
    app.tasks = content.tasks.map((t) => ({ ...t, answered: null }))
    buildGears(true)
  } else if (app.mode === 'arquiz') {
    const pool = QUIZ_POOL.filter((q) => !q.machine || q.machine === app.machine)
    app.quiz = pool.slice(0, 5).map((q) => ({ ...q, answered: null }))
    buildGears(true)
  } else if (app.mode === 'konsequenz') {
    playConsequence(app.duell ? duellOutro : konsequenzOutro)
  }
}

function buildGears(interactive) {
  const layer = $('.gear-layer')
  layer.innerHTML = ''
  gearEls = []
  activeIndex = -1
  if (!interactive) return
  const keys = Object.keys(HOTSPOTS[app.machine])
  keys.forEach((key, i) => {
    const b = document.createElement('button')
    b.className = 'gear'
    b.innerHTML = GEAR_SVG
    b.addEventListener('click', () => openPoint(i))
    layer.appendChild(b)
    gearEls.push({ el: b, key })
  })
}

function updateGears() {
  if (!scene?.placed) return
  const positions = HOTSPOTS[app.machine]
  gearEls.forEach(({ el, key }) => {
    const p = scene.project(positions[key])
    el.style.transform = ''
    el.style.left = `${p.x}px`
    el.style.top = `${p.y}px`
    el.style.display = p.visible ? 'flex' : 'none'
  })
}

/* ---------------- Task- / Quiz-Sheet ---------------- */

function openPoint(i) {
  activeIndex = i
  gearEls.forEach(({ el }, idx) => el.classList.toggle('active', idx === i))
  const sheet = $('.task-sheet')
  const answers = $('.sheet-answers')

  if (app.mode === 'training') {
    const task = app.tasks[i]
    $('.sheet-question').textContent = content.taskQuestion
    answers.innerHTML = task.options
      .map(
        (o, idx) =>
          `<button data-option="${idx}" class="${task.answered === idx ? 'selected' : ''}">${o}</button>`
      )
      .join('')
    answers.querySelectorAll('button').forEach((b) =>
      b.addEventListener('click', () => answerTask(i, parseInt(b.dataset.option, 10)))
    )
  } else {
    const q = app.quiz[i]
    $('.sheet-question').textContent = `Frage ${i + 1}`
    answers.innerHTML =
      `<p class="quiz-inline">${q.q}</p>` +
      q.a
        .map((o, idx) => `<button data-option="${idx}">${o}</button>`)
        .join('')
    answers.querySelectorAll('button').forEach((b) =>
      b.addEventListener('click', () => answerQuiz(i, parseInt(b.dataset.option, 10)))
    )
  }
  sheet.classList.add('open')
}

function answerTask(i, option) {
  const task = app.tasks[i]
  task.answered = option
  gearEls[i].el.classList.add('answered')
  playNotifSound()
  setTimeout(() => {
    if (app.tasks.every((t) => t.answered !== null)) return evaluateTraining()
    cyclePoint(1)
  }, 450)
}

function answerQuiz(i, option) {
  const q = app.quiz[i]
  if (q.answered !== null) return
  q.answered = option
  const buttons = $('.sheet-answers').querySelectorAll('button')
  buttons[q.correct]?.classList.add('right')
  if (option !== q.correct) buttons[option]?.classList.add('wrong')
  gearEls[i].el.classList.add(option === q.correct ? 'ok' : 'bad', 'answered')
  setTimeout(() => {
    if (app.quiz.every((x) => x.answered !== null)) return evaluateArQuiz()
    cyclePoint(1)
  }, 1400)
}

function cyclePoint(dir) {
  const n = gearEls.length
  let next = activeIndex
  for (let k = 0; k < n; k++) {
    next = (next + dir + n) % n
    const item = app.mode === 'training' ? app.tasks[next] : app.quiz[next]
    if (item.answered === null) break
  }
  openPoint(next)
}

$$('.sheet-arrow').forEach((b) =>
  b.addEventListener('click', () => cyclePoint(parseInt(b.dataset.cycle, 10)))
)

function closeSheets() {
  $$('.sheet').forEach((s) => s.classList.remove('open'))
  $('.viewer-cl').classList.remove('open')
}

/* ---------------- Auswertung & Konsequenz ---------------- */

function evaluateTraining() {
  $('.task-sheet').classList.remove('open')
  const wrong = app.tasks.filter((t) => t.answered !== t.correct)
  app.tasks.forEach((t, i) => {
    gearEls[i].el.classList.add(t.answered === t.correct ? 'ok' : 'bad')
  })
  if (!wrong.length) {
    showResult(content.allCorrect, 'Deine Routine sitzt — auch ohne Checkliste.', [
      ['Zum Menü', () => leaveViewer(), true],
    ])
  } else {
    showResult(
      content.consequence.titleTemplate(wrong.length, app.tasks.length),
      content.consequence.text,
      [
        ['Konsequenz ansehen', () => playConsequence(trainingOutro), true],
        ['Modul wiederholen', () => restartViewerMode()],
      ]
    )
  }
}

function evaluateArQuiz() {
  $('.task-sheet').classList.remove('open')
  const right = app.quiz.filter((q) => q.answered === q.correct).length
  const actions = [['Zum Menü', () => leaveViewer(), right === 5]]
  if (right < 5) {
    actions.unshift(['Konsequenz ansehen', () => playConsequence(trainingOutro), true])
  }
  showResult(
    `${right} von 5 richtig`,
    right === 5
      ? 'Perfekt — deine Routinen sitzen.'
      : 'Einige Antworten waren riskant.\nDie Simulation zeigt eine mögliche Folge.',
    actions
  )
}

function showResult(title, text, actions) {
  $('.result-title').textContent = title
  $('.result-text').textContent = text
  const wrap = $('.result-actions')
  wrap.innerHTML = ''
  for (const [label, fn, primary] of actions) {
    const b = document.createElement('button')
    b.textContent = label
    if (primary) b.classList.add('primary')
    b.addEventListener('click', () => {
      $('.result-sheet').classList.remove('open')
      fn()
    })
    wrap.appendChild(b)
  }
  $('.result-sheet').classList.add('open')
}

function playConsequence(after) {
  closeSheets()
  const scenario = ['fire', 'water', 'wood'][Math.floor(Math.random() * 3)]
  scene.showConsequence(scenario)
  if (scenario === 'fire') playFireSound()
  else if (scenario === 'water') playWaterSound()
  else app.machine === 'm1' ? playWoodCrack() : playDrillSound()
  setTimeout(() => after(scenario), 2800)
}

const SCENARIO_NAMES = { fire: 'Brand', water: 'Leckage', wood: 'Splitterflug' }

function trainingOutro(scenario) {
  showResult(
    `Mögliche Folge: ${SCENARIO_NAMES[scenario]}`,
    'Keine Strafe — die Wahrheit der Maschine.\nWiederhole das Modul und lass die Routine sitzen.',
    [
      ['Modul wiederholen', () => restartViewerMode(), true],
      ['Zum Menü', () => leaveViewer()],
    ]
  )
}

function konsequenzOutro() {
  showResult('Konsequenz-Simulation', '', [['Zum Menü', () => leaveViewer(), true]])
}

function restartViewerMode() {
  scene.clearConsequence()
  startMode()
}

function leaveViewer() {
  app.duell = null
  app.stack = ['maschine', 'level']
  go('home', false)
}

/* Checklisten-Overlay im Viewer */
$('.viewer-checklist').addEventListener('click', () => {
  renderChecklist($('.viewer-cl'), app.module)
  $('.viewer-cl').classList.add('open')
})
$('[data-close-cl]').addEventListener('click', () => $('.viewer-cl').classList.remove('open'))

/* ---------------- Quiz Duell ---------------- */

function pickDuellQuestions() {
  const specific = QUIZ_POOL.filter((q) => q.machine === app.machine)
  const generic = QUIZ_POOL.filter((q) => !q.machine).sort(() => Math.random() - 0.5)
  return [...specific, ...generic].slice(0, DUELL.rounds).sort(() => Math.random() - 0.5)
}

function startDuell() {
  app.duell = {
    questions: pickDuellQuestions(),
    round: 0,
    you: 0,
    bot: 0,
    selected: null,
    locked: false,
    botAnswer: null,
    botTime: null,
    timeLeft: DUELL.questionSeconds,
    timers: [],
  }
  runRound()
}

function dTimer(fn, ms) {
  app.duell.timers.push(setTimeout(fn, ms))
}

function clearDuellTimers() {
  app.duell?.timers.forEach((t) => clearTimeout(t))
  if (app.duell) app.duell.timers = []
}

function runRound() {
  const d = app.duell
  clearDuellTimers()
  d.selected = null
  d.locked = false
  d.botAnswer = null
  d.timeLeft = DUELL.questionSeconds

  const q = d.questions[d.round]
  $('#round-num').textContent = d.round + 1
  $('#score-you').textContent = d.you
  $('#score-bot').textContent = d.bot
  $('.quiz-question').textContent = q.q
  $('.bot-status').textContent = `${DUELL.botEmoji} ${DUELL.botName} überlegt …`
  const grid = $('.quiz-grid')
  grid.innerHTML = q.a.map((a, i) => `<button data-i="${i}">${a}</button>`).join('')
  grid.querySelectorAll('button').forEach((b) =>
    b.addEventListener('click', () => {
      if (d.locked) return
      d.selected = parseInt(b.dataset.i, 10)
      grid.querySelectorAll('button').forEach((x) => x.classList.remove('selected'))
      b.classList.add('selected')
      $('.confirm-btn').disabled = false
    })
  )
  $('.confirm-btn').disabled = true

  // Bot plant seine Antwort
  const botDelay =
    (DUELL.botMinSeconds + Math.random() * (DUELL.botMaxSeconds - DUELL.botMinSeconds)) * 1000
  dTimer(() => {
    if (d.locked) return
    d.botAnswer =
      Math.random() < DUELL.botAccuracy
        ? q.correct
        : [0, 1, 2, 3].filter((i) => i !== q.correct)[Math.floor(Math.random() * 3)]
    d.botTime = DUELL.questionSeconds - d.timeLeft
    $('.bot-status').textContent = `${DUELL.botEmoji} ${DUELL.botName} hat geantwortet ✔`
  }, botDelay)

  // Timer-Balken
  const tick = () => {
    if (d.locked) return
    d.timeLeft = Math.max(0, d.timeLeft - 0.1)
    const pct = (d.timeLeft / DUELL.questionSeconds) * 100
    const fill = $('.timer-fill')
    fill.style.width = `${pct}%`
    fill.classList.toggle('low', pct < 25)
    if (d.timeLeft <= 0) return reveal()
    dTimer(tick, 100)
  }
  tick()
}

$('.confirm-btn').addEventListener('click', () => {
  if (!app.duell || app.duell.locked || app.duell.selected === null) return
  reveal()
})

function reveal() {
  const d = app.duell
  d.locked = true
  clearDuellTimers()
  const q = d.questions[d.round]

  // Bot antwortet spätestens jetzt
  if (d.botAnswer === null) {
    d.botAnswer =
      Math.random() < DUELL.botAccuracy
        ? q.correct
        : [0, 1, 2, 3].filter((i) => i !== q.correct)[Math.floor(Math.random() * 3)]
    d.botTime = DUELL.questionSeconds - d.timeLeft
  }

  const grid = $('.quiz-grid')
  const buttons = grid.querySelectorAll('button')
  buttons[q.correct].classList.add('right')
  if (d.selected !== null && d.selected !== q.correct) buttons[d.selected].classList.add('wrong')
  const botPick = document.createElement('span')
  botPick.className = 'bot-pick'
  botPick.textContent = DUELL.botEmoji
  buttons[d.botAnswer].appendChild(botPick)

  // Punkte: 100 Basis + Schnelligkeits-Bonus
  if (d.selected === q.correct) {
    d.you += 100 + Math.round(d.timeLeft * 10)
    playNotifSound()
  }
  if (d.botAnswer === q.correct) {
    d.bot += 100 + Math.round((DUELL.questionSeconds - d.botTime) * 10)
  }
  $('#score-you').textContent = d.you
  $('#score-bot').textContent = d.bot
  $('.bot-status').textContent = q.explain

  dTimer(() => {
    d.round += 1
    if (d.round < DUELL.rounds) return runRound()
    // Duell vorbei → Konsequenz-Simulation im AR-Viewer
    app.mode = 'konsequenz'
    go('viewer')
  }, 2400)
}

function duellOutro(scenario) {
  const d = app.duell
  const won = d.you >= d.bot
  showResult(
    won ? `Gewonnen! ${d.you} : ${d.bot}` : `Verloren. ${d.you} : ${d.bot}`,
    `${won ? 'Stark — deine Routine hat gehalten.' : `${DUELL.botName} war heute schneller.`}\n` +
      `Und trotzdem: Ein übersprungener Schritt genügt.\nMögliche Folge: ${SCENARIO_NAMES[scenario]}.`,
    [
      ['Nochmal spielen', () => { app.stack = ['maschine', 'level', 'home', 'quizmenu']; go('duell', false) }, true],
      ['Zum Menü', () => leaveViewer()],
    ]
  )
}

/* ---------------- Start ---------------- */

show('maschine')
