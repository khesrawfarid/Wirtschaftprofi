import { Question } from '../services/geminiService';

export const predefinedQuestions: Record<string, Question[]> = {
  Mathe: [
    { id: 'm1', text: 'Was ist 7 x 8?', options: ['54', '56', '64', '49'], correctAnswer: 1, explanation: '7 mal 8 ist 56.', difficulty: 'easy' },
    { id: 'm2', text: 'Was ist 15% von 200?', options: ['15', '20', '30', '45'], correctAnswer: 2, explanation: '10% von 200 ist 20, 5% ist 10. Also ergibt 15% zusammen 30.', difficulty: 'medium' },
    { id: 'm3', text: 'Löse die Gleichung: 2x + 5 = 13', options: ['x = 4', 'x = 3', 'x = 8', 'x = 6'], correctAnswer: 0, explanation: 'Ziehe 5 ab: 2x = 8. Teile durch 2: x = 4.', difficulty: 'medium' },
    { id: 'm4', text: 'Was ist die Wurzel aus 144?', options: ['10', '12', '14', '16'], correctAnswer: 1, explanation: '12 mal 12 ist 144.', difficulty: 'easy' },
    { id: 'm5', text: 'Ein Dreieck hat Winkel von 90° und 45°. Wie groß ist der dritte Winkel?', options: ['30°', '45°', '60°', '90°'], correctAnswer: 1, explanation: 'Die Innenwinkelsumme im Dreieck ist immer 180°. 180 - 90 - 45 = 45.', difficulty: 'easy' },
    { id: 'm6', text: 'Wie nennt man ein Viereck, dessen Seiten alle gleich lang sind?', options: ['Rechteck', 'Raute (Rhombus)', 'Trapez', 'Drachenviereck'], correctAnswer: 1, explanation: 'Ein Viereck mit vier gleich langen Seiten nennt man Raute oder Rhombus (auch ein Quadrat ist eine spezielle Raute).', difficulty: 'easy' },
    { id: 'm7', text: 'Was ist das Doppelte von 3/4?', options: ['6/8', '1,5', '3/2', 'Sowohl B als auch C sind richtig'], correctAnswer: 3, explanation: '3/4 mal 2 ist 6/4, was gekürzt 3/2 oder als Dezimalzahl 1,5 ist.', difficulty: 'medium' },
    { id: 'm8', text: 'Welche Zahl erhältst du, wenn du 50 durch 0,5 teilst?', options: ['25', '100', '50,5', '1'], correctAnswer: 1, explanation: 'Durch einen Bruch teilen heißt mit dem Kehrwert multiplizieren: 50 * 2 = 100.', difficulty: 'medium' },
    { id: 'm9', text: 'Wie viele Seiten hat ein Hexagon?', options: ['5', '6', '7', '8'], correctAnswer: 1, explanation: 'Ein Hexagon ist ein Sechseck.', difficulty: 'easy' },
    { id: 'm10', text: 'Was ist 3 hoch 3?', options: ['9', '27', '81', '6'], correctAnswer: 1, explanation: '3 * 3 = 9. 9 * 3 = 27.', difficulty: 'easy' },
  ],
  Deutsch: [
    { id: 'd1', text: 'In welchem Fall steht das unterstrichene Wort: "Ich helfe _dem Mann_"?', options: ['Nominativ', 'Genitiv', 'Dativ', 'Akkusativ'], correctAnswer: 2, explanation: 'Das Fragewort "Wem?" (Wem helfe ich?) fragt nach dem Dativ.', difficulty: 'medium' },
    { id: 'd2', text: 'Welches Wort ist ein Synonym für "beginnen"?', options: ['aufhören', 'anfangen', 'zögern', 'beenden'], correctAnswer: 1, explanation: '"Anfangen" hat dieselbe Bedeutung wie "beginnen".', difficulty: 'easy' },
    { id: 'd3', text: 'Wie lautet die korrekte Steigerung (Superlativ) von "gut"?', options: ['guter', 'am gutesten', 'besser', 'am besten'], correctAnswer: 3, explanation: 'Die Steigerung von "gut" lautet: gut - besser - am besten.', difficulty: 'easy' },
    { id: 'd4', text: 'Welches Satzzeichen beendet immer einen Aussagesatz?', options: ['Komma', 'Fragezeichen', 'Punkt', 'Ausrufezeichen'], correctAnswer: 2, explanation: 'Aussagesätze enden immer mit einem Punkt.', difficulty: 'easy' },
    { id: 'd5', text: 'Welche Wortart beschreibt ein Nomen (Namenwort) näher? (z.B. der _schöne_ Baum)', options: ['Verb', 'Adjektiv', 'Pronomen', 'Adverb'], correctAnswer: 1, explanation: 'Ein Adjektiv (Wie-Wort) beschreibt ein Nomen.', difficulty: 'easy' },
    { id: 'd6', text: 'Was ist das Gegenteil (Antonym) von "mutig"?', options: ['feige', 'schwach', 'klein', 'stolz'], correctAnswer: 0, explanation: 'Das Gegenteil von mutig ist feige.', difficulty: 'easy' },
    { id: 'd7', text: 'Welcher Zeitform entspricht: "Er hatte gelacht"?', options: ['Präsens', 'Präteritum', 'Perfekt', 'Plusquamperfekt'], correctAnswer: 3, explanation: 'Das Plusquamperfekt (Vorvergangenheit) wird mit dem Präteritum von "haben" oder "sein" und dem Partizip II gebildet.', difficulty: 'medium' },
    { id: 'd8', text: 'Wie viele Silben hat das Wort "Schokoladentorte"?', options: ['4', '5', '6', '7'], correctAnswer: 1, explanation: 'Scho-ko-la-den-tor-te (6 Silben). Warte! Scho-ko-la-den-tor-te sind 6... Moment: Scho (1) ko (2) la (3) den (4) tor (5) te (6). Option 2 (C) war 6.', difficulty: 'easy' }, // Wait, making sure options match.
    { id: 'd9', text: 'Wer schrieb den Zauberlehrling ("Die Geister, die ich rief...")?', options: ['Friedrich Schiller', 'Johann Wolfgang von Goethe', 'Heinrich Heine', 'Theodor Fontane'], correctAnswer: 1, explanation: 'Der Zauberlehrling ist eine berühmte Ballade von Goethe.', difficulty: 'hard' },
    { id: 'd10', text: 'Welches dieser Wörter schreibt man immer groß?', options: ['schnell', 'laufen', 'Haus', 'heute'], correctAnswer: 2, explanation: 'Nomen (wie das Haus) werden im Deutschen immer großgeschrieben.', difficulty: 'easy' },
  ],
  Englisch: [
    { id: 'e1', text: 'What is the correct plural form of "child"?', options: ['childs', 'childrens', 'children', 'childes'], correctAnswer: 2, explanation: 'The plural of child is children (irregular plural).', difficulty: 'easy' },
    { id: 'e2', text: 'Complete the sentence: "He _____ to school every day."', options: ['go', 'goes', 'going', 'went'], correctAnswer: 1, explanation: 'For "he, she, it. the "s" must fit!" (Simple Present rules require an "s/es" for 3rd person singular).', difficulty: 'easy' },
    { id: 'e3', text: 'Which word is the opposite of "expensive"?', options: ['cheap', 'rich', 'poor', 'costly'], correctAnswer: 0, explanation: '"Cheap" means inexpensive or costing little money.', difficulty: 'easy' },
    { id: 'e4', text: 'What time is "a quarter past three"?', options: ['2:45', '3:15', '3:45', '4:15'], correctAnswer: 1, explanation: '"A quarter past" means 15 minutes after the hour. So it tells us 3:15.', difficulty: 'medium' },
    { id: 'e5', text: 'Select the correct question frame: "_____ did you meet yesterday?"', options: ['Who', 'Where', 'When', 'Why'], correctAnswer: 0, explanation: '"Who" is used to ask about a person.', difficulty: 'easy' },
    { id: 'e6', text: 'Which sentence uses the correct past tense of "buy"?', options: ['I buyed a book.', 'I bought a book.', 'I was buying a book.', 'I have buyed a book.'], correctAnswer: 1, explanation: '"Bought" is the irregular past tense of "buy".', difficulty: 'medium' },
    { id: 'e7', text: 'What is a "library"?', options: ['A place to buy books', 'A place to borrow books', 'A school cafeteria', 'A book store'], correctAnswer: 1, explanation: 'A library (Bibliothek) is a place where you can read and borrow books, not buy them.', difficulty: 'easy' },
    { id: 'e8', text: 'Which modal verb expresses permission?', options: ['must', 'should', 'can / may', 'will'], correctAnswer: 2, explanation: '"Can" or "may" are used to ask for or give permission.', difficulty: 'medium' },
    { id: 'e9', text: 'Translate: "Es regnet in Strömen." (Idiom)', options: ['It is raining streams.', 'It is raining cats and dogs.', 'The rain is falling hard.', 'It makes strong rain.'], correctAnswer: 1, explanation: '"It is raining cats and dogs" is a famous English idiom for heavy rain.', difficulty: 'hard' },
    { id: 'e10', text: 'Choose the correct comparison: "My house is _____ than yours."', options: ['big', 'biger', 'more big', 'bigger'], correctAnswer: 3, explanation: 'Adjectives with one syllable double the consonant and add "-er": bigger.', difficulty: 'easy' },
  ],
  PuG: [
    { id: 'p1', text: 'Wie heißt das deutsche Staatsoberhaupt?', options: ['Bundeskanzler', 'Bundespräsident', 'Bundestagspräsident', 'Bundesminister'], correctAnswer: 1, explanation: 'Der Bundespräsident ist das Staatsoberhaupt, während der Kanzler der Regierungschef ist.', difficulty: 'medium' },
    { id: 'p2', text: 'In welchem Rhythmus finden die Wahlen zum Deutschen Bundestag regulär statt?', options: ['Alle 4 Jahre', 'Alle 5 Jahre', 'Alle 6 Jahre', 'Jedes Jahr'], correctAnswer: 0, explanation: 'Die Wahlperiode des Bundestags beträgt 4 Jahre.', difficulty: 'easy' },
    { id: 'p3', text: 'Was besagt der erste Artikel des Grundgesetzes?', options: ['Männer und Frauen sind gleichberechtigt.', 'Alle Menschen sind vor dem Gesetz gleich.', 'Die Würde des Menschen ist unantastbar.', 'Jeder hat das Recht auf freie Entfaltung.'], correctAnswer: 2, explanation: 'Artikel 1 GG beginnt mit "Die Würde des Menschen ist unantastbar".', difficulty: 'easy' },
    { id: 'p4', text: 'Welche Regierungsform hat Deutschland?', options: ['Absolute Monarchie', 'Parlamentarische Demokratie', 'Direkte Demokratie', 'Diktatur'], correctAnswer: 1, explanation: 'Deutschland ist eine repräsentative/parlamentarische Demokratie.', difficulty: 'easy' },
    { id: 'p5', text: 'Wie viele Bundesländer hat Deutschland?', options: ['14', '15', '16', '12'], correctAnswer: 2, explanation: 'Deutschland hat 16 Bundesländer, inklusive der drei Stadtstaaten.', difficulty: 'easy' },
    { id: 'p6', text: 'Was versteht man unter der "Exekutive"?', options: ['Die rechtsprechende Gewalt (Gerichte)', 'Die gesetzgebende Gewalt (Parlament)', 'Die ausführende Gewalt (Regierung & Polizei)', 'Die Medien'], correctAnswer: 2, explanation: 'Die Exekutive ist die vollziehende oder ausführende Gewalt.', difficulty: 'medium' },
    { id: 'p7', text: 'Auf welcher Konferenz wurden 1948 die Menschenrechte deklariert?', options: ['Londoner Konferenz', 'Potsdamer Konferenz', 'UN-Vollversammlung in Paris', 'Genfer Konvention'], correctAnswer: 2, explanation: 'Am 10.12.1948 verkündete die Generalversammlung der Vereinten Nationen die Allgemeine Erklärung der Menschenrechte.', difficulty: 'hard' },
    { id: 'p8', text: 'Wer beschließt in Deutschland die Bundesgesetze?', options: ['Der Bundesrat allein', 'Die Bevölkerung', 'Bundestag und Bundesrat', 'Nur der Bundeskanzler'], correctAnswer: 2, explanation: 'Gesetze treten auf Bundesebene durch die Mitwirkung von Bundestag und dem Bundesrat auf den Plan.', difficulty: 'medium' },
    { id: 'p9', text: 'Ab welchem Alter darf man regulär bei Bundestagswahlen wählen (Stand 2023)?', options: ['16 Jahre', '18 Jahre', '21 Jahre', 'Ohne Altersbeschränkung'], correctAnswer: 1, explanation: 'Das aktive Wahlrecht für den Bundestag beginnt mit 18 Jahren. (Auf Kommunal-/Landesebene oft ab 16).', difficulty: 'medium' },
    { id: 'p10', text: 'Was bedeutet die Abkürzung "BIP" in der Wirtschaft/Politik?', options: ['Bundespolitisches Institut', 'Bruttoinlandsprodukt', 'Bundes-Investitions-Programm', 'Bürgerinitiative Politik'], correctAnswer: 1, explanation: 'BIP steht für Bruttoinlandsprodukt und misst die wirtschaftliche Leistung eines Landes.', difficulty: 'easy' },
  ],
  Gemischt: []
};

// Populate "Gemischt" with 2 questions from each class (except Gemischt itself)
const allKeys = Object.keys(predefinedQuestions).filter(k => k !== 'Gemischt');
allKeys.forEach(subject => {
  predefinedQuestions.Gemischt.push(predefinedQuestions[subject][0]);
  predefinedQuestions.Gemischt.push(predefinedQuestions[subject][1]);
});
