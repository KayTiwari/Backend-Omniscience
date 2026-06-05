import type { Problem } from './course'

const topics = [
  ['01. Types vs Runtime', 'Explain that TypeScript checks code before runtime, but emitted JavaScript still needs runtime validation for untrusted input.'],
  ['02. Primitive Types', 'Write variables and function parameters using string, number, boolean, null, and undefined intentionally.'],
  ['03. Arrays And Tuples', 'Model homogeneous arrays and fixed-position tuples, then explain where tuple overuse hurts readability.'],
  ['04. Object Types', 'Define object shapes for request DTOs and response DTOs without using any.'],
  ['05. Optional Properties', 'Model optional fields and explain the difference between missing, undefined, and null.'],
  ['06. Union Types', 'Model a status as a union of string literals and narrow it with conditionals.'],
  ['07. Type Narrowing', 'Use typeof, in, and equality checks to narrow a value before accessing fields.'],
  ['08. Interfaces vs Type Aliases', 'Choose interface or type alias for API contracts and explain the practical tradeoff.'],
  ['09. Generics', 'Write a generic Result<T> and use it for service success/failure returns.'],
  ['10. Utility Types', 'Use Pick, Omit, Partial, Required, Record, and Readonly in backend DTOs.'],
  ['11. Unknown Over Any', 'Accept unknown JSON and refine it safely before trusting it.'],
  ['12. Never And Exhaustiveness', 'Use never to force exhaustive handling of discriminated union cases.'],
  ['13. Discriminated Unions', 'Model domain events or API results with a kind/type discriminator.'],
  ['14. Function Types', 'Type a middleware-like function and a repository dependency.'],
  ['15. Async Return Types', 'Type Promise results and avoid forgetting awaits in service boundaries.'],
  ['16. Error Result Shapes', 'Prefer typed Result objects for expected failures and exceptions for unexpected bugs.'],
  ['17. Runtime Validation Boundary', 'Pair TypeScript types with runtime validation for request bodies.'],
  ['18. Branded IDs', 'Use branded string types for UserId and ProjectId to avoid mixing identifiers.'],
  ['19. Enums vs Literal Unions', 'Compare enum, const object, and literal union choices for backend statuses.'],
  ['20. Strict tsconfig', 'Explain strict, noImplicitAny, exactOptionalPropertyTypes, and noUncheckedIndexedAccess.'],
  ['21. Module Resolution', 'Explain ESM/CJS boundaries and import path behavior in Node TypeScript projects.'],
  ['22. Type-Only Imports', 'Use import type to avoid accidental runtime imports.'],
  ['23. Repository Contracts', 'Define interfaces for repositories so services can be tested with fakes.'],
  ['24. API DTO Mapping', 'Map internal database rows into public DTOs without leaking private fields.'],
  ['25. TypeScript Backend Launch Review', 'Review a TypeScript backend for unsafe any, missing validation, bad tsconfig, and untyped boundaries.'],
]

export const typescriptFundamentalProblems: Problem[] = topics.map(([title, task], index) => ({
  id: `typescript-fundamentals-${String(index + 1).padStart(2, '0')}-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`,
  title,
  type: index % 5 === 0 ? 'lesson' : index % 5 === 1 ? 'coding' : index % 5 === 2 ? 'quiz' : index % 5 === 3 ? 'debug' : 'design',
  difficulty: index < 10 ? 'Warmup' : index < 20 ? 'Core' : 'Hard',
  minutes: index % 5 === 1 ? 25 : 18,
  prompt: `${task} Connect the answer to a backend route, service, repository, or API boundary.`,
  explanation:
    'TypeScript is the bridge between JavaScript fundamentals and safer Node.js backends. It catches mistakes before runtime, but it does not replace runtime checks for JSON, headers, params, database rows, or third-party responses.',
  production:
    'Production TypeScript value comes from explicit contracts at boundaries: request DTOs, response DTOs, config, repositories, services, and job payloads. The type system makes illegal states harder to express, while validation keeps untrusted runtime data honest.',
  walkthrough: [
    'Write the smallest type or function that demonstrates the concept.',
    'Show where untrusted runtime data enters.',
    'Narrow or validate before trusting the value.',
    'Map internal data into a stable public shape.',
    'Explain which error TypeScript catches and which error only runtime validation catches.',
  ],
  example:
    'Example backend mindset: type the service contract, validate the HTTP body at runtime, then return a typed DTO instead of a raw database row.',
  questions: [
    'What bug does TypeScript prevent here?',
    'What bug can still happen at runtime?',
    'Where would this type live in a backend codebase?',
    'How would you test this boundary?',
  ],
  checklist: [
    'Uses precise types instead of any.',
    'Names the runtime boundary.',
    'Explains narrowing or validation.',
    'Connects the concept to Node.js backend code.',
  ],
  choices:
    index % 5 === 2
      ? [
          'TypeScript guarantees all incoming JSON is safe at runtime',
          'TypeScript helps internal code, but untrusted input still needs runtime validation',
          'TypeScript should be disabled in backend routes',
          'Types are only useful for frontend code',
        ]
      : undefined,
  correctChoice: index % 5 === 2 ? 1 : undefined,
  answer:
    index % 5 === 2
      ? 'TypeScript checks your code before runtime. Inputs from HTTP, databases, queues, and providers still need runtime validation or narrowing.'
      : undefined,
}))
