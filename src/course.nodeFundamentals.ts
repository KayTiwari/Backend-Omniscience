import type { Problem } from './course'

type NodeDrill = {
  id: string
  title: string
  task: string
  concept: string
  example: string
}

const drills: NodeDrill[] = [
  {
    id: 'node-fundamentals-01-sum-with-for-loop',
    title: '01. Sum With A For Loop',
    concept: 'for loops, accumulators, numeric arrays, and predictable iteration',
    task: 'Implement sumNumbers(nums). Return the sum of every number in the array using a for loop.',
    example: 'sumNumbers([2, 3, 5]) returns 10.',
  },
  {
    id: 'node-fundamentals-02-count-even-numbers',
    title: '02. Count Even Numbers',
    concept: 'modulo, conditionals, counters, and scanning input once',
    task: 'Implement countEvens(nums). Count how many numbers are divisible by 2.',
    example: 'countEvens([1, 2, 4, 7]) returns 2.',
  },
  {
    id: 'node-fundamentals-03-while-countdown',
    title: '03. While Countdown',
    concept: 'while loops, loop termination, and avoiding infinite loops',
    task: 'Implement countdown(n). Return [n, n-1, ... 1]. Return [] for n <= 0.',
    example: 'countdown(4) returns [4, 3, 2, 1].',
  },
  {
    id: 'node-fundamentals-04-map-user-names',
    title: '04. Map User Names',
    concept: 'array mapping, object property access, and output shape',
    task: 'Implement userNames(users). Return an array of the name field from each user.',
    example: "userNames([{ name: 'Ada' }, { name: 'Lin' }]) returns ['Ada', 'Lin'].",
  },
  {
    id: 'node-fundamentals-05-filter-active-users',
    title: '05. Filter Active Users',
    concept: 'array filtering, booleans, and separating active records',
    task: 'Implement activeUsers(users). Return only users where active is true.',
    example: "activeUsers([{ id: 1, active: true }, { id: 2, active: false }]) returns [{ id: 1, active: true }].",
  },
  {
    id: 'node-fundamentals-06-find-by-id',
    title: '06. Find By ID',
    concept: 'linear search, strict equality, and missing-result behavior',
    task: 'Implement findById(items, id). Return the matching item or null.',
    example: "findById([{ id: 'a' }], 'a') returns { id: 'a' }.",
  },
  {
    id: 'node-fundamentals-07-count-by-status',
    title: '07. Count By Status',
    concept: 'objects as maps, grouping, and counting API/domain states',
    task: 'Implement countByStatus(rows). Return an object mapping status to count.',
    example: "countByStatus([{ status: 'open' }, { status: 'open' }, { status: 'done' }]) returns { open: 2, done: 1 }.",
  },
  {
    id: 'node-fundamentals-08-safe-json-parse',
    title: '08. Safe JSON Parse',
    concept: 'try/catch, untrusted input, and controlled parse failures',
    task: 'Implement safeJsonParse(text). Return { ok: true, value } or { ok: false, error: "invalid json" }.',
    example: "safeJsonParse('{\"a\":1}') returns { ok: true, value: { a: 1 } }.",
  },
  {
    id: 'node-fundamentals-09-require-fields',
    title: '09. Require Fields',
    concept: 'request validation, required fields, and field-level errors',
    task: 'Implement requireFields(obj, fields). Return missing field names.',
    example: "requireFields({ email: 'a@b.com' }, ['email', 'name']) returns ['name'].",
  },
  {
    id: 'node-fundamentals-10-normalize-email',
    title: '10. Normalize Email',
    concept: 'string trim/lowercase, canonical identifiers, and login inputs',
    task: 'Implement normalizeEmail(email). Trim whitespace and lowercase the address.',
    example: "normalizeEmail(' Ada@Example.COM ') returns 'ada@example.com'.",
  },
  {
    id: 'node-fundamentals-11-slug-from-title',
    title: '11. Slug From Title',
    concept: 'string normalization, URL-safe identifiers, and deterministic transforms',
    task: 'Implement slugFromTitle(title). Lowercase, trim, replace non-alphanumeric runs with hyphens, and strip edge hyphens.',
    example: "slugFromTitle(' Hello, API World! ') returns 'hello-api-world'.",
  },
  {
    id: 'node-fundamentals-12-parse-integer-param',
    title: '12. Parse Integer Param',
    concept: 'route parameter parsing, NaN checks, and failing fast',
    task: 'Implement parsePositiveInt(value). Return a positive integer or null.',
    example: "parsePositiveInt('42') returns 42; parsePositiveInt('0') returns null.",
  },
  {
    id: 'node-fundamentals-13-build-query-string',
    title: '13. Build Query String',
    concept: 'URL encoding, query params, and HTTP client helpers',
    task: 'Implement toQueryString(params). Ignore null/undefined values and percent-encode keys and values.',
    example: "toQueryString({ q: 'hello world', page: 2 }) returns 'q=hello%20world&page=2'.",
  },
  {
    id: 'node-fundamentals-14-read-header-case-insensitive',
    title: '14. Read Header Case-Insensitive',
    concept: 'HTTP headers, case-insensitive lookup, and defensive objects',
    task: 'Implement getHeader(headers, name). Return the matching header value regardless of key casing.',
    example: "getHeader({ 'Content-Type': 'application/json' }, 'content-type') returns 'application/json'.",
  },
  {
    id: 'node-fundamentals-15-basic-auth-parser',
    title: '15. Basic Auth Parser',
    concept: 'Authorization headers, scheme parsing, base64 decoding mental model',
    task: 'Implement parseBasicAuth(header). Return { username, password } for Basic credentials or null.',
    example: "parseBasicAuth('Basic YWRhOnNlY3JldA==') returns { username: 'ada', password: 'secret' }.",
  },
  {
    id: 'node-fundamentals-16-error-envelope',
    title: '16. Error Envelope',
    concept: 'stable API errors, status codes, public messages, and request ids',
    task: 'Implement makeError(status, code, message, requestId). Return a stable JSON API error object.',
    example: "makeError(400, 'VALIDATION', 'bad input', 'r1') returns { error: { status: 400, code: 'VALIDATION', message: 'bad input', requestId: 'r1' } }.",
  },
  {
    id: 'node-fundamentals-17-compose-middleware',
    title: '17. Compose Middleware',
    concept: 'middleware order, next-style pipelines, and request mutation',
    task: 'Implement runMiddleware(req, middleware). Each middleware is (req, next) and may mutate req before calling next.',
    example: 'runMiddleware({}, [addA, addB]) returns the mutated request after both run.',
  },
  {
    id: 'node-fundamentals-18-promise-all-settled-summary',
    title: '18. Promise Results Summary',
    concept: 'Promise.allSettled, partial failure, fan-out, and dependency isolation',
    task: 'Implement summarizeSettled(results). Count fulfilled/rejected and collect fulfilled values.',
    example: "summarizeSettled([{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: 'x' }]) returns { fulfilled: 1, rejected: 1, values: [1] }.",
  },
  {
    id: 'node-fundamentals-19-timeout-race-shape',
    title: '19. Timeout Result Shape',
    concept: 'timeouts, async dependency boundaries, and predictable failure objects',
    task: 'Implement timeoutResult(ms). Return { timeoutMs: ms, error: "timeout" }.',
    example: 'timeoutResult(250) returns { timeoutMs: 250, error: "timeout" }.',
  },
  {
    id: 'node-fundamentals-20-retryable-status',
    title: '20. Retryable Status',
    concept: 'HTTP retry policy, transient failures, and idempotent calls',
    task: 'Implement isRetryableStatus(status). Return true for 408, 429, and 5xx statuses.',
    example: 'isRetryableStatus(503) returns true; isRetryableStatus(400) returns false.',
  },
  {
    id: 'node-fundamentals-21-buffer-byte-length',
    title: '21. Byte Length',
    concept: 'Buffer.byteLength, strings vs bytes, and Content-Length correctness',
    task: 'Implement byteLength(value). Return the UTF-8 byte length of a string.',
    example: "byteLength('hello') returns 5.",
  },
  {
    id: 'node-fundamentals-22-chunk-array-for-batches',
    title: '22. Chunk Array For Batches',
    concept: 'batching, backfills, pagination, and downstream pressure',
    task: 'Implement chunkForBatches(items, size). Split items into ordered arrays of length size.',
    example: 'chunkForBatches([1,2,3,4,5], 2) returns [[1,2],[3,4],[5]].',
  },
  {
    id: 'node-fundamentals-23-idempotency-key',
    title: '23. Idempotency Key',
    concept: 'dedupe keys, request retries, and safe write APIs',
    task: 'Implement idempotencyKey(method, path, bodyHash). Return a stable key string.',
    example: "idempotencyKey('POST', '/orders', 'abc') returns 'POST:/orders:abc'.",
  },
  {
    id: 'node-fundamentals-24-redact-secret-fields',
    title: '24. Redact Secret Fields',
    concept: 'structured logging, secret redaction, and safe observability',
    task: 'Implement redactSecrets(obj). Return a copy where password, token, and secret fields are "[redacted]".',
    example: "redactSecrets({ email: 'a', password: 'pw' }) returns { email: 'a', password: '[redacted]' }.",
  },
  {
    id: 'node-fundamentals-25-request-log-line',
    title: '25. Request Log Line',
    concept: 'request logs, method/path/status/duration, and incident debugging',
    task: 'Implement requestLog(req, res, durationMs). Return a compact structured log object.',
    example: "requestLog({ method: 'GET', path: '/health' }, { status: 200 }, 12) returns { method: 'GET', path: '/health', status: 200, durationMs: 12 }.",
  },
]

export const nodeFundamentalProblems: Problem[] = drills.map((drill, index) => ({
  id: drill.id,
  title: drill.title,
  type: 'coding',
  difficulty: index < 12 ? 'Warmup' : index < 21 ? 'Core' : 'Hard',
  minutes: index < 12 ? 18 : 25,
  prompt: `Coding drill: ${drill.task}`,
  explanation:
    `${drill.title} drills ${drill.concept}. This is intentionally small: backend skill compounds when loops, arrays, objects, strings, errors, and async shapes become automatic.`,
  production:
    `In production Node.js, ${drill.concept} shows up inside routes, middleware, clients, workers, logs, and tests. If this small version is shaky, the larger backend version will be shaky too.`,
  walkthrough: [
    'Write the function signature exactly as shown in the coding tests.',
    'Handle the simplest happy path first.',
    'Add the empty, missing, or invalid input branch.',
    'Run tests, read the failing case, and tighten the implementation.',
    'Explain how the same pattern appears inside a real API route or worker.',
  ],
  example: drill.example,
  questions: [
    `What JavaScript or Node.js fundamental is this drilling?`,
    'What edge case should fail safely?',
    'Where would this exact pattern appear in a backend?',
    'How would a bug here show up in production?',
  ],
  checklist: [
    'Function name matches the starter.',
    'Happy path passes.',
    'Edge case is handled deliberately.',
    'Output shape is stable.',
    'Production connection is understood.',
  ],
}))
