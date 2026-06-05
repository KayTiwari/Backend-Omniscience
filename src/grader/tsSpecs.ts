import type { GradeSpec } from './types.ts'

// REAL TypeScript drills. The executor (tsWorker.ts) type-strips/transpiles via the
// TypeScript compiler, then runs the JS against the tests. References are verified
// offline with `tsc --strict` (valid strict TS) and by running their behavior.
// Ordered: typed basics -> interfaces/unions -> generics -> utility types.
export const tsSpecs: GradeSpec[] = [
  {
    problemId: 'ts-typed-sum',
    title: 'Typed Function: Sum',
    language: 'ts',
    starter: 'function sum(nums: number[]): number {\n  // add them up\n}\n',
    tests: [
      { name: 'sums numbers', body: 'assertEqual(sum([1, 2, 3]), 6)' },
      { name: 'empty is zero', body: 'assertEqual(sum([]), 0)' },
    ],
    reference: `function sum(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0)
}`,
  },
  {
    problemId: 'ts-greet',
    title: 'Typed Function: Greet',
    language: 'ts',
    starter: "function greet(name: string): string {\n  // 'Hello, <name>!'\n}\n",
    tests: [{ name: 'greets', body: "assertEqual(greet('Ada'), 'Hello, Ada!')" }],
    reference: `function greet(name: string): string {
  return 'Hello, ' + name + '!'
}`,
  },
  {
    problemId: 'ts-optional-param',
    title: 'Optional Parameter',
    language: 'ts',
    starter: 'function fullName(first: string, last?: string): string {\n  pass\n}\n',
    tests: [
      { name: 'with last', body: "assertEqual(fullName('Ada', 'Lovelace'), 'Ada Lovelace')" },
      { name: 'without last', body: "assertEqual(fullName('Cher'), 'Cher')" },
    ],
    reference: `function fullName(first: string, last?: string): string {
  return last ? first + ' ' + last : first
}`,
  },
  {
    problemId: 'ts-interface',
    title: 'Interface: Describe A User',
    language: 'ts',
    starter: 'interface User {\n  name: string\n  age: number\n}\n\nfunction describe(u: User): string {\n  // "<name> is <age>"\n}\n',
    tests: [{ name: 'describes', body: "assertEqual(describe({ name: 'Ada', age: 36 }), 'Ada is 36')" }],
    reference: `interface User {
  name: string
  age: number
}

function describe(u: User): string {
  return u.name + ' is ' + u.age
}`,
  },
  {
    problemId: 'ts-discriminated-union',
    title: 'Discriminated Union: Area',
    language: 'ts',
    starter: "type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number }\n\nfunction area(shape: Shape): number {\n  // circle -> round(pi*r*r); square -> s*s\n}\n",
    tests: [
      { name: 'square', body: "assertEqual(area({ kind: 'square', s: 3 }), 9)" },
      { name: 'circle', body: "assertEqual(area({ kind: 'circle', r: 1 }), 3)" },
    ],
    reference: `type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number }

function area(shape: Shape): number {
  if (shape.kind === 'circle') return Math.round(Math.PI * shape.r * shape.r)
  return shape.s * shape.s
}`,
  },
  {
    problemId: 'ts-generic-identity',
    title: 'Generic: Identity',
    language: 'ts',
    starter: 'function identity<T>(x: T): T {\n  pass\n}\n',
    tests: [
      { name: 'number', body: 'assertEqual(identity(5), 5)' },
      { name: 'string', body: "assertEqual(identity('a'), 'a')" },
    ],
    reference: `function identity<T>(x: T): T {
  return x
}`,
  },
  {
    problemId: 'ts-generic-first',
    title: 'Generic: First Or Undefined',
    language: 'ts',
    starter: 'function first<T>(arr: T[]): T | undefined {\n  pass\n}\n',
    tests: [
      { name: 'returns first', body: 'assertEqual(first([1, 2, 3]), 1)' },
      { name: 'empty is undefined', body: 'assert(first([]) === undefined)' },
    ],
    reference: `function first<T>(arr: T[]): T | undefined {
  return arr[0]
}`,
  },
  {
    problemId: 'ts-keyof-pluck',
    title: 'keyof: Pluck A Field',
    language: 'ts',
    starter: 'function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {\n  pass\n}\n',
    tests: [
      { name: 'plucks ids', body: "assertEqual(pluck([{ id: 1 }, { id: 2 }], 'id'), [1, 2])" },
    ],
    reference: `function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key])
}`,
  },
  {
    problemId: 'ts-record-countby',
    title: 'Record: Count By',
    language: 'ts',
    starter: 'function countBy<T>(items: T[], key: (x: T) => string): Record<string, number> {\n  pass\n}\n',
    tests: [
      { name: 'counts groups', body: "assertEqual(countBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? 'even' : 'odd')), { odd: 2, even: 2 })" },
    ],
    reference: `function countBy<T>(items: T[], key: (x: T) => string): Record<string, number> {
  const out: Record<string, number> = {}
  for (const item of items) {
    const k = key(item)
    out[k] = (out[k] || 0) + 1
  }
  return out
}`,
  },
  {
    problemId: 'ts-partial-defaults',
    title: 'Partial<T>: Apply Defaults',
    language: 'ts',
    starter: 'interface Config {\n  host: string\n  port: number\n}\n\nfunction withDefaults(opts: Partial<Config>, defaults: Config): Config {\n  pass\n}\n',
    tests: [
      { name: 'overrides defaults', body: "assertEqual(withDefaults({ port: 8080 }, { host: 'localhost', port: 80 }), { host: 'localhost', port: 8080 })" },
    ],
    reference: `interface Config {
  host: string
  port: number
}

function withDefaults(opts: Partial<Config>, defaults: Config): Config {
  return { ...defaults, ...opts }
}`,
  },
  {
    problemId: 'ts-map-values',
    title: 'Generic Map Over Values',
    language: 'ts',
    starter: 'function mapValues<T, U>(obj: Record<string, T>, fn: (v: T) => U): Record<string, U> {\n  pass\n}\n',
    tests: [
      { name: 'transforms values', body: 'assertEqual(mapValues({ a: 1, b: 2 }, (v) => v * 10), { a: 10, b: 20 })' },
    ],
    reference: `function mapValues<T, U>(obj: Record<string, T>, fn: (v: T) => U): Record<string, U> {
  const out: Record<string, U> = {}
  for (const k of Object.keys(obj)) out[k] = fn(obj[k])
  return out
}`,
  },
  {
    problemId: 'ts-as-const-union',
    title: 'as const Literal Union',
    language: 'ts',
    starter: "const Status = { Active: 'active', Inactive: 'inactive' } as const\ntype Status = (typeof Status)[keyof typeof Status]\n\nfunction isActive(s: Status): boolean {\n  pass\n}\n",
    tests: [
      { name: 'active', body: "assert(isActive('active') === true)" },
      { name: 'inactive', body: "assert(isActive('inactive') === false)" },
    ],
    reference: `const Status = { Active: 'active', Inactive: 'inactive' } as const
type Status = (typeof Status)[keyof typeof Status]

function isActive(s: Status): boolean {
  return s === Status.Active
}`,
  },
]
