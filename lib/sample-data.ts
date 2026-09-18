import type { QuizQuestion } from "./types";

export const GENGHIS_CONTENT = `Genghis Khan (born Temüjin; c. 1162 – August 1227), also known as Chinggis Khan, was the founder and first khan of the Mongol Empire. After spending most of his life uniting the Mongol tribes, he launched a series of military campaigns, conquering large parts of China and Central Asia.

Born between 1155 and 1167 and given the name Temüjin, he was the eldest child of Yesugei, a Mongol chieftain of the Borjigin clan, and his wife Hö'elün. When Temüjin was eight, his father died and his family was abandoned by its tribe. Reduced to near-poverty, Temüjin killed his older half-brother to secure his familial position. His charismatic personality helped to attract his first followers and to form alliances with two prominent steppe leaders named Jamukha and Toghrul; they worked together to retrieve Temüjin's newlywed wife Börte, who had been kidnapped by raiders. As his reputation grew, his relationship with Jamukha deteriorated into open warfare. Temüjin was badly defeated in c. 1187, and may have spent the following years as a subject of the Jin dynasty; upon reemerging in 1196, he swiftly began gaining power. Toghrul came to view Temüjin as a threat and launched a surprise attack on him in 1203. Temüjin retreated, then regrouped and overpowered Toghrul; after defeating the Naiman tribe and executing Jamukha, he was left as the sole ruler on the Mongolian steppe.`;

export const GENGHIS_SUMMARY = `Genghis Khan, born Temüjin around 1162, was the founder of the Mongol Empire. After his father's death, Temüjin's family was left in poverty, and he later killed his half-brother to secure his position. He built alliances with leaders like Jamukha and Toghrul, and despite being defeated in battle and briefly under the Jin dynasty, he rose to power by defeating rivals. By 1206, after overcoming the Naiman tribe and executing Jamukha, Temüjin became the undisputed ruler of the Mongol steppe, eventually leading a series of successful military campaigns that expanded his empire across China and Central Asia.`;

export const GENGHIS_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "What was Genghis Khan's birth name?",
    options: ["Yesugei", "Temüjin", "Toghrul", "Jamukha"],
    correctIndex: 1,
  },
  {
    id: "q2",
    question: "When was Temüjin born?",
    options: ["Around 1206", "Around 1187", "Around 1162", "Around 1120"],
    correctIndex: 2,
  },
  {
    id: "q3",
    question: "What happened to Temüjin's family after his father died?",
    options: [
      "They became kings",
      "They moved to China",
      "They were abandoned and became poor",
      "They joined Toghrul's army",
    ],
    correctIndex: 2,
  },
  {
    id: "q4",
    question: "Who were Temüjin's early allies?",
    options: [
      "Börte and Yesugei",
      "Naiman and Jin",
      "Jamukha and Toghrul",
      "Chinggis and Kublai",
    ],
    correctIndex: 2,
  },
  {
    id: "q5",
    question: "Why did Temüjin and Jamukha become enemies?",
    options: [
      "Jamukha stole his horse",
      "Their alliance broke",
      "Börte left",
      "Toghrul betrayed them",
    ],
    correctIndex: 1,
  },
];
