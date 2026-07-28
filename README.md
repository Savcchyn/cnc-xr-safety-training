# CNC Fräsen Sicherheitstraining — XR Prototyp

Web-Prototyp einer Mixed-Reality-Anwendung für Sicherheitstraining an CNC-Holzfräsen.
Der Prototyp bildet den kompletten Userflow der XR-Anwendung (ShapesXR-Design) als
begehbare 3D-Szene im Browser ab: First-Person-Navigation, spatiale UI-Panels,
Interaktionspunkte an der Maschine, Zeitdruck-Simulation und Content-CMS.

## Steuerung

| Eingabe | Aktion |
| --- | --- |
| Maus ziehen | Umschauen |
| `W` `A` `S` `D` | Bewegen |
| Scrollen | Zoomen (Dolly) |
| Klicken | UI bedienen, Interaktionspunkte öffnen, Spatial Tasks greifen/ablegen |

## Flow

1. **Startscreen** — Auswahl von Maschine, Erfahrungsstand und Raum-Modus
   (Live Trainings Umgebung / Umgebungssimulation / Miniatur Modell)
2. **Modul-Auswahl** — 6 Checklisten-Module der Routinen Checkliste
3. **PreChecklist** — optionaler letzter Blick in die Checkliste (Modul 2 „Rüsten")
4. **Space Simulation (Check In)** — Timer, Interaktionspunkte (Gears) an der
   Maschine, „Was gibt es hier zu tun?"-Entscheidungen, Zeitdruck-Nachrichten
   (Schichtleiter, Kollege, Feierabend), Checkliste 3× einblendbar
5. **Konsequenz-Simulation** — übersprungene Schritte führen zu einer möglichen
   Folge (Feuer), inkl. Auswertung pro Interaktionspunkt
6. **Modul Review** — „Dein Routinen Profil"
7. **Content Dashboard (CMS)** — Checklisten-Module verwalten, Checkpoints
   bearbeiten, Spatial Tasks greifen und am Modell platzieren,
   Zeitdruck-Nachrichten bearbeiten

## Tech-Stack

- [Three.js](https://threejs.org/) — WebGL-Szene, First-Person-Controls, Raycasting
- CSS3DRenderer — UI-Panels als echtes HTML/CSS im 3D-Raum
- [Vite](https://vitejs.dev/) — Dev-Server & Build
- 3D-Modelle: `public/models/` (GLB) — CNC-Holzfräse + Control Panel

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Produktions-Build nach dist/
```

## Projektstruktur

```
src/
  main.js      # Bootstrap: Renderer (WebGL + CSS3D), Loop
  world.js     # Szene, Licht, GLB-Modelle, Feuer, Gear-Partikel
  controls.js  # First-Person-Steuerung + Kamerafahrten
  panels.js    # Alle spatialen UI-Panels (HTML/CSS)
  flow.js      # State Machine des gesamten Userflows
  content.js   # Alle Texte (1:1 aus den ShapesXR-Screenshots)
  style.css    # Panel-Styling (dunkles UI, Orange-Akzente)
```
