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

  // ----- Batch 2: guards, utility types, generics ------------------------
  {
    problemId: 'ts-type-guard',
    title: 'Type Guard',
    language: 'ts',
    starter: 'function isString(x: unknown): x is string {\n  pass\n}\n',
    tests: [
      { name: 'narrows', body: "assert(isString('a') === true)\nassert(isString(5) === false)" },
    ],
    reference: `function isString(x: unknown): x is string {
  return typeof x === 'string'
}`,
  },
  {
    problemId: 'ts-omit',
    title: 'Omit<T, K>',
    language: 'ts',
    starter: "interface User {\n  id: number\n  name: string\n  password: string\n}\n\nfunction publicUser(u: User): Omit<User, 'password'> {\n  pass\n}\n",
    tests: [
      { name: 'drops password', body: "assertEqual(publicUser({ id: 1, name: 'Ada', password: 'x' }), { id: 1, name: 'Ada' })" },
    ],
    reference: `interface User {
  id: number
  name: string
  password: string
}

function publicUser(u: User): Omit<User, 'password'> {
  const { password, ...rest } = u
  return rest
}`,
  },
  {
    problemId: 'ts-pick',
    title: 'Pick<T, K>',
    language: 'ts',
    starter: "interface User {\n  id: number\n  name: string\n  email: string\n}\n\nfunction summary(u: User): Pick<User, 'id' | 'name'> {\n  pass\n}\n",
    tests: [
      { name: 'keeps id and name', body: "assertEqual(summary({ id: 1, name: 'Ada', email: 'a@b.c' }), { id: 1, name: 'Ada' })" },
    ],
    reference: `interface User {
  id: number
  name: string
  email: string
}

function summary(u: User): Pick<User, 'id' | 'name'> {
  return { id: u.id, name: u.name }
}`,
  },
  {
    problemId: 'ts-required',
    title: 'Required<T> Defaults',
    language: 'ts',
    starter: 'interface Opts {\n  a?: number\n  b?: number\n}\n\nfunction normalize(o: Opts): Required<Opts> {\n  pass\n}\n',
    tests: [
      { name: 'fills missing', body: 'assertEqual(normalize({ a: 5 }), { a: 5, b: 0 })\nassertEqual(normalize({}), { a: 0, b: 0 })' },
    ],
    reference: `interface Opts {
  a?: number
  b?: number
}

function normalize(o: Opts): Required<Opts> {
  return { a: o.a ?? 0, b: o.b ?? 0 }
}`,
  },
  {
    problemId: 'ts-readonly',
    title: 'Readonly<T>',
    language: 'ts',
    starter: 'interface Config {\n  retries: number\n}\n\nfunction freezeConfig(c: Config): Readonly<Config> {\n  pass\n}\n',
    tests: [
      { name: 'returns the config', body: 'assertEqual(freezeConfig({ retries: 3 }), { retries: 3 })' },
    ],
    reference: `interface Config {
  retries: number
}

function freezeConfig(c: Config): Readonly<Config> {
  return Object.freeze({ ...c })
}`,
  },
  {
    problemId: 'ts-tuple',
    title: 'Tuple Return',
    language: 'ts',
    starter: 'function pair<A, B>(a: A, b: B): [A, B] {\n  pass\n}\n',
    tests: [
      { name: 'builds a tuple', body: "assertEqual(pair(1, 'a'), [1, 'a'])" },
    ],
    reference: `function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b]
}`,
  },
  {
    problemId: 'ts-generic-constraint',
    title: 'Generic Constraint (extends)',
    language: 'ts',
    starter: 'function longest<T extends { length: number }>(a: T, b: T): T {\n  // return the one with greater length\n}\n',
    tests: [
      { name: 'strings and arrays', body: "assertEqual(longest('aa', 'b'), 'aa')\nassertEqual(longest([1], [1, 2]), [1, 2])" },
    ],
    reference: `function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b
}`,
  },
  {
    problemId: 'ts-mapped-type',
    title: 'Mapped Type: All Flags',
    language: 'ts',
    starter: 'type Flags<T> = { [K in keyof T]: boolean }\n\nfunction allTrue<T extends object>(obj: T): Flags<T> {\n  pass\n}\n',
    tests: [
      { name: 'every key true', body: 'assertEqual(allTrue({ a: 1, b: 2 }), { a: true, b: true })' },
    ],
    reference: `type Flags<T> = { [K in keyof T]: boolean }

function allTrue<T extends object>(obj: T): Flags<T> {
  const out = {} as Flags<T>
  for (const k of Object.keys(obj) as (keyof T)[]) out[k] = true
  return out
}`,
  },
  {
    problemId: 'ts-enum',
    title: 'Enum',
    language: 'ts',
    starter: 'enum Level {\n  Low = 1,\n  High = 10,\n}\n\nfunction isHigh(l: Level): boolean {\n  pass\n}\n',
    tests: [
      { name: 'compares members', body: 'assert(isHigh(Level.High) === true)\nassert(isHigh(Level.Low) === false)' },
    ],
    reference: `enum Level {
  Low = 1,
  High = 10,
}

function isHigh(l: Level): boolean {
  return l === Level.High
}`,
  },
  {
    problemId: 'ts-union-return',
    title: 'Union Return Type',
    language: 'ts',
    starter: 'function parseBool(s: string): boolean | null {\n  // "true"/"false" -> boolean, else null\n}\n',
    tests: [
      { name: 'parses or nulls', body: "assert(parseBool('true') === true)\nassert(parseBool('false') === false)\nassert(parseBool('x') === null)" },
    ],
    reference: `function parseBool(s: string): boolean | null {
  if (s === 'true') return true
  if (s === 'false') return false
  return null
}`,
  },

  // ----- Batch 3: generic classes, Result, exhaustiveness, helpers -------
  {
    problemId: 'ts-stack-class',
    title: 'Generic Class: Stack<T>',
    language: 'ts',
    starter: 'class Stack<T> {\n  push(x: T): void {}\n  pop(): T | undefined {}\n  peek(): T | undefined {}\n  size(): number {}\n}\n',
    tests: [
      { name: 'LIFO behavior', body: 'const s = new Stack(); s.push(1); s.push(2); assertEqual(s.peek(), 2); assertEqual(s.pop(), 2); assertEqual(s.size(), 1);' },
    ],
    reference: `class Stack<T> {
  private items: T[] = []
  push(x: T): void { this.items.push(x) }
  pop(): T | undefined { return this.items.pop() }
  peek(): T | undefined { return this.items[this.items.length - 1] }
  size(): number { return this.items.length }
}`,
  },
  {
    problemId: 'ts-result-map',
    title: 'Result Type: map',
    language: 'ts',
    starter: "type Result<T> = { ok: true; value: T } | { ok: false; error: string }\n\nfunction mapResult<T, U>(r: Result<T>, fn: (v: T) => U): Result<U> {\n  // transform the value on ok; pass errors through\n}\n",
    tests: [
      { name: 'maps ok, passes error', body: "assertEqual(mapResult({ ok:true, value:2 }, (x) => x * 10), { ok:true, value:20 }); assertEqual(mapResult({ ok:false, error:'x' }, (x) => x), { ok:false, error:'x' });" },
    ],
    reference: `type Result<T> = { ok: true; value: T } | { ok: false; error: string }

function mapResult<T, U>(r: Result<T>, fn: (v: T) => U): Result<U> {
  return r.ok ? { ok: true, value: fn(r.value) } : r
}`,
  },
  {
    problemId: 'ts-compact',
    title: 'Type Guard Filter: compact',
    language: 'ts',
    starter: 'function compact<T>(arr: (T | null | undefined)[]): T[] {\n  // drop null and undefined, keeping the narrowed type\n}\n',
    tests: [
      { name: 'removes nullish', body: 'assertEqual(compact([1, null, 2, undefined, 3]), [1, 2, 3]);' },
    ],
    reference: `function compact<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((x): x is T => x !== null && x !== undefined)
}`,
  },
  {
    problemId: 'ts-from-entries',
    title: 'Generic fromEntries',
    language: 'ts',
    starter: 'function fromEntries<T>(entries: [string, T][]): Record<string, T> {\n  pass\n}\n',
    tests: [
      { name: 'builds a record', body: "assertEqual(fromEntries([['a',1],['b',2]]), { a:1, b:2 });" },
    ],
    reference: `function fromEntries<T>(entries: [string, T][]): Record<string, T> {
  const out: Record<string, T> = {}
  for (const [k, v] of entries) out[k] = v
  return out
}`,
  },
  {
    problemId: 'ts-exhaustive',
    title: 'Exhaustive Switch (never)',
    language: 'ts',
    starter: "type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number }\n\nfunction area(shape: Shape): number {\n  // handle every kind; the default should be a never check\n}\n",
    tests: [
      { name: 'covers each case', body: "assertEqual(area({ kind:'square', s:3 }), 9); assertEqual(area({ kind:'circle', r:2 }), 12);" },
    ],
    reference: `type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number }

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.round(shape.r * shape.r * 3)
    case 'square': return shape.s * shape.s
    default: {
      const _exhaustive: never = shape
      return _exhaustive
    }
  }
}`,
  },
  {
    problemId: 'ts-group-by',
    title: 'Generic groupBy',
    language: 'ts',
    starter: 'function groupBy<T>(items: T[], keyFn: (x: T) => string): Record<string, T[]> {\n  pass\n}\n',
    tests: [
      { name: 'buckets by key', body: "assertEqual(groupBy([1,2,3,4], (x) => (x % 2 === 0 ? 'e' : 'o')), { o:[1,3], e:[2,4] });" },
    ],
    reference: `function groupBy<T>(items: T[], keyFn: (x: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {}
  for (const item of items) {
    const k = keyFn(item)
    if (!out[k]) out[k] = []
    out[k].push(item)
  }
  return out
}`,
  },
  {
    problemId: 'ts-pick-keys',
    title: 'Generic pickKeys',
    language: 'ts',
    starter: 'function pickKeys<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {\n  pass\n}\n',
    tests: [
      { name: 'keeps chosen keys', body: "assertEqual(pickKeys({ a:1, b:2, c:3 }, ['a','c']), { a:1, c:3 });" },
    ],
    reference: `function pickKeys<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const out = {} as Pick<T, K>
  for (const k of keys) out[k] = obj[k]
  return out
}`,
  },
  {
    problemId: 'ts-merge',
    title: 'Intersection Merge (A & B)',
    language: 'ts',
    starter: 'function merge<A extends object, B extends object>(a: A, b: B): A & B {\n  pass\n}\n',
    tests: [
      { name: 'combines objects', body: 'assertEqual(merge({ a:1 }, { b:2 }), { a:1, b:2 });' },
    ],
    reference: `function merge<A extends object, B extends object>(a: A, b: B): A & B {
  return { ...a, ...b }
}`,
  },
]
