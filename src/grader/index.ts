import { specs as rawSpecs } from './specs'
import { explanations } from './explanations'
import type { GradeSpec } from './types'

export type { TestCase, TestResult, GradeResult, GradeSpec } from './types'
export { runTests } from './core'
export { gradeJs } from './gradeJs'
export { explanations } from './explanations'

// Specs with "why it works" explanations attached by problemId. Prefer importing
// `specs` from this index so the Check-solutions UI gets explanations for free.
export const specs: GradeSpec[] = rawSpecs.map((s) =>
  explanations[s.problemId] ? { ...s, explanation: explanations[s.problemId] } : s,
)
