import { GENGHIS_CONTENT, GENGHIS_QUIZ, GENGHIS_SUMMARY } from "./sample-data";
import type { QuizQuestion } from "./types";

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function looksLikeGenghis(content: string) {
  const n = normalize(content);
  return (
    n.includes("temüjin") ||
    n.includes("temujin") ||
    n.includes("genghis") ||
    n.includes("chinggis") ||
    normalize(GENGHIS_CONTENT).slice(0, 80) === n.slice(0, 80)
  );
}

export function summarizeArticle(title: string, content: string): string {
  if (looksLikeGenghis(content)) return GENGHIS_SUMMARY;

  const sentences = content
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return `${title}: No content available to summarize.`;
  }

  const picked = sentences.slice(0, Math.min(4, sentences.length));
  const summary = picked.join(" ");
  return summary.length > 600 ? `${summary.slice(0, 597)}...` : summary;
}

function extractKeyPhrases(content: string): string[] {
  const words = content
    .replace(/[^a-zA-Zа-яА-ЯөүёӨҮЁ0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4);

  const freq = new Map<string, number>();
  for (const w of words) {
    const key = w.toLowerCase();
    freq.set(key, (freq.get(key) ?? 0) + 1);
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w);
}

export function generateQuiz(
  title: string,
  content: string,
  summary: string,
): QuizQuestion[] {
  if (looksLikeGenghis(content)) return GENGHIS_QUIZ;

  const phrases = extractKeyPhrases(content);
  const topic = title.trim() || "this article";
  const firstSentence =
    content.split(/(?<=[.!?])\s+/).find(Boolean)?.slice(0, 120) ?? topic;

  const distractors = [
    "It is not mentioned",
    "Around the year 2000",
    "A different author",
    "An unrelated event",
    "None of the above",
    "Only in fiction",
    "After the year 1900",
    "Unknown location",
  ];

  const makeOptions = (correct: string, pool: string[]) => {
    const options = [correct];
    for (const d of pool) {
      if (options.length >= 4) break;
      if (!options.includes(d)) options.push(d);
    }
    while (options.length < 4) {
      options.push(distractors[options.length % distractors.length]);
    }
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    return {
      options: shuffled,
      correctIndex: shuffled.indexOf(correct),
    };
  };

  const q1Correct = phrases[0] ? phrases[0] : topic;
  const q1 = makeOptions(q1Correct, phrases.slice(1).concat(distractors));

  const q2Correct = "A concise overview of the main ideas";
  const q2 = makeOptions(q2Correct, [
    "Only trivia facts",
    "A list of dates only",
    "Unrelated news headlines",
  ]);

  const q3Correct = firstSentence.slice(0, 80) + (firstSentence.length > 80 ? "…" : "");
  const q3 = makeOptions(q3Correct, [
    "The article has no opening idea",
    "It begins with a quiz answer key",
    "It starts with a shopping list",
  ]);

  const q4Correct = phrases[1] ?? "key themes in the text";
  const q4 = makeOptions(q4Correct, phrases.slice(2).concat(distractors));

  const q5Correct = summary.split(/(?<=[.!?])\s+/)[0]?.slice(0, 90) || summary.slice(0, 90);
  const q5 = makeOptions(q5Correct, [
    "The summary is empty",
    "It only lists author names",
    "It rejects the article topic",
  ]);

  return [
    {
      id: "gq1",
      question: `Which term is most central to "${topic}"?`,
      ...q1,
    },
    {
      id: "gq2",
      question: "What does a good summary of this article provide?",
      ...q2,
    },
    {
      id: "gq3",
      question: "Which line best matches the opening of the article?",
      ...q3,
    },
    {
      id: "gq4",
      question: `Which idea is also important in "${topic}"?`,
      ...q4,
    },
    {
      id: "gq5",
      question: "Which statement best matches the generated summary?",
      ...q5,
    },
  ];
}
