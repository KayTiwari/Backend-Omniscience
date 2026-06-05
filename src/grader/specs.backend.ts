import type { GradeSpec } from './types.ts'

// Auto-gradable coding drills, ordered so concepts build on each other:
// HTTP layer -> APIs -> caching -> security -> reliability/architecture ->
// data & performance -> real-time. Each ships a reference solution that the
// self-test runs against its own tests.
export const backendSpecs: GradeSpec[] = [
  // ----- HTTP layer -------------------------------------------------------
  {
    problemId: 'internet-request-line',
    title: 'Parse An HTTP Request Line',
    language: 'js',
    starter:
      'function parseRequestLine(line) {\n  // "GET /users?page=2 HTTP/1.1" ->\n  // { method, path, query, version }; query is "" when absent\n}\n',
    tests: [
      {
        name: 'splits method, path, query, version',
        body: "assertEqual(parseRequestLine('GET /users?page=2 HTTP/1.1'), { method: 'GET', path: '/users', query: 'page=2', version: 'HTTP/1.1' });",
      },
      {
        name: 'empty query when no question mark',
        body: "assertEqual(parseRequestLine('POST /login HTTP/1.1'), { method: 'POST', path: '/login', query: '', version: 'HTTP/1.1' });",
      },
    ],
    reference:
      "function parseRequestLine(line) {\n" +
      "  const [method, target, version] = line.split(' ');\n" +
      "  const q = target.indexOf('?');\n" +
      "  const path = q >= 0 ? target.slice(0, q) : target;\n" +
      "  const query = q >= 0 ? target.slice(q + 1) : '';\n" +
      "  return { method, path, query, version };\n" +
      "}\n",
  },
  {
    problemId: 'internet-parse-cookies',
    title: 'Parse A Cookie Header',
    language: 'js',
    starter:
      "function parseCookies(header) {\n  // 'a=1; b=2' -> { a: '1', b: '2' }; '' -> {}\n}\n",
    tests: [
      {
        name: 'parses multiple cookies',
        body: "assertEqual(parseCookies('sid=abc; theme=dark'), { sid: 'abc', theme: 'dark' });",
      },
      { name: 'empty header is empty object', body: "assertEqual(parseCookies(''), {});" },
    ],
    reference:
      "function parseCookies(header) {\n" +
      "  const out = {};\n" +
      "  if (!header) return out;\n" +
      "  for (const part of header.split(';')) {\n" +
      "    const idx = part.indexOf('=');\n" +
      "    if (idx < 0) continue;\n" +
      "    out[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();\n" +
      "  }\n" +
      "  return out;\n" +
      "}\n",
  },
  {
    problemId: 'internet-build-response',
    title: 'Build A Raw HTTP Response',
    language: 'js',
    starter:
      'function buildResponse(status, body) {\n  // return a raw HTTP/1.1 response string with a status line,\n  // Content-Length header, CRLF separators, then the body\n}\n',
    tests: [
      {
        name: 'includes status line and content-length',
        body: "const r = buildResponse(200, 'hello'); assert(r.startsWith('HTTP/1.1 200 OK\\r\\n'), 'status line'); assert(r.includes('Content-Length: 5'), 'length'); assert(r.endsWith('\\r\\nhello'), 'body');",
      },
      {
        name: 'maps 404',
        body: "assert(buildResponse(404, '').startsWith('HTTP/1.1 404 Not Found\\r\\n'), '404 reason');",
      },
    ],
    reference:
      "function buildResponse(status, body) {\n" +
      "  const reasons = { 200: 'OK', 201: 'Created', 400: 'Bad Request', 404: 'Not Found', 500: 'Internal Server Error' };\n" +
      "  const reason = reasons[status] || 'Unknown';\n" +
      "  const len = new TextEncoder().encode(body).length;\n" +
      "  return 'HTTP/1.1 ' + status + ' ' + reason + '\\r\\n' +\n" +
      "    'Content-Length: ' + len + '\\r\\n' +\n" +
      "    '\\r\\n' + body;\n" +
      "}\n",
  },
  {
    problemId: 'internet-content-negotiation',
    title: 'Content Negotiation',
    language: 'js',
    starter:
      "function chooseType(accept, available) {\n  // accept: 'application/json, text/html;q=0.9'\n  // return the highest-q type that is in `available`, else null\n}\n",
    tests: [
      {
        name: 'prefers higher q that is available',
        body: "assertEqual(chooseType('application/json, text/html;q=0.9', ['text/html', 'application/xml']), 'text/html');",
      },
      {
        name: 'respects explicit q ordering',
        body: "assertEqual(chooseType('a/b;q=0.2, c/d;q=0.8', ['a/b', 'c/d']), 'c/d');",
      },
      { name: 'null when nothing matches', body: "assertEqual(chooseType('text/plain', ['application/json']), null);" },
    ],
    reference:
      "function chooseType(accept, available) {\n" +
      "  const parsed = accept.split(',').map((part) => {\n" +
      "    const [type, ...params] = part.split(';').map((s) => s.trim());\n" +
      "    const qp = params.find((p) => p.startsWith('q='));\n" +
      "    const q = qp ? parseFloat(qp.slice(2)) : 1;\n" +
      "    return { type, q };\n" +
      "  });\n" +
      "  parsed.sort((a, b) => b.q - a.q);\n" +
      "  for (const { type } of parsed) if (available.includes(type)) return type;\n" +
      "  return null;\n" +
      "}\n",
  },

  // ----- APIs -------------------------------------------------------------
  {
    problemId: 'api-offset-paginate',
    title: 'Offset Pagination',
    language: 'js',
    starter:
      'function offsetPaginate(items, page, perPage) {\n  // 1-based page. return { items, page, perPage, total, totalPages }\n}\n',
    tests: [
      {
        name: 'returns the requested page and metadata',
        body: "assertEqual(offsetPaginate([1,2,3,4,5], 2, 2), { items: [3,4], page: 2, perPage: 2, total: 5, totalPages: 3 });",
      },
    ],
    reference:
      "function offsetPaginate(items, page, perPage) {\n" +
      "  const total = items.length;\n" +
      "  const totalPages = Math.ceil(total / perPage);\n" +
      "  const start = (page - 1) * perPage;\n" +
      "  return { items: items.slice(start, start + perPage), page, perPage, total, totalPages };\n" +
      "}\n",
  },
  {
    problemId: 'api-validate',
    title: 'Validate A Request Body',
    language: 'js',
    starter:
      "function validate(rules, obj) {\n  // rules: { field: { required?, type? } }\n  // return { field: 'required' | 'type' } for each violation\n}\n",
    tests: [
      {
        name: 'flags missing required and wrong type',
        body: "assertEqual(validate({ name: { required: true, type: 'string' }, age: { type: 'number' } }, { age: 'x' }), { name: 'required', age: 'type' });",
      },
      {
        name: 'no errors when valid',
        body: "assertEqual(validate({ name: { required: true, type: 'string' } }, { name: 'Ada' }), {});",
      },
    ],
    reference:
      "function validate(rules, obj) {\n" +
      "  const errors = {};\n" +
      "  for (const field of Object.keys(rules)) {\n" +
      "    const r = rules[field];\n" +
      "    const v = obj[field];\n" +
      "    if (r.required && (v === undefined || v === null || v === '')) { errors[field] = 'required'; continue; }\n" +
      "    if (v !== undefined && r.type && typeof v !== r.type) errors[field] = 'type';\n" +
      "  }\n" +
      "  return errors;\n" +
      "}\n",
  },
  {
    problemId: 'api-etag',
    title: 'Generate A Weak ETag',
    language: 'js',
    starter:
      "function etag(body) {\n  // return a stable hex hash string for the body (djb2 is fine)\n}\n",
    tests: [
      {
        name: 'stable and content-sensitive',
        body: "assert(etag('hello') === etag('hello'), 'stable'); assert(etag('hello') !== etag('world'), 'differs'); assert(typeof etag('x') === 'string', 'string');",
      },
    ],
    reference:
      "function etag(body) {\n" +
      "  let h = 5381;\n" +
      "  for (let i = 0; i < body.length; i++) h = (((h << 5) + h) + body.charCodeAt(i)) >>> 0;\n" +
      "  return h.toString(16);\n" +
      "}\n",
  },

  // ----- Caching ----------------------------------------------------------
  {
    problemId: 'caching-memoize',
    title: 'Memoize A Function',
    language: 'js',
    starter:
      'function memoize(fn) {\n  // return a function that caches results by its arguments\n}\n',
    tests: [
      {
        name: 'computes once per distinct args',
        body: "let calls = 0; const m = memoize((x) => { calls++; return x * 2; }); assertEqual(m(2), 4); assertEqual(m(2), 4); assertEqual(calls, 1); assertEqual(m(3), 6); assertEqual(calls, 2);",
      },
    ],
    reference:
      "function memoize(fn) {\n" +
      "  const cache = new Map();\n" +
      "  return function (...args) {\n" +
      "    const key = JSON.stringify(args);\n" +
      "    if (cache.has(key)) return cache.get(key);\n" +
      "    const value = fn.apply(this, args);\n" +
      "    cache.set(key, value);\n" +
      "    return value;\n" +
      "  };\n" +
      "}\n",
  },
  {
    problemId: 'caching-lru',
    title: 'LRU Cache',
    language: 'js',
    starter:
      'class LRU {\n  constructor(capacity) {}\n  get(key) {}   // returns value or undefined; marks as recently used\n  put(key, value) {} // evicts least-recently-used when over capacity\n}\n',
    tests: [
      {
        name: 'evicts the least recently used entry',
        body: "const c = new LRU(2); c.put('a', 1); c.put('b', 2); assertEqual(c.get('a'), 1); c.put('c', 3); assertEqual(c.get('b'), undefined); assertEqual(c.get('a'), 1); assertEqual(c.get('c'), 3);",
      },
    ],
    reference:
      "class LRU {\n" +
      "  constructor(capacity) { this.cap = capacity; this.map = new Map(); }\n" +
      "  get(key) {\n" +
      "    if (!this.map.has(key)) return undefined;\n" +
      "    const v = this.map.get(key);\n" +
      "    this.map.delete(key); this.map.set(key, v);\n" +
      "    return v;\n" +
      "  }\n" +
      "  put(key, value) {\n" +
      "    if (this.map.has(key)) this.map.delete(key);\n" +
      "    this.map.set(key, value);\n" +
      "    if (this.map.size > this.cap) this.map.delete(this.map.keys().next().value);\n" +
      "  }\n" +
      "}\n",
  },

  // ----- Security ---------------------------------------------------------
  {
    problemId: 'security-constant-time',
    title: 'Constant-Time Compare',
    language: 'js',
    starter:
      'function constantTimeEqual(a, b) {\n  // compare two strings without early-exit on first mismatch\n}\n',
    tests: [
      {
        name: 'matches and mismatches',
        body: "assert(constantTimeEqual('abc', 'abc') === true); assert(constantTimeEqual('abc', 'abd') === false); assert(constantTimeEqual('abc', 'abcd') === false);",
      },
    ],
    reference:
      "function constantTimeEqual(a, b) {\n" +
      "  if (a.length !== b.length) return false;\n" +
      "  let diff = 0;\n" +
      "  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);\n" +
      "  return diff === 0;\n" +
      "}\n",
  },
  {
    problemId: 'security-escape-html',
    title: 'Escape HTML',
    language: 'js',
    starter:
      "function escapeHtml(s) {\n  // escape & < > \" ' to prevent XSS in rendered output\n}\n",
    tests: [
      {
        name: 'escapes the dangerous characters',
        body: "assertEqual(escapeHtml('<a href=\"x\">&'), '&lt;a href=&quot;x&quot;&gt;&amp;');",
      },
    ],
    reference:
      "function escapeHtml(s) {\n" +
      "  return s\n" +
      "    .replace(/&/g, '&amp;')\n" +
      "    .replace(/</g, '&lt;')\n" +
      "    .replace(/>/g, '&gt;')\n" +
      "    .replace(/\"/g, '&quot;')\n" +
      "    .replace(/'/g, '&#39;');\n" +
      "}\n",
  },
  {
    problemId: 'security-strong-password',
    title: 'Password Strength',
    language: 'js',
    starter:
      'function isStrong(pw) {\n  // true if length >= 8 and has lower, upper, and digit\n}\n',
    tests: [
      {
        name: 'enforces the rules',
        body: "assert(isStrong('Abcdefg1') === true); assert(isStrong('abcdefg1') === false); assert(isStrong('Abc1') === false);",
      },
    ],
    reference:
      "function isStrong(pw) {\n" +
      "  return pw.length >= 8 && /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /[0-9]/.test(pw);\n" +
      "}\n",
  },
  {
    problemId: 'security-token-bucket',
    title: 'Token Bucket Limiter',
    language: 'js',
    starter:
      'function tokenBucket(times, capacity, refillPerSec) {\n  // times: ascending ms timestamps. return booleans: was each request allowed?\n}\n',
    tests: [
      {
        name: 'drains then refuses',
        body: "assertEqual(tokenBucket([0,0,0], 2, 1), [true, true, false]);",
      },
      {
        name: 'refills over time',
        body: "assertEqual(tokenBucket([0,1000], 1, 1), [true, true]);",
      },
    ],
    reference:
      "function tokenBucket(times, capacity, refillPerSec) {\n" +
      "  let tokens = capacity, last = null;\n" +
      "  const out = [];\n" +
      "  for (const t of times) {\n" +
      "    if (last !== null) tokens = Math.min(capacity, tokens + ((t - last) / 1000) * refillPerSec);\n" +
      "    last = t;\n" +
      "    if (tokens >= 1) { tokens -= 1; out.push(true); } else out.push(false);\n" +
      "  }\n" +
      "  return out;\n" +
      "}\n",
  },
  {
    problemId: 'security-jwt-payload',
    title: 'Decode A JWT Payload',
    language: 'js',
    starter:
      "function jwtPayload(token) {\n  // return the decoded JSON payload (the middle segment). Do NOT verify.\n}\n",
    tests: [
      {
        name: 'decodes the base64url payload',
        body: "const tok = 'h.' + btoa('{\"sub\":\"42\"}') + '.s'; assertEqual(jwtPayload(tok), { sub: '42' });",
      },
    ],
    reference:
      "function jwtPayload(token) {\n" +
      "  const seg = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');\n" +
      "  return JSON.parse(atob(seg));\n" +
      "}\n",
  },

  // ----- Reliability & architecture --------------------------------------
  {
    problemId: 'architecture-backoff',
    title: 'Exponential Backoff',
    language: 'js',
    starter:
      'function backoff(attempt, base, cap) {\n  // return the delay for a retry attempt (0-based), capped\n}\n',
    tests: [
      {
        name: 'doubles and caps',
        body: "assertEqual(backoff(0, 100, 1000), 100); assertEqual(backoff(3, 100, 1000), 800); assertEqual(backoff(5, 100, 1000), 1000);",
      },
    ],
    reference:
      "function backoff(attempt, base, cap) {\n" +
      "  return Math.min(cap, base * Math.pow(2, attempt));\n" +
      "}\n",
  },
  {
    problemId: 'architecture-idempotency',
    title: 'Idempotent Dedupe',
    language: 'js',
    starter:
      'function dedupeByKey(items, keyFn) {\n  // keep only the first item per key, preserving order\n}\n',
    tests: [
      {
        name: 'drops later duplicates',
        body: "assertEqual(dedupeByKey([{k:'a',v:1},{k:'b',v:2},{k:'a',v:3}], (x) => x.k), [{k:'a',v:1},{k:'b',v:2}]);",
      },
    ],
    reference:
      "function dedupeByKey(items, keyFn) {\n" +
      "  const seen = new Set();\n" +
      "  const out = [];\n" +
      "  for (const item of items) {\n" +
      "    const k = keyFn(item);\n" +
      "    if (seen.has(k)) continue;\n" +
      "    seen.add(k); out.push(item);\n" +
      "  }\n" +
      "  return out;\n" +
      "}\n",
  },
  {
    problemId: 'architecture-circuit-breaker',
    title: 'Circuit Breaker States',
    language: 'js',
    starter:
      "function circuitStates(events, threshold) {\n  // events: 'ok' | 'fail'. open after `threshold` consecutive fails; an ok closes it.\n  // return the state after each event: 'closed' | 'open'\n}\n",
    tests: [
      {
        name: 'opens on consecutive failures',
        body: "assertEqual(circuitStates(['fail','fail','ok','fail'], 2), ['closed','open','closed','closed']);",
      },
    ],
    reference:
      "function circuitStates(events, threshold) {\n" +
      "  let fails = 0, state = 'closed';\n" +
      "  const out = [];\n" +
      "  for (const e of events) {\n" +
      "    if (e === 'fail') { fails++; if (fails >= threshold) state = 'open'; }\n" +
      "    else { fails = 0; state = 'closed'; }\n" +
      "    out.push(state);\n" +
      "  }\n" +
      "  return out;\n" +
      "}\n",
  },
  {
    problemId: 'queue-dlq',
    title: 'Queue With Retries & DLQ',
    language: 'js',
    starter:
      'function runQueue(messages, failKeys, maxRetries) {\n  // messages: [{ key }]. messages whose key is in failKeys always fail.\n  // return { processed: [keys], dlq: [keys], attempts: number }\n}\n',
    tests: [
      {
        name: 'dead-letters poison messages after retries',
        body: "assertEqual(runQueue([{key:'a'},{key:'b'},{key:'c'}], ['b'], 2), { processed: ['a','c'], dlq: ['b'], attempts: 5 });",
      },
    ],
    reference:
      "function runQueue(messages, failKeys, maxRetries) {\n" +
      "  const processed = [], dlq = [];\n" +
      "  let attempts = 0;\n" +
      "  for (const m of messages) {\n" +
      "    if (failKeys.includes(m.key)) { attempts += maxRetries + 1; dlq.push(m.key); }\n" +
      "    else { attempts += 1; processed.push(m.key); }\n" +
      "  }\n" +
      "  return { processed, dlq, attempts };\n" +
      "}\n",
  },

  // ----- Data & performance ----------------------------------------------
  {
    problemId: 'db-group-by',
    title: 'Group By',
    language: 'js',
    starter:
      'function groupBy(items, keyFn) {\n  // return { key: [items...] }\n}\n',
    tests: [
      {
        name: 'buckets by computed key',
        body: "assertEqual(groupBy([1,2,3,4], (x) => (x % 2 === 0 ? 'even' : 'odd')), { odd: [1,3], even: [2,4] });",
      },
    ],
    reference:
      "function groupBy(items, keyFn) {\n" +
      "  const out = {};\n" +
      "  for (const item of items) {\n" +
      "    const k = keyFn(item);\n" +
      "    (out[k] = out[k] || []).push(item);\n" +
      "  }\n" +
      "  return out;\n" +
      "}\n",
  },
  {
    problemId: 'db-hash-join',
    title: 'Hash Join',
    language: 'js',
    starter:
      'function hashJoin(left, right, key) {\n  // inner join two row arrays on `key`, merging matched rows\n}\n',
    tests: [
      {
        name: 'joins matching rows only',
        body: "assertEqual(hashJoin([{id:1,a:'x'},{id:9,a:'q'}], [{id:1,b:'y'},{id:2,b:'z'}], 'id'), [{id:1,a:'x',b:'y'}]);",
      },
    ],
    reference:
      "function hashJoin(left, right, key) {\n" +
      "  const index = new Map();\n" +
      "  for (const r of right) {\n" +
      "    const k = r[key];\n" +
      "    (index.get(k) || index.set(k, []).get(k)).push(r);\n" +
      "  }\n" +
      "  const out = [];\n" +
      "  for (const l of left) for (const r of index.get(l[key]) || []) out.push({ ...l, ...r });\n" +
      "  return out;\n" +
      "}\n",
  },
  {
    problemId: 'perf-chunk',
    title: 'Chunk An Array',
    language: 'js',
    starter:
      'function chunk(arr, size) {\n  // split into sub-arrays of length `size` (last may be shorter)\n}\n',
    tests: [
      {
        name: 'splits evenly and handles remainder',
        body: "assertEqual(chunk([1,2,3,4,5], 2), [[1,2],[3,4],[5]]); assertEqual(chunk([], 3), []);",
      },
    ],
    reference:
      "function chunk(arr, size) {\n" +
      "  const out = [];\n" +
      "  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));\n" +
      "  return out;\n" +
      "}\n",
  },
  {
    problemId: 'perf-percentile',
    title: 'Latency Percentile',
    language: 'js',
    starter:
      'function percentile(values, p) {\n  // nearest-rank percentile (p in 0..100). [] -> undefined\n}\n',
    tests: [
      {
        name: 'computes p50 and p95',
        body: "assertEqual(percentile([1,2,3,4], 50), 2); const big = Array.from({length:100}, (_, i) => i + 1); assertEqual(percentile(big, 95), 95); assertEqual(percentile([], 50), undefined);",
      },
    ],
    reference:
      "function percentile(values, p) {\n" +
      "  if (values.length === 0) return undefined;\n" +
      "  const sorted = [...values].sort((a, b) => a - b);\n" +
      "  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));\n" +
      "  return sorted[idx];\n" +
      "}\n",
  },
  {
    problemId: 'perf-topk',
    title: 'Top-K Frequent',
    language: 'js',
    starter:
      'function topKFrequent(items, k) {\n  // return the k most frequent values (ties: smaller value first)\n}\n',
    tests: [
      {
        name: 'ranks by frequency',
        body: "assertEqual(topKFrequent([1,1,2,2,2,3], 2), [2,1]);",
      },
    ],
    reference:
      "function topKFrequent(items, k) {\n" +
      "  const counts = new Map();\n" +
      "  for (const x of items) counts.set(x, (counts.get(x) || 0) + 1);\n" +
      "  return [...counts.entries()]\n" +
      "    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))\n" +
      "    .slice(0, k)\n" +
      "    .map((e) => e[0]);\n" +
      "}\n",
  },

  // ----- Real-time --------------------------------------------------------
  {
    problemId: 'realtime-sse-format',
    title: 'Format A Server-Sent Event',
    language: 'js',
    starter:
      "function formatSSE(msg) {\n  // msg: { event?, data, id? } -> 'event: ..\\ndata: ..\\nid: ..\\n\\n'\n}\n",
    tests: [
      {
        name: 'includes provided fields and trailing blank line',
        body: "assertEqual(formatSSE({ event: 'ping', data: 'hi', id: '1' }), 'event: ping\\ndata: hi\\nid: 1\\n\\n');",
      },
      {
        name: 'omits optional fields',
        body: "assertEqual(formatSSE({ data: 'x' }), 'data: x\\n\\n');",
      },
    ],
    reference:
      "function formatSSE(msg) {\n" +
      "  const lines = [];\n" +
      "  if (msg.event) lines.push('event: ' + msg.event);\n" +
      "  lines.push('data: ' + msg.data);\n" +
      "  if (msg.id) lines.push('id: ' + msg.id);\n" +
      "  return lines.join('\\n') + '\\n\\n';\n" +
      "}\n",
  },
]
