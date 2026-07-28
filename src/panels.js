import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { content } from './content.js'

// Weltmaßstab ist 455 Einheiten/Meter → Panels behalten Matrix-Scale 1
// (wichtig für korrekte border-radius/box-shadow-Darstellung in Firefox).
const PANEL_SCALE = 1

/**
 * Erzeugt ein Spatial-UI-Panel als CSS3DObject.
 * `actions`: Map von data-action → Handler (delegierter Click).
 */
export function makePanel(className, html, actions = {}) {
  const el = document.createElement('div')
  el.className = `panel ${className}`
  el.innerHTML = html
  el.style.pointerEvents = 'auto'

  el.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]')
    if (!target || !el.contains(target)) return
    const handler = actions[target.dataset.action]
    if (handler) handler(target, e)
  })

  const object = new CSS3DObject(el)
  object.scale.setScalar(PANEL_SCALE)
  return { el, object }
}

/* ---------------- Startscreen / Trainings Selection ---------------- */

export function buildStartPanel(onSelect, onTutorial, onDashboard) {
  const c = content.start
  const cols = c.columns
    .map(
      (col) => `
      <div class="start-col" data-col="${col.key}">
        <h3>${col.question}</h3>
        ${col.options
          .map(
            (o, i) => `
          <button class="btn" data-action="select" data-key="${col.key}" data-index="${i}">
            ${o.label}
            ${o.sub ? `<span class="btn-sub">${o.sub}</span>` : ''}
          </button>`
          )
          .join('')}
      </div>`
    )
    .join('')

  return makePanel(
    'start-panel',
    `
    <div class="start-glow"></div>
    <div class="start-warning">⚠️</div>
    <div class="start-head">
      <h1>${c.titleTop}<br/><span class="accent">${c.titleAccent}</span> ${c.titleRest}</h1>
      <p class="subtitle">${c.subtitle}</p>
    </div>
    <div class="start-columns">${cols}</div>
    <div class="start-footer">
      <button class="btn" data-action="tutorial">${c.tutorial}</button>
      <button class="btn" data-action="dashboard">${c.dashboard}</button>
    </div>
    `,
    {
      select: (t) => {
        const col = t.closest('.start-col')
        col.querySelectorAll('.btn').forEach((b) => b.classList.remove('selected'))
        t.classList.add('selected')
        onSelect(t.dataset.key, parseInt(t.dataset.index, 10))
      },
      tutorial: onTutorial,
      dashboard: onDashboard,
    }
  )
}

/* ---------------- Modul Selection ---------------- */

export function buildModulePanel(onModule, onBack) {
  const grid = content.modules
    .map(
      (m) => `
      <button class="btn module-btn" data-action="module" data-module="${m.n}">
        <span class="num">${m.n}</span>
        <span class="label">${m.title.replace(' & ', '<br/>& ')}</span>
      </button>`
    )
    .join('')

  return makePanel(
    'module-panel',
    `
    <button class="btn chip back-chip-left" data-action="back">${content.cms.back}</button>
    <h2>${content.moduleSelect.title}</h2>
    <div class="module-grid">${grid}</div>
    `,
    {
      module: (t) => onModule(parseInt(t.dataset.module, 10)),
      back: onBack,
    }
  )
}

/* ---------------- PreChecklist Dialog ---------------- */

export function buildPreChecklistPanel(onNo, onYes) {
  const c = content.preChecklist
  return makePanel(
    'prechecklist-panel',
    `
    <h2>${c.title}</h2>
    <p>${c.sub}</p>
    <div class="prechecklist-actions">
      <button class="btn" data-action="no">${c.no}</button>
      <button class="btn primary" data-action="yes">${c.yes}</button>
    </div>
    `,
    { no: onNo, yes: onYes }
  )
}

/* ---------------- Checkliste (groß) ---------------- */

function checklistItems(cls = '') {
  return content.checklist.items
    .map(
      (item, i) => `
      <div class="check-item ${cls}" data-action="toggle" data-index="${i}">
        <div class="checkbox">✔</div>
        <div class="check-label">${item.label}
          ${item.sub ? `<span class="check-sub">${item.sub}</span>` : ''}
        </div>
      </div>`
    )
    .join('')
}

export function buildChecklistPanel(onStart) {
  const c = content.checklist
  return makePanel(
    'checklist-panel',
    `
    <p class="kicker">${c.kicker}</p>
    <h2 class="title">${c.title}</h2>
    <div class="check-grid">${checklistItems()}</div>
    <button class="btn primary" data-action="start" style="font-size:24px;padding:20px;">${c.startButton}</button>
    `,
    {
      start: onStart,
      toggle: (t) => t.classList.toggle('checked'),
    }
  )
}

/* ---------------- Check In ---------------- */

export function buildCheckinPanel(onShowChecklist, onLeave, onDone) {
  const c = content.checkin
  const panel = makePanel(
    'checkin-panel',
    `
    <h2>${c.title}</h2>
    <p class="accent-line">${c.accentLine}</p>
    ${c.lines.map((l) => `<p class="body-line">${l}</p>`).join('')}
    <div class="checkin-actions">
      <button class="btn" data-action="show-checklist">${c.showChecklist} (<span class="views-left">${c.checklistViews}</span>)</button>
      <button class="btn" data-action="leave">${c.leaveModule}</button>
      <button class="btn wide" data-action="done">${c.markDone}</button>
    </div>
    `,
    { 'show-checklist': onShowChecklist, leave: onLeave, done: onDone }
  )

  panel.setViewsLeft = (n) => {
    panel.el.querySelector('.views-left').textContent = n
    const btn = panel.el.querySelector('[data-action="show-checklist"]')
    btn.classList.toggle('disabled', n <= 0)
  }
  return panel
}

/* ---------------- Timer ---------------- */

export function buildTimerPanel() {
  const panel = makePanel(
    'timer-panel',
    `
    <div class="timer-title">${content.checkin.timerLabel}</div>
    <div class="timer-digits">
      <div class="digit m1">0</div>
      <div class="digit m2">0</div>
      <div class="colon">:</div>
      <div class="digit s1">0</div>
      <div class="digit s2">0</div>
    </div>
    `
  )
  panel.setSeconds = (total) => {
    const m = Math.floor(total / 60)
    const s = total % 60
    panel.el.querySelector('.m1').textContent = Math.floor(m / 10)
    panel.el.querySelector('.m2').textContent = m % 10
    panel.el.querySelector('.s1').textContent = Math.floor(s / 10)
    panel.el.querySelector('.s2').textContent = s % 10
  }
  return panel
}

/* ---------------- Zeitdruck-Nachrichten ---------------- */

export function buildNotificationStack() {
  const panel = makePanel(
    'notif-stack',
    content.notifications
      .map(
        (n, i) => `
        <div class="notif" data-notif="${i}">
          <div class="bell">🔔</div>
          <div>
            <div class="notif-title">${n.title}</div>
            <div class="notif-text">${n.text}</div>
          </div>
          <div class="notif-time">${n.time}</div>
        </div>`
      )
      .join('')
  )
  panel.show = (i) => {
    const el = panel.el.querySelector(`[data-notif="${i}"]`)
    if (el) el.classList.add('visible')
  }
  panel.reset = () =>
    panel.el.querySelectorAll('.notif').forEach((n) => n.classList.remove('visible'))
  return panel
}

/* ---------------- Task Frage ---------------- */

export function buildTaskPanel(onAnswer) {
  const panel = makePanel(
    'task-panel',
    `
    <h3>${content.taskQuestion}</h3>
    <div class="task-options"></div>
    `,
    {
      answer: (t) => {
        panel.el
          .querySelectorAll('.task-options .btn')
          .forEach((b) => b.classList.remove('selected'))
        t.classList.add('selected')
        onAnswer(parseInt(t.dataset.option, 10))
      },
    }
  )
  panel.setTask = (task) => {
    panel.el.querySelector('.task-options').innerHTML = task.options
      .map(
        (o, i) =>
          `<button class="btn ${task.answered === i ? 'selected' : ''}" data-action="answer" data-option="${i}">${o}</button>`
      )
      .join('')
  }
  return panel
}

/* ---------------- Mini-Checkliste im Check-In ---------------- */

export function buildMiniChecklist() {
  const c = content.checklist
  const panel = makePanel(
    'mini-checklist',
    `
    <p class="kicker">${c.kicker}</p>
    <h2 class="title">${c.title}</h2>
    <div class="countdown-badge"><span>15</span></div>
    <div class="check-grid">${checklistItems()}</div>
    `,
    { toggle: (t) => t.classList.toggle('checked') }
  )
  panel.setCountdown = (n) => {
    panel.el.querySelector('.countdown-badge span').textContent = n
  }
  return panel
}

/* ---------------- Konsequenz ---------------- */

export function buildConsequencePanel(onRepeat, onLeave) {
  const c = content.consequence
  const panel = makePanel(
    'consequence-panel',
    `
    <div class="consequence-ring">⚠️</div>
    <h2 class="headline"></h2>
    <p>${c.text}</p>
    <div class="consequence-actions">
      <button class="btn" data-action="repeat">${c.repeat}</button>
      <button class="btn" data-action="leave">${c.leave}</button>
    </div>
    `,
    { repeat: onRepeat, leave: onLeave }
  )
  panel.setSkipped = (skipped, total) => {
    panel.el.querySelector('.headline').textContent = c.titleTemplate(skipped, total)
  }
  return panel
}

/* ---------------- Modul Review ---------------- */

const ARC = (rot) => `
  <svg width="86" height="86" viewBox="0 0 86 86" style="transform:rotate(${rot}deg)">
    <circle cx="43" cy="43" r="34" fill="none" stroke="#f0c33c" stroke-width="13"
      stroke-dasharray="165 55" stroke-linecap="butt"/>
  </svg>`

export function buildReviewPanel(onContinue) {
  const c = content.review
  return makePanel(
    'review-panel',
    `
    <h2>${c.title}</h2>
    <p class="review-text">${c.text}</p>
    <div class="review-viz">
      <div>
        <div class="arcs">${ARC(80)}${ARC(200)}${ARC(-40)}</div>
        <div class="viz-label">${c.leftLabel}</div>
      </div>
      <div>
        <div class="bars">
          <div class="bar" style="height:38%"></div>
          <div class="bar" style="height:62%"></div>
          <div class="bar" style="height:100%"></div>
          <div class="bar" style="height:70%"></div>
        </div>
        <div class="viz-label">${c.rightLabel}</div>
      </div>
    </div>
    <button class="btn" data-action="continue" style="font-size:20px;padding:18px;">${c.button}</button>
    `,
    { continue: onContinue }
  )
}

/* ---------------- Content Dashboard (CMS) ---------------- */

export function buildCmsPanel(handlers) {
  const c = content.cms
  const state = { machine: 0, group: 0 }

  const panel = makePanel(
    'cms-panel',
    `
    <button class="btn chip" data-action="back">${c.back}</button>
    <h2 class="cms-title">${c.title}</h2>
    <div class="cms-row">
      <div class="stepper">
        <button data-action="machine-prev">◀</button>
        <div class="stepper-value machine-value">${c.machines[0]}</div>
        <button data-action="machine-next">▶</button>
      </div>
      <div class="stepper">
        <button data-action="group-prev">◀</button>
        <div class="stepper-value group-value">${c.groups[0]}</div>
        <button data-action="group-next">▶</button>
      </div>
    </div>
    <div class="cms-row">
      <button class="btn cms-add" data-action="add-machine"><span class="icon">+</span>${c.addMachine}</button>
      <button class="btn cms-add" data-action="add-group"><span class="icon">+</span>${c.addGroup}</button>
    </div>
    <h3 class="cms-section-title modules-title">${c.modulesTitle(c.machines[0], c.groups[0])}</h3>
    <div class="module-grid">
      ${content.modules
        .map(
          (m) => `
        <button class="btn module-btn ${m.n === 2 ? 'selected' : ''}" data-action="module" data-module="${m.n}">
          <span class="num">${m.n}</span>
          <span class="label">${m.title.replace(' & ', '<br/>& ')}</span>
        </button>`
        )
        .join('')}
    </div>
    <div class="cms-row">
      <button class="btn cms-add" data-action="add-module"><span class="icon">+</span>${c.addModule}</button>
      <button class="btn cms-add" data-action="delete-module"><span class="icon">✕</span>${c.deleteModule}</button>
    </div>
    <button class="btn cms-add cms-wide" data-action="edit-notifications"><span class="icon">🔔</span>${c.editNotifications}</button>
    `,
    {
      back: handlers.back,
      'machine-prev': () => step('machine', -1),
      'machine-next': () => step('machine', 1),
      'group-prev': () => step('group', -1),
      'group-next': () => step('group', 1),
      'add-machine': handlers.prototypeOnly,
      'add-group': handlers.prototypeOnly,
      'add-module': handlers.prototypeOnly,
      'delete-module': handlers.prototypeOnly,
      'edit-notifications': handlers.editNotifications,
      module: (t) => {
        panel.el
          .querySelectorAll('.module-grid .btn')
          .forEach((b) => b.classList.remove('selected'))
        t.classList.add('selected')
        handlers.selectModule(parseInt(t.dataset.module, 10))
      },
    }
  )

  function step(key, d) {
    const list = key === 'machine' ? c.machines : c.groups
    state[key] = (state[key] + d + list.length) % list.length
    panel.el.querySelector(`.${key}-value`).textContent = list[state[key]]
    panel.el.querySelector('.modules-title').textContent = c.modulesTitle(
      c.machines[state.machine],
      c.groups[state.group]
    )
  }

  return panel
}

/* ---------------- CMS: Checkliste bearbeiten ---------------- */

export function buildCmsChecklistPanel(onEditItem, onAddCheckpoint, onSave, onDeleteItem = () => {}) {
  const c = content.cms
  const items = content.checklist.items
    .slice(0, 5)
    .map(
      (item, i) => `
      <div class="edit-item">
        <button class="icon-btn" data-action="delete-item" data-index="${i}">✕</button>
        <button class="icon-btn" data-action="edit-item" data-index="${i}">✎</button>
        <div class="check-label">${item.label}
          ${item.sub ? `<span class="check-sub">${item.sub}</span>` : ''}
        </div>
      </div>`
    )
    .join('')

  return makePanel(
    'cms-checklist',
    `
    <p class="kicker">${c.checklistKicker}</p>
    <h2 class="title">${c.checklistTitle}</h2>
    ${items}
    <div class="dots"><span class="active"></span><span></span><span></span></div>
    <button class="btn cms-add cms-wide" data-action="add-checkpoint"><span class="icon">+</span>${c.addCheckpoint}</button>
    <button class="btn cms-add cms-wide" data-action="save" style="margin-top:14px;"><span class="icon">💾</span>${c.saveChecklist}</button>
    `,
    {
      'edit-item': (t) => onEditItem(parseInt(t.dataset.index, 10)),
      'delete-item': (t) => onDeleteItem(parseInt(t.dataset.index, 10)),
      'add-checkpoint': onAddCheckpoint,
      save: onSave,
    }
  )
}

/* ---------------- CMS: Checkpoint Editor ---------------- */

export function buildCheckpointEditor(onBack, onSave) {
  const c = content.checkpointEditor
  const panel = makePanel(
    'checkpoint-editor',
    `
    <button class="btn chip back-chip" data-action="back">${content.cms.back}</button>
    <p class="kicker">${c.kicker}</p>
    <h2 class="title" style="margin-bottom:16px;">${c.title}</h2>
    <p class="checkpoint-label">${c.label}</p>
    <div class="field" contenteditable="true">${c.text}<span class="pencil">✎</span></div>
    <div class="spatial-link checked" data-action="spatial">
      <div class="checkbox">✔</div>
      <span>${c.spatialLink}</span>
    </div>
    <p class="answer-label">${c.correctLabel}</p>
    <div class="field answer correct" contenteditable="true">${c.correctValue}<span class="pencil">✎</span></div>
    <p class="answer-label">${c.wrongLabel}</p>
    <div class="field answer wrong" contenteditable="true">${c.wrongValue}<span class="pencil">✎</span></div>
    <button class="btn cms-add cms-wide" data-action="save"><span class="icon">💾</span>${c.save}</button>
    `,
    {
      back: onBack,
      save: onSave,
      spatial: (t) => t.classList.toggle('checked'),
    }
  )
  return panel
}

/* ---------------- Checkpoint hinzugefügt (Platzierung) ---------------- */

export function buildPlacementPanel(onConfirm) {
  const c = content.checkpointAdded
  const panel = makePanel(
    'placement-panel',
    `
    <h2>${c.title}</h2>
    <p>${c.text}</p>
    <button class="btn" data-action="confirm" style="font-size:20px;padding:18px;">${c.confirm}</button>
    `,
    { confirm: onConfirm }
  )
  return panel
}

/* ---------------- Checkpoint platziert (Konsequenz-Simulation?) ---------------- */

export function buildCheckpointPlacedPanel(onRequest, onContinue) {
  const c = content.checkpointPlacedDialog
  return makePanel(
    'placement-panel',
    `
    <h2>${c.title}</h2>
    <p style="font-size:22px;margin-bottom:14px;">${c.subtitle}</p>
    <p>${c.text}</p>
    <div class="prechecklist-actions">
      <button class="btn" data-action="request">${c.request}</button>
      <button class="btn" data-action="continue">${c.continueWithout}</button>
    </div>
    `,
    { request: onRequest, continue: onContinue }
  )
}

/* ---------------- Tutorial ---------------- */

export function buildTutorialPanel(onClose) {
  const c = content.tutorial
  return makePanel(
    'tutorial-panel',
    `
    <h2>${c.title}</h2>
    ${c.lines.map(([k, v]) => `<div class="tutorial-row"><b>${k}</b><span>${v}</span></div>`).join('')}
    <button class="btn primary" data-action="close">${c.button}</button>
    `,
    { close: onClose }
  )
}

/* ---------------- Zeitdruck-Nachrichten Editor ---------------- */

export function buildNotificationEditor(onBack, onSave) {
  const c = content.cms
  const panel = makePanel(
    'checkpoint-editor',
    `
    <button class="btn chip back-chip" data-action="back">${c.back}</button>
    <h2 class="cms-title" style="font-size:34px;">🔔 ${c.editNotifications}</h2>
    ${content.notifications
      .map(
        (n, i) => `
      <p class="answer-label">${n.title} · ${n.time}</p>
      <div class="field answer" contenteditable="true" data-notif="${i}">${n.text}<span class="pencil">✎</span></div>`
      )
      .join('')}
    <button class="btn cms-add cms-wide" data-action="save"><span class="icon">💾</span>Speichern</button>
    `,
    { back: onBack, save: onSave }
  )
  return panel
}
