// Inhalte der Präsentations-App — Texte aus praesentation_texte_final.md.

export const USPS = [
  {
    key: 'experience',
    label: 'Experience',
    color: 'var(--usp-yellow)',
    text: 'Konsequenz statt Korrektur: Wird ein Checklisten-Schritt übersprungen, sagt das System nichts. Erst am Modulende zeigt die Konsequenz-Simulation, was der Fehler an der echten Maschine bedeutet hätte — und der Zeitdruck-Modus macht den Impuls zum Überspringen selbst spürbar.',
  },
  {
    key: 'zielgruppe',
    label: 'Zielgruppe',
    color: 'var(--usp-magenta)',
    text: 'Vom Anfänger bis zum Experten: Neue Benutzer erhalten ein geführtes Onboarding, Erfahrene springen direkt ins Training. Umfang und Unterstützung passen sich der Erfahrungsstufe an — das Routinen-Profil zeigt jedem sein eigenes Muster.',
  },
  {
    key: 'framework',
    label: 'Skalierbarkeit',
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
        usp: 'zielgruppe',
        thumb: 'onboarding',
        text: 'Anfänger sehen zu, wie die virtuelle Hand alle Arbeitsschritte korrekt ausführt — Schritt für Schritt, mit Erklär-Panels und eigener Navigation. Gesten üben, Maschine kennenlernen, gefahrlos trainieren.',
      },
      {
        key: 'konsequenzsim',
        label: 'Konsequenz Simulation',
        usp: 'experience',
        thumb: 'konsequenz',
        text: '„3 von 5 Schritten übersprungen." Dann brennt die Maschine. Die Simulation zeigt eine mögliche Folge der realen Auslassungen — keine Strafe, sondern die Wahrheit der Maschine. Danach: Modul wiederholen.',
      },
      {
        key: 'zeitdrucknotif',
        label: 'Zeitdruck Notifications',
        usp: 'experience',
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
        usp: 'experience',
        thumb: 'training',
        text: 'Im Modul findet der Nutzer Interaktionspunkte an der Maschine und entscheidet selbst, was zu tun ist. Keine Führung, keine Nummerierung — genau wie am echten Arbeitsplatz zählt der eigene Blick.',
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
        text: 'Jeder Interaktionspunkt stellt eine echte Entscheidung: Was gibt es hier zu tun? Die falsche Option sieht oft harmlos aus — wie in der Realität. Das System bewertet nicht sofort. Es merkt sich.',
      },
      {
        key: 'lernkarten',
        label: 'AR Lernkarten und Poster',
        usp: 'experience',
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
        usp: 'zielgruppe',
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

// Erklärtexte für die klickbaren Userflow-Nodes (Zoom-Overlay)
export const UF_EXPLAIN = {
  headset: {
    thumb: 'start',
    title: 'Headset auf',
    text: 'Die MR-Brille kommt direkt im Betrieb auf — das Training beginnt an oder neben der echten Maschine, nicht im Schulungsraum.',
  },
  setup: {
    thumb: 'start',
    title: 'Willkommens-Setup',
    text: 'Drei Entscheidungen, ein Einstieg: Maschine, Erfahrungsstand und Spatial Mode. Das System passt Umfang und Unterstützung automatisch an.',
  },
  onboarding: {
    thumb: 'onboarding',
    title: 'Onboarding (Anfänger)',
    text: 'Neue Benutzer üben Gesten, lernen die Maschine mit ihren Gefahrenzonen kennen und trainieren zunächst ohne Konsequenz — der geschützte grüne Pfad.',
  },
  direkt: {
    thumb: 'module',
    title: 'Direktstart',
    text: 'Erfahrene und Experten überspringen das Onboarding und starten direkt in der Modulauswahl.',
  },
  quest: {
    thumb: 'module',
    title: 'Quest-Module 1–6',
    text: 'Sechs Module entlang der echten Sicherheitscheckliste, als Schleife: Aufgabe, Entscheidung, Auswertung — Modul für Modul, bis die Routine sitzt.',
  },
  zeitdruck: {
    thumb: 'zeitdruck',
    title: 'Zeitdruck-Notification',
    text: 'Mitten im Modul erscheint unangekündigt eine Nachricht mit laufendem Timer — der Impuls, Schritte zu überspringen, wird selbst spürbar. Ein seitliches Ereignis, kein Schritt im Pfad.',
  },
  konsequenz: {
    thumb: 'konsequenz',
    title: 'Konsequenz-Simulation',
    text: 'Wird ein Schritt übersprungen, sagt das System nichts. Am Modulende zeigt die Simulation die mögliche Folge — Feuer, Leckage oder Splitterflug. Danach: Modul wiederholen.',
  },
  profil: {
    thumb: 'review',
    title: 'Routinen-Profil',
    text: 'Kein Test, kein Bestanden: Das Profil zeigt, wo die eigene Routine unter Druck nachgibt — die Grundlage für gezieltes Weiterlernen.',
  },
  lernkarten: {
    thumb: 'mini',
    title: 'AR-Lernkarten',
    text: 'Karte scannen — das Miniaturmodell erscheint auf dem Tisch, das Quiz testet gezielt die erkannten Schwachstellen. Ohne Headset, direkt im Pausenraum.',
  },
  dashboard: {
    thumb: 'cms',
    title: 'Content Dashboard',
    text: 'Die Parallel-Ebene des Betriebs: Checklisten pflegen, Checkpoints mit Spatial Tasks verknüpfen, Zeitdruck-Nachrichten schreiben, Konsequenz-Simulationen anfragen.',
  },
  erfahrungsstand: {
    thumb: 'start',
    title: 'Erfahrungsstand?',
    text: 'Die einzige Weiche im System: Anfänger nehmen den grünen Onboarding-Pfad, Erfahrene den direkten Weg — beide führen ins selbe Training.',
  },
  willkommen: {
    thumb: 'start',
    title: 'Willkommen',
    text: 'Ankommen im Raum: Der warme Glow, die schwebenden Zahnräder — das Training stellt sich vor, bevor es fordert.',
  },
  gesten: {
    thumb: 'onboarding',
    title: 'Gesten-Tutorial',
    text: 'Greifen, zeigen, platzieren — die Hand-Tracking-Grundlagen werden gefahrlos geübt, bevor die Maschine ins Spiel kommt.',
  },
  kennenlernen: {
    thumb: 'training',
    title: 'Maschine kennenlernen',
    text: 'Die Maschine mit ihren Gefahrenzonen erkunden — noch ohne Aufgabe, ohne Timer, ohne Konsequenz.',
  },
  uebung: {
    thumb: 'quiz',
    title: 'Übungsmodul',
    text: 'Ein komplettes Modul im Schutzraum: Fehler haben hier noch keine Folge — die Routine darf wachsen.',
  },
  vorgeschmack: {
    thumb: 'konsequenz',
    title: 'Vorgeschmack Konsequenz',
    text: 'Der Scharnier-Moment: eine kontrollierte Kostprobe der Konsequenz-Simulation. Ab jetzt weiß der Anfänger, warum jeder Schritt zählt.',
  },
  trainingein: {
    thumb: 'module',
    title: 'Ins Training',
    text: 'Beide Pfade münden hier: die Quest-Module der Routinen-Checkliste — für alle dieselben, mit angepasster Unterstützung.',
  },
  modulauswahl: {
    thumb: 'module',
    title: 'Modulauswahl',
    text: 'Sechs Module entlang der Routinen-Checkliste — von „Vor Arbeitsbeginn" bis „Nach Arbeitsende". Modul 2 „Rüsten" ist das aktive Beispiel.',
  },
  checkfrage: {
    thumb: 'precheck',
    title: 'Checklisten-Frage',
    text: '„Letzter Blick in die Checkliste?" — dreimal pro Training einblendbar, je zehn Sekunden. Dann muss die Routine aus dem Gedächtnis kommen.',
  },
  checkin: {
    thumb: 'training',
    title: 'Check-In',
    text: 'Interaktionspunkte an der Maschine finden — keine Führung, keine Nummerierung. Wie am echten Arbeitsplatz zählt der eigene Blick.',
  },
  panels: {
    thumb: 'quiz',
    title: 'Entscheidungs-Panels',
    text: '„Was gibt es hier zu tun?" — die falsche Option sieht oft harmlos aus. Das System bewertet nicht sofort. Es merkt sich.',
  },
  auswertung: {
    thumb: 'konsequenz',
    title: 'Auswertung',
    text: 'Alle Punkte erfüllt? Der Moment der Wahrheit am Modulende — hier entscheidet sich, ob die Konsequenz folgt.',
  },
  naechstes: {
    thumb: 'module',
    title: 'Nächstes Modul',
    text: 'Routine bestätigt — weiter zum nächsten Modul, bis alle sechs abgeschlossen sind.',
  },
  wiederholen: {
    thumb: 'training',
    title: 'Training wiederholen',
    text: 'Der Kreis schließt sich: Das Training ist jederzeit wiederholbar — mit dem Wissen aus dem eigenen Routinen-Profil.',
  },
}

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
