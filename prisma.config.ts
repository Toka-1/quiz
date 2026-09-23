// Prisma CLI config. Keep generate working when DATABASE_URL is unset
// during install; migrate/build still need a real URL on Vercel.
import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl =
  process.env.DATABASE_URL?.trim() ||
  // Placeholder only for `prisma generate` — never used for real queries.
  "postgresql://prisma:prisma@127.0.0.1:5432/prisma?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: databaseUrl,
  },
});
