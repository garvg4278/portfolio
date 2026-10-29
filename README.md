# Garv Gupta — Portfolio

A 3D developer portfolio for Garv Gupta (B.E. Computer Science Engineering, Chandigarh University, 2026; DevOps and cloud engineering).
Built with **Astro** (static output), **Three.js** (lazy-loaded scenes) and plain CSS. Served from an **nginx** container.

Live: https://garv-gupta-portfolio.bytexl.live

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Hero with an interactive 3D layer stack, direction, three featured projects, skills, credentials, achievements, qualities, contact call to action |
| `/about/` | Biography, professional qualities with evidence, timeline |
| `/projects/` | Filterable grid of 12 projects (consistent card system) |
| `/projects/<slug>/` | One page per project: problem, interactive architecture flow, approach, and every case-study section that has content |
| `/skills/` | Skill map by depth (hands-on, working knowledge, learning), each linked to evidence |
| `/education/` | Degree (CGPA 7.68/10) and 10 credentials (cloud, DevOps, cybersecurity, SQL, programming) with type labels, verification links and a certificate viewer |
| `/contact/` | Contact details and a form (mailto fallback, or direct submission if configured) |

## Run locally

Requires Node 22+.

```bash
npm ci
npm run dev        # http://localhost:4321
npm run build      # outputs ./dist
npm run preview    # serve ./dist
npm run lint         # ESLint
npm run typecheck    # astro check (TypeScript)
npm test             # unit tests for the logic layer
npm run check:links  # after a build: checks every internal link, asset and #anchor
npm run verify       # all of the above plus a production build
```

Browser and server checks (need Playwright, nginx and `axe-core` locally): `python3 scripts/qa-browser.py` (also `THEME=light`), `python3 scripts/qa-interactions.py`, `python3 scripts/qa-a11y.py` and `python3 scripts/qa-nginx.py`.

In headless browsers without a GPU the 3D scene deliberately falls back to a static poster. Add `?scene=force` to the URL to force WebGL.

## Update content (no layout changes needed)

| What | File |
| --- | --- |
| Name, links, intro, hero layers | `src/data/site.ts` (env-driven values come from `src/config/env.ts`) |
| Projects and case studies | `src/data/projects.ts` (types in `src/types/index.ts`) |
| Skills and depth levels | `src/data/skills.ts` |
| Certificates | `src/data/credentials.ts` (+ images via `scripts/optimize-images.py`) |
| Qualities, education entries | `src/data/about.ts` |
| Colours, type, spacing, dark and light themes | `src/styles/global.css` (palette constants plus semantic tokens per theme) |

A project page shows only the sections that exist in its data entry. Add `contribution`, `challenges`, `decisions`, `verification`, `results` or `limitations` and the section appears. Add `repo` or `live` only with real URLs.

Regenerate generated assets:

```bash
python3 scripts/build-resume.py   # starter resume PDF from site facts (replace with your own if you prefer)
python3 scripts/build-og.py       # social preview image public/og.png
python3 scripts/build-icons.py    # favicon.ico, apple-touch-icon and app icons from public/favicon.svg
python3 scripts/optimize-images.py <folder-of-original-jpgs>
```

## Contact form

Without configuration, the form validates input and opens the visitor's email app with the message filled in. It never claims a message was sent.
To submit directly, create a form endpoint (for example Formspree), then build with:

```bash
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx npm run build   # see .env.example
```

The success message appears only after the endpoint returns an OK response. For Docker/CI builds, pass it as a build argument or repository variable. The value is public.

## Docker

```bash
docker build -t garv-portfolio .
docker run -p 8080:80 garv-portfolio      # http://localhost:8080
docker pull ghcr.io/garvg4278/garv-portfolio:latest
```

The Dockerfile is multi-stage: Node builds the site and runs the link check, then `nginx:alpine` serves `dist/` using `nginx.conf` (caching, gzip, security headers, 404 page).

## CI/CD

`.github/workflows/docker-ci.yml`:

1. **check** (push and pull request): `npm ci`, lint, type-check, unit tests, `npm run build`, `npm run check:links`.
2. **publish** (push to `main` or manual run): build the image, smoke-test it with `docker run` and `curl`, push `latest` and the 7-character commit SHA to `ghcr.io/garvg4278/garv-portfolio`. Registry login uses the `GHCR_PAT` repository secret, as before.

**The workflow publishes an image. It does not deploy it.** Whatever serves https://garv-gupta-portfolio.bytexl.live must be pointed at the new image (or rebuilt from this repository) for the new site to go live. See `docs/DEPLOYMENT.md`.

## Structure

```
src/data/        content only (projects, skills, credentials, site facts)
src/types/       shared TypeScript types for the content
src/config/      env.ts: the only file that reads environment variables
src/lib/         pure logic, unit-tested (projects, flow layout, validation, store, scene config)
src/lib/api/     http.js (timeout, normalised errors) and contact.js (submission adapter)
src/components/  Astro components: markup and scoped CSS only
src/scripts/     features/ (one module per browser feature) and scene.js (Three.js, lazy chunk)
src/pages/       routes (file-based), sitemap.xml.ts
src/styles/      global.css (design tokens and base styles)
public/          fonts, certificates (WebP), profile photo, resume PDF, icons, og.png, robots.txt
scripts/         link checker, browser and nginx QA, asset generators
tests/           node:test unit tests
docs/            ARCHITECTURE.md, UI_FEATURES.md, CHANGES.md, CONTENT_TODO.md, DEPLOYMENT.md, TESTING.md, QA_CHECKLIST.md
```

See `docs/ARCHITECTURE.md` for the layering rules, state management, error handling and naming conventions.
