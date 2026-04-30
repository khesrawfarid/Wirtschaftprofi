import { Question } from '../services/geminiService';

export const vocabulary = [
  { en: "(to) imagine (sth.)", de: "sich (etw.) vorstellen", diff: "easy" as const },
  { en: "invention", de: "Erfindung", diff: "medium" as const },
  { en: "scientist", de: "Wissenschaftler", diff: "easy" as const },
  { en: "(to) solve (sth.)", de: "(etw.) lösen", diff: "easy" as const },
  { en: "(to) develop", de: "(etw.) entwickeln", diff: "easy" as const },
  { en: "(to) hold academic posts", de: "einen akademischen Posten bekleiden", diff: "medium" as const },
  { en: "internet access", de: "Internetzugang", diff: "easy" as const },
  { en: "according to", de: "nach, gemäß, entsprechend", diff: "medium" as const },
  { en: "traditional news", de: "traditionelle Nachrichten", diff: "easy" as const },
  { en: "(to) fade away", de: "verblassen, schwinden", diff: "medium" as const },
  { en: "(to) turn to (sb./sth.)", de: "sich an (jdn./etw.) wenden, zukehren", diff: "hard" as const },
  { en: "source", de: "Quelle", diff: "easy" as const },
  { en: "content", de: "Inhalt", diff: "easy" as const },
  { en: "(to) subscribe to (sth.)", de: "(etw.) abonnieren, sich für (etw.) registrieren", diff: "medium" as const },
  { en: "convenient", de: "bequem", diff: "medium" as const },
  { en: "reliable", de: "zuverlassig, sicher, verlässlich, vertrauenswürdig", diff: "medium" as const },
  { en: "(to) switch on", de: "(etw.) einschalten", diff: "easy" as const },
  { en: "scheduled", de: "geplant, planmäßig", diff: "medium" as const },
  { en: "broadcast", de: "Radiosendung", diff: "medium" as const },
  { en: "(to) experience (sth.)", de: "(etw.) erfahren, erleben", diff: "easy" as const },
  { en: "(to) come across (sb./ sth.)", de: "auf etw. stoßen, (jdm./etw.) begegnen", diff: "hard" as const },
  { en: "(to) recognise (sb./sth.)", de: "(jdn./etw.) erkennen", diff: "easy" as const },
  { en: "obvious", de: "offensichtlich", diff: "easy" as const },
  { en: "confident", de: "zuversichtlich, sicher, selbstbewusst", diff: "medium" as const },
  { en: "(to) provide (sth.)", de: "(etw.) zur Verfügung stellen, versorgen mit (etw.)", diff: "medium" as const },
  { en: "(to) bombard (sth.)", de: "(etw.) bombardieren", diff: "easy" as const },
  { en: "advertisement", de: "Werbung, Anzeige, Reklame", diff: "easy" as const },
  { en: "(to) upset (sb./sth.)", de: "(jdn.) aufregen, verärgern, verstimmen", diff: "medium" as const },
  { en: "circulate", de: "zirkulieren, umlaufen, im Umlauf sein", diff: "medium" as const },
  { en: "range of", de: "Angebot an, Auswahl an/von", diff: "hard" as const },
  { en: "(to) fool (sb.)", de: "(jdn.) täuschen, hereinlegen, betrügen", diff: "medium" as const },
  { en: "variety", de: "Vielzahl, Vielfalt, Auswahl", diff: "easy" as const },
  { en: "misleading", de: "irreführend, mussverständlich", diff: "hard" as const },
  { en: "context", de: "Zusammenhang, Kontext", diff: "easy" as const },
  { en: "(to) trust (sb./ sth.)", de: "(jdn.) vertrauen", diff: "medium" as const },
  { en: "(to) pop up", de: "erscheinen", diff: "medium" as const },
  { en: "(to) share (sth.)", de: "(etw.) teilen", diff: "easy" as const },
  { en: "advice", de: "Beratung, Rat", diff: "easy" as const },
  { en: "(to) involve (sb./ sth.)", de: "(etw.) beinhalten, (jdn.) einbeziehen", diff: "medium" as const },
  { en: "(to) interact with (sb. / sth.)", de: "Mit (jdm./etw.) interagieren, umgehen", diff: "easy" as const },
  { en: "(to) donate (sth.)", de: "(etw.) spenden", diff: "easy" as const },
  { en: "rise", de: "Aufstieg, Anstieg", diff: "easy" as const },
  { en: "collaboration", de: "Zusammenarbeit, Mitwirkung", diff: "easy" as const },
  { en: "(to) enable (sb./sth.)", de: "(etw.) ermöglichen", diff: "medium" as const },
  { en: "(to) delete (sth.)", de: "(etw.) löschen", diff: "easy" as const },
  { en: "characters", de: "Schriftzeichen", diff: "medium" as const },
  { en: "(to) promote (sb./sth.)", de: "(jdn./etw.) fördern, unterstützen", diff: "medium" as const },
  { en: "increasing", de: "zunehmend, ansteigend", diff: "medium" as const },
  { en: "awareness", de: "Bewusstsein", diff: "medium" as const },
  { en: "(to) goof around", de: "herumblödeln", diff: "hard" as const },
  { en: "homegrown", de: "heimisch", diff: "medium" as const },
  { en: "snappy", de: "flott", diff: "hard" as const },
  { en: "on average", de: "Im Durchschnitt, im Mittel", diff: "easy" as const },
  { en: "immediately", de: "unverzüglich, sofort", diff: "easy" as const },
  { en: "delay", de: "Verspätung, Verzögerung", diff: "easy" as const },
  { en: "(to) outperform (sb./sth.)", de: "(jdn./etw.) übertreffen", diff: "hard" as const },
  { en: "(to) verify (sb. /sth.)", de: "(jdn./etw.) prüfen, überprüfen", diff: "medium" as const },
  { en: "censor", de: "Zensor", diff: "easy" as const },
  { en: "revenue", de: "Umsatz", diff: "hard" as const },
  { en: "social networking site", de: "Website zur sozialen Vernetzung", diff: "easy" as const },
  { en: "popularity", de: "Beliebtheit", diff: "easy" as const },
  { en: "(to) reach (sb./sth.)", de: "(jdn./ etw.) erreichen", diff: "easy" as const },
  { en: "familiar", de: "vertraut, bekannt", diff: "medium" as const },
  { en: "competition", de: "Wettbewerb", diff: "easy" as const },
  { en: "(to) reflect (sb./sth.)", de: "(jdn./etw.) wiederspiegeln", diff: "medium" as const },
  { en: "Entertainment", de: "Unterhaltung", diff: "easy" as const },
  { en: "(to) layer (sth.)", de: "(etw.) überlagern", diff: "hard" as const },
  { en: "(to) launch (sth.)", de: "(etw.) einführen", diff: "medium" as const },
  { en: "(to) affect (sb./ sth.)", de: "beeinträchtigen, betreffen, sich auswirken", diff: "medium" as const },
  { en: "(to) abbreviate", de: "etwas abkürzen", diff: "medium" as const },
  { en: "proper", de: "ordnungsgemäß", diff: "medium" as const },
  { en: "notification", de: "Mitteilung, Benachrichtigung", diff: "easy" as const },
  { en: "mindless", de: "sinnlos", diff: "medium" as const },
  { en: "distracting", de: "ablenkend", diff: "medium" as const },
  { en: "constant", de: "ständig, andauernd", diff: "easy" as const },
  { en: "inattentive", de: "unaufmerksam, unkonzentriert", diff: "medium" as const }
];

function getRandomOptions(list: typeof vocabulary, current: (typeof vocabulary)[0], count: number, key: 'en' | 'de') {
  const opts = [current[key]];
  const pool = list.filter(item => item[key] !== current[key]);
  pool.sort(() => 0.5 - Math.random());
  opts.push(...pool.slice(0, count - 1).map(item => item[key]));
  opts.sort(() => 0.5 - Math.random());
  return opts;
}

function generateQuestions(): Question[] {
  const questions: Question[] = [];
  let idCounter = 1;

  vocabulary.forEach(item => {
    // English -> German
    const deOptions = getRandomOptions(vocabulary, item, 4, 'de');
    questions.push({
      id: 'v' + (idCounter++),
      vocabId: item.en,
      text: `Was bedeutet das englische Wort "${item.en}"?`,
      options: deOptions,
      correctAnswer: deOptions.indexOf(item.de),
      explanation: `"${item.en}" bedeutet "${item.de}".`,
      difficulty: item.diff
    });

    // German -> English
    const enOptions = getRandomOptions(vocabulary, item, 4, 'en');
    questions.push({
      id: 'v' + (idCounter++),
      vocabId: item.en,
      text: `Was ist das englische Wort für "${item.de}"?`,
      options: enOptions,
      correctAnswer: enOptions.indexOf(item.en),
      explanation: `"${item.de}" heißt auf Englisch "${item.en}".`,
      difficulty: item.diff
    });
  });

  return questions;
}

export const predefinedQuestions: Record<string, Question[]> = {
  Englisch: generateQuestions()
};
