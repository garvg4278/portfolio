// Evidence-based qualities, shared by Home (short) and About (full).
export const qualities = [
  {
    title: 'Turns repeated work into scripts and pipelines',
    short: 'A multi-step user onboarding became one command. Pipelines build, check and publish images on every push.',
    evidence: [
      { text: 'The Linux user-creation script turns several manual steps into one command, with a check after each step.', href: '/projects/linux-user-management/' },
      { text: 'ShipForge and this portfolio each have a pipeline that builds, checks and publishes versioned container images.', href: '/projects/shipforge/' },
    ],
  },
  {
    title: 'Investigates errors and checks results',
    short: 'Log utilities, validation rules and pipeline checks exist so problems are found early.',
    evidence: [
      { text: 'ShipForge ships a Python health-check script that the pipeline runs against the whole stack before a release is called healthy.', href: '/projects/shipforge/' },
      { text: 'The market-data system validates and reconciles financial datasets and uses SQL and root-cause analysis to find what causes inconsistencies.', href: '/projects/market-data-validation/' },
      { text: 'The retail analysis pipeline refuses to run on duplicate IDs or invalid prices, and reconciles revenue to within $0.01.', href: '/projects/retail-sales-analysis/' },
    ],
  },
  {
    title: 'Learns unfamiliar tools by building with them',
    short: 'Security coursework led to DevOps coursework, then to AWS, with projects at each step.',
    evidence: [
      { text: 'Google Cybersecurity (Apr 2025), then IBM Introduction to DevOps (Sep 2025), then the AWS Cloud Solutions Architect professional certificate (Feb 2026).', href: '/education/' },
      { text: 'The DevOps coursework shows up in the containerized, pipeline-driven projects, such as ShipForge.', href: '/projects/shipforge/' },
    ],
  },
  {
    title: 'Designs access and failure in early',
    short: 'Role checks live on the API, and pipelines scan for secrets and known vulnerabilities.',
    evidence: [
      { text: 'ShipForge and the Sweet Shop system enforce admin and user roles on the API, not only in the interface.', href: '/projects/shipforge/' },
      { text: 'SSCPrep runs gitleaks, an SBOM and Grype scans in its pipeline, with per-route rate limits on the API.', href: '/projects/sscprep-platform/' },
    ],
  },
];

export const education = [
  { years: '2022 – 2026', title: 'Bachelor of Engineering, Computer Science Engineering', place: 'Chandigarh University, Mohali, Punjab', note: 'Graduated 2026. CGPA 7.68/10.' },
  { years: '2021 – 2022', title: 'Grade 12 (CBSE), Physics, Chemistry, Mathematics', place: 'Agra Vanasthali Vidyalaya, Agra', note: '' },
  { years: '2019 – 2020', title: 'Grade 10 (CBSE)', place: 'Delhi Public School, Agra', note: '' },
];
