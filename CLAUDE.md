# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal technical blog (blog.windstone.cc) built with **VuePress 2** (RC) and **vuepress-theme-hope**. Written in Chinese. Content lives in `docs/` as markdown files (~630 pages). The site is deployed to GitHub Pages (`wind-stone/wind-stone.github.io`) via a force-push script.

## Commands

- `pnpm dev` — start VuePress dev server (opens browser automatically, debug mode enabled)
- `pnpm build` — production build to `docs/.vuepress/dist/`
- `pnpm deploy` — injects `<global-config />` into all markdown files, builds, then removes the injection
- `pnpm deploy-github` — runs `deploy.sh` which builds and force-pushes `dist/` to GitHub Pages
- `pnpm lint` — runs lint-staged (ESLint on staged `.js` and `.vue` files only)
- `pnpm docs:clean-dev` — dev server with clean cache (useful when things behave oddly)

There is no test suite.

## Package Manager & Runtime

- **pnpm** (v9.11.0 specified in `packageManager` field). Do not use npm/yarn.
- **Node >= 20.17.0** required.
- ESM project (`"type": "module"` in package.json).

## Architecture

### Content pipeline

`docs/` is the VuePress source root. Each top-level directory under `docs/` is a content section (frontend-fundamentals, full-stack, llm, vue, interview, wander, webgl-programming-guide). Navigation is defined in `docs/.vuepress/navbar.ts` and sidebars in `docs/.vuepress/sidebar/list/` (one file per section, aggregated by `docs/.vuepress/sidebar/index.ts`).

### Deploy-time component injection

The `<global-config />` component (Giscus comments + busuanzi visitor counter) is **not** in markdown source files. The build scripts in `build/` (`addComponents.js` / `delComponents.js`) append and strip this component from every `.md` file at deploy time. Never commit markdown files with `<global-config />` in them.

### Vue components in markdown

`.vue` files in `docs/.vuepress/components/` are auto-registered via `@vuepress/plugin-register-components` and can be used directly in markdown. The naming convention is kebab-case based on directory/file path, e.g. `components/animation-effects/gradient-shadows.vue` becomes `<animation-effects-gradient-shadows />`. Code import in markdown uses `@components` alias which resolves to the components directory.

### `apps/` directory

Contains standalone sub-projects that are **not** part of the VuePress build. These are independent (their own package.json, dependencies, etc.) and should be developed in isolation.

## Git Conventions

- Commit messages follow **Conventional Commits** (enforced by commitlint via husky). Messages are typically in Chinese, e.g. `feat: 添加XXX`, `fix: 修复XXX`.
- Pre-commit hook runs ESLint on staged `.js`/`.vue` files.
- Main branch is `master`.

## Code Style

- **Prettier**: 4-space indent, single quotes, 120 char width, LF line endings, trailing commas (es5). Config in `.prettierrc`.
- **ESLint**: flat config (`eslint.config.ts`). JS + Vue rules only; TypeScript ESLint rules are currently commented out.
- **markdownlint**: ATX headings, no line-length limit, 4-space list indent, allows `<sup>`/`<sub>` inline HTML.

## Known VuePress Gotchas

These are documented in `vuepress-skills.md` and are easy to waste time on:

- `process.env.NODE_ENV` in markdown breaks rendering. Workaround: write as `p rocess.env.NODE_ENV` (with a space).
- Raw HTML tags like `</body>` in markdown break rendering.
- Pipe characters (`|`) inside markdown table cells must be escaped as `\|`.
- Internal links should use relative/absolute paths (e.g. `../guide/introduction.md`), not full URLs.

## Key Config Files

| File                              | Purpose                                                          |
| --------------------------------- | ---------------------------------------------------------------- |
| `docs/.vuepress/config.ts`        | VuePress + theme + plugin configuration                          |
| `docs/.vuepress/navbar.ts`        | Top navigation bar                                               |
| `docs/.vuepress/sidebar/index.ts` | Sidebar aggregator                                               |
| `docs/.vuepress/templates/`       | Custom HTML templates (dev + build) with particles.js background |
| `build/`                          | Deploy-time component injection/removal scripts                  |
| `deploy.sh`                       | GitHub Pages force-push deployment                               |
