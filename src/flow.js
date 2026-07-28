import * as THREE from 'three'
import { CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { content } from './content.js'
import { GEAR_SVG } from './world.js'
import {
  buildStartPanel,
  buildModulePanel,
  buildPreChecklistPanel,
  buildChecklistPanel,
  buildCheckinPanel,
  buildTimerPanel,
  buildNotificationStack,
  buildTaskPanel,
  buildMiniChecklist,
  buildConsequencePanel,
  buildReviewPanel,
  buildCmsPanel,
  buildCmsChecklistPanel,
  buildCheckpointEditor,
  buildPlacementPanel,
  buildCheckpointPlacedPanel,
  buildTutorialPanel,
  buildNotificationEditor,
} from './panels.js'

import { U } from './units.js'

// Welt-Koordinaten (Meter → Szenen-Einheiten)
const V3 = (x, y, z) => new THREE.Vector3(x * U, y * U, z * U)
// Maschinen-lokale Koordinaten (Meter — die Maschinen-Gruppe skaliert selbst mit U)
const V3m = (x, y, z) => new THREE.Vector3(x, y, z)

// Positionen der Interaktionspunkte (lokal zur Maschinen-Gruppe,
// abgestimmt auf die geladenen GLB-Modelle)
const HOTSPOT_POSITIONS = {
  'panel-top': V3m(-0.3, 1.78, 1.15),
  'panel-estop': V3m(-1.18, 1.2, 1.3),
  'cabinet-door': V3m(-0.74, 0.5, 1.25),
  spindle: V3m(0.62, 1.62, 0.8),
  table: V3m(1.55, 1.18, 1.0),
}

export class Flow {
  constructor({ scene, camera, controls, world, toast }) {
    this.scene = scene
    this.camera = camera
    this.controls = controls
    this.world = world
    this.toast = toast

    this.state = null
    this.selections = { machine: null, level: null, space: null }
    this.mode = 'space'
    this.timers = []
    this.hotspots = []
    this.tasks = []
    this.activeTask = null
    this.checklistViews = content.checkin.checklistViews
    this.grabbed = null
    this.placedGear = null

    this.raycaster = new THREE.Raycaster()
    this.pointer = new THREE.Vector2()

    this.buildPanels()
    this.setupPlacementEvents()
    this.setState('start')
  }

  /* ---------------- Panels ---------------- */

  buildPanels() {
    this.panels = {}

    this.panels.start = buildStartPanel(
      (key, index) => this.onStartSelect(key, index),
      () => this.showPanel('tutorial', true),
      () => this.setState('cms')
    )

    this.panels.tutorial = buildTutorialPanel(() => this.showPanel('tutorial', false))

    this.panels.modules = buildModulePanel(() => this.setState('preChecklist'))

    this.panels.preChecklist = buildPreChecklistPanel(
      () => this.setState('simulation'),
      () => this.setState('checklist')
    )

    this.panels.checklist = buildChecklistPanel(() => this.setState('simulation'))

    this.panels.checkin = buildCheckinPanel(
      () => this.showMiniChecklist(),
      () => this.setState('modules'),
      () => this.evaluate()
    )

    this.panels.timer = buildTimerPanel()
    this.panels.notifications = buildNotificationStack()
    this.panels.task = buildTaskPanel((option) => this.onTaskAnswer(option))
    this.panels.miniChecklist = buildMiniChecklist()

    this.panels.consequence = buildConsequencePanel(
      () => this.setState('simulation'),
      () => this.setState('review')
    )

    this.panels.review = buildReviewPanel(() => this.setState('modules'))

    this.panels.cms = buildCmsPanel({
      back: () => this.setState('start'),
      prototypeOnly: () => this.toast(content.prototypeOnly),
      editNotifications: () => this.swapCmsRight('cmsNotifications'),
      selectModule: () => this.swapCmsRight('cmsChecklist'),
    })

    this.panels.cmsChecklist = buildCmsChecklistPanel(
      () => this.swapCmsRight('cmsEditor'),
      () => this.setState('cmsPlacement'),
      () => this.toast(content.checkpointPlaced),
      () => this.toast(content.prototypeOnly)
    )

    this.panels.cmsEditor = buildCheckpointEditor(
      () => this.swapCmsRight('cmsChecklist'),
      () => this.setState('cmsPlacement')
    )

    this.panels.cmsNotifications = buildNotificationEditor(
      () => this.swapCmsRight('cmsChecklist'),
      () => {
        this.toast(content.notificationsSaved)
        this.swapCmsRight('cmsChecklist')
      }
    )

    this.panels.placement = buildPlacementPanel(() => this.onPlacementConfirm())

    this.panels.checkpointPlaced = buildCheckpointPlacedPanel(
      () => {
        this.toast(content.simulationRequested)
        this.setState('cms')
      },
      () => this.setState('cms')
    )
  }

  showPanel(name, visible, position, rotationY = 0) {
    const panel = this.panels[name]
    if (!panel) return
    if (visible) {
      if (position) panel.object.position.copy(position)
      panel.object.rotation.set(0, rotationY, 0)
      this.scene.add(panel.object)
    } else {
      panel.object.removeFromParent()
    }
  }

  hideAllPanels() {
    for (const name of Object.keys(this.panels)) this.showPanel(name, false)
  }

  /* ---------------- State Machine ---------------- */

  setState(state) {
    this.state = state
    this.hideAllPanels()
    this.clearTimers()
    this.clearHotspots()
    this.world.clearFire()
    this.releaseGrab()

    const go = (pos, look, dur) => this.controls.goTo(V3(...pos), V3(...look), dur)

    switch (state) {
      case 'start': {
        this.world.machine.visible = false
        this.world.gearField.visible = true
        this.showPanel('start', true, V3(0, 1.75, 1.6))
        go([0, 1.65, 4.6], [0, 1.7, 0], 1.4)
        break
      }

      case 'modules': {
        this.world.gearField.visible = false
        this.world.setMachineMode(this.mode)
        this.showPanel('modules', true, V3(0, 1.85, 1.7))
        go([0, 1.65, 4.4], [0, 1.6, 0], 1.2)
        break
      }

      case 'preChecklist': {
        this.showPanel('preChecklist', true, V3(0, 1.85, 1.7))
        go([0, 1.65, 4.3], [0, 1.7, 0], 0.9)
        break
      }

      case 'checklist': {
        this.showPanel('checklist', true, V3(0, 1.75, 1.8))
        go([0, 1.65, 4.4], [0, 1.65, 0], 0.9)
        break
      }

      case 'simulation': {
        this.world.gearField.visible = false
        this.world.setMachineMode(this.mode)
        this.startSimulation()
        break
      }

      case 'consequence': {
        this.world.igniteFire()
        this.markHotspotResults()
        this.spawnHotspots(false)
        this.showPanel('consequence', true, V3(0.1, 1.85, 1.9))
        go([0.4, 1.7, 4.9], [-0.3, 1.3, 0], 1.2)
        break
      }

      case 'review': {
        this.showPanel('review', true, V3(0, 1.75, 1.9))
        go([0, 1.65, 4.5], [0, 1.6, 0], 1.0)
        break
      }

      case 'cms': {
        this.world.gearField.visible = false
        this.world.setMachineMode(this.mode === 'mini' ? 'mini' : 'space')
        this.showPanel('cms', true, V3(-0.95, 1.75, 1.9), 0.12)
        this.cmsRight = 'cmsChecklist'
        this.showPanel('cmsChecklist', true, V3(1.15, 1.75, 1.75), -0.15)
        go([0, 1.7, 5.6], [0, 1.55, 0], 1.1)
        break
      }

      case 'cmsPlacement': {
        this.showPanel('placement', true, V3(0, 2.05, 1.7))
        this.spawnGrabbableGear()
        go([0, 1.65, 4.6], [0, 1.5, 0], 1.0)
        break
      }

      case 'checkpointPlaced': {
        this.showPanel('checkpointPlaced', true, V3(0, 1.85, 1.8))
        go([0, 1.65, 4.4], [0, 1.7, 0], 0.9)
        break
      }
    }
  }

  /* ---------------- Startscreen ---------------- */

  onStartSelect(key, index) {
    this.selections[key] = index
    if (key === 'space') {
      this.mode = content.start.columns[2].options[index].mode
      this.world.setMachineMode(this.mode)
      this.world.gearField.visible = false
    }
    if (key === 'machine') {
      // Maschine erscheint hinter dem Panel (Trainings Selection)
      this.world.gearField.visible = false
      this.world.setMachineMode(this.mode)
    }
    const done = Object.values(this.selections).every((v) => v !== null)
    if (done) {
      this.setTimer(() => this.setState('modules'), 0.7)
    }
  }

  /* ---------------- Simulation (Check In) ---------------- */

  startSimulation() {
    this.tasks = content.tasks.map((t) => ({ ...t, answered: null }))
    this.checklistViews = content.checkin.checklistViews
    this.panels.checkin.setViewsLeft(this.checklistViews)
    this.panels.notifications.reset()

    const mini = this.mode === 'mini'

    if (mini) {
      this.showPanel('checkin', true, V3(-1.45, 1.95, 2.5), 0.22)
      this.showPanel('timer', true, V3(-2.95, 2.6, 2.2), 0.35)
      this.showPanel('notifications', true, V3(-3.05, 1.65, 2.2), 0.35)
      this.controls.goTo(V3(0.5, 1.75, 5.3), V3(-0.2, 1.0, 1.6), 1.2)
    } else {
      this.showPanel('checkin', true, V3(-2.05, 1.85, 2.15), 0.28)
      this.showPanel('timer', true, V3(-3.6, 2.55, 1.9), 0.4)
      this.showPanel('notifications', true, V3(-3.7, 1.55, 1.9), 0.4)
      this.controls.goTo(V3(-0.2, 1.75, 5.3), V3(-0.9, 1.25, 0.3), 1.2)
    }

    this.spawnHotspots(true)

    // Countdown
    this.remaining = content.checkin.timerSeconds
    this.panels.timer.setSeconds(this.remaining)
    this.setInterval(() => {
      this.remaining -= 1
      this.panels.timer.setSeconds(Math.max(0, this.remaining))
      if (this.remaining <= 0) {
        this.toast(content.timeUp)
        this.evaluate()
      }
    }, 1)

    // Zeitdruck-Nachrichten
    content.notifications.forEach((n, i) => {
      this.setTimer(() => this.panels.notifications.show(i), n.delay)
    })
  }

  spawnHotspots(interactive) {
    this.clearHotspots()
    for (const task of this.tasks.length ? this.tasks : content.tasks) {
      const el = document.createElement('div')
      el.className = 'gear-hotspot'
      el.innerHTML = `${GEAR_SVG}<div class="badge"></div>`
      el.style.pointerEvents = interactive ? 'auto' : 'none'
      const sprite = new CSS3DSprite(el)
      sprite.scale.setScalar(0.0022)
      sprite.position.copy(HOTSPOT_POSITIONS[task.id])
      sprite.userData.task = task
      if (interactive) {
        el.addEventListener('click', () => this.openTask(sprite))
      }
      this.world.machine.add(sprite)
      this.hotspots.push(sprite)
    }
  }

  clearHotspots() {
    for (const h of this.hotspots) h.removeFromParent()
    this.hotspots = []
    this.showPanel('task', false)
    this.activeTask = null
  }

  openTask(sprite) {
    // Vorherigen aktiven Punkt zurücksetzen
    for (const h of this.hotspots) h.element.classList.remove('active')
    sprite.element.classList.add('active')
    this.activeTask = sprite.userData.task
    this.panels.task.setTask(this.activeTask)

    // Fragepanel neben dem Interaktionspunkt platzieren (Weltkoordinaten)
    const worldPos = sprite.getWorldPosition(new THREE.Vector3())
    const pos = worldPos.clone()
    pos.y -= 0.35 * U
    pos.z += 0.55 * U
    this.showPanel('task', true, pos, 0.1)
  }

  onTaskAnswer(option) {
    if (!this.activeTask) return
    this.activeTask.answered = option
    this.setTimer(() => {
      this.showPanel('task', false)
      for (const h of this.hotspots) h.element.classList.remove('active')
      this.activeTask = null
    }, 0.45)
  }

  showMiniChecklist() {
    if (this.checklistViews <= 0) return
    this.checklistViews -= 1
    this.panels.checkin.setViewsLeft(this.checklistViews)

    const pos = this.mode === 'mini' ? V3(-1.9, 1.7, 2.7) : V3(-3.35, 1.8, 2.25)
    this.showPanel('miniChecklist', true, pos, 0.42)

    let left = content.checkin.checklistViewSeconds
    this.panels.miniChecklist.setCountdown(left)
    const id = setInterval(() => {
      left -= 1
      this.panels.miniChecklist.setCountdown(Math.max(0, left))
      if (left <= 0) {
        clearInterval(id)
        this.showPanel('miniChecklist', false)
      }
    }, 1000)
    this.timers.push(id)
  }

  evaluate() {
    this.clearTimers()
    const total = this.tasks.length
    const skipped = this.tasks.filter((t) => t.answered !== t.correct).length
    this.lastSkipped = skipped

    if (skipped === 0) {
      this.toast(content.allCorrect)
      this.setState('review')
    } else {
      this.panels.consequence.setSkipped(skipped, total)
      this.setState('consequence')
    }
  }

  markHotspotResults() {
    // Wird nach spawnHotspots(false) im Konsequenz-State aufgerufen —
    // Badges direkt beim Spawnen setzen:
    this.pendingBadges = true
  }

  /* ---------------- CMS ---------------- */

  swapCmsRight(name) {
    this.showPanel(this.cmsRight, false)
    this.cmsRight = name
    this.showPanel(name, true, V3(1.15, 1.75, 1.75), -0.15)
  }

  /* ---------------- Spatial Task greifen & platzieren ---------------- */

  spawnGrabbableGear() {
    const el = document.createElement('div')
    el.className = 'gear-hotspot'
    el.innerHTML = GEAR_SVG
    const sprite = new CSS3DSprite(el)
    sprite.scale.setScalar(1.2)
    sprite.position.copy(V3(0, 1.15, 2.9))
    el.addEventListener('click', (e) => {
      e.stopPropagation()
      this.grabbed = sprite
      this.grabGuard = true
      setTimeout(() => (this.grabGuard = false), 150)
      el.classList.add('grabbed')
    })
    this.scene.add(sprite)
    this.placedGear = sprite
  }

  setupPlacementEvents() {
    window.addEventListener('pointermove', (e) => {
      if (!this.grabbed) return
      this.pointer.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      )
      this.raycaster.setFromCamera(this.pointer, this.camera)
      const hits = this.raycaster.intersectObject(this.world.machine, true)
      if (hits.length) {
        const hit = hits[0]
        const normal = hit.face
          ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld)
          : new THREE.Vector3(0, 0, 1)
        this.grabbed.position.copy(hit.point).addScaledVector(normal, 0.12 * U)
      } else {
        // Frei vor der Kamera schweben lassen
        const dir = this.raycaster.ray.direction.clone()
        this.grabbed.position.copy(this.camera.position).addScaledVector(dir, 2.2 * U)
      }
    })

    // Ablegen: sowohl click als auch pointerdown abfangen (robust für Maus & Touch)
    const drop = (e) => {
      if (!this.grabbed || this.grabGuard) return
      if (e.target.closest('.panel')) return
      this.grabbed.element.classList.remove('grabbed')
      this.grabbed = null
    }
    window.addEventListener('click', drop)
    window.addEventListener('pointerdown', drop)
  }

  releaseGrab() {
    this.grabbed = null
    if (this.placedGear && this.state !== 'cmsPlacement') {
      this.placedGear.removeFromParent()
      this.placedGear = null
    }
  }

  onPlacementConfirm() {
    if (this.grabbed) return // erst ablegen
    this.setState('checkpointPlaced')
  }

  /* ---------------- Timer Helpers ---------------- */

  setTimer(fn, seconds) {
    this.timers.push(setTimeout(fn, seconds * 1000))
  }

  setInterval(fn, seconds) {
    this.timers.push(setInterval(fn, seconds * 1000))
  }

  clearTimers() {
    for (const t of this.timers) {
      clearTimeout(t)
      clearInterval(t)
    }
    this.timers = []
  }

  update() {
    // Badges für Konsequenz-State setzen, sobald Hotspots existieren
    if (this.pendingBadges && this.hotspots.length) {
      for (const h of this.hotspots) {
        const t = h.userData.task
        const ok = t.answered === t.correct
        h.element.classList.add(ok ? 'ok' : 'bad')
        h.element.querySelector('.badge').textContent = ok ? '✓' : '✕'
      }
      this.pendingBadges = false
    }
  }
}
