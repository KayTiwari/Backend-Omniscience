import type { Problem, Subject } from './course'
import { glossaryEntries } from './glossaryEntries'
import { BookIcon } from './TechIcons'

// The encyclopedia: an index page (search + A-Z) followed by one page per
// glossary term, alphabetical. The page content is rendered from
// glossaryEntries (short, body, examples, diagrams, related); the Problem
// objects here exist for navigation and the sidebar. Inline glossary clicks
// deep-link straight to a term's page by its glossary id.

const indexProblem: Problem = {
  id: 'appendix-index',
  title: 'Encyclopedia',
  type: 'lesson',
  difficulty: 'Warmup',
  minutes: 2,
  prompt: 'Search or jump by letter to any backend term, each with a full explanation and diagrams.',
  checklist: ['Find a term by search or letter.'],
}

const termProblems: Problem[] = glossaryEntries.map((entry) => ({
  id: entry.id,
  title: entry.term,
  type: 'lesson',
  difficulty: 'Warmup',
  minutes: 3,
  prompt: entry.short,
  checklist: [`Explain ${entry.term} in one sentence.`],
}))

export const appendixSubject: Subject = {
  id: 'appendix-glossary',
  title: 'Encyclopedia',
  subtitle:
    'Every backend term as its own page: full explanation, diagrams, and worked examples, searchable and A-Z.',
  icon: BookIcon,
  color: '#888892',
  problems: [indexProblem, ...termProblems],
}

// Inline glossary term clicks resolve a glossaryId straight to its page id
// (they are the same now). Kept as a named export for the click handler.
export const appendixTargetByGlossaryId: Record<string, string> = Object.fromEntries(
  glossaryEntries.map((entry) => [entry.id, entry.id]),
)
