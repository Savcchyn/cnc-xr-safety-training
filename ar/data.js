// Daten der AR App: Quizfragen, Hotspot-Positionen, Duell-Konfiguration.
// Maschinen-, Modul- und Task-Daten kommen aus dem XR-Prototyp (src/content.js).

// Interaktionspunkte pro Maschine (lokale Meter, identisch zum XR-Prototyp)
export const HOTSPOTS = {
  m1: {
    'panel-top': [-0.3, 1.78, 1.15],
    'panel-estop': [-1.18, 1.2, 1.3],
    'cabinet-door': [-0.74, 0.5, 1.25],
    spindle: [0.62, 1.62, 0.8],
    table: [1.55, 1.18, 1.0],
  },
  m2: {
    'panel-top': [0.75, 1.65, 0.6],
    'panel-estop': [0.85, 1.15, 0.7],
    'cabinet-door': [-0.7, 0.7, 0.7],
    spindle: [0, 1.55, 0.55],
    table: [-0.15, 1.05, 0.85],
  },
  m3: {
    'panel-top': [0.16, 1.35, 0.65],
    'panel-estop': [0.5, 0.85, 0.85],
    'cabinet-door': [-0.55, 0.85, 0.5],
    spindle: [-1.15, 1.05, 0.45],
    table: [1.0, 0.6, 0.5],
  },
}

// Quiz-Pool: exemplarische Fragen aus den Routinen-Checklisten.
// machine: null = für alle Maschinen, sonst nur für diese Variante.
export const QUIZ_POOL = [
  {
    q: 'Der Schichtleiter drängelt: „Teil 47 muss in 5 Minuten raus." Was tust du?',
    a: [
      'Checkliste trotzdem vollständig durchgehen',
      'Nur die wichtigsten Punkte prüfen',
      'Checkliste überspringen, Zeit ist Geld',
      'Kollegen um Hilfe bitten und parallel starten',
    ],
    correct: 0,
    machine: null,
    explain: 'Zeitdruck ist die häufigste reale Unfallursache — die Routine gilt immer.',
  },
  {
    q: 'Was gilt beim Arbeiten an rotierenden Werkzeugen?',
    a: [
      'Handschuhe schützen die Hände',
      'Keine Handschuhe — Einzugsgefahr',
      'Nur linke Hand behandschuht',
      'Handschuhe nur beim Rüsten',
    ],
    correct: 1,
    machine: null,
    explain: 'Handschuhe können von rotierenden Werkzeugen erfasst werden.',
  },
  {
    q: 'Die Maschine klingt plötzlich anders — Rattern und Vibration. Was tun?',
    a: [
      'Weiterlaufen lassen und beobachten',
      'Vorschub leicht reduzieren',
      'Sofort stoppen und prüfen',
      'Nach Programmende prüfen',
    ],
    correct: 2,
    machine: null,
    explain: 'Ungewöhnliche Geräusche bedeuten sofort stoppen — stumpfes Werkzeug klingt anders.',
  },
  {
    q: 'Wie entfernst du Späne aus dem Arbeitsraum?',
    a: [
      'Mit der Hand, wenn sie abgekühlt sind',
      'Mit Druckluft Richtung Körper',
      'Während des Laufs absaugen',
      'Nur mit Haken oder Bürste bei Stillstand',
    ],
    correct: 3,
    machine: null,
    explain: 'Späne sind scharf und heiß — niemals mit der Hand, niemals im Lauf.',
  },
  {
    q: 'Was prüfst du vor dem Programmstart?',
    a: [
      'Verfahrwege, Drehzahlen und Testlauf im Einzelsatz',
      'Nur den Nullpunkt',
      'Ob genug Material da ist',
      'Die Uhrzeit für die Schichtübergabe',
    ],
    correct: 0,
    machine: null,
    explain: 'Programm-Plausibilität und Einzelsatz-Testlauf gehören vor jeden Start.',
  },
  {
    q: 'Vor dem Start: Wo ist der richtige Platz für den Futterschlüssel?',
    a: [
      'Im Spannfutter, griffbereit',
      'Abgezogen und abgelegt',
      'Auf dem Maschinenbett',
      'In der Hosentasche',
    ],
    correct: 1,
    machine: 'm3',
    explain: 'Ein steckender Futterschlüssel wird beim Spindelstart zum Geschoss.',
  },
  {
    q: 'Wann darfst du die Schutztür des Bearbeitungszentrums öffnen?',
    a: [
      'Sobald der Zyklus pausiert',
      'Wenn es schnell gehen muss, jederzeit',
      'Erst nach Zyklusstopp und bestätigtem Spindelstillstand',
      'Wenn der Werkzeugwechsler steht',
    ],
    correct: 2,
    machine: 'm2',
    explain: 'Stillstand wird visuell bestätigt — nicht angenommen.',
  },
  {
    q: 'Wozu dient die Absauganlage an der Holzfräse?',
    a: [
      'Nur für die Optik der Halle',
      'Staub ist brennbar und gesundheitsschädlich',
      'Sie kühlt das Werkzeug',
      'Sie hält das Werkstück fest',
    ],
    correct: 1,
    machine: 'm1',
    explain: 'Holzstaub ist ein Brand- und Gesundheitsrisiko — Absaugung gehört zur Routine.',
  },
]

// Quiz Duell: Gegner-Bot
export const DUELL = {
  botName: 'Kollege Marco',
  botEmoji: '👷',
  playerEmoji: '🧑‍🏭',
  questionSeconds: 15,
  botMinSeconds: 3,
  botMaxSeconds: 11,
  botAccuracy: 0.7,
  rounds: 5,
}
