import { requireDbUser, jsonError } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ articleId: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const user = await requireDbUser();
    const { articleId } = await params;

    const article = await prisma.article.findFirst({
      where: { id: articleId, userId: user.id },
      include: {
        quizzes: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            questions: { orderBy: { order: "asc" } },
            attempts: {
              where: { userId: user.id },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    if (!article) {
      return Response.json({ error: "Article not found" }, { status: 404 });
    }

    return Response.json({ article });
  } catch (error) {
    return jsonError(error);
  }
}

/** Spec alias: POST /api/article/:articleId — fetch article */
export async function POST(req: Request, ctx: Params) {
  return GET(req, ctx);
}
