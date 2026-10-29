// Project content. Pure data: no logic here (helpers live in src/lib/projects.js).
// Every claim below was checked against the project's repository or the supplied source.
// Add `repo` / `live` only with real URLs. Sections render only when their field is present.
import type { Project } from '../types';

export const projects: Project[] = [
  {
    slug: 'shipforge',
    name: 'ShipForge',
    category: 'DevOps & Cloud',
    status: 'Completed',
    featured: true,
    summary:
      'Logistics platform where users create and track shipments and admins manage status. Multi-stage Docker images, a Jenkins pipeline and a Python health check.',
    stack: ['Next.js 16', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL', 'Docker Compose', 'Jenkins', 'Python'],
    repo: 'https://github.com/garvg4278/shipforge',
    snippets: [{ title: 'Start the full stack', code: 'docker compose up -d' }],
    flow: {
      title: 'Jenkins pipeline',
      steps: [
        { label: 'Checkout', detail: 'Jenkins pulls the repository. The pipeline is defined in the Jenkinsfile, so it is versioned with the code.' },
        { label: 'Lint and type-check', detail: 'Backend: syntax check and prisma validate. Frontend: tsc --noEmit.' },
        { label: 'Build images', detail: 'Docker builds the backend and frontend images from their multi-stage Dockerfiles.' },
        { label: 'Push to Docker Hub', detail: 'Main branch only. Both images are tagged with the build tag and latest, using credentials stored in Jenkins.' },
        { label: 'Health check', detail: 'Main branch only. docker compose starts the full stack and a Python script checks the API and its dependencies.' },
      ],
    },
    extraFlows: [
      {
        title: 'Request path',
        steps: [
          { label: 'Next.js UI', detail: 'Login, signup, user dashboard and an admin page, written in TypeScript with CSS Modules.' },
          { label: 'Typed API client', detail: 'A typed client in lib/api.ts sends the JWT, with auth state kept in an AuthContext.' },
          { label: 'Express middleware', detail: 'Helmet, CORS, rate limiting, JWT authentication, admin-only guard and request validation.' },
          { label: 'Controllers and services', detail: 'Routes call controllers; business logic and database queries live in services.' },
          { label: 'PostgreSQL', detail: 'Prisma models for users, shipments, addresses and packages.' },
        ],
      },
    ],
    problem:
      'Customers need to create and follow shipments, and admins need to update their status. Each role must be limited to its own actions, and the whole stack should start the same way on any machine.',
    approach:
      'An Express API with a Next.js front end and a PostgreSQL database, packaged as separate Docker images and started with one docker compose command. A Jenkins pipeline checks, builds and publishes the images.',
    contribution: [
      'Layered Express API: routes, controllers and services, with middleware for JWT authentication, admin-only routes, validation, rate limiting and central error handling.',
      'Prisma schema for User, Shipment, Address and Package, a shipment status lifecycle (pending to delivered or cancelled), indexes on user, status and creation date, and a SQL migration.',
      'Helmet, CORS and express-rate-limit on the API, with Winston and Morgan logging.',
      'Multi-stage Dockerfiles for both services that run as a non-root user and define container health checks.',
      'docker-compose stack where the backend waits for the PostgreSQL health check before starting.',
      'Jenkins pipeline as code, and Jenkins itself run in Docker with configuration as code (casc.yml, plugins.txt).',
      'A Python health-check script with exit codes, JSON output and timeouts, used by the pipeline.',
    ],
    challenges: [
      'Getting frontend linting to run in CI took several iterations: Next.js 16 changed how next lint behaves, so the pipeline moved to a direct ESLint call with ESLint pinned to version 8 (visible in the commit history).',
    ],
    decisions: [
      'Replaced GitHub Actions with a Jenkins pipeline running in Docker (commit "ci: replace GitHub Actions with Jenkins pipeline").',
      'Image push and the integration health check run on main only; feature branches run lint and build.',
    ],
    verification: [
      'The pipeline runs node --check, prisma validate and tsc --noEmit, builds both images, and on main boots the full stack and runs the Python health check.',
    ],
    limitations: [
      'No automated unit or integration tests yet. Verification is lint, type-check, image build and a health check.',
    ],
  },
  {
    slug: 'sscprep-platform',
    name: 'SSCPrep Platform',
    category: 'DevOps & Cloud',
    status: 'In progress',
    featured: true,
    summary:
      'Mock-test platform for eight SSC exams, built for students and always evolving. Timed sections, analytics, an admin panel and a pipeline with secret scanning, SBOM and Grype.',
    stack: ['Next.js 14', 'TypeScript', 'PostgreSQL', 'Prisma', 'Zustand', 'Upstash Redis', 'GitHub Actions', 'Grype', 'GHCR', 'Vercel'],
    repo: 'https://github.com/garvg4278/SSCPrep-Platform',
    flow: {
      title: 'CI/CD pipeline',
      steps: [
        { label: 'Lint, test, build', detail: 'prisma generate and validate, lint, type-check, npm test and a production build.' },
        { label: 'Security audit', detail: 'npm audit at high severity and above, plus gitleaks secret scanning.' },
        { label: 'Docker build', detail: 'The application image is built (not pushed on pull requests).' },
        { label: 'SBOM and Grype', detail: 'A CycloneDX software bill of materials is generated and uploaded, then scanned for vulnerabilities with Grype.' },
        { label: 'GHCR and Vercel', detail: 'The image is pushed to GitHub Container Registry and the app is deployed to Vercel.' },
      ],
    },
    extraFlows: [
      {
        title: 'Exam submission',
        steps: [
          { label: 'Submit', detail: 'The client closes open question timers and posts the answers.' },
          { label: 'Score on the server', detail: 'Per question: correct, incorrect or unattempted and marks awarded. Per section: accuracy, score and negative marks.' },
          { label: 'Save atomically', detail: 'A Prisma transaction stores the report and per-question analytics.' },
          { label: 'Report page', detail: 'The user is redirected to their private analytics report.' },
        ],
      },
    ],
    problem:
      'SSC exams are taken as a computer-based test with sectional timers, locked sections and negative marking. Practising for them needs a platform that reproduces those rules.',
    why: 'It is being built for students to use, so it is never really finished: it changes whenever a new need or a point of friction shows up.',
    approach:
      'A Next.js 14 application with eight SSC exam types, a shared library of uploaded mock tests (parsed from PDF or DOCX), a full-screen exam interface and an admin panel. Each user’s attempts and analytics stay private.',
    contribution: [
      'Prisma schema with 20 models covering tests, sections, questions, attempts, per-question and per-section analytics, reports, vocabulary, current affairs, streaks, feedback and an audit log.',
      'Authentication with JWT in httpOnly cookies and bcrypt password hashing, and an admin role.',
      'Edge middleware with per-route rate limits through Upstash Redis (for example 10 requests a minute for auth and 5 for uploads).',
      'Exam state in a Zustand store persisted to sessionStorage, so an exam survives a page refresh.',
      'Admin panel for users, tests, analytics (with CSV export), feedback, vocabulary, current affairs and the audit log.',
      'Multi-stage Dockerfile that runs as a non-root user with a health check, plus dev, prod and tools compose files.',
      'GitHub Actions pipeline with secret scanning, SBOM generation, Grype scanning, GHCR publishing and Vercel deployment.',
    ],
    verification: [
      'CI runs prisma validate, lint, type-check, the test suite and a production build.',
      'Dependency audit, gitleaks and Grype run in the pipeline.',
    ],
    limitations: [
      'Automated tests cover the paper-parsing and analytics modules only.',
    ],
  },
  {
    slug: 'containerized-portfolio',
    name: 'Containerized Portfolio with CI/CD',
    category: 'DevOps & Cloud',
    status: 'Completed',
    featured: true,
    summary:
      'This site, packaged as an nginx container image. GitHub Actions checks it on every push, smoke-tests the image and publishes versioned tags to GitHub Container Registry.',
    stack: ['Astro', 'Three.js', 'Docker', 'nginx', 'GitHub Actions', 'GHCR'],
    repo: 'https://github.com/garvg4278/portfolio',
    live: 'https://garv-gupta-portfolio.bytexl.live',
    snippets: [{ title: 'Run the published image', code: 'docker run -p 8080:80 ghcr.io/garvg4278/garv-portfolio:latest' }],
    flow: {
      title: 'From commit to container image',
      steps: [
        { label: 'Push to main', detail: 'A commit on main starts the workflow. It can also be started by hand with workflow_dispatch.' },
        { label: 'Check', detail: 'npm ci, lint, type-check, unit tests, a production build, then a link check over every generated page. Any failure stops the pipeline.' },
        { label: 'Build image', detail: 'A multi-stage Dockerfile: a Node stage builds the static files, and an nginx:alpine stage serves them.' },
        { label: 'Smoke test', detail: 'The new image is started and curl requests the home page, a project page and the resume PDF.' },
        { label: 'Publish to GHCR', detail: 'Pushed to ghcr.io/garvg4278/garv-portfolio with two tags: latest and the 7-character commit SHA.' },
      ],
    },
    problem:
      'A static site is easy to deploy by hand and just as easy to deploy inconsistently: there is no versioned artifact, no record of which build is live, and no known-good version to return to.',
    why: 'I wanted a small project where I own the whole path from commit to a versioned container image, using the same pieces a larger service would use.',
    approach:
      'The site is built into plain static files, copied into an nginx:alpine image, and published to GHCR by GitHub Actions on every push to main.',
    stackWhy: [
      { tech: 'Multi-stage Docker build', why: 'Node and the build tooling stay in the first stage. The final image contains only nginx and the built files.' },
      { tech: 'nginx:alpine', why: 'A small, standard static server. Caching, security headers and redirects live in one config file, nginx.conf.' },
      { tech: 'GitHub Actions', why: 'The pipeline lives in the same repository as the code, so changes to either are reviewed together.' },
      { tech: 'GHCR', why: 'The image sits next to the source and is addressable by tag, including the commit SHA.' },
    ],
    contribution: [
      'Wrote the original Dockerfile and workflow: a single-stage nginx:alpine image, a GHCR login using a personal access token stored as a repository secret, and a push of the latest and short-SHA tags.',
      'Rebuilt the site in Astro and Three.js in October 2026, with content in data files, shared components and a small logic layer with unit tests.',
      'Moved the Dockerfile to a multi-stage build and added an nginx configuration: long-lived caching for hashed assets, no-cache for HTML, gzip, security headers, a custom 404 page and redirects from the old URLs.',
      'Extended the workflow with lint, type-check, tests, a link check and an image smoke test before anything is pushed.',
    ],
    decisions: [
      'Kept nginx:alpine on port 80 so the docker run command already documented in the README still works.',
      'Kept the GHCR login on the existing personal access token (GHCR_PAT) rather than changing registry permissions during the rebuild.',
    ],
    verification: [
      'CI runs ESLint, astro check, unit tests, a production build and a check of every internal link, asset and anchor in the generated pages.',
      'Each image carries the commit SHA as a tag, so a running container can be traced back to a commit.',
    ],
    results: ['Every push to main produces two image tags in GHCR: latest and the short commit SHA.'],
    limitations: [
      'The workflow publishes the image. It does not roll the new image out to the host; that step happens outside this repository.',
      'There are no automated browser or accessibility tests in CI yet.',
      'The registry login uses a long-lived personal access token instead of the workflow token.',
    ],
  },
  {
    slug: 'sweet-shop-management-system',
    name: 'Sweet Shop Management System',
    category: 'DevOps & Cloud',
    status: 'Completed',
    summary:
      'Inventory and request-approval system with admin and user roles. TypeScript API with Prisma, a React front end, 24 Jest tests and a Jenkins pipeline that pushes versioned Docker images.',
    stack: ['Node.js', 'TypeScript', 'Express', 'Prisma', 'SQLite', 'React', 'Vite', 'Jest', 'Jenkins', 'Docker'],
    repo: 'https://github.com/garvg4278/Sweet-Shop-Management-System',
    flow: {
      title: 'Jenkins pipeline',
      steps: [
        { label: 'Checkout', detail: 'Source is cloned from GitHub using the declarative pipeline in the Jenkinsfile.' },
        { label: 'Build images', detail: 'Backend and frontend Docker images are built and tagged with the build number.' },
        { label: 'Docker Hub login', detail: 'Authentication uses an access token stored in Jenkins credentials, not in the repository.' },
        { label: 'Push images', detail: 'Versioned and latest tags are pushed to Docker Hub.' },
      ],
    },
    extraFlows: [
      {
        title: 'Request path',
        steps: [
          { label: 'React front end', detail: 'Built with Vite and served by nginx in its own container.' },
          { label: 'Express API', detail: 'Auth and admin guards, request validation and centralized error handling.' },
          { label: 'Services', detail: 'Business logic for sweets, inventory, purchases and approval requests.' },
          { label: 'Prisma and SQLite', detail: 'User, Sweet, Purchase and Request models with migrations.' },
        ],
      },
    ],
    problem: 'A shop needs inventory management where admins and users have different powers, and where users can raise requests that an admin approves.',
    approach:
      'A TypeScript Express API with Prisma, JWT authentication and role separation, a React front end, and Docker Compose files for development and production-style runs.',
    contribution: [
      'REST API with JWT authentication, admin and auth guards, Zod-style request validators and a domain error type handled in one error middleware.',
      'Inventory, purchase and request-approval workflows, with Prisma migrations.',
      'Backend tests with Jest covering auth, guards, inventory, search and delete (24 test cases).',
      'Separate Dockerfiles for backend and frontend, with the frontend served by nginx, and dev and prod compose files with a backend health check.',
      'Jenkins running in Docker with its own compose setup, and a pipeline that builds and pushes versioned images.',
    ],
    challenges: [
      'Running the backend tests inside the Jenkins container needed several fixes (workspace mounts, npm ci for determinism). The pipeline was then simplified to build and push (visible in the commit history).',
    ],
    decisions: [
      'Tests run locally and are not enforced in the pipeline. The README records this as a deliberate choice to keep builds reproducible; a CI test stage is the next step.',
    ],
    limitations: ['Uses SQLite, so it suits a single instance. Tests are not part of the pipeline.'],
  },
  {
    slug: 'team-task-manager',
    name: 'TaskFlow: Team Task Manager',
    category: 'Backend & Applications',
    status: 'Completed',
    summary:
      'Task manager with a drag-and-drop Kanban board, real-time updates over Socket.IO and role-based access. Next.js 14 front end, Express and Prisma back end on PostgreSQL.',
    stack: ['Next.js 14', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL', 'Socket.IO', 'Zustand', 'Tailwind CSS', 'Docker', 'GitHub Actions'],
    repo: 'https://github.com/garvg4278/team-task-manager',
    flow: {
      title: 'Request path',
      steps: [
        { label: 'Next.js app', detail: 'App Router pages for auth, dashboard, projects and activity, with state in Zustand stores.' },
        { label: 'Express middleware', detail: 'Helmet, rate limiting, JWT authentication, validation and error handling.' },
        { label: 'Routes and services', detail: 'Routers for auth, projects, tasks, comments, notifications and activity call service modules.' },
        { label: 'Prisma and PostgreSQL', detail: 'Relational schema with a SQL migration and a seed script.' },
        { label: 'Socket.IO', detail: 'The server pushes live updates to connected clients.' },
      ],
    },
    extraFlows: [
      {
        title: 'CI/CD pipeline',
        steps: [
          { label: 'Lint and type-check', detail: 'Matrix job over backend and frontend.' },
          { label: 'Build backend', detail: 'Prisma client generation and TypeScript build; the build output is uploaded as an artifact.' },
          { label: 'Build frontend', detail: 'Next.js production build.' },
          { label: 'Push images', detail: 'Docker Buildx builds and pushes both images to Docker Hub.' },
          { label: 'Deploy', detail: 'The Railway CLI deploys the backend and frontend services.' },
        ],
      },
    ],
    problem: 'Engineering teams need to plan work, assign it and follow progress together, with changes visible to everyone as they happen.',
    approach:
      'A full-stack TypeScript application: a Kanban board with four status columns, projects with members and roles, task comments and notifications, and an activity log, backed by PostgreSQL.',
    contribution: [
      'Express API in TypeScript organised as routes, controllers and services, with Swagger/OpenAPI documentation and Winston logging.',
      'JWT access tokens with a refresh token stored in an httpOnly cookie, bcrypt hashing and admin and member roles.',
      'Real-time updates over Socket.IO and a drag-and-drop board built with dnd-kit.',
      'Multi-stage Dockerfiles that run as non-root users, plus Railway deployment configuration.',
      'GitHub Actions pipeline with lint, type-check, build, Docker image publishing and a deploy job.',
    ],
    limitations: ['No automated tests in the repository yet.'],
  },
  {
    slug: 'retail-sales-analysis',
    name: 'Retail Sales Portfolio Analysis',
    category: 'Data & Analytics',
    status: 'Completed',
    summary:
      'Reproducible Python pipeline over 150,000 retail transactions: input checks, financial reconciliation, segment analysis, an executive PDF report and an Excel dashboard.',
    stack: ['Python', 'pandas', 'NumPy', 'ReportLab', 'Excel'],
    repo: 'https://github.com/garvg4278/Retail-Data-Anaysis',
    flow: {
      title: 'Analysis pipeline',
      steps: [
        { label: 'Source extract', detail: '150,000 transaction records kept immutable in data/.' },
        { label: 'Contract checks', detail: 'The run fails if a required column is missing, a transaction ID is duplicated, a price or quantity is invalid, or a binary flag leaves its range.' },
        { label: 'Reconcile and engineer', detail: 'Revenue is reconciled to price x quantity less discount within $0.01, then features are derived.' },
        { label: 'Summary tables', detail: 'Ten auditable CSV tables and a JSON summary.' },
        { label: 'Report and dashboard', detail: 'A four-page executive PDF and an Excel dashboard built from the tables.' },
      ],
    },
    problem: 'Where is revenue at risk, which customers matter most, and what actions does the available evidence actually support?',
    approach:
      'A pipeline that validates the data contract, defines metrics explicitly (reported sales, return exposure, return-adjusted sales), checks effect size with Cramér’s V before reading anything into small segment differences, and exports tables, a report and a dashboard.',
    results: [
      'Returns represent $735.0K, or 8.1% of reported sales.',
      'High-frequency customers generate 35.1% of return-adjusted sales.',
      'Coupon users differ from other customers by only $0.16 in average order value, so the report avoids implying a causal effect.',
      '10.0% of ratings are missing, and the report recommends monitoring coverage instead of imputing them.',
    ],
    verification: [
      'I re-ran src/retail_portfolio_pipeline.py in October 2026. It rebuilt the ten analysis tables and reproduced the $735.0K and 8.1% return figures.',
    ],
    limitations: [
      'The data cannot establish margin impact, the root cause of returns, or causal coupon lift without additional fields and an experimental design.',
    ],
  },
  {
    slug: 'dsa-visualization',
    name: 'AlgoVista: DSA Visualization Platform',
    category: 'Backend & Applications',
    status: 'Completed',
    summary:
      'Next.js 15 and TypeScript visualizer that animates sorting, searching, graph, tree and dynamic-programming algorithms step by step. Algorithm logic is kept separate from rendering.',
    stack: ['Next.js 15', 'TypeScript', 'Zustand', 'D3.js', 'Framer Motion'],
    repo: 'https://github.com/garvg4278/DSA_Visualization',
    live: 'https://dsa-visualization-ten.vercel.app/',
    flow: {
      title: 'Layers',
      steps: [
        { label: 'Algorithm engine', detail: 'Pure TypeScript functions that emit typed visualization steps, with no DOM coupling.' },
        { label: 'Playback store', detail: 'A Zustand store holds the current step, speed and play or pause state.' },
        { label: 'Visualization', detail: 'D3.js and React components read the current step and only render it.' },
        { label: 'Controls', detail: 'Play, pause, step forward and back, speed and keyboard shortcuts.' },
      ],
    },
    problem: 'Visualizers often mix algorithm execution with rendering, which makes them hard to extend, test or replay.',
    approach:
      'Each algorithm is a function that returns a list of steps. A playback store walks through the steps, so the same run can be played, paused, stepped backwards and compared in a side-by-side mode.',
    contribution: [
      'Separation of algorithm engine, playback store and visualization layer.',
      'Graph, tree, dynamic-programming table and animated bar visualizations.',
      'Pseudocode and C++, Java and Python implementations for each algorithm, a complexity panel, a comparison mode and a playground.',
    ],
  },
  {
    slug: 'exam-eligibility-finder',
    name: 'Exam Eligibility Finder',
    category: 'Backend & Applications',
    status: 'Completed',
    summary:
      'React and Vite app for Indian students: eligibility checks by age and qualification, scholarships, syllabus pages, result and admit-card links, dark mode and an EmailJS contact form.',
    stack: ['React', 'Vite', 'React Router', 'EmailJS', 'CSS'],
    repo: 'https://github.com/garvg4278/Exam-Eligibility-Finder',
    flow: {
      title: 'User journey',
      steps: [
        { label: 'Choose a stage', detail: 'Pages for after 10th, after 12th and after graduation.' },
        { label: 'Enter details', detail: 'Age and qualification.' },
        { label: 'Eligibility check', detail: 'Matching exams are listed for those details.' },
        { label: 'Follow up', detail: 'Scholarship, syllabus, admit card and result pages.' },
      ],
    },
    problem: 'Students need a quick way to see which competitive exams, scholarships and results are relevant to them.',
    approach: 'A responsive React single-page app with routing, a dark mode toggle and a contact form that sends email through EmailJS.',
  },
  {
    slug: 'market-data-validation',
    name: 'Market Data Validation and Reconciliation System',
    category: 'Data & Analytics',
    status: 'Completed',
    summary:
      'Automated validation and reconciliation workflows for structured financial datasets, using Python and SQL on PostgreSQL, with root-cause analysis of data inconsistencies.',
    stack: ['Python', 'SQL', 'PostgreSQL'],
    flow: {
      title: 'Validation and reconciliation flow',
      steps: [
        { label: 'Financial datasets', detail: 'Structured market and asset data.' },
        { label: 'Automated processing', detail: 'Python workflows load and process the data.' },
        { label: 'Validate and reconcile', detail: 'Automated validation and reconciliation checks run on the processed data.' },
        { label: 'SQL analysis', detail: 'Inconsistencies are analysed with SQL queries against PostgreSQL.' },
        { label: 'Root cause', detail: 'Findings point to the source of each data-quality issue.' },
      ],
    },
    problem: 'Structured financial datasets have to be checked and reconciled, or inconsistencies reduce the reliability of everything built on them.',
    approach:
      'Automated data validation, processing and reconciliation workflows written in Python and SQL, with structured debugging and root-cause analysis to find what causes data-quality and workflow problems.',
  },
  {
    slug: 'linux-user-management',
    name: 'Linux User Creation Script',
    category: 'Automation & Scripting',
    status: 'Completed',
    summary:
      'Bash script that creates a Linux user with a home directory and a generated one-time password, and forces a password change at first login.',
    stack: ['Bash', 'Linux', 'useradd', 'passwd'],
    repo: 'https://github.com/garvg4278/DevOps-Learning',
    flow: {
      title: 'What one run does',
      steps: [
        { label: 'Check privileges', detail: 'Exits with an error unless run as root or with sudo.' },
        { label: 'Validate input', detail: 'Requires a username and accepts an optional comment; refuses a user that already exists.' },
        { label: 'Create the account', detail: 'useradd creates the user with a home directory, and the exit status is checked.' },
        { label: 'Set password', detail: 'A one-time password is set and the user is forced to change it at first login.' },
        { label: 'Report', detail: 'Prints the username, password and host so they can be handed over.' },
      ],
    },
    problem: 'Creating accounts by hand on Linux machines means repeating the same steps, and skipped steps give inconsistent accounts.',
    approach: 'One script wraps the steps with checks after each one, so a failure stops the run with a clear message instead of leaving a half-created account.',
    limitations: [
      'The one-time password is derived from the clock. A random generator such as openssl rand would be stronger.',
      'It creates the account only: groups, SSH settings and permissions are not handled.',
    ],
  },
  {
    slug: 'linux-admin-scripts',
    name: 'Linux Admin Scripts: Reports and Archiving',
    category: 'Automation & Scripting',
    status: 'Completed',
    summary:
      'Bash scripts for routine administration: a system report, a network report, a free-RAM check and an archiver that compresses old or large files.',
    stack: ['Bash', 'Linux', 'df and du', 'ss and ping', 'gzip'],
    repo: 'https://github.com/garvg4278/DevOps-Learning',
    flow: {
      title: 'Scripts in the repository',
      steps: [
        { label: 'System report', detail: 'Date, disk usage, the five largest files in /var/log, memory, CPU information and uptime.' },
        { label: 'Network report', detail: 'IP addresses, a ping test and the first listening connections from ss.' },
        { label: 'RAM check', detail: 'Shows free and used memory.' },
        { label: 'Archive', detail: 'Finds files over 20 MB or older than 10 days, gzips them and moves them to an archive folder, with timestamped messages.' },
      ],
    },
    problem: 'Routine checks on a Linux machine (disk, memory, network, clutter) are quick but easy to skip when done by hand.',
    approach: 'Small scripts that each do one job and print readable output, written while working through Linux and shell scripting alongside daily notes. The same repository holds Docker notes.',
    limitations: ['Learning-stage scripts: paths such as the archive directory are hard-coded and the disk-alert script still needs its threshold test fixed.'],
  },
  {
    slug: 'ai-interior-design',
    name: 'AI-Powered Interior Design Platform',
    category: 'AI & Experimental',
    status: 'Experimental',
    summary:
      'Next.js app where a user uploads a room photo and receives AI-generated redesigns, with authentication and a credit system. Presented at an academic conference.',
    stack: ['Next.js', 'Clerk', 'Drizzle ORM', 'Neon Postgres', 'Firebase Storage', 'Replicate'],
    flow: {
      title: 'Redesign request',
      steps: [
        { label: 'Upload photo', detail: 'The room photo is stored in Firebase Storage.' },
        { label: 'Sign in', detail: 'Clerk handles authentication.' },
        { label: 'Credit check', detail: 'A credit balance in Neon Postgres, accessed through Drizzle ORM.' },
        { label: 'Generate', detail: 'Replicate runs image-to-image generation.' },
        { label: 'Redesign', detail: 'The generated room design is returned to the user.' },
      ],
    },
    problem: 'Visualising a redesign of a room normally needs a designer or manual mock-ups.',
    approach: 'A Next.js platform where the user uploads a photo and gets AI-generated redesigns. It integrates Clerk for authentication, Neon Postgres through Drizzle ORM, Firebase Storage, Replicate for image-to-image generation, and a credit system.',
  },
];
