# Your 20-point checklist: status and evidence

Checked on the final build. "Evidence" names the test or file that proves it. Re-run everything with `npm run verify`, `python3 scripts/qa-browser.py` and `python3 scripts/qa-nginx.py`.

| # | Item | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Remove horizontal scrolling | Done | `qa-browser.py`: 0 px overflow on all 19 pages at 320 to 1920 px, in both dark and light themes |
| 2 | Find broken links | Done | `check-links.mjs`: 766 internal links, assets, fonts and anchors, 0 broken. All 8 GitHub repos confirmed with `git ls-remote`. Certificate and LinkedIn links could not be opened from the build environment (see CONTENT_TODO) |
| 3 | Add mobile menu | Done | Hamburger with `aria-expanded`, Esc and link-click close; tested with touch emulation |
| 4 | Add a favicon | Done | `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, 192/512 icons, `site.webmanifest`; checked on every page |
| 5 | Fix page title | Done | Unique, under 70 characters, one per page; duplicates fail QA |
| 6 | Add meta description | Done | Unique, under 200 characters, one per page; duplicates fail QA |
| 7 | Fix footer links | Done | Footer links are covered by the link checker and by the "no empty or # links" QA |
| 8 | Custom 404 page | Done | `src/pages/404.astro`, served by nginx for unknown URLs (`qa-nginx.py`) |
| 9 | Fix the copyright year | Done | Footer year is generated at build time (`src/config/env.ts`), so it is correct after every deploy |
| 10 | Compress images | Done | Certificates and photo are WebP (thumbnails 640 px, viewer 1600 px): about 0.9 MB for all 8 credentials, down from about 36 MB of JPEGs for 15 |
| 11 | Fix broken buttons | Done | QA fails on any button without a type or name and any link with an empty or `#` href; interaction tests click every control type |
| 12 | Add success messages | Done | Contact form shows success only after the form service answers OK; copy-to-clipboard confirmation |
| 13 | Add error messages | Done | Inline field errors, an error summary, and distinct messages for rejected, timed-out and offline submissions (`tests/contact-api.test.mjs`) |
| 14 | Remove placeholder text | Done | QA and a data test fail on lorem, TODO, TBD, placeholder text or `YOUR_DEPLOYED_URL_HERE`; the old placeholder `og:url` is gone |
| 15 | Remove unused navigation | Done | Six nav items, all with real pages; no dead anchors |
| 16 | Fix mobile overflow | Done | Same evidence as item 1 |
| 17 | Make the logo clickable | Done | Brand mark and name link to `/` on every page |
| 18 | Make the email clickable | Done | `mailto:` links in the footer, home call to action and contact page; QA flags emails shown as plain text |
| 19 | Every page mobile optimised | Done | All pages checked at 320 to 1920 px; touch targets are at least 44 px; the 3D scenes use fewer particles and a lower pixel ratio on mobile |
| 20 | Code organisation | Done | See `ARCHITECTURE.md`. Data, logic, config, components and browser features are in separate folders; 45 unit tests cover the logic layer; ESLint and `astro check` pass with 0 errors; dead code found by lint was removed |

Not applicable as written: "scalable API structure". The site has no backend by design. `src/lib/api/` is the seam where one would plug in; `ARCHITECTURE.md` explains how.
