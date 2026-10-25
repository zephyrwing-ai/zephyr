# zephyr

A personal site for weekly notes, everyday observations, and work in progress.

## Run locally

Use Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4321/`. Run `npm run build` to check the project and generate `dist/`, then `npm run preview` to view the build.

## Edit

- `src/config/site.ts`: name, introduction, X and GitHub links, contact email, and sections.
- `src/content/entries/`: Markdown articles in `weekly`, `life`, and `project`.
- `src/styles/global.css`: colors, layout, and typography.
- `public/`: images and icons.

Each article declares `section`, `title`, `description`, and `publishedAt`. Its filename supplies the URL slug. Use `topic` for Life groups, `featured` for homepage selections, and `cover` for project images.

Weekly entries are grouped by publication year. Each year is collapsible, and the group containing the current article opens automatically.

Keep drafts with `draft: true`. Publication dates use the Shanghai calendar, and scheduled entries appear after a build on or after their publication date.

The Contact link uses the visitor's configured email application to compose a message. Reading-focus regression tests run with `node --experimental-strip-types --test tests/reading-position.test.mjs`.

## Deploy

Set `SITE_URL` to the production origin when building, then deploy `dist/` to a static host.

```sh
SITE_URL=https://your-domain.example npm run build
```

Asset credits and licenses are listed in `THIRD_PARTY_NOTICES.md`.
