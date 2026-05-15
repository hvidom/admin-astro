# 🚀 Astro Admin Dashboard

A high-performance, dark-mode ready **CRM & Admin Panel** built with a modern web stack. This repository marks the transition from a traditional Express architecture to a lightning-fast, type-safe environment powered by **Astro** and **Bun**.

---

## 🛠️ Tech Stack & Resources

| Technology | Purpose | Documentation |
| :--- | :--- | :--- |
| **Astro v6** | Web Framework (SSR Mode) | [astro.build](https://astro.build/) |
| **Bun** | Runtime, Package Manager & Bundler | [bun.sh](https://bun.sh/) |
| **Drizzle ORM** | Type-safe TypeScript ORM | [orm.drizzle.team](https://orm.drizzle.team/) |
| **Tailwind v4** | CSS Framework (Vite Engine) | [tailwindcss.com](https://tailwindcss.com/) |
| **Shadcn UI** | Accessible UI Components | [ui.shadcn.com](https://ui.shadcn.com/) |
| **React 19** | Component Library | [react.dev](https://react.dev/) |

---

## 📦 Key Packages Explained

Based on the latest `package.json`, here are the critical tools powering this dashboard:

* **`better-auth`**: A modern, framework-agnostic authentication library that handles sessions and user management with zero-config database integration.
* **`@dnd-kit`**: A collection of lightweight, modular toolkits for drag-and-drop interfaces (used for rearranging dashboard widgets or list items).
* **`@tanstack/react-table`**: The "headless" industry standard for building powerful, sortable, and filterable data grids.
* **`motion`**: High-performance animation library (formerly Framer Motion) used for fluid transitions and UI effects.
* **`recharts`**: A composable charting library built on React components, utilized for the Analytics views.
* **`next-themes`**: Logic for seamless Dark Mode toggling and system preference detection.
* **`sonner`**: An opinionated toast component for beautiful, non-intrusive notifications.

---

## 🗄️ Database Strategy (Drizzle ORM)

This project uses **Drizzle ORM** to bridge the gap between TypeScript and SQL.

**Flexibility Note:** While currently configured for a local `better-sqlite3` instance for speed and simplicity, Drizzle’s architecture is "dialect-agnostic." This means you can point your connection string to **any database**—including **PostgreSQL, MySQL, Turso (LibSQL), or Cloudflare D1**—with minimal configuration changes.

### DB Management Commands

* `bun run db:push`: Instantly syncs your `schema.ts` with the database (perfect for rapid prototyping).
* `bun run db:seed`: Populates your database with dummy data for testing CRM features.
* `bun run db:migrate`: Generates and applies structured SQL migrations for production safety.
* `bun run studio`: Opens a visual SQL editor in your browser at `localhost:4984`.

---

## 📂 Project Migration: `DBWebsite2`

The `DBWebsite2` folder contains a specialized **demo project migration**.

Originally built as a monolithic **Express.js** server, this module has been refactored to run on **Bun** and **Hono**.

* **Goal:** To demonstrate the massive performance gains and reduced memory footprint of moving from Node/Express to the Bun/Hono ecosystem.
* **Features:** High-speed edge-ready routing and significantly lower latency for API endpoints.

---

## 🚀 Getting Started

### Development

## Install dependencies using Bun

bun install

## Start the local development server

bun run dev

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

* **Framework Engine:** Astro v6 (configured in SSR `standalone` Node.js execution mode).
* **Component Ecosystem:** React 19 + Shadcn UI components optimized via `class-variance-authority` and `tailwind-merge`.
* **Styling Architecture:** Tailwind CSS v4 running via native Vite compiler plugins (`@tailwindcss/vite`).
* **Database Architecture:** Local SQLite engine automated by Drizzle ORM tracking, operating synchronously with ultra-low latency.
