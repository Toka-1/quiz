import { requireDbUser, jsonError } from "@/lib/auth-user";
import { generateQuizWithGemini } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ articleId: string }> };

export async function POST(_req: Request, { params }: Params) {
  try {
    const user = await requireDbUser();
    const { articleId } = await params;

    const article = await prisma.article.findFirst({
      where: { id: articleId, userId: user.id },
    });

    if (!article) {
      return Response.json({ error: "Article not found" }, { status: 404 });
    }

    if (!article.summary) {
      return Response.json(
        { error: "Generate a summary before creating a quiz" },
        { status: 400 },
      );
    }

    const generated = await generateQuizWithGemini(
      `${article.title}\n\n${article.content}`,
    );

    const quiz = await prisma.quiz.create({
      data: {
        articleId: article.id,
        questions: {
          create: generated.map((q, order) => ({
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            order,
          })),
        },
      },
      include: {
        questions: { orderBy: { order: "asc" } },
      },
    });

    return Response.json({ quiz }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const user = await requireDbUser();
    const { articleId } = await params;

    const article = await prisma.article.findFirst({
      where: { id: articleId, userId: user.id },
      select: { id: true },
    });
    if (!article) {
      return Response.json({ error: "Article not found" }, { status: 404 });
    }

    const quiz = await prisma.quiz.findFirst({
      where: { articleId },
      orderBy: { createdAt: "desc" },
      include: {
        questions: { orderBy: { order: "asc" } },
        attempts: {
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return Response.json({ quiz });
  } catch (error) {
    return jsonError(error);
  }
}
