# Tests actually performed

Environment: Node 22, headless Chromium 141-era build via Playwright, nginx 1.24, Lighthouse (local CLI). The sandbox has **no GPU**, so WebGL ran on a software renderer (SwiftShader). No real device was used.

## Passed

| Check | Result |
| --- | --- |
| `npm run verify` (ESLint, `astro check`, unit tests, build, link check) | 0 lint errors, 0 type errors, 45 of 45 unit tests, 19 pages built |
| Unit tests (`tests/`) | Validation rules, contact submission (success, rejection, offline, timeout, mailto), flow layout bounds for 1 to 6 steps, project data integrity (unique slugs, real evidence links, images exist, no placeholder text, 3 featured with repos), store, scene quality rules, safe() |
| `npm run check:links` | 766 internal references (links, images, fonts, anchors) checked, 0 broken |
| GitHub repositories | All 8 linked repositories confirmed to exist with `git ls-remote` |
| `scripts/qa-browser.py` | All 19 pages at 320, 360, 390, 414, 768, 1024, 1280, 1440 and 1920 px: 0 overflow, 0 console or network errors, unique titles and descriptions, one h1, alt text, no dead links or buttons, no placeholder text, 3D scene mounts at 390 and 1440 px |
| `scripts/qa-interactions.py` | 39 checks: hero layers and slab click, skip link, theme toggle (persists, no flash, colours change), progress bar, back to top, sticky header, hover, copy buttons (clipboard really contains the email and the command), form error, busy, success and offline states with a stubbed form service, confirmation modal (cancel keeps, confirm clears), footer date and year, zero cookies, certificate viewer, mobile menu |
| `scripts/qa-a11y.py` | axe-core WCAG 2.1 A and AA rules on every page, dark and light, at 1440 and 390 px: 72 audits, 0 violations (includes colour contrast) |
| `scripts/qa-nginx.py` | Real nginx with the production config: routes, 301 redirects from old URLs, 404, security headers. It caught and fixed an infinite redirect on `/` |
| Console and network errors, 8 routes, behind nginx with the production CSP | None (the only logged error is the intentional 404 status on `/nope/`) |
| Horizontal overflow at 1440 px and 390 px, all 7 main routes | 0 px |
| 3D hero with WebGL forced (`?scene=force`) | Renders; canvas fades in over the poster; layer buttons, slab hover (raycast) and slab click all update the readout and `aria-pressed` |
| Poster fallback: software renderer (default) and WebGL fully disabled | Poster stays; no JS errors |
| Reduced motion | Name animation off, no auto-rotation (scene falls back to poster in this sandbox) |
| JavaScript disabled | Project cards and content visible |
| Project filters | Counts, hidden state, URL hash, deep link and hash change work |
| Architecture flow diagram | Selection updates panel text and `aria-current` |
| Contact form | Empty submit gives 4 inline errors, summary, focus on first field; invalid email message; valid input builds a `mailto:` and shows "nothing has been sent yet" (no fake success) |
| Certificate viewer | Opens full-size WebP (1600 px), closes on Escape, returns focus |
| Skills filter | Learning filter shows 3 items in 2 groups |
| Mobile navigation (touch emulation) | Opens, link navigates |
| nginx | `nginx -t` passes; direct URLs, trailing-slash redirect, 404 page, MIME types, cache headers, security headers and 301 redirects from the old `.html` pages verified |
| Lighthouse (nginx, headless Chromium, final build) | Home mobile: Performance 97, Accessibility 100, Best Practices 100, SEO 100 (LCP 1.7 s, CLS 0, TBT 0 ms). Education mobile: 100 on all four. See caveat below |

Initial JavaScript is about 2 KB gzipped. The Three.js chunk is 565 KB (141 KB gzipped) and loads only after idle or when a scene is near the viewport, and not at all on save-data or software-rendered WebGL.

## Caveats

- **The Lighthouse home scores measure the poster fallback**, not the live 3D scene, because a software renderer is detected and the 3D code is not even downloaded. Before that fallback existed, the same run on the 3D path scored 61 for performance with huge blocking time, which was the CPU rendering WebGL. That number says nothing about GPU hardware, but also means **3D-path performance on real devices is untested**. Run Lighthouse on your deployed site in desktop Chrome and check Core Web Vitals in the field.
- WCAG: structure, labels, focus styles, keyboard flows, reduced motion and contrast tokens were built in and Lighthouse's automated accessibility checks pass, but no screen-reader test or manual WCAG audit was done.

## Not done

- `docker build` / `docker run` (no Docker available here). The workflow's smoke-test step will be its first real run.
- GitHub Actions run, push to GHCR, and deployment to the live domain.
- Fetching external links (certificate verification URLs, GitHub, LinkedIn): network restricted.
- Safari, Firefox and real mobile devices.
