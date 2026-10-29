// Skills grouped by domain, each marked by depth and linked to evidence (project slugs or a credential).
import type { Level, SkillGroup } from '../types';

export const levelInfo: Record<Level, { label: string; meaning: string; glyph: string }> = {
  'hands-on': { label: 'Hands-on', meaning: 'Used in a project I built.', glyph: '●' },
  working: { label: 'Working knowledge', meaning: 'Used in smaller tasks or studied with exercises.', glyph: '◐' },
  learning: { label: 'Learning', meaning: 'Currently studying. Not yet used in a shipped project.', glyph: '○' },
};

export const skillGroups: SkillGroup[] = [
  {
    id: 'devops',
    title: 'DevOps and cloud',
    blurb: 'Build, package and ship software in a repeatable way.',
    skills: [
      { name: 'Docker and Docker Compose', level: 'hands-on', note: 'Multi-stage images, non-root users, health checks, multi-container stacks started with one command.', projects: ['shipforge', 'sscprep-platform', 'containerized-portfolio', 'sweet-shop-management-system'] },
      { name: 'Jenkins', level: 'hands-on', note: 'Pipeline as code, Jenkins run in Docker, Docker Hub credentials kept out of the repository.', projects: ['shipforge', 'sweet-shop-management-system'] },
      { name: 'GitHub Actions and CI/CD', level: 'hands-on', note: 'Lint, test, build, image publishing and deployment jobs.', projects: ['sscprep-platform', 'team-task-manager', 'containerized-portfolio'] },
      { name: 'Container registries', level: 'hands-on', note: 'GHCR and Docker Hub, tagging with latest and a commit or build identifier.', projects: ['containerized-portfolio', 'shipforge', 'sscprep-platform'] },
      { name: 'Supply-chain scanning', level: 'hands-on', note: 'Secret scanning with gitleaks, SBOM generation and Grype scans in a pipeline.', projects: ['sscprep-platform'] },
      { name: 'nginx', level: 'hands-on', note: 'Serving static builds with caching, security headers and redirects.', projects: ['containerized-portfolio', 'sweet-shop-management-system'] },
      { name: 'Linux administration', level: 'hands-on', note: 'Users, groups, permissions, SSH and log handling.', projects: ['linux-user-management', 'linux-admin-scripts'] },
      { name: 'Git and GitHub', level: 'hands-on', note: 'Version control across every project.', projects: ['containerized-portfolio'] },
      { name: 'AWS fundamentals', level: 'working', note: 'Coursework: AWS Cloud Solutions Architect professional certificate. No production AWS deployment is claimed.', credential: 'aws-solutions-architect' },
      { name: 'Health checks and troubleshooting', level: 'hands-on', note: 'Container and pipeline health checks, Python health-check script, log and deployment troubleshooting.', projects: ['shipforge', 'sscprep-platform', 'linux-admin-scripts'] },
      { name: 'Kubernetes and orchestration', level: 'learning', note: 'Pods, services and deployment strategies for multi-service apps.' },
      { name: 'Terraform and infrastructure as code', level: 'learning', note: 'Provisioning cloud resources from version-controlled definitions.' },
    ],
  },
  {
    id: 'data',
    title: 'SQL and databases',
    blurb: 'Model data sensibly and check it before it is trusted.',
    skills: [
      { name: 'SQL', level: 'hands-on', note: 'Relational queries and modelling. HackerRank SQL (Intermediate) and IBM and Meta database courses.', credential: 'hr-sql-intermediate', projects: ['market-data-validation'] },
      { name: 'PostgreSQL with Prisma', level: 'hands-on', note: 'Schemas with relations, indexes, enums and SQL migrations.', projects: ['shipforge', 'sscprep-platform', 'team-task-manager'] },
      { name: 'SQLite with Prisma', level: 'hands-on', note: 'Migrations and a role-based inventory schema.', projects: ['sweet-shop-management-system'] },
      { name: 'Data validation with pandas', level: 'hands-on', note: 'Input-contract checks, reconciliation and quality reporting.', projects: ['retail-sales-analysis', 'market-data-validation'] },
      { name: 'MySQL', level: 'working', note: 'Relational database concepts and SQL querying.', credential: 'ibm-db-sql' },
      { name: 'Excel reporting', level: 'working', note: 'An Excel dashboard and an executive PDF generated from analysis tables.', projects: ['retail-sales-analysis'] },
      { name: 'Drizzle ORM and Neon', level: 'working', note: 'Serverless Postgres in one application.', projects: ['ai-interior-design'] },
    ],
  },
  {
    id: 'security',
    title: 'Cybersecurity',
    blurb: 'Where I started, and still how I review a system.',
    skills: [
      { name: 'JWT authentication and RBAC', level: 'hands-on', note: 'Admin and user roles enforced on the API, httpOnly cookies, bcrypt hashing.', projects: ['shipforge', 'sscprep-platform', 'sweet-shop-management-system', 'team-task-manager'] },
      { name: 'API hardening', level: 'hands-on', note: 'Helmet, CORS, rate limiting and request validation.', projects: ['shipforge', 'sscprep-platform', 'team-task-manager'] },
      { name: 'DevSecOps scanning', level: 'hands-on', note: 'npm audit, gitleaks and Grype in CI.', projects: ['sscprep-platform'] },
      { name: 'Linux hardening', level: 'hands-on', note: 'SSH restrictions and default permissions.', projects: ['linux-user-management'] },
      { name: 'Secrets management and least privilege', level: 'working', note: 'Pipeline credentials kept in Jenkins and CI secrets, and secret scanning with gitleaks.', projects: ['shipforge', 'sweet-shop-management-system', 'sscprep-platform'] },
      { name: 'Network and cyber defence fundamentals', level: 'working', note: 'Google Cybersecurity and EC-Council coursework, including ethical hacking, network defence and digital forensics essentials.', credential: 'google-cybersecurity' },
    ],
  },
  {
    id: 'software',
    title: 'Software engineering',
    blurb: 'Applications and APIs that the other layers support.',
    skills: [
      { name: 'TypeScript', level: 'hands-on', note: 'Front ends and Express APIs.', projects: ['shipforge', 'sscprep-platform', 'sweet-shop-management-system', 'team-task-manager', 'dsa-visualization'] },
      { name: 'Node.js and Express', level: 'hands-on', note: 'Layered REST APIs: routes, controllers, services, middleware.', projects: ['shipforge', 'sweet-shop-management-system', 'team-task-manager'] },
      { name: 'Next.js and React', level: 'hands-on', note: 'App Router applications and a Vite single-page app.', projects: ['shipforge', 'sscprep-platform', 'team-task-manager', 'exam-eligibility-finder'] },
      { name: 'State management with Zustand', level: 'hands-on', note: 'Exam state, playback state and UI stores.', projects: ['sscprep-platform', 'dsa-visualization', 'team-task-manager'] },
      { name: 'Automated testing with Jest', level: 'hands-on', note: 'Backend tests for auth, guards, inventory and search.', projects: ['sweet-shop-management-system'] },
      { name: 'Python and Bash scripting', level: 'hands-on', note: 'Health checks, system and network reports, user creation, archiving and data pipelines.', projects: ['shipforge', 'linux-admin-scripts', 'linux-user-management', 'retail-sales-analysis'], credential: 'hr-python' },
      { name: 'Real-time features with Socket.IO', level: 'working', note: 'Live updates in one application.', projects: ['team-task-manager'] },
      { name: 'API testing with Postman', level: 'working', note: 'Checking endpoints and integration behaviour while debugging.' },
      { name: 'Core computer science', level: 'working', note: 'Operating systems, computer networks, DBMS, object-oriented programming, data structures and algorithms.', projects: ['dsa-visualization'], credential: 'hr-problem-solving' },
      { name: 'C, C++ and Java', level: 'working', note: 'University coursework.' },
      { name: 'System design', level: 'learning', note: 'Scalability patterns, service boundaries, caching and load balancing.' },
    ],
  },
];
