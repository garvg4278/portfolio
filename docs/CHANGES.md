# Significant changes

## What was found in the audit

- `Portfolio.zip` and `Portfolio_Revamped.zip` contain **identical website files**. The only difference is that `Portfolio.zip` also contains the `.git` folder. The "Revamped" archive is not a newer implementation.
- The pending changes shown by `git status` in that repository are line-ending (CRLF) differences only; `git diff -w` is empty.
- The supplied source (DevOps and Backend Engineer, "graduating 2026") is **newer than the live site**. On 23 Oct 2026 https://garv-gupta-portfolio.bytexl.live was still serving an older version: "Cybersecurity & DevOps Portfolio", "7th-semester CSE student", a "Secure IoT platform (patent pending)" claim, `og:url` set to the placeholder `YOUR_DEPLOYED_URL_HERE`, and a 2025 footer. See `DEPLOYMENT.md`.
- The old contact form showed "Message noted" without sending anything (`handleFormSubmit` only reset the form).
- Most "View on GitHub" buttons pointed at the GitHub profile root, not a repository. Only `portfolio`, `Exam-Eligibility-Finder` and `DSA_Visualization` had real repository URLs.
- The old home page showed unverifiable numbers ("8+ Projects Shipped", "3+ Dockerized Systems") and wording such as "production-ready". These were removed.
- Eight certificate images were never shown on the old site (AWS, four HackerRank, NPTEL Multi-Core, Yale, Michigan). The AWS Cloud Solutions Architect certificate (Feb 2026) is the most relevant to your target roles. All 14 certificates were checked against the images.
- Certificate titles were corrected to match the certificates: "Databases and SQL for Data Science with Python" (IBM), "Cybersecurity Attack and Defense Fundamentals" (EC-Council specialization).
- The old Dockerfile and workflow had no build step, no caching or security headers, and no checks. Certificate JPEGs (about 36 MB in total, up to 7.9 MB each) were served as-is.

## What was built

- **Stack:** Astro (static output), Three.js (one lazy chunk), plain CSS design tokens, self-hosted fonts. The static output keeps the existing nginx container and GHCR pipeline model. A framework was introduced so navigation, footer, cards and diagrams are components and content lives in data files, instead of six HTML files with duplicated markup.
- **Design:** exact palette (`#000000`, `#502F4C`, `#70587C`, `#C8B8DB`, `#F5EAEC`) as CSS variables. Instrument Serif for headings, Geist for text, Geist Mono for technical metadata.
- **3D hero:** a stack of five slabs (the "layers" of DevOps work) with a pipeline spine, travelling packets, a faceted core, a grid floor and particles. Pointer parallax, hover and click on slabs, scroll-linked camera pull-back, five accessible buttons mirroring the slabs. Smaller scenes on About (orbit) and Contact (lattice, click sends a pulse).
- **3D safeguards:** lazy-loaded after idle or when near the viewport; renders only while visible; fewer particles and lower pixel ratio on mobile; frame-time check lowers pixel ratio once; static SVG poster as first paint and as fallback (no WebGL, software renderer, save-data); reduced-motion renders on demand with no auto-rotation; full disposal on page hide.
- **Projects:** one consistent card grid (3, 2, 1 columns), five category filters (only categories with projects), a live result count, URL hash deep links, and a detail page per project. Case-study sections render only when the data exists.
- **Interactive architecture flows** on each project page (keyboard accessible, `aria-current`, connection highlight).
- **Skills:** depth levels (hands-on, working knowledge, learning) with evidence links; no percentage bars.
- **Education:** 14 credentials with type labels, issuer, date, verification links where printed on the certificate, WebP thumbnails and an on-demand full-size viewer (1.4 MB total instead of about 36 MB).
- **Contact:** real validation with accessible errors; mailto fallback that does not claim success; optional direct submission through `PUBLIC_FORM_ENDPOINT` that only confirms after an OK response.
- **Resume:** a starter one-page PDF built from facts already on the site (`scripts/build-resume.py`). Replace it with your own if you keep a master copy.
- **SEO and metadata:** titles, descriptions, canonical URLs, Open Graph and Twitter cards, `og.png`, favicon, `sitemap.xml`, `robots.txt`, JSON-LD.
- **Delivery:** multi-stage Dockerfile, hardened `nginx.conf` (CSP, caching, gzip, 404 page, 301 redirects from the old `.html` URLs), CI with build, link check, image smoke test, and GHCR publish.

## Content decisions

- Presented as a 2026 graduate seeking entry-level DevOps, cloud and backend roles.
- No Experience page: there is no verified internship or employment, so achievements are on the home page and the About timeline instead of an empty page.
- Secure IoT was left out (see `CONTENT_TODO.md`).
- SSCPrep was added as a featured project; it was not in the supplied source (see `CONTENT_TODO.md`).

## Second pass (repository review, checklist, architecture)

- **Projects rebuilt from your actual repositories.** All seven were cloned and read. Several descriptions on the old site did not match the code, so they were replaced:
  - "Inventory and Workflow Management System" is now **Sweet Shop Management System**: it uses SQLite (not PostgreSQL), TypeScript, 24 Jest tests and a Jenkins pipeline.
  - "Logistics Shipment Management System" is now **ShipForge**: a complete Next.js, Express and PostgreSQL stack with multi-stage non-root images, compose health checks, a Jenkins pipeline and a Python health check (not "front end in progress").
  - **DSA Visualization** is a Next.js 15 and TypeScript app (AlgoVista), not Express and MongoDB.
  - **Exam Eligibility Finder** has no Dockerfile or multi-stage build; that claim was removed.
  - **Retail Sales** is a pandas pipeline with a PDF and Excel output; its headline figures were reproduced by re-running it.
  - **SSCPrep Platform** and **TaskFlow (team-task-manager)** are new. SSCPrep claims that could not be found in the pushed repository (cursor pagination, window-function percentiles, IST-anchored streaks) were removed.
- **Credentials trimmed from 14 to 8**, keeping DevOps, cloud, SQL and cybersecurity: AWS, IBM DevOps, Google Cybersecurity, EC-Council, NPTEL Cloud/IoT, IBM Databases and SQL, Meta Introduction to Databases, HackerRank SQL (Intermediate). Your supplied links are used for AWS, Google, Meta and HackerRank. Removed: Yale psychology, Michigan negotiation, NPTEL multi-core, and three basic-level HackerRank tests.
- **Every page now has its own 3D scene:** layered stack (home, skills), orbit (about), cube lattice (projects), prism with one satellite per credential (education), network lattice (contact).
- **Architecture refactor:** logic moved out of components into `src/lib` with unit tests; one module per browser feature; a small observable store; env config isolated in `src/config/env.ts`; an HTTP client with timeouts; shared types; ESLint and `astro check` added. Lint found and removed dead code.
- **Bugs found and fixed by the new checks:** an infinite redirect loop on `/` in the nginx config (found by `qa-nginx.py`), a duplicated certificate dialog with a duplicate id on the Education page, buttons without a type, and a 404 page with the default description.
- **Performance:** the 3D code (141 KB gzipped) is no longer downloaded at all when WebGL is missing or software-rendered, which moved the home page from 89 to 100 on Lighthouse mobile in the GPU-less test environment.
- **Footer year** is generated at build time. Favicon set, web manifest and `PUBLIC_SITE_URL` added.

## Third pass (resume, repositories, UI features)

- **Resume content applied:** CGPA 7.68/10 (education, home, resume), Gurgaon on-site line, location, contact email from your resume, MySQL, Postman, secrets management, health checks and Terraform added to skills, the Market Data system reworded to match your resume (Python, SQL, PostgreSQL), and the starter resume PDF rebuilt around your content with repository-accurate facts.
- **DevOps-Learning repository reviewed** and used as evidence: the Linux user script and the system, network, RAM and archive scripts are now two projects with repository links. Old claims that the code does not support (groups, SSH restrictions, severity-based log summaries) were removed.
- **Credentials:** HackerRank Python (Basic) and Problem Solving (Basic) restored, matching your resume, for 10 in total.
- **SSCPrep Platform** reframed as built for students and kept evolving, with your note on how you pick projects added to About.
- **New UI features:** dark/light theme toggle, back-to-top button, scroll progress bar, copy buttons (email and code), confirmation modal for clearing the form, loading states, last-updated date, privacy note. See `UI_FEATURES.md`.
- **New checks:** `qa-interactions.py` (39 checks), `qa-a11y.py` (axe-core, WCAG 2.1 AA, both themes), and `THEME=light` support in `qa-browser.py`.
