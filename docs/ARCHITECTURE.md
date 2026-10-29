# Architecture

A static site: Astro renders every page to plain HTML at build time, and nginx serves the files. There is deliberately **no application server and no database**; nothing on the site needs one. The only runtime network call is the optional contact-form request.

## Layers and where things live

| Layer | Folder | Rule |
| --- | --- | --- |
| Content (data) | `src/data/*.ts`, `src/types/` | Plain typed objects. No logic. Edit these to change the site. |
| Business logic | `src/lib/*.js`, `src/lib/api/*.js` | Pure, framework-free functions with JSDoc types (projects, flow layout, validation, theme, clipboard, formatting, store, scene config). Unit-tested. No direct DOM access. |
| Configuration | `src/config/env.ts`, `astro.config.mjs`, `.env.example` | The only places that read environment variables. Public values only. |
| UI components | `src/components/*.astro`, `src/layouts/` | Markup and scoped CSS. They import logic from `src/lib` and data from `src/data`. |
| Browser behaviour | `src/scripts/features/*.js` | One module per feature (nav, theme, scroll chrome, copy, confirm dialog, filters, flow diagram, form...). Each exposes an `init...()` function wrapped in `safe()` so one failure cannot break the page. |
| 3D | `src/scripts/scene.js`, `src/scripts/features/lazy-scene.js` | One lazy chunk. Quality decisions come from `src/lib/scene-config.js`. |
| Routes | `src/pages/` | File-based routing. `projects/[slug].astro` generates one page per project. |
| Tooling | `scripts/`, `tests/`, `.github/`, `Dockerfile`, `nginx.conf` | Link checker, asset generators, browser QA, unit tests, CI, image. |

## State management

Interactive features keep their state in a tiny observable store (`src/lib/store.js`: `get`, `set`, `subscribe`) and render from it: project filter, skill filter, hero layer selection and the architecture flow diagram. State is local to a page; nothing is shared between pages, so a heavier library would add weight without benefit.

## Error handling

- Every feature starts through `safe(name, fn)` (`src/lib/safe.js`).
- All network access goes through `src/lib/api/http.js`: a timeout, and errors normalised into `ApiError` with a `kind` of `http`, `network` or `timeout`.
- The contact flow (`src/lib/api/contact.js`) returns one of four honest results (`sent`, `compose`, `rejected`, `unreachable`) and never reports success unless the form service answered with an OK status.
- WebGL: no context, a software renderer, or save-data mode leaves the static poster in place; the page is complete without 3D.
- `JSON.parse` of embedded data is guarded; missing DOM nodes make a feature exit quietly.
- Build-time: unknown project slugs throw, the link checker fails CI on any broken internal link, and data-integrity tests fail on duplicate slugs, dead evidence links, missing images or placeholder text.

## API structure

There is no backend API, by design. The seam for one already exists: `src/lib/api/http.js` (transport) and `src/lib/api/contact.js` (one endpoint adapter). To add a real backend later (for example a serverless function for the contact form), implement it behind `PUBLIC_FORM_ENDPOINT` or add a new adapter beside `contact.js` that uses `postJson`. Nothing in the UI needs to change.

## Conventions

- Components: `PascalCase.astro`. Everything else: `kebab-case.js`. Data and types: lower-case names (`projects.ts`).
- One concern per file. Pure logic never touches `document`; DOM code never contains business rules.
- Content strings contain no placeholders: tests fail on `lorem`, `TODO`, `TBD`, `placeholder`.
- Colours, type, spacing and motion timings are CSS custom properties in `src/styles/global.css`. Components use semantic tokens (`--bg`, `--fg`, `--accent`, `--surface-1`), never raw palette values, so both themes work; a subtree with `data-theme="dark"` stays dark inside a light page.

## Quality gates

`npm run verify` runs: ESLint, `astro check` (types), unit tests, production build, link check. CI runs the same steps before it builds and publishes the image. `scripts/qa-browser.py` adds a real-browser pass across every page at nine widths.
