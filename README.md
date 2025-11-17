# Bloodbank UI

Frontend for the Bloodbank management system — a Next.js app providing the UI and API routes used by the project.

**Project layout (selected)**
- `app/` — Next.js app directory (routes, pages, components)
- `app/api/` — server API routes (donors, requests, stock, units, health-records, agreements)
- `lib/db.js` — MySQL connection helper (reads DB credentials from environment variables)
- `public/` — static assets

**Prerequisites**
- Node.js (modern LTS, e.g. Node 18+)
- npm or yarn
- A running MySQL-compatible database for the app's API routes

Getting started

1. Install dependencies:

```powershell
npm install
```

2. Create an environment file at the project root named `.env.local` and set the database variables (this file is ignored by Git):

```text
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database
# optional
DB_PORT=3306
```

3. Run the development server:

```powershell
npm run dev
```

Build and run

```powershell
npm run build
npm start
```

Available scripts (from `package.json`)
- `dev` — run Next.js in development mode
- `build` — build the production app
- `start` — start the production server
- `lint` — run ESLint

Environment variables
- The application reads database connection settings from environment variables used in `lib/db.js`:
  - `DB_HOST`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME`
  - `DB_PORT` (optional)

Security and git
- The repository includes a `.gitignore` entry for environment files (e.g. `.env`, `.env.local`, `.env.*.local`). Do NOT commit credentials.

Notes
- This is a UI + API project built with Next.js 16. Adjust Node version and tooling to match your environment if necessary.

If you'd like, I can commit these files for you or expand the README with architecture diagrams, endpoint examples, or deployment instructions. Which would you prefer?
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
