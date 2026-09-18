import { requireDbUser, jsonError } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireDbUser();
    const articles = await prisma.article.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        summary: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { quizzes: true } },
      },
    });
    return Response.json({ articles });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireDbUser();
    const body = (await req.json()) as { title?: string; content?: string };
    const title = body.title?.trim() ?? "";
    const content = body.content?.trim() ?? "";

    if (!title || content.length < 40) {
      return Response.json(
        { error: "Title and content (min ~40 chars) are required" },
        { status: 400 },
      );
    }

    const article = await prisma.article.create({
      data: { title, content, userId: user.id },
    });

    return Response.json({ article }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
