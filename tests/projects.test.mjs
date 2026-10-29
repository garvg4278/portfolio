import test from 'node:test';
import assert from 'node:assert/strict';
import { categorySlug, categoriesPresent, countIn, neighbours, caseStudySections, findProject, featuredProjects } from '../src/lib/projects.js';
import { projects } from '../src/data/projects.ts';
import { categories } from '../src/data/categories.ts';
import { skillGroups } from '../src/data/skills.ts';
import { credentials } from '../src/data/credentials.ts';
import { existsSync } from 'node:fs';

test('categorySlug', () => {
  assert.equal(categorySlug('Data & Analytics'), 'data-and-analytics');
  assert.equal(categorySlug('DevOps & Cloud'), 'devops-and-cloud');
});
test('every category used by a project is a known category', () => {
  for (const p of projects) assert.ok(categories.includes(p.category), `${p.slug}: ${p.category}`);
});
test('filters only show categories that have projects, and counts add up', () => {
  const present = categoriesPresent(categories, projects);
  assert.ok(present.length > 0);
  assert.equal(present.reduce((n, c) => n + countIn(projects, c), 0), projects.length);
});
test('project grid size is a multiple of three (no orphan row)', () => assert.equal(projects.length % 3, 0));
test('slugs are unique, url-safe and project fields are complete', () => {
  const seen = new Set();
  for (const p of projects) {
    assert.match(p.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
    assert.ok(!seen.has(p.slug), `duplicate ${p.slug}`); seen.add(p.slug);
    for (const f of ['name', 'summary', 'problem', 'approach']) assert.ok(p[f]?.trim(), `${p.slug}.${f}`);
    assert.ok(p.stack.length > 0 && p.flow.steps.length >= 3 && p.flow.steps.length <= 6, `${p.slug} flow size`);
    for (const f of [p.flow, ...(p.extraFlows ?? [])]) for (const s of f.steps) assert.ok(s.label.trim() && s.detail.trim(), `${p.slug} step`);
  }
});
test('repo and live URLs are well-formed https links; repos are on garvg4278', () => {
  for (const p of projects) {
    if (p.repo) assert.match(p.repo, /^https:\/\/github\.com\/garvg4278\/[\w.-]+$/, p.slug);
    if (p.live) assert.match(p.live, /^https:\/\/[\w.-]+(\/.*)?$/, p.slug);
  }
});
test('exactly three featured projects, all with a repository', () => {
  const f = featuredProjects(projects);
  assert.equal(f.length, 3);
  for (const p of f) assert.ok(p.repo, p.slug);
});
test('no placeholder or planning text in project content', () => {
  const text = JSON.stringify(projects);
  assert.doesNotMatch(text, /lorem|TODO|TBD|placeholder|YOUR_/i);
});
test('neighbours wrap around', () => {
  assert.equal(neighbours(projects, 0).prev.slug, projects.at(-1).slug);
  assert.equal(neighbours(projects, projects.length - 1).next.slug, projects[0].slug);
});
test('case-study sections follow the data', () => {
  const full = caseStudySections(findProject(projects, 'containerized-portfolio')).map((s) => s.id);
  assert.ok(['problem', 'how', 'approach', 'stack', 'contribution', 'verification', 'results', 'limits'].every((id) => full.includes(id)));
  const thin = caseStudySections(findProject(projects, 'exam-eligibility-finder')).map((s) => s.id);
  assert.deepEqual(thin, ['problem', 'how', 'approach']);
});
test('findProject throws for unknown slugs', () => assert.throws(() => findProject(projects, 'nope')));
test('every skill evidence link points at a real project or credential', () => {
  const slugs = new Set(projects.map((p) => p.slug));
  const creds = new Set(credentials.map((c) => c.slug));
  for (const g of skillGroups) for (const s of g.skills) {
    for (const slug of s.projects ?? []) assert.ok(slugs.has(slug), `${s.name} -> ${slug}`);
    if (s.credential) assert.ok(creds.has(s.credential), `${s.name} -> ${s.credential}`);
  }
});
test('every credential has images and a valid verification link', () => {
  for (const c of credentials) {
    for (const k of ['thumb', 'full']) assert.ok(existsSync(`public/certificates/${c.slug}-${k}.webp`), `${c.slug} ${k}`);
    if (c.verifyUrl) assert.match(c.verifyUrl, /^https:\/\/(www\.)?(coursera\.org|hackerrank\.com)\//, c.slug);
  }
});
