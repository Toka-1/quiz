import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL?.trim(),
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-flash-latest",
  "gemini-3.8-flash",
].filter((m): m is string => Boolean(m));

function getClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenerativeAI(key);
}

async function generateText(prompt: string): Promise<string> {
  const genAI = getClient();
  let lastError: unknown;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      if (!text) throw new Error("Empty response from Gemini");
      return text;
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      // try next model on unavailable / overloaded / not found
      if (
        message.includes("404") ||
        message.includes("503") ||
        message.includes("429") ||
        message.includes("not found") ||
        message.includes("no longer available") ||
        message.includes("high demand") ||
        message.includes("overloaded") ||
        message.includes("Unavailable")
      ) {
        continue;
      }
      throw error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("All Gemini models failed");
}

export async function summarizeWithGemini(content: string): Promise<string> {
  const prompt = `Please provide a concise summary of the following article: ${content}`;
  const text = await generateText(prompt);
  return text.length > 1200 ? `${text.slice(0, 1197)}...` : text;
}

export type GeneratedQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export async function generateQuizWithGemini(
  content: string,
): Promise<GeneratedQuestion[]> {
  const prompt = `Generate 5 multiple choice questions based on this article: ${content}. Return the response in this exact JSON format:
      [
        {
          "question": "Question text here",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "answer": "0"
        }
      ]
      Make sure the response is valid JSON and the answer is the index (0-3) of the correct option.`;

  const raw = await generateText(prompt);
  const jsonText = extractJson(raw);
  const parsed = JSON.parse(jsonText) as Array<{
    question: string;
    options: string[];
    answer: string | number;
  }>;

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid quiz JSON from Gemini");
  }

  return parsed.slice(0, 5).map((q, i) => {
    const options = Array.isArray(q.options) ? q.options.slice(0, 4) : [];
    while (options.length < 4) options.push(`Option ${options.length + 1}`);
    const correctIndex = Number(q.answer);
    return {
      question: q.question || `Question ${i + 1}`,
      options,
      correctIndex:
        Number.isFinite(correctIndex) && correctIndex >= 0 && correctIndex <= 3
          ? correctIndex
          : 0,
    };
  });
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start >= 0 && end > start) return text.slice(start, end + 1);
  return text;
}
