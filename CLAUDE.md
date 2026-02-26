# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio/blog site (codelsior.fr) built with Astro, based on the Aria template. Content is in French.

## Commands

- **Dev server:** `pnpm dev` (port 4321)
- **Build:** `pnpm build` (runs `astro check` then `astro build`)
- **Preview production build:** `pnpm preview`
- **Lint/format:** `pnpm check` (Biome with `--apply-unsafe`)
- **Type check only:** `pnpm astro check`

Package manager is **pnpm** (9.12.2). Node version: 20 (see `.node-version`).

## Architecture

**Framework:** Astro 4.x with Tailwind CSS and TypeScript.

- `src/pages/` — File-based routing. Dynamic routes use `[slug].astro` pattern.
- `src/layouts/` — Three layouts: `main.astro` (base), `post.astro` (blog posts), `project.astro` (project pages).
- `src/components/` — Astro server-side components. `home/` subfolder contains homepage sections.
- `src/content/post/` — Markdown blog posts using Astro Content Collections. Schema defined in `src/content/config.js` (title, description, dateFormatted).
- `src/collections/` — Static JSON data files (`menu.json`, `projects.json`, `experiences.json`) consumed by components.
- `src/assets/css/main.css` — Tailwind base + custom CSS animations (dark mode, sticky header).
- `src/assets/js/main.js` — Client-side JS for dark mode toggle, sticky header, and mobile menu.

## Key Conventions

- Dark mode uses Tailwind's `class` strategy with localStorage persistence.
- All styling is Tailwind utility classes; blog post content uses `@tailwindcss/typography` prose classes.
- Formatting: 2-space indentation, LF line endings (see `.editorconfig`).
- Biome handles both linting and import organization.
