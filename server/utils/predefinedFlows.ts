export interface PredefinedFlowTemplate {
  key: string
  name: string
  skillSlugs: string[]
}

// Keys match FlowPicker flow IDs so cold-start carousel creation routes correctly.
export const PREDEFINED_FLOWS: PredefinedFlowTemplate[] = [
  { key: 'networking',    name: 'Networking Essentials',      skillSlugs: ['networking'] },
  { key: 'system-design', name: 'System Design Fundamentals', skillSlugs: ['apis', 'databases', 'caching', 'scalability'] },
  { key: 'api-design',    name: 'API Design Principles',      skillSlugs: ['http-and-apis', 'apis'] },
  { key: 'databases',     name: 'Database & Storage',         skillSlugs: ['databases'] },
  { key: 'security',      name: 'Security Fundamentals',      skillSlugs: ['authentication', 'authorization', 'owasp'] },
  { key: 'cloud',         name: 'Cloud Architecture',         skillSlugs: ['aws-basics', 'deployments', 'containers'] },
  { key: 'concurrency',   name: 'Concurrency & Async',        skillSlugs: ['concurrency'] },
  { key: 'frontend-perf', name: 'Frontend Performance',       skillSlugs: ['performance', 'browser-behavior', 'javascript'] },
]
