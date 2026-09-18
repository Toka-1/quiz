import { requireDbUser, jsonError } from "@/lib/auth-user";
import { summarizeWithGemini } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await requireDbUser();
    const body = (await req.json()) as {
      title?: string;
      content?: string;
      articleId?: string;
      maxLength?: number;
    };

    const maxLength = Math.min(Math.max(body.maxLength ?? 1200, 200), 4000);

    let article;

    if (body.articleId) {
      article = await prisma.article.findFirst({
        where: { id: body.articleId, userId: user.id },
      });
      if (!article) {
        return Response.json({ error: "Article not found" }, { status: 404 });
      }
    } else {
      const title = body.title?.trim() ?? "";
      const content = body.content?.trim() ?? "";
      if (!title || content.length < 40) {
        return Response.json(
          { error: "Title and content (min ~40 chars) are required" },
          { status: 400 },
        );
      }
      article = await prisma.article.create({
        data: { title, content, userId: user.id },
      });
    }

    let summary = await summarizeWithGemini(article.content);
    if (summary.length > maxLength) {
      summary = `${summary.slice(0, maxLength - 3)}...`;
    }

    article = await prisma.article.update({
      where: { id: article.id },
      data: { summary },
    });

    return Response.json({ article });
  } catch (error) {
    return jsonError(error);
  }
}
