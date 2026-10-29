# Deployment

## Finding: the live site is not running the supplied source

Compared on 23 Oct 2026:

| | Live site | Supplied ZIPs (HEAD "Updating Portfolio") |
| --- | --- | --- |
| Positioning | Cybersecurity and DevOps | DevOps and Backend Engineer |
| Status | "7th-semester CSE student" | "Graduating 2026" |
| Highlights | Secure IoT platform (patent pending) | Inventory system, data validation, CI/CD |
| `og:url` | `YOUR_DEPLOYED_URL_HERE` | n/a |
| Footer | 2025 | 2026 |

So either the latest commits were never pushed or deployed, or the host does not build from this repository. The repository's workflow only **builds and pushes an image to GHCR**; nothing in it updates a running site. I cannot see how the host (`bytexl.live`) pulls or builds, so I have not verified this and have not deployed anything.

## Steps (manual)

1. Unzip, open the folder (it includes the original `.git` history), then:
   ```bash
   git status           # old pages show as deleted, new project files as added
   git add -A
   git commit -m "Rebuild portfolio: Astro, Three.js, case studies, hardened nginx image"
   git push origin main
   ```
2. Confirm the **Actions** run passes (check job, then publish job). The `GHCR_PAT` secret must still exist and have `write:packages`.
3. Confirm the image exists: `ghcr.io/garvg4278/garv-portfolio:latest`.
4. Point the host at it. Depending on how bytexl.live is set up, either redeploy from the repository (it contains a Dockerfile) or pull `ghcr.io/garvg4278/garv-portfolio:latest` and restart. If the host expects a static folder instead, run `npm ci && npm run build` and upload `dist/`.
5. Verify the real site:
   ```bash
   curl -s https://garv-gupta-portfolio.bytexl.live/ | grep -o "<title>[^<]*"
   # expect: Garv Gupta | DevOps & Cloud Engineering Graduate
   curl -sI https://garv-gupta-portfolio.bytexl.live/resume/Garv_Gupta_Resume.pdf | head -1
   ```
6. If the host is on a different base URL, change `site.url` in `src/data/site.ts` and the Sitemap line in `public/robots.txt`.
7. Optional: set `PUBLIC_FORM_ENDPOINT` (see README) to enable direct form submission.

## Old URLs

`/about.html`, `/projects.html`, `/skills.html`, `/education.html` and `/contact.html` redirect (301) to the new routes in `nginx.conf`. If the host serves the files itself rather than through this nginx config, add equivalent redirects there.

## Not done

The Docker image was not built here (no Docker in the build environment), and nothing was published or deployed. The CI workflow's image smoke test will be its first real run.
