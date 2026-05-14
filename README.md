# Project Script Reference

This repository utilizes a high-performance modern web stack powered by **Astro**, **Bun (as runtime & package manager)**, **React & Shadcn UI**, **Tailwind CSS v4 (via Vite)**, and **Drizzle ORM** targeting a standalone local SQLite database environment.

The primary goal of this project is to build a modern, rapid, and lightweight **CRM / Admin Panel System** to manage, analyze, and update database entities such as **Clients**, **Orders**, **Analytics**, **Partners**, **Products**, and **Services**.

---

## 🚀 Development & Core Commands

| Command | Script | Description |
| :--- | :--- | :--- |
| `bun run dev` | `bunx --bun astro dev` | Starts the local development server utilizing Bun execution for maximum speed with hot-module reloading (HMR). |
| `bun run sync` | `astro sync` | Generates TypeScript types for your Astro content collections and architecture definitions. |
| `bun run astro` | `astro` | A CLI passthrough enabling the execution of arbitrary Astro commands directly (e.g., `bun run astro --help`). |

---

## 📦 Build & Preview Pipelines

| Command | Script | Description |
| :--- | :--- | :--- |
| `bun run build` | `bun run astro check && bunx --bun astro build && bun run build:tailwind && bun run build:postcss` | The core **production build pipeline**. It performs TypeScript type-checking, compiles the Astro app with Node SSR standalone adapter targets, and heavily optimizes static and stylesheet distributions. |
| `bun run preview` | `astro build && astro preview` | Performs a production build and immediately spins up a local Node server to preview the production-ready application. |

---

## 🎨 Stylesheet Compilation

*Note: While Tailwind CSS v4 runs smoothly through the Vite plugin in dev mode, these production pipeline scripts ensure strict post-processing build distribution compliance.*

| Command | Script | Description |
| :--- | :--- | :--- |
| `bun run build:tailwind` | `bun x @tailwindcss/cli -i src/styles/global.css -o dist/global.css --minify` | Compiles standalone Tailwind v4 utility classes via the native Tailwind CLI, generating an optimized and minified global stylesheet in `dist/`. |
| `bun run build:postcss` | `postcss dist/global.css -o dist/global.css` | Passes the compiled stylesheet through PostCSS to seamlessly apply specific vendor transforms or plugins in-place. |

---

## 🗄️ Database Management (Drizzle ORM)

This project connects to a local instance database using **Drizzle ORM** with `better-sqlite3` and `@libsql/client`.

| Command | Script | Description |
| :--- | :--- | :--- |
| **`bun run db:generate`** | `bunx drizzle-kit generate` | Scans `schema.ts` definition files and creates structured incremental SQL migration files. |
| **`bun run db:migrate`** | `bunx drizzle-kit migrate` | Executes and applies all outstanding SQL migrations to your target local database file. |
| **`bun run db:push`** | `bun drizzle-kit push` | Instantly syncs and maps your current TypeScript schema file structure directly to the local DB file. Ideal for prototyping new CRM modules (e.g., Partners, Products) without writing migration records. |
| **`bun run studio`** | `bunx drizzle-kit studio --port 4984` | Launches Drizzle's browser-based database management visual GUI on port `4984` to inspect, filter, and modify rows within CRM tables. |
| **`bun run db:check`** | `bun drizzle-kit check` | Validates that your local database schema file structure is safely and entirely in sync with generation logs. |

---

## 🔧 Maintenance

| Command | Script | Description |
| :--- | :--- | :--- |
| **`bun run browserslist`** | `bunx update-browserslist-db@latest` | Updates your local `caniuse-lite` database target indices, keeping CSS autoprefixing completely updated to current vendor browser builds. |

---

## 🛠️ Stack Summary

- **Framework Engine:** Astro v6 (configured in SSR `standalone` Node.js execution mode).
- **Component Ecosystem:** React 19 + Shadcn UI components optimized via `class-variance-authority` and `tailwind-merge`.
- **Styling Architecture:** Tailwind CSS v4 running via native Vite compiler plugins (`@tailwindcss/vite`).
- **Database Architecture:** Local SQLite engine automated by Drizzle ORM tracking, operating synchronously with ultra-low latency.