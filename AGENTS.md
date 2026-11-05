# Repository Instructions

## Project

This repository contains the public `zephyr` personal site. Astro renders the pages, React supports interactive islands, and Tailwind CSS supplies the visual system. The production build is a static artifact in `dist/`.

## Source Of Truth

- Site identity and navigation live in `src/config/site.ts`.
- Published content lives in `src/content/entries/`.
- Global visual rules live in `src/styles/global.css`.
- Shared layouts and page composition live in `src/layouts/`.
- Static assets live in `public/`.
- Article authoring rules live in `docs/article-publishing.md`.

Read the relevant source and documentation before changing behavior.

## Verification

Use Node.js 22.22 or newer.

```sh
npm ci
npm test
npm run build
```

`npm run build` runs `astro check` before `astro build`. Run the relevant tests for every behavior change and run both `npm test` and `npm run build` before delivery.

## Engineering Quality

- Diagnose the root cause before choosing an implementation.
- Keep state ownership and data flow explicit across Astro, React, and browser APIs.
- Reuse existing design tokens, configuration, utilities, and components.
- Place content in the content collection and site-wide values in `src/config/site.ts`.
- Add regression coverage when behavior changes.
- Preserve semantic HTML, keyboard access, reduced-motion support, and responsive behavior.
- Keep generated output in `dist/` out of version control.
- Keep credentials in GitHub Actions secrets and commit only secret references such as `${{ secrets.OPENAI_API_KEY }}`.
- Work on a focused branch, commit related files together, and report the verification commands and results.

## Agent Delivery

Agent-generated changes follow the same branch, pull request, and CI path as human changes. Each change description states the problem, the implementation, the verification evidence, and any remaining external dependency.

