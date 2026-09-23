const url = process.env.DATABASE_URL?.trim() ?? "";

if (!url) {
  console.error(`
[build] DATABASE_URL is missing or empty.

Fix on Vercel:
1. Project → Settings → Environment Variables
2. Edit DATABASE_URL (do not Add a duplicate)
3. Paste your full Prisma connection string (postgres://...)
4. Enable Production + Preview (+ Development)
5. Save → Deployments → Redeploy

Do not wrap the value in quotes in the Vercel UI.
`);
  process.exit(1);
}

console.log(`[build] DATABASE_URL is set (length ${url.length})`);
