import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export class AuthError extends Error {
  status = 401;
  constructor(message = "Unauthorized") {
    super(message);
  }
}

export async function requireDbUser() {
  const { userId } = await auth();
  if (!userId) throw new AuthError();

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null;
  const name =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.username ||
    null;

  return prisma.user.upsert({
    where: { clerkId: userId },
    update: { email: email ?? undefined, name: name ?? undefined },
    create: { clerkId: userId, email, name },
  });
}

export function jsonError(error: unknown) {
  if (error instanceof AuthError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  const message = error instanceof Error ? error.message : "Server error";
  console.error(error);
  return Response.json({ error: message }, { status: 500 });
}
