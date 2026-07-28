// Inhalte der Präsentations-App — Texte aus praesentation_texte_final.md.

export const USPS = [
  {
    key: 'konsequenz',
    label: 'Konsequenz statt Korrektur',
    color: 'var(--usp-yellow)',
    text: 'Wird ein Checklisten-Schritt übersprungen, sagt das System nichts. Erst am Modulende zeigt die Konsequenz-Simulation, was der Fehler an der echten Maschine bedeutet hätte. Lernen durch Erfahren — nicht durch Fehlermeldung.',
  },
  {
    key: 'zeitdruck',
    label: 'Zeitdruck-Modus',
    color: 'var(--usp-magenta)',
    text: 'Mitten im Modul erscheint unangekündigt eine Nachricht: „Teil 47 muss in 5 Minuten in die Endmontage." Der Nutzer spürt selbst, wie der Impuls entsteht, Schritte zu überspringen — die häufigste reale Unfallursache, erstmals trainierbar gemacht.',
  },
  {
    key: 'framework',
    label: 'Skalierbares Framework',
    color: 'var(--usp-green)',
    text: 'Drei Spatial Modes für jede Raumsituation, Checklisten pro Maschine und Erfahrungsstufe, ein Content Dashboard, mit dem Betriebe eigene Checkpoints, Konsequenzen und Zeitdruck-Nachrichten pflegen. Kein Einzeltraining — eine Plattform, die mit dem Betrieb wächst.',
  },
]

export const PRODUKT_INTRO =
  'Ein XR-Training, das die Sicherheitscheckliste des Betriebs in erlebbare Quest-Module übersetzt — und Fehler nicht korrigiert, sondern ihre Konsequenz spürbar macht. Klicke einen Baustein für Screenshot und Beschreibung aus dem Prototyp — oder filtere nach den drei USPs.'

export const FEATURES = [
  {
    row: 1,
    items: [
      {
        key: 'onboarding',
        label: 'Onboarding',
        usp: 'framework',
        thumb: 'onboarding',
        text: 'Anfänger sehen zu, wie die virtuelle Hand alle Arbeitsschritte korrekt ausführt — Schritt für Schritt, mit Erklär-Panels und eigener Navigation. Gesten üben, Maschine kennenlernen, gefahrlos trainieren.',
      },
      {
        key: 'konsequenzsim',
        label: 'Konsequenz Simulation',
        usp: 'konsequenz',
        thumb: 'konsequenz',
        text: '„3 von 5 Schritten übersprungen." Dann brennt die Maschine. Die Simulation zeigt eine mögliche Folge der realen Auslassungen — keine Strafe, sondern die Wahrheit der Maschine. Danach: Modul wiederholen.',
      },
      {
        key: 'zeitdrucknotif',
        label: 'Zeitdruck Notifications',
        usp: 'zeitdruck',
        thumb: 'zeitdruck',
        text: 'Schichtleiter, wartende Kollegen, Feierabend — die Nachrichten erzeugen glaubwürdigen betrieblichen Druck mit laufendem Timer. Im Debrief zeigt das System, welche Schritte unter Druck geopfert wurden.',
      },
    ],
  },
  {
    row: 2,
    items: [
      {
        key: 'checklisten',
        label: 'Checklisten Module',
        usp: 'framework',
        wide: true,
        thumb: 'checklisten',
        text: 'Sechs Module entlang der echten Sicherheitscheckliste — von „Vor Arbeitsbeginn" bis „Nach Arbeitsende". Die Checkliste ist einsehbar, aber sie bleibt nicht stehen: drei Check-ins pro Training, dann muss die Routine aus dem Gedächtnis kommen. Erinnern prägt ein. Abhaken nicht.',
      },
    ],
  },
  {
    row: 3,
    items: [
      {
        key: 'training',
        label: 'Trainings­simulationen',
        usp: 'konsequenz',
        thumb: 'training',
        text: 'Im Modul findet der Nutzer Interaktionspunkte an der Maschine und entscheidet selbst, was zu tun ist. Keine Führung, keine Nummerierung — genau wie am echten Arbeitsplatz zählt der eigene Blick.',
      },
      {
        key: 'spatial',
        label: 'Spatial Modes',
        usp: 'framework',
        thumb: 'spatial',
        text: 'Drei Raum-Modi passen das Training jeder Umgebung an: Mixed Reality an der Live-Maschine, VR-Umgebungssimulation mit Platz — oder das greifbare Miniaturmodell für kleine Räume.',
      },
      {
        key: 'quiz',
        label: 'Quiz',
        usp: 'konsequenz',
        thumb: 'quiz',
        text: 'Jeder Interaktionspunkt stellt eine echte Entscheidung: Was gibt es hier zu tun? Die falsche Option sieht oft harmlos aus — wie in der Realität. Das System bewertet nicht sofort. Es merkt sich.',
      },
      {
        key: 'lernkarten',
        label: 'AR Lernkarten und Poster',
        usp: 'framework',
        thumb: 'mini',
        text: 'Karte scannen — das Miniaturmodell erscheint auf dem Tisch, das Quiz testet gezielt die Punkte, die im Routinen-Profil als Schwachstellen erkannt wurden. Training wandert in den Arbeitsalltag.',
      },
    ],
  },
  {
    row: 4,
    items: [
      {
        key: 'level',
        label: 'Anfänger — Experte',
        usp: 'framework',
        wide: true,
        split: ['Anfänger', 'Experte'],
        thumb: 'review',
        text: 'Drei Entscheidungen, ein Einstieg: Maschine, Erfahrungsstufe, Spatial Mode. Anfänger erhalten ein geführtes Onboarding, Erfahrene springen direkt ins Training. Das System passt Umfang und Unterstützung automatisch an — und das Routinen-Profil zeigt am Ende, wo die Routine unter Druck bricht.',
      },
    ],
  },
  {
    row: 5,
    items: [
      {
        key: 'plattform',
        label: 'VR/MR Trainingsplattform',
        usp: 'framework',
        thumb: 'module',
        text: 'Eine Plattform, drei Maschinen, sechs Module — vom Headset bis zum Browser-Prototyp. Neue Maschinen docken mit eigenen 3D-Modellen und Task Points an.',
      },
      {
        key: 'arapp',
        label: 'AR App',
        usp: 'framework',
        thumb: 'mini',
        text: 'Die mobile Verlängerung des Trainings: Lernkarten scannen, Miniaturmodell platzieren, Quiz spielen — ohne Headset, ohne Installation, direkt im Pausenraum.',
      },
      {
        key: 'cms',
        label: 'CMS System',
        usp: 'framework',
        thumb: 'cms',
        text: 'Der Autoren-Layer für den Betrieb: Maschinen anlegen, Checklisten pflegen, Checkpoints mit Spatial Tasks verknüpfen, Zeitdruck-Nachrichten bearbeiten und Konsequenz-Simulationen anfragen. Das Training bleibt aktuell — weil der Betrieb es selbst weiterschreibt.',
      },
    ],
  },
]

export const USERFLOW_INTRO =
  'Ein System, zwei Einstiege: Neue Benutzer durchlaufen ein geführtes Onboarding — Gesten üben, Maschine kennenlernen, gefahrlos trainieren. Erfahrene starten direkt. Danach führt derselbe Weg durch die Quest-Module: Aufgabe, Entscheidung, Auswertung — und bei übersprungenen Schritten die Konsequenz, bevor es weitergeht.'

// col/row = Position im Gesamtdiagramm (7 Spalten, 3 Reihen)
export const USERFLOW = [
  {
    key: 'start',
    title: 'Startscreen',
    thumb: 'start',
    col: 1,
    row: 1,
    text: 'Drei Entscheidungen, ein Einstieg: Maschine, Erfahrungsstand und Raum-Modus. Der warme Glow und die schwebenden Zahnräder setzen den Ton des Trainings.',
  },
  {
    key: 'module',
    title: 'Modul Selection',
    thumb: 'module',
    col: 2,
    row: 1,
    text: 'Sechs Routinen-Module der gewählten Maschine — der User startet dort, wo seine Routine trainiert werden soll.',
  },
  {
    key: 'precheck',
    title: 'PreChecklist View',
    thumb: 'precheck',
    col: 3,
    row: 1,
    text: 'Letzter Blick in die Checkliste? Im Training bleibt sie bewusst knapp: dreimal einblendbar, je zehn Sekunden.',
  },
  {
    key: 'training',
    title: 'Space Simulation Mode',
    thumb: 'training',
    col: 4,
    row: 1,
    text: 'Check In: Interaktionspunkte an der Maschine finden, Timer läuft mit, die UI billboardet zum User — raumverankert wie in ShapesXR entworfen.',
  },
  {
    key: 'quiz',
    title: 'Task Simulation',
    thumb: 'quiz',
    col: 5,
    row: 1,
    text: '„Was gibt es hier zu tun?" — Entscheidung treffen, die virtuelle Hand führt sie aus, der Task Point färbt sich.',
  },
  {
    key: 'konsequenz',
    title: 'Konsequenz Simulation',
    thumb: 'konsequenz',
    col: 6,
    row: 1,
    text: 'Übersprungene Schritte werden ausgewertet — und eine mögliche Folge wird simuliert: Feuer, Wasser oder Splitterflug.',
  },
  {
    key: 'review',
    title: 'Modul Review',
    thumb: 'review',
    col: 7,
    row: 1,
    text: 'Kein Test, kein Ergebnis: das Routinen-Profil. Fehler lassen sich an den Task Points erklären und von der Hand korrekt vorführen.',
  },
  {
    key: 'mini',
    title: 'Small Space Mode',
    thumb: 'mini',
    col: 2,
    row: 2,
    text: 'Das Miniaturmodell: greifen, positionieren, skalieren, drehen — dasselbe Training auf der Tischplatte.',
  },
  {
    key: 'checklisten',
    title: 'Checklist View',
    thumb: 'checklisten',
    col: 4,
    row: 2,
    text: 'Die Routinen-Checkliste des Moduls — maschinenspezifisch, mit hervorgehobenen Sicherheits-Keywords.',
  },
  {
    key: 'zeitdruck',
    title: 'Zeitdruck',
    thumb: 'zeitdruck',
    col: 5,
    row: 2,
    text: 'Ab Sekunde zehn poppen die Nachrichten auf: Endmontage wartet, der Kollege drängelt, gleich fährt die Bahn.',
  },
  {
    key: 'cms',
    title: 'Trainings-CMS',
    thumb: 'cms',
    col: 1,
    row: 3,
    text: 'Content Dashboard im Raum: Checklisten pflegen, Checkpoints mit Spatial Tasks verknüpfen, Zeitdruck-Nachrichten schreiben.',
  },
]

export const WORKFLOW_INTRO =
  'Von der Aufgabe zur Experience in sieben Schritten — so bin ich als XR-Designerin und Entwicklerin an die Probeaufgabe herangegangen.'

export const WORKFLOW = [
  {
    n: 1,
    title: 'ReBriefing',
    text: 'Die Aufgabe hinterfragt: Nicht „wie machen wir ein Training besonders?", sondern „warum scheitern Sicherheitstrainings überhaupt?"',
  },
  {
    n: 2,
    title: 'Research',
    text: 'Reale Gefährdungen, echte Checklisten, Unfallursachen: Der Befund — Routine und Zeitdruck schlagen Unwissen. Erfahrene sind oft gefährdeter als Anfänger.',
  },
  {
    n: 3,
    title: 'Ideation',
    text: 'Mehrere Ansätze durchgespielt, ein Schwerpunkt gewählt: die Checkliste selbst zum Erlebnis machen, Fehler durch Konsequenz statt Korrektur vermitteln.',
  },
  {
    n: 4,
    title: 'Concept',
    text: 'Aus der Idee ein System: Quest-Module, Konsequenz-Mechanik, Zeitdruck-Modus, drei Spatial Modes, Onboarding für Anfänger, Autoren-Layer für den Betrieb.',
  },
  {
    n: 5,
    title: 'Design',
    text: 'Jede Entscheidung folgt der Kernidee: Hand Tracking, weil das Training von Händen handelt. Eine Checkliste, die verschwindet. Sound als Sicherheitsinformation.',
  },
  {
    n: 6,
    title: 'Prototyping',
    text: 'Früh und räumlich gebaut: ShapesXR für die Spatial-Logik, ein begehbarer Web-3D-Prototyp für Ablauf, Interaktion und Konsequenz — entwickelt mit Creative Vibe Coding.',
  },
  {
    n: 7,
    title: 'Presentation',
    text: 'Eine Idee ist so stark wie ihre Vermittlung. Diese Präsentation ist der letzte Schritt des Prozesses — und der Beweis, dass er funktioniert.',
  },
]

export const SHAPESXR_URL =
  'https://shapes.app/space/view/cee35e42-05ba-4de7-a030-b9c90b744387/9z736r53'
