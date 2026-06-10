import type { Problem } from './course'
import { apiFoundations } from './course.foundationsApi'
import { httpFoundations } from './course.foundationsHttp'
import { jsFoundations } from './course.foundationsJs'
import { securityFoundations } from './course.foundationsSecurity'
import { sqlFoundations } from './course.foundationsSql'

// Foundational rung ladders, keyed by subject id. Each ladder opens its course
// (phase rank sorts rungs first) so a true beginner always starts at zero:
// see real code or traffic run, predict it, tweak it, write it, lock it in.
export const foundationProblems: Record<string, Problem[]> = {
  'js-fundamentals': jsFoundations,
  sql: sqlFoundations,
  internet: httpFoundations,
  api: apiFoundations,
  security: securityFoundations,
}
