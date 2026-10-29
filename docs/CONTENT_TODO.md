# Needs your confirmation

Nothing here is published as fact unless stated. Edit `src/data/*.ts`, rebuild, redeploy.

## Decide now

1. **Two email addresses.** Your old site used `garvgupta4278@gmail.com`; your new resume uses `garvg4278@gmail.com`. The site now uses the resume address (`src/data/site.ts`, `email`). If that is wrong, change that one line and rebuild.
2. **Phone number.** It is in the resume PDF but deliberately **not** on the website (public phone numbers attract spam). Say so if you want it published.
3. **Your resume needs two corrections.** The starter PDF follows your wording but fixes facts that your own repositories contradict. Fix your master copy too, because an interviewer can open the repos:
   - ShipForge CI: your resume says GitHub Actions; the repository replaced GitHub Actions with **Jenkins** (see its commit history and Jenkinsfile).
   - Inventory and Workflow system: your resume says PostgreSQL; the Sweet Shop repository uses **SQLite** through Prisma.
4. **Intelligent-Cloud-Infrastructure-Operations-Platform could not be analysed.** GitHub asks for a login for that URL, so it is private, mistyped or not pushed. I cannot say what it is, so it is **not on the site**. Make it public (or paste its README) and I will review it.
5. **findata-platform is an empty repository** (no commits). If that is the home of the Market Data Validation and Reconciliation System, push the code; until then that project has no repository link and its description comes only from your resume.

## Please check

6. **Final links I could not open from the build environment:** the four certificate links you supplied, the IBM DevOps / IBM Databases and SQL / EC-Council links (read from the images), the two HackerRank links I derived from your SQL link's pattern (`/certificates/iframe/<id>`), your LinkedIn URL, and the DSA demo you confirmed. Click-test each one. The Google link is an `account/accomplishments` URL; if it asks for a login in a private window, use `https://coursera.org/verify/professional-cert/ULL6I7CMIE9I`.
6a. **TaskFlow demo:** the expired link is not used anywhere on the site. Add a `live:` entry in `projects.ts` when you have a new one.
7. **Statuses:** everything is "Completed" except SSCPrep Platform ("In progress", described as built for students and always evolving). Change `status` in `projects.ts` if you disagree.
8. **Projects without a repository:** Market Data Validation and the AI Interior Design platform (add the conference name and date to the latter).
9. **Skill depth levels** in `skills.ts` follow your resume and repositories. AWS stays "Working knowledge (coursework)", Kubernetes and Terraform are "Learning", MySQL and Postman are "Working knowledge" from your resume.
10. **About page wording** is drafted from your old text and your messages (including how you choose projects). Edit anything that does not sound like you.
11. **Photo and certificates.** `profile.webp` is shown on About. The NPTEL certificate shows your photo and roll number when opened full size.
12. **Secure IoT** is omitted (nothing verifies the old "patent pending" claim).

## Bugs in your repositories (a recruiter can see these)

- **DevOps-Learning `fs_status.sh`:** the test is written `[[ %fu -ge 80 ]]` (it should be `$fu`), so the disk alert never fires; the email address is hard-coded. The site does not describe this script as working.
- **DevOps-Learning `user.sh`:** the "password" is the current timestamp, while the README calls it a secure random password. `openssl rand -base64 12` would fix it. The site says "one-time password" and lists this as a limitation.
- **Exam-Eligibility-Finder** commits `node_modules/` and a zip file; add a `.gitignore`.
- **TaskFlow** README has a placeholder banner and the expired demo link.
- **ShipForge and TaskFlow** have no automated tests; **Sweet Shop** has 24 tests that the pipeline does not run.
- **Retail-Data-Anaysis** (typo in the repo name) references a dashboard build script that is not committed.
- **SSCPrep-Platform** history is two commits.
- Three public repositories were not reviewed because they sit outside your DevOps, cloud, SQL, security and software-engineering focus: Food_Delivery_App, Loan_Approval, College_Search_Website.

## What would still raise the quality

Screenshots or a short screen recording for ShipForge, SSCPrep and TaskFlow; one measurable result per featured project; a screenshot of a green pipeline run for each CI/CD project; a Kubernetes or Terraform mini-project, since both are on your resume as "expanding".
