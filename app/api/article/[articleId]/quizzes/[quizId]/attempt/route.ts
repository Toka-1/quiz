import { requireDbUser, jsonError } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ articleId: string; quizId: string }> };

export async function POST(req: Request, { params }: Params) {
  try {
    const user = await requireDbUser();
    const { articleId, quizId } = await params;
    const body = (await req.json()) as { answers?: (number | null)[] };

    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, articleId, article: { userId: user.id } },
      include: { questions: { orderBy: { order: "asc" } } },
    });

    if (!quiz) {
      return Response.json({ error: "Quiz not found" }, { status: 404 });
    }

    const answers = Array.isArray(body.answers) ? body.answers : [];
    const normalized = quiz.questions.map((_, i) => {
      const a = answers[i];
      return typeof a === "number" ? a : -1;
    });

    const score = quiz.questions.reduce((sum, q, i) => {
      return sum + (normalized[i] === q.correctIndex ? 1 : 0);
    }, 0);

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        userId: user.id,
        answers: normalized,
        score,
      },
    });

    return Response.json({
      attempt,
      quiz: {
        id: quiz.id,
        questions: quiz.questions,
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}
