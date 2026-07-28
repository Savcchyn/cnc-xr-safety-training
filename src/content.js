// Alle Texte stammen aus den ShapesXR-Screenshots (1:1 übernommen, inkl. Originalschreibweise).

export const content = {
  start: {
    titleTop: 'Willkommen im',
    titleAccent: 'CNC Fräsen',
    titleRest: 'Sicherheitstraining',
    subtitle:
      'Ein XR-Sicherheitstraining, das nicht nur Wissen vermittelt — sondern Wahrnehmung zurückholt.',
    columns: [
      {
        key: 'machine',
        question: 'Mit welcher Maschine möchtest du heute trainieren?',
        options: [
          { label: 'Maschine 1' },
          { label: 'Maschine 2' },
          { label: 'Maschine 3' },
        ],
      },
      {
        key: 'level',
        question: 'Wie lautet dein Erfahrungsstand?',
        options: [
          { label: 'Anfänger' },
          { label: 'Erfahren' },
          { label: 'Experte' },
        ],
      },
      {
        key: 'space',
        question: 'Wie viel Raum kann dein Traingprogramm einnehmen?',
        options: [
          {
            label: 'Live Trainings Umgebung',
            sub: 'Mixed Reality an der Maschine im Betrieb',
            mode: 'live',
          },
          {
            label: 'Umgebungssimulation',
            sub: 'Virtual Reality Trainings Simulation mit Platz',
            mode: 'space',
          },
          {
            label: 'Miniatur Modell',
            sub: 'Mixed Reality auf kleinem Raum',
            mode: 'mini',
          },
        ],
      },
    ],
    tutorial: 'Tutorial',
    dashboard: 'Content Dashboard',
  },

  moduleSelect: {
    title:
      'Wähle ein Trainingsmodul der Routinen Checkliste deiner Maschine aus, von der du starten möchtest.',
  },

  modules: [
    { n: 1, title: 'Vor Arbeitsbeginn' },
    { n: 2, title: 'Rüsten' },
    { n: 3, title: 'Vor Programmstart' },
    { n: 4, title: 'Während des Betriebs' },
    { n: 5, title: 'Eingriffe & Unterbrechungen' },
    { n: 6, title: 'Nach Arbeitsende' },
  ],

  preChecklist: {
    title: 'Brauchst du vor dem Start des Moduls einen letzten Blick in die Checkliste?',
    sub: 'Innerhalb des Trainings kannst du die Checkliste 3x Checkin einblenden',
    no: 'Nein, starte das Modul',
    yes: 'Ja, vor dem Start einblenden',
  },

  checklist: {
    kicker: 'Checkliste Modul 2',
    title: 'Rüsten',
    items: [
      {
        label: 'Maschine im sicheren Zustand',
        sub: '(Hauptantrieb aus, ggf. abgeschaltet/verriegelt)',
      },
      {
        label: 'Werkzeug auf Beschädigung geprüft',
        sub: 'keine Risse, kein Ausbruch an der Schneide',
      },
      {
        label: 'Werkzeug korrekt und fest gespannt',
        sub: 'Spannzange sauber',
      },
      {
        label: 'Werkstück sicher gespannt',
        sub: 'Spannkraft und Spannmittel zur Bearbeitung passend',
      },
      { label: 'Spannmittel auf festen Sitz kontrolliert', sub: '' },
      { label: 'Werkzeuglängen und Nullpunkte korrekt eingemessen', sub: '' },
      { label: 'Kühlschmierstoff-Zufuhr geprüft', sub: '' },
    ],
    startButton: 'Modul Starten',
  },

  checkin: {
    title: 'Check In',
    accentLine: 'Finde die Interaktionspunkte und entscheide was zutun ist.',
    lines: [
      'Jetzt wird es ernst: Werkzeug. Werkstück. Spannkraft.',
      'Prüfe jeden Schritt, bevor du weitergehst.\nDie Maschine verzeiht keine Abkürzung.',
      'Hier findest du deine Checkliste, kannst das Modul verlassen\noder für erledigt erklären.',
    ],
    showChecklist: 'Checkliste anzeigen',
    leaveModule: 'Modul verlassen',
    markDone: 'Modul als erledigt makeieren',
    timerLabel: 'Timer',
    // Timer zählt vorwärts ab 00:00 — er dokumentiert die Trainingszeit
    // zur Einordnung, es läuft keine Zeit ab.
    checklistViews: 3,
    checklistViewSeconds: 10,
  },

  // Spatial Tasks: Interaktionspunkte an der Maschine.
  // "Was gibt es hier zu tun?" — pro Punkt drei Antwortoptionen.
  taskQuestion: 'Was gibt es hier zu tun?',
  tasks: [
    {
      id: 'panel-top',
      options: ['Nichts', 'Nullpunkte einmessen', 'Hauptantrieb ausschaltem'],
      correct: 1,
    },
    {
      id: 'panel-estop',
      options: ['Nichts', 'Nullpunkte einmessen', 'Nullpunkte unverändert lassen'],
      correct: 2,
    },
    {
      id: 'cabinet-door',
      options: ['Nichts', 'Werkzeug auf Beschädigung prüfen', 'Werkzeug wechseln'],
      correct: 1,
    },
    {
      id: 'spindle',
      options: ['Spannmittel auf festen Sitz kontrollieren', 'Nichts', 'Werkstück lösen'],
      correct: 0,
    },
    {
      id: 'table',
      options: ['Programm starten', 'Nichts', 'Kühlschmierstoff-Zufuhr prüfen'],
      correct: 2,
    },
  ],

  notifications: [
    {
      title: 'Schichtleiter',
      text: 'Teil 47 muss in 5 Minuten in die Endmontage.\nGeht das noch?',
      time: 'Vor 3 Min.',
      delay: 10,
    },
    {
      title: 'Kollege wartet',
      text: 'Ich brauch die Maschine für meinen Auftrag\nin 3 Minuten!',
      time: 'Vor 1 Min.',
      delay: 20,
    },
    {
      title: 'Feierabend',
      text: 'Du musst gleich los zum Konzert,\nsonst verpasst du die Bahn!',
      time: 'Gerade eben',
      delay: 30,
    },
  ],

  consequence: {
    titleTemplate: (skipped, total) => `${skipped} von ${total} Schritte übersprungen!`,
    text: 'Einige Punkte der Sicherheitscheckliste wurden nicht ausgeführt.\nDie folgende Simulation zeigt eine mögliche Folge.',
    repeat: 'Modul wiederholen',
    leave: 'Modul verlassen',
  },

  review: {
    title: 'Dein Routinen Profil',
    text: 'Kein Test. Kein Ergebnis. Ein Blick auf deine eigene Routine\nund darauf, wo sie unter Druck nachgibt.',
    leftLabel: 'Wo die Routine bricht',
    rightLabel: 'Dein Muster',
    button: 'Zur Modulauswahl',
    errorsButton: 'Fehler an den Task Points ansehen',
  },

  reviewErrors: {
    runSimulation: 'Korrekte Simulation ausführen',
    backToProfile: 'Zurück zum Profil',
    simulationDone: 'Korrekte Simulation abgeschlossen.',
    noErrors: 'Keine Fehler — alle Task Points waren korrekt.',
    cardKicker: 'Richtig wäre:',
  },

  // Erklärungen pro Task Point — für Onboarding und Fehler-Review
  taskExplanations: {
    'panel-top': {
      action: 'Nullpunkte einmessen',
      text: 'Werkzeuglängen und Nullpunkte müssen vor dem Start korrekt eingemessen sein.\nSonst fährt die Maschine mit falschen Referenzen ins Material.',
    },
    'panel-estop': {
      action: 'Nullpunkte unverändert lassen',
      text: 'Die Referenzen stimmen bereits.\nUnnötiges Umstellen erzeugt Fehlpositionen beim nächsten Programmlauf.',
    },
    'cabinet-door': {
      action: 'Werkzeug auf Beschädigung prüfen',
      text: 'Risse oder Ausbrüche an der Schneide führen zu Werkzeugbruch\nund unkontrolliert fliegenden Teilen.',
    },
    spindle: {
      action: 'Spannmittel auf festen Sitz kontrollieren',
      text: 'Lose Spannmittel können sich bei der Bearbeitung lösen —\ndas Werkstück wird zum Geschoss.',
    },
    table: {
      action: 'Kühlschmierstoff-Zufuhr prüfen',
      text: 'Ohne Kühlschmierstoff überhitzen Werkzeug und Werkstück.\nBrandgefahr und Werkzeugverschleiß steigen stark an.',
    },
  },

  onboarding: {
    kicker: 'Onboarding',
    stepLabel: (i, n) => `Arbeitsschritt ${i} von ${n}`,
    intro:
      'Schau zu, wie die Arbeitsschritte des Moduls korrekt ausgeführt werden.\nMit den Pfeilen schaltest du vor und zurück.',
    startTraining: 'Training starten',
    back: 'zurück',
  },

  moduleEditor: {
    kicker: 'Neues Modul',
    titlePlaceholder: 'Modul 7 — Name eingeben',
    checkpointsLabel: 'Checkpoints',
    tasksLabel: 'Verknüpfte Tasks',
    addCheckpoint: 'Checkpoint hinzufügen',
    addTask: 'Task hinzufügen',
    save: 'Modul speichern',
    saved: 'Modul gespeichert (Beispiel — Prototyp).',
    exampleCheckpoint: 'Neuer Checkpoint — Text eingeben',
    exampleTask: 'Richtige Antwort eingeben',
  },

  notifEditor: {
    senderLabel: 'Absender',
    timeLabel: 'Zeit',
    textLabel: 'Nachricht',
    add: 'Nachricht hinzufügen',
    newSender: 'Neuer Absender',
    newTime: 'Gerade eben',
    newText: 'Neue Nachricht — Text eingeben',
  },

  cms: {
    back: 'zurück',
    title: 'Content Dashboard',
    machines: ['Maschine 1', 'Maschine 2', 'Maschine 3'],
    groups: ['Anfänger', 'Erfahren', 'Experte'],
    addMachine: 'Maschine hinzufügen',
    addGroup: 'Gruppe hinzufügen',
    modulesTitle: (machine, group) => `Checklisten Module: ${machine}, ${group}`,
    addModule: 'Modul hinzufügen',
    deleteModule: 'Modul löschen',
    editNotifications: 'Zeitdruck Nachrichten bearbeiten',
    checklistKicker: 'Checkliste Modul 2',
    checklistTitle: 'Rüsten',
    addCheckpoint: 'Check Point hinzufügen',
    saveChecklist: 'Checkliste speichern',
  },

  checkpointEditor: {
    kicker: 'Checkliste Modul 2',
    title: 'Rüsten',
    label: 'Checkpoint 01',
    text: 'Maschine im sicheren Zustand\n\n(Hauptantrieb aus, ggf. abgeschaltet/verriegelt)',
    spatialLink: 'mit Spatial Task verknüpfen',
    correctLabel: 'Richtige Antwort:',
    correctValue: 'Hauptantrieb ausschalten',
    wrongLabel: 'Falsche Antwort:',
    wrongValue: 'System zurücksetzen',
    save: 'Checkpoint speichern',
  },

  checkpointAdded: {
    title: 'Checkpoint hinzugefügt',
    text: 'Dein neuer Checkpoint wurde der Checkliste hinzugefügt und mit einem Spatial Task verknüpft.\nDer Spatial Task erscheint jetzt griffbereit vor dir.\nGreife ihn und platziere ihn an der passenden Stelle am Modell.\nKehre danach zum Panel zurück, um die Platzierung zu bestätigen.',
    confirm: 'Platzierung bestätigen',
  },

  checkpointPlacedDialog: {
    title: 'Checkpoint platziert',
    subtitle: 'Konsequenz-Simulation gewünscht?',
    text: 'Zeige Lernenden, was passiert, wenn dieser Checkpoint übersprungen wird.\nDie Simulation wird vom Systembetreiber erstellt. Deine Anfrage wird direkt übermittelt.',
    request: 'Simulation anfragen',
    continueWithout: 'Ohne Simulation fortfahren',
  },
  simulationRequested: 'Anfrage übermittelt. Der Systembetreiber erstellt die Simulation.',

  tutorial: {
    title: 'Tutorial',
    lines: [
      ['Maus ziehen', 'Umschauen im Raum'],
      ['W A S D', 'Bewegen'],
      ['Scrollen', 'Zoomen'],
      ['Klicken', 'Mit UI und Interaktionspunkten interagieren'],
      ['Greifen', 'Spatial Tasks anklicken, bewegen und erneut klicken zum Platzieren'],
    ],
    button: "Los geht's",
  },

  timeUp: 'Zeit abgelaufen! Das Modul wird ausgewertet.',
  allCorrect: 'Alle Schritte korrekt ausgeführt!',
  prototypeOnly: 'Diese Funktion ist im Prototyp nur angedeutet.',
  checkpointPlaced: 'Checkpoint platziert & gespeichert.',
  notificationsSaved: 'Zeitdruck Nachrichten gespeichert.',
}
