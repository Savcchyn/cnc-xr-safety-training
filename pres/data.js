// Inhalte der Präsentations-App. USP-Farbzuordnung entsprechend Slide 03.3:
// experience = Gelb, zielgruppe = Magenta, skalierbarkeit = Grün.

export const USPS = [
  { key: 'experience', label: 'Experience', color: 'var(--usp-yellow)' },
  { key: 'zielgruppe', label: 'Zielgruppe', color: 'var(--usp-magenta)' },
  { key: 'skalierbarkeit', label: 'Skalierbarkeit', color: 'var(--usp-green)' },
]

export const FEATURES = [
  {
    row: 1,
    items: [
      {
        key: 'onboarding',
        label: 'Onboarding',
        usp: 'zielgruppe',
        thumb: 'onboarding',
        text: 'Anfänger sehen zu, wie die virtuelle Hand alle Arbeitsschritte korrekt ausführt — Schritt für Schritt, mit Erklär-Panels und eigener Navigation. Die Checkliste bleibt dabei immer sichtbar.',
      },
      {
        key: 'konsequenz',
        label: 'Konsequenz Simulation',
        usp: 'experience',
        thumb: 'konsequenz',
        text: 'Übersprungene Schritte haben Folgen: Brand, Leckage oder berstendes Werkstück — zufällig gewählt, mit Sound. Die Konsequenz eines vergessenen Handgriffs wird real erlebbar statt abstrakt erklärt.',
      },
      {
        key: 'zeitdruck',
        label: 'Zeitdruck Notifications',
        usp: 'experience',
        thumb: 'zeitdruck',
        text: 'Schichtleiter, wartende Kollegen, Feierabend: Push-Nachrichten erzeugen den echten Alltagsdruck, unter dem Routinen brechen — und machen Betriebsblindheit sichtbar.',
      },
    ],
  },
  {
    row: 2,
    items: [
      {
        key: 'checklisten',
        label: 'Checklisten Module',
        usp: 'skalierbarkeit',
        wide: true,
        thumb: 'checklisten',
        text: 'Sechs Routinen-Module pro Maschine — von „Vor Arbeitsbeginn" bis „Nach Arbeitsende". Jede Maschine bringt ihre eigenen Checklisten mit, gepflegt über das CMS.',
      },
    ],
  },
  {
    row: 3,
    items: [
      {
        key: 'training',
        label: 'Trainings­simulationen',
        usp: 'experience',
        thumb: 'training',
        text: 'Im Check-In-Modus findet der User Interaktionspunkte an der echten Maschine und entscheidet, was zu tun ist. Ein Timer dokumentiert die Trainingszeit — ohne Prüfungsdruck.',
      },
      {
        key: 'spatial',
        label: 'Spatial Modes',
        usp: 'experience',
        thumb: 'spatial',
        text: 'Drei Raum-Modi passen das Training jeder Umgebung an: Mixed Reality an der Live-Maschine, VR-Umgebungssimulation mit Platz — oder das greifbare Miniaturmodell für kleine Räume.',
      },
      {
        key: 'quiz',
        label: 'Quiz',
        usp: 'experience',
        thumb: 'quiz',
        text: 'An jedem Task Point stellt die Maschine eine Entscheidungsfrage. Antworten werden von der virtuellen Hand ausgeführt — richtig wie falsch, die Auswertung kommt im Review.',
      },
      {
        key: 'lernkarten',
        label: 'AR Lernkarten und Poster',
        usp: 'experience',
        thumb: 'mini',
        text: 'Gedruckte Lernkarten und Poster werden per Smartphone gescannt und holen das Miniaturmodell samt Quiz in den Pausenraum — Training wandert in den Alltag.',
      },
    ],
  },
  {
    row: 4,
    items: [
      {
        key: 'level',
        label: 'Anfänger — Experte',
        usp: 'zielgruppe',
        wide: true,
        split: ['Anfänger', 'Experte'],
        thumb: 'review',
        text: 'Vom geführten Onboarding bis zum Experten-Check-In unter Zeitdruck: Der Erfahrungsstand bestimmt Führung, Tempo und Tiefe. Das Routinen-Profil zeigt, wo die eigene Routine unter Druck nachgibt.',
      },
    ],
  },
  {
    row: 5,
    items: [
      {
        key: 'plattform',
        label: 'VR/MR Trainingsplattform',
        usp: 'skalierbarkeit',
        thumb: 'module',
        text: 'Eine Plattform, drei Maschinen, sechs Module — vom Headset bis zum Browser-Prototyp. Neue Maschinen docken mit eigenen 3D-Modellen und Task Points an.',
      },
      {
        key: 'arapp',
        label: 'AR App',
        usp: 'skalierbarkeit',
        thumb: 'mini',
        text: 'Die mobile Verlängerung des Trainings: Lernkarten scannen, Miniaturmodell platzieren, Quiz spielen — ohne Headset, überall.',
      },
      {
        key: 'cms',
        label: 'CMS System',
        usp: 'skalierbarkeit',
        thumb: 'cms',
        text: 'Maschinen, Gruppen, Module, Checkpoints, Spatial Tasks und Zeitdruck-Nachrichten — alles im Spatial-CMS editierbar. Ein System, das mit den Erfahrungen mitwächst.',
      },
    ],
  },
]

export const USERFLOW = [
  {
    key: 'start',
    title: 'Startscreen',
    thumb: 'start',
    text: 'Drei Entscheidungen, ein Einstieg: Maschine, Erfahrungsstand und Raum-Modus. Der warme Glow und die schwebenden Zahnräder setzen den Ton des Trainings.',
  },
  {
    key: 'module',
    title: 'Modul Selection',
    thumb: 'module',
    text: 'Sechs Routinen-Module der gewählten Maschine — der User startet dort, wo seine Routine trainiert werden soll.',
  },
  {
    key: 'precheck',
    title: 'PreChecklist View',
    thumb: 'precheck',
    text: 'Letzter Blick in die Checkliste? Im Training bleibt sie bewusst knapp: dreimal einblendbar, je zehn Sekunden.',
  },
  {
    key: 'checklisten',
    title: 'Checklist View',
    thumb: 'checklisten',
    text: 'Die Routinen-Checkliste des Moduls — maschinenspezifisch, mit hervorgehobenen Sicherheits-Keywords.',
  },
  {
    key: 'training',
    title: 'Space Simulation Mode',
    thumb: 'training',
    text: 'Check In: Interaktionspunkte an der Maschine finden, Timer läuft mit, die UI billboardet zum User — raumverankert wie in ShapesXR entworfen.',
  },
  {
    key: 'quiz',
    title: 'Task Simulation',
    thumb: 'quiz',
    text: '„Was gibt es hier zu tun?" — Entscheidung treffen, die virtuelle Hand führt sie aus, der Task Point färbt sich.',
  },
  {
    key: 'zeitdruck',
    title: 'Zeitdruck',
    thumb: 'zeitdruck',
    text: 'Ab Sekunde zehn poppen die Nachrichten auf: Endmontage wartet, der Kollege drängelt, gleich fährt die Bahn.',
  },
  {
    key: 'konsequenz',
    title: 'Konsequenz Simulation',
    thumb: 'konsequenz',
    text: 'Übersprungene Schritte werden ausgewertet — und eine mögliche Folge wird simuliert: Feuer, Wasser oder Splitterflug.',
  },
  {
    key: 'review',
    title: 'Modul Review',
    thumb: 'review',
    text: 'Kein Test, kein Ergebnis: das Routinen-Profil. Fehler lassen sich an den Task Points erklären und von der Hand korrekt vorführen.',
  },
  {
    key: 'mini',
    title: 'Small Space Mode',
    thumb: 'mini',
    text: 'Das Miniaturmodell: greifen, positionieren, skalieren, drehen — dasselbe Training auf der Tischplatte.',
  },
  {
    key: 'cms',
    title: 'Trainings-CMS',
    thumb: 'cms',
    text: 'Content Dashboard im Raum: Checklisten pflegen, Checkpoints mit Spatial Tasks verknüpfen, Zeitdruck-Nachrichten schreiben.',
  },
]

export const WORKFLOW = [
  {
    n: 1,
    title: 'Briefing',
    text: 'Auftrag und Zielgruppen verstehen, USPs schärfen: Experience, Zielgruppe, Skalierbarkeit.',
  },
  {
    n: 2,
    title: 'Spatial Draft',
    text: 'Userflow und Spatial UI direkt im Raum entworfen — in ShapesXR, am echten Maßstab.',
  },
  {
    n: 3,
    title: 'UI-Design',
    text: 'Neumorphism-Designsystem: Panels, Buttons, Interaktionspunkte und Farbwelt.',
  },
  {
    n: 4,
    title: 'Build',
    text: 'Web-3D-Prototyp mit Three.js und CSS3D Spatial UI — gebaut im Dialog mit Claude Code.',
  },
  {
    n: 5,
    title: 'Deploy & Iteration',
    text: 'GitHub → Vercel: jede Iteration sofort live testbar, Feedback fließt direkt zurück.',
  },
]

export const SHAPESXR_URL =
  'https://shapes.app/space/view/cee35e42-05ba-4de7-a030-b9c90b744387/9z736r53'
