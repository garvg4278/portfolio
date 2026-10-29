// Shared content types for src/data/*.ts

export type Status = 'Completed' | 'In progress' | 'Experimental' | 'Planned';
export type Category =
  | 'DevOps & Cloud'
  | 'Backend & Applications'
  | 'Automation & Scripting'
  | 'Data & Analytics'
  | 'AI & Experimental';

export interface FlowStep { label: string; detail: string }
export interface Flow { title: string; steps: FlowStep[] }

export interface Project {
  slug: string;
  name: string;
  category: Category;
  status: Status;
  summary: string;
  stack: string[];
  featured?: boolean;
  repo?: string;
  live?: string;
  flow: Flow;
  extraFlows?: Flow[];
  snippets?: { title: string; code: string }[];
  problem: string;
  why?: string;
  approach: string;
  outcome?: string;
  stackWhy?: { tech: string; why: string }[];
  contribution?: string[];
  challenges?: string[];
  decisions?: string[];
  verification?: string[];
  results?: string[];
  limitations?: string[];
}

export type Level = 'hands-on' | 'working' | 'learning';
export interface Skill {
  name: string;
  level: Level;
  note: string;
  projects?: string[];
  credential?: string;
}
export interface SkillGroup { id: string; title: string; blurb: string; skills: Skill[] }

export type CredType =
  | 'Professional certificate'
  | 'Specialization'
  | 'Course certificate'
  | 'Proctored exam'
  | 'Skills assessment';
export interface Credential {
  slug: string;
  title: string;
  issuer: string;
  date: string;
  sort: string;
  type: CredType;
  area: string;
  covers: string;
  verifyUrl?: string;
  credentialId?: string;
  highlight?: string;
  group: 'cloud-security' | 'sql' | 'programming';
}
