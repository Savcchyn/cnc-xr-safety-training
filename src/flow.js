import * as THREE from 'three'
import { CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { content } from './content.js'
import { GEAR_SVG } from './world.js'
import { playNotifSound } from './audio.js'
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

// Diese Panels billboarden im Modul: ihre Z-Achse (Front) folgt dem User,
// sie bleiben dabei aufrecht (Rotation nur um die Hochachse)
const BILLBOARD_PANELS = ['checkin', 'timer', 'notifications', 'miniChecklist']

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

    // Miniatur-Modell: greifen, positionieren, skalieren, drehen
    this.mini = { grabbed: false, lift: 0.06 * U, keys: new Set() }
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    this.hintMini = document.getElementById('hint-mini')

    this.buildPanels()
    this.setupPlacementEvents()
    this.setupMiniInteraction()
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

    this.panels.modules = buildModulePanel(
      () => this.setState('preChecklist'),
      () => this.setState('start')
    )

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
    if (this.mini.grabbed) this.dropMini()

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
        if (this.mode === 'mini') {
          go([0, 1.75, 4.7], [0, 0.75, 1.5], 1.2)
        } else {
          go([0, 1.65, 4.4], [0, 1.6, 0], 1.2)
        }
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
      this.showPanel('checkin', true, V3(-1.35, 1.95, 2.55), 0.2)
      this.showPanel('timer', true, V3(-2.85, 2.62, 2.35), 0.42)
      this.showPanel('notifications', true, V3(-2.95, 1.62, 2.35), 0.42)
      this.controls.goTo(V3(0.3, 1.75, 5.5), V3(-0.3, 0.95, 1.6), 1.2)
    } else {
      this.showPanel('checkin', true, V3(-1.55, 1.85, 2.1), 0.22)
      this.showPanel('timer', true, V3(-3.0, 2.58, 2.0), 0.42)
      this.showPanel('notifications', true, V3(-3.1, 1.58, 2.0), 0.42)
      this.controls.goTo(V3(-0.5, 1.75, 5.6), V3(-1.1, 1.3, 0.2), 1.2)
    }

    this.spawnHotspots(true)

    // Timer zählt vorwärts ab 00:00 — dokumentiert die Trainingszeit,
    // es läuft keine Zeit ab.
    this.elapsed = 0
    this.panels.timer.setSeconds(0)
    this.setInterval(() => {
      this.elapsed += 1
      this.panels.timer.setSeconds(this.elapsed)
    }, 1)

    // Zeitdruck-Nachrichten: ab Sekunde 10 im 10-Sekunden-Abstand,
    // jeweils mit UI-Sound
    content.notifications.forEach((n, i) => {
      this.setTimer(() => {
        this.panels.notifications.show(i)
        playNotifSound()
      }, n.delay)
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

  /* ---------------- Miniatur-Modell: greifen & manipulieren ----------------
   * Klicken = greifen/ablegen · Zeigerbewegung = auf dem Boden positionieren
   * Scrollen = skalieren · Q/E = um die Hochachse (Z-Achse) drehen           */

  setupMiniInteraction() {
    let downPos = null

    window.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.panel') || e.target.closest('.gear-hotspot')) return
      downPos = { x: e.clientX, y: e.clientY }
    })

    window.addEventListener('pointerup', (e) => {
      if (!downPos) return
      const moved = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y)
      downPos = null
      if (moved > 6) return
      this.onMiniClick(e)
    })

    window.addEventListener('pointermove', (e) => {
      if (!this.mini.grabbed) return
      this.setPointer(e)
      this.raycaster.setFromCamera(this.pointer, this.camera)
      const hit = new THREE.Vector3()
      if (this.raycaster.ray.intersectPlane(this.groundPlane, hit)) {
        const m = this.world.machine
        m.position.x = THREE.MathUtils.clamp(hit.x, -6 * U, 6 * U)
        m.position.z = THREE.MathUtils.clamp(hit.z, -1.5 * U, 6.5 * U)
        m.position.y = this.mini.lift
      }
    })

    window.addEventListener(
      'wheel',
      (e) => {
        if (!this.mini.grabbed) return
        e.preventDefault()
        const m = this.world.machine
        const factor = Math.exp(-e.deltaY * 0.0012)
        const s = THREE.MathUtils.clamp(m.scale.x * factor, 0.06 * U, 0.7 * U)
        m.scale.setScalar(s)
      },
      { passive: false }
    )

    window.addEventListener('keydown', (e) => {
      if (e.target.isContentEditable) return
      const k = e.key.toLowerCase()
      if (k === 'q' || k === 'e') this.mini.keys.add(k)
    })
    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase()
      this.mini.keys.delete(k)
    })
  }

  setPointer(e) {
    this.pointer.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    )
  }

  onMiniClick(e) {
    if (this.mode !== 'mini') return
    if (this.state === 'cmsPlacement' || this.grabbed) return
    if (!this.world.machine.visible) return

    if (this.mini.grabbed) {
      this.dropMini()
      return
    }

    this.setPointer(e)
    this.raycaster.setFromCamera(this.pointer, this.camera)
    if (this.raycaster.intersectObject(this.world.machine, true).length) {
      this.grabMini()
    }
  }

  grabMini() {
    this.mini.grabbed = true
    this.world.miniTransformed = true
    this.world.machine.position.y = this.mini.lift
    this.controls.lookEnabled = false
    this.controls.wheelEnabled = false
    document.body.classList.add('mini-grabbed')
  }

  dropMini() {
    this.mini.grabbed = false
    this.world.machine.position.y = 0
    this.controls.lookEnabled = true
    this.controls.wheelEnabled = true
    document.body.classList.remove('mini-grabbed')
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

  update(dt = 0.016) {
    // Billboarding: UI-Panels im Modul weich zum User ausrichten
    const k = Math.min(1, 8 * dt)
    for (const name of BILLBOARD_PANELS) {
      const panel = this.panels[name]
      if (!panel || !panel.object.parent) continue
      const o = panel.object
      const dx = this.camera.position.x - o.position.x
      const dz = this.camera.position.z - o.position.z
      const target = Math.atan2(dx, dz)
      let delta = target - o.rotation.y
      delta = ((((delta + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI
      o.rotation.y += delta * k
    }

    // Miniatur drehen (Q/E) während sie gegriffen ist
    if (this.mini.grabbed && this.mini.keys.size) {
      const dir = (this.mini.keys.has('q') ? 1 : 0) - (this.mini.keys.has('e') ? 1 : 0)
      this.world.machine.rotation.y += dir * 1.8 * dt
    }

    // Hinweis-Balken für die Miniatur-Steuerung
    if (this.hintMini) {
      const show =
        this.mode === 'mini' &&
        this.world.machine.visible &&
        this.state !== 'cmsPlacement' &&
        this.state !== 'start'
      this.hintMini.classList.toggle('visible', show)
    }

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
