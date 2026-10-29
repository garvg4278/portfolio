// Single source for site-wide facts. Edit here; layouts read from this file.
import { env } from '../config/env';

export const site = {
  name: 'Garv Gupta',
  url: env.siteUrl,
  headline: 'Computer Science Engineering Graduate | DevOps & Cloud Engineering',
  intro:
    'I graduated with a B.E. in Computer Science Engineering from Chandigarh University in 2026. My current focus is DevOps and cloud engineering, with an interest in Linux, containerization, CI/CD, automation, and reliable software systems.',
  description:
    'Portfolio of Garv Gupta, a 2026 Computer Science Engineering graduate focused on DevOps and cloud engineering: Linux, containers, CI/CD and automation.',
  email: 'garvg4278@gmail.com',
  github: 'https://github.com/garvg4278',
  linkedin: 'https://www.linkedin.com/in/garv-gupta/',
  resume: '/resume/Garv_Gupta_Resume.pdf',
  formEndpoint: env.formEndpoint,
  year: env.year,
  buildDate: env.buildDate,
  location: 'Agra, Uttar Pradesh',
  relocation: 'Willing to work from the office in Gurgaon.',
  nav: [
    { href: '/', label: 'Home' },
    { href: '/about/', label: 'About' },
    { href: '/projects/', label: 'Projects' },
    { href: '/skills/', label: 'Skills' },
    { href: '/education/', label: 'Education' },
    { href: '/contact/', label: 'Contact' },
  ],
};

// The five layers of the hero object. Each one points at real evidence on this site.
export const layers = [
  {
    id: 'linux',
    name: 'Linux and networking',
    text: 'Bash scripts for user creation, system and network reports and archiving, backed by Google Cybersecurity and EC-Council coursework.',
    href: '/projects/linux-user-management/',
  },
  {
    id: 'containers',
    name: 'Containers',
    text: 'Docker and Docker Compose, multi-stage builds, non-root images and health checks, used in ShipForge, SSCPrep, the Sweet Shop system and this portfolio.',
    href: '/projects/shipforge/',
  },
  {
    id: 'pipelines',
    name: 'CI/CD pipelines',
    text: 'Jenkins pipelines in ShipForge and the Sweet Shop system, and GitHub Actions in SSCPrep with secret scanning, SBOM generation and Grype scans.',
    href: '/projects/sscprep-platform/',
  },
  {
    id: 'cloud',
    name: 'Cloud fundamentals',
    text: 'AWS Cloud Solutions Architect professional certificate (Feb 2026), IBM Introduction to DevOps and NPTEL Cloud, IoT, Edge and ML.',
    href: '/education/#aws-solutions-architect',
  },
  {
    id: 'automation',
    name: 'Automation',
    text: 'Scripts and pipelines that replace repeated manual steps: user creation, reports, archiving, build and publish.',
    href: '/projects/linux-admin-scripts/',
  },
];
