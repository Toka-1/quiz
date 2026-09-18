# Quiz app — Article Quiz Generator

Нийтлэл оруулаад **Gemini AI**-аар хураангуйлж, автоматаар **quiz** үүсгэн шалгах веб апп.

## Технологи

| Хэсэг | Технологи |
|--------|-----------|
| Frontend | Next.js (App Router), React, Tailwind CSS |
| Auth | Clerk (email / Google) |
| Backend API | Next.js `app/api/` |
| ORM / DB | Prisma + PostgreSQL |
| AI | Google Gemini |
| Deploy | Vercel-д тохиромжтой |

## Гол боломжууд

1. **Нэвтрэх / бүртгүүлэх** — Clerk (имэйл, Google)
2. **Нийтлэл оруулах** — гарчиг + текст
3. **Хураангуйлах** — Gemini summary, PostgreSQL-д хадгална
4. **Quiz үүсгэх** — максимум 5 олон сонголттой асуулт
5. **Quiz өгөх** — оноо, зөв/буруу хариулт харна
6. **History** — sidebar-д өмнөх нийтлэлүүд
7. **Хэл солих** — EN | MN

## Суулгах

```bash
cd quiz
npm install
```

### Environment хувьсагч

`.env.example`-ийг хуулж `.env.local` үүсгэ:

```bash
cp .env.example .env.local
```

Дараах утгуудыг бөглөнө:

| Хувьсагч | Тайлбар |
|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `DATABASE_URL` | PostgreSQL connection string |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) |

Сонголттой:

```bash
GEMINI_MODEL=gemini-2.5-flash
```

### Өгөгдлийн сан

```bash
npx prisma migrate deploy
# эсвэл хөгжүүлэлтэд:
npx prisma migrate dev

npx prisma generate
```

Түр Prisma Postgres (24ц):

```bash
npx create-db create -r ap-southeast-1 -e .env.local -t 24h
npx prisma migrate deploy
```

### Ажиллуулах

```bash
npm run dev
```

- Апп: [http://localhost:3000](http://localhost:3000)
- Prisma Studio: `npx prisma studio` → [http://localhost:5555](http://localhost:5555)

## Хэрэглэх заавар

1. `/sign-in` эсвэл `/sign-up` — нэвтэрнэ
2. `/home` — нийтлэлийн гарчиг, текст оруулна
3. **Generate summary / Хураангуйлах** — AI summary үүснэ
4. **Create quiz / Take a quiz** — 5 асуулттай тест
5. Үр дүн дээр зөв хариулт, оноо харна
6. Sidebar **History** — өмнөх нийтлэл рүү буцна
7. Header дээр **EN | MN** — хэл солино

## API

| Method | Path | Тайлбар |
|--------|------|---------|
| `GET` | `/api/articles` | Хэрэглэгчийн нийтлэлүүдийн жагсаалт |
| `POST` | `/api/articles` | Нийтлэл үүсгэх |
| `GET` / `POST` | `/api/article/[articleId]` | Нэг нийтлэл авах |
| `POST` | `/api/generate` | Summary үүсгэж хадгалах |
| `GET` / `POST` | `/api/article/[articleId]/quizzes` | Quiz авах / үүсгэх |
| `POST` | `/api/article/[articleId]/quizzes/[quizId]/attempt` | Хариулт илгээх, оноо |

Бүх API Clerk session шаардана.

## Өгөгдлийн загвар (Prisma)

- **User** — `clerkId`, email, name
- **Article** — title, content, summary
- **Quiz** — article-тай холбоотой
- **QuizQuestion** — question, options[], correctIndex
- **QuizAttempt** — answers[], score

Schema: `prisma/schema.prisma`

## Төслийн бүтэц

```
quiz/
├── app/
│   ├── api/                 # Backend API
│   ├── article/[id]/        # Summary, quiz, result
│   ├── home/                # Нийтлэл оруулах
│   ├── sign-in/ sign-up/    # Clerk auth
│   ├── page.tsx             # Landing
│   └── layout.tsx
├── components/              # AppShell, LanguageToggle, UI
├── lib/
│   ├── api.ts               # Frontend API client
│   ├── auth-user.ts         # Clerk → DB user
│   ├── gemini.ts            # Summary + quiz AI
│   ├── prisma.ts
│   └── i18n/                # EN / MN орчуулга
└── prisma/
    ├── schema.prisma
    └── migrations/
```

## Скриптүүд

```bash
npm run dev          # хөгжүүлэлтийн сервер
npm run build        # production build
npm run start        # production сервер
npm run db:migrate   # prisma migrate dev
npm run db:push      # schema push
```

## Анхаарах зүйлс

- `create-db`-ийн түр DB **~24 цагийн** дараа устана. Урт хугацаанд Neon / Prisma claim / өөрийн Postgres ашигла.
- `GEMINI_API_KEY` байхгүй бол summary/quiz үүсэхгүй.
- DB унтарсан үед `Can't reach database server at db.prisma.io` гэсэн алдаа гарна — шинэ `DATABASE_URL` тавьж migrate дахин хий.

## Figma

Дизайн лавлагаа: [Quiz app (4C)](https://www.figma.com/design/GwdkdRnqbHYbyvVmFPowoz/Quiz-app--4C-)
