// Pure helpers for project data. No DOM, no framework: unit-tested in tests/projects.test.mjs.

/** @typedef {import('../types').Project} Project */

/**
 * "Data & Analytics" -> "data-and-analytics". Used for filter ids and URL hashes.
 * @param {string} category
 */
export const categorySlug = (category) =>
  category.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/**
 * Categories that actually have projects, in the preferred order.
 * @param {readonly string[]} order
 * @param {Project[]} projects
 */
export const categoriesPresent = (order, projects) => order.filter((c) => projects.some((p) => p.category === c));

/**
 * @param {Project[]} projects
 * @param {string} category
 */
export const countIn = (projects, category) => projects.filter((p) => p.category === category).length;

/** @param {Project['status']} status */
export const statusGlyph = (status) => ({ Completed: '●', 'In progress': '◐', Experimental: '◇', Planned: '○' })[status] ?? '○';

/**
 * @param {Project[]} projects
 * @param {string} slug
 * @returns {Project}
 */
export const findProject = (projects, slug) => {
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown project slug: ${slug}`);
  return p;
};

/** @param {Project[]} projects */
export const featuredProjects = (projects) => projects.filter((p) => p.featured);

/**
 * Previous and next project, wrapping around.
 * @param {Project[]} projects
 * @param {number} index
 */
export const neighbours = (projects, index) => ({
  prev: projects[(index + projects.length - 1) % projects.length],
  next: projects[(index + 1) % projects.length],
});

/**
 * Which case-study sections exist for a project, in display order.
 * @param {Project} p
 * @returns {{id: string, title: string}[]}
 */
export const caseStudySections = (p) => {
  const defs = [
    ['problem', 'Problem', true],
    ['how', 'How it works', true],
    ['approach', 'Approach', true],
    ['stack', 'Technology and why', p.stackWhy?.length],
    ['contribution', 'What I implemented', p.contribution?.length],
    ['challenges', 'Technical challenges', p.challenges?.length],
    ['decisions', 'Decisions and trade-offs', p.decisions?.length],
    ['verification', 'Testing and verification', p.verification?.length],
    ['results', 'Results', p.results?.length || p.outcome],
    ['limits', 'Limitations and next steps', p.limitations?.length],
  ];
  return defs.filter((d) => d[2]).map(([id, title]) => ({ id: String(id), title: String(title) }));
};
