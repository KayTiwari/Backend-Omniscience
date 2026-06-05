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

  // ----- Networking & SSRF defense ---------------------------------------
  {
    problemId: 'net-cidr-contains',
    title: 'CIDR Contains IP',
    language: 'js',
    starter:
      "function cidrContains(cidr, ip) {\n  // does the IPv4 `ip` fall inside `cidr` (e.g. '10.0.0.0/8')?\n}\n",
    tests: [
      {
        name: 'matches inside the range',
        body: `assert(cidrContains('10.0.0.0/8', '10.5.4.3') === true); assert(cidrContains('192.168.1.0/24', '192.168.1.255') === true);`,
      },
      {
        name: 'rejects outside the range',
        body: `assert(cidrContains('10.0.0.0/8', '11.0.0.1') === false); assert(cidrContains('192.168.1.0/24', '192.168.2.1') === false);`,
      },
    ],
    reference: `function cidrContains(cidr, ip) {
  const [net, bitsStr] = cidr.split('/');
  const bits = Number(bitsStr);
  const toInt = (s) => s.split('.').reduce((a, o) => a * 256 + Number(o), 0);
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return ((toInt(ip) & mask) >>> 0) === ((toInt(net) & mask) >>> 0);
}
`,
  },

  // ----- Observability ----------------------------------------------------
  {
    problemId: 'obs-log-parse',
    title: 'Parse An Access Log Line',
    language: 'js',
    starter:
      "function parseLogLine(line) {\n  // '<ts> GET /api 200 34ms' -> { ts, method, path, status:Number, ms:Number }\n}\n",
    tests: [
      {
        name: 'extracts typed fields',
        body: `assertEqual(parseLogLine('2026-06-05T10:15:01Z GET /api 200 34ms'), { ts: '2026-06-05T10:15:01Z', method: 'GET', path: '/api', status: 200, ms: 34 });`,
      },
    ],
    reference: `function parseLogLine(line) {
  const [ts, method, path, status, lat] = line.split(' ');
  return { ts, method, path, status: Number(status), ms: Number(lat.replace('ms', '')) };
}
`,
  },
  {
    problemId: 'obs-error-rate',
    title: 'Error Rate',
    language: 'js',
    starter:
      'function errorRate(statuses) {\n  // fraction of statuses that are 5xx; [] -> 0\n}\n',
    tests: [
      {
        name: 'computes the 5xx fraction',
        body: `assertEqual(errorRate([200,500,200,503]), 0.5); assertEqual(errorRate([]), 0); assertEqual(errorRate([200,404]), 0);`,
      },
    ],
    reference: `function errorRate(statuses) {
  if (statuses.length === 0) return 0;
  return statuses.filter((s) => s >= 500).length / statuses.length;
}
`,
  },
  {
    problemId: 'obs-histogram',
    title: 'Cumulative Histogram Buckets',
    language: 'js',
    starter:
      'function bucketize(values, bounds) {\n  // Prometheus-style: count of values <= each ascending bound\n}\n',
    tests: [
      {
        name: 'counts cumulatively per bound',
        body: `assertEqual(bucketize([1,2,3,4], [2,4]), [2,4]); assertEqual(bucketize([5,6], [2,4]), [0,0]);`,
      },
    ],
    reference: `function bucketize(values, bounds) {
  return bounds.map((b) => values.filter((v) => v <= b).length);
}
`,
  },

  // ----- Messaging & partitioning ----------------------------------------
  {
    problemId: 'msg-partition',
    title: 'Partition By Key',
    language: 'js',
    starter:
      'function partition(key, n) {\n  // map a key to a partition [0, n) with a stable hash\n}\n',
    tests: [
      {
        name: 'stable and in range',
        body: `assert(partition('user-1', 4) === partition('user-1', 4), 'stable'); const p = partition('abc', 8); assert(p >= 0 && p < 8, 'range');`,
      },
    ],
    reference: `function partition(key, n) {
  let h = 5381;
  for (let i = 0; i < key.length; i++) h = (((h << 5) + h) + key.charCodeAt(i)) >>> 0;
  return h % n;
}
`,
  },
  {
    problemId: 'msg-round-robin',
    title: 'Round-Robin Assignment',
    language: 'js',
    starter:
      'function roundRobin(items, workers) {\n  // return the worker index assigned to each item\n}\n',
    tests: [
      {
        name: 'cycles through workers',
        body: `assertEqual(roundRobin(['a','b','c','d'], 2), [0,1,0,1]); assertEqual(roundRobin([], 3), []);`,
      },
    ],
    reference: `function roundRobin(items, workers) {
  return items.map((_, i) => i % workers);
}
`,
  },

  // ----- Scaling & load shedding -----------------------------------------
  {
    problemId: 'scale-weighted-pick',
    title: 'Weighted Pick',
    language: 'js',
    starter:
      'function weightedPick(weights, r) {\n  // r in [0,1): return the index chosen by cumulative weight\n}\n',
    tests: [
      {
        name: 'lands in the right band',
        body: `assertEqual(weightedPick([1,1,2], 0.9), 2); assertEqual(weightedPick([1,1], 0.4), 0); assertEqual(weightedPick([1,1], 0.6), 1);`,
      },
    ],
    reference: `function weightedPick(weights, r) {
  const total = weights.reduce((a, b) => a + b, 0);
  const target = r * total;
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i];
    if (target < acc) return i;
  }
  return weights.length - 1;
}
`,
  },
  {
    problemId: 'scale-sliding-window',
    title: 'Sliding-Window Rate Limiter',
    language: 'js',
    starter:
      'function slidingWindow(times, limit, windowMs) {\n  // log-based sliding window. return booleans: allowed?\n}\n',
    tests: [
      {
        name: 'evicts old entries as the window slides',
        body: `assertEqual(slidingWindow([0,100,200,1100], 2, 1000), [true, true, false, true]);`,
      },
    ],
    reference: `function slidingWindow(times, limit, windowMs) {
  const log = [];
  const out = [];
  for (const t of times) {
    while (log.length && log[0] <= t - windowMs) log.shift();
    if (log.length < limit) { log.push(t); out.push(true); }
    else out.push(false);
  }
  return out;
}
`,
  },

  // ----- Data integrity ---------------------------------------------------
  {
    problemId: 'data-luhn',
    title: 'Luhn Checksum',
    language: 'js',
    starter:
      'function luhnValid(num) {\n  // validate a numeric string with the Luhn algorithm\n}\n',
    tests: [
      {
        name: 'accepts valid and rejects invalid',
        body: `assert(luhnValid('79927398713') === true); assert(luhnValid('79927398710') === false);`,
      },
    ],
    reference: `function luhnValid(num) {
  let sum = 0, dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}
`,
  },

  // ----- JSON / config utilities -----------------------------------------
  {
    problemId: 'json-get-path',
    title: 'Safe Nested Get',
    language: 'js',
    starter:
      "function getPath(obj, path, dflt) {\n  // getPath({a:{b:1}}, 'a.b') -> 1; missing -> dflt\n}\n",
    tests: [
      {
        name: 'reads nested and falls back',
        body: `assertEqual(getPath({a:{b:{c:5}}}, 'a.b.c', 0), 5); assertEqual(getPath({a:{}}, 'a.b.c', 0), 0);`,
      },
    ],
    reference: `function getPath(obj, path, dflt) {
  let cur = obj;
  for (const p of path.split('.')) {
    if (cur == null || !(p in Object(cur))) return dflt;
    cur = cur[p];
  }
  return cur;
}
`,
  },
  {
    problemId: 'json-deep-equal',
    title: 'Deep Equal',
    language: 'js',
    starter:
      'function deepEqual(a, b) {\n  // recursive structural equality for JSON-like values\n}\n',
    tests: [
      {
        name: 'compares nested structures',
        body: `assert(deepEqual({a:[1,2]}, {a:[1,2]}) === true); assert(deepEqual({a:[1,2]}, {a:[1,3]}) === false); assert(deepEqual(1, 1) === true);`,
      },
    ],
    reference: `function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a == null || b == null) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual(a[k], b[k]));
}
`,
  },
  {
    problemId: 'json-deep-merge',
    title: 'Deep Merge',
    language: 'js',
    starter:
      'function deepMerge(a, b) {\n  // merge b into a recursively (b wins); arrays are replaced\n}\n',
    tests: [
      {
        name: 'merges nested objects',
        body: `assertEqual(deepMerge({a:1, b:{x:1}}, {b:{y:2}, c:3}), {a:1, b:{x:1, y:2}, c:3});`,
      },
    ],
    reference: `function deepMerge(a, b) {
  const out = { ...a };
  for (const k of Object.keys(b)) {
    const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
    out[k] = isObj(a[k]) && isObj(b[k]) ? deepMerge(a[k], b[k]) : b[k];
  }
  return out;
}
`,
  },

  // ----- Parsing ----------------------------------------------------------
  {
    problemId: 'parse-csv-line',
    title: 'Parse A CSV Line',
    language: 'js',
    starter:
      'function parseCsvLine(line) {\n  // handle quoted fields with embedded commas and "" escapes\n}\n',
    tests: [
      {
        name: 'splits respecting quotes',
        body: `assertEqual(parseCsvLine('a,"b,c",d'), ['a', 'b,c', 'd']);`,
      },
      {
        name: 'unescapes doubled quotes',
        body: `assertEqual(parseCsvLine('x,"he said ""hi"""'), ['x', 'he said "hi"']);`,
      },
    ],
    reference: `function parseCsvLine(line) {
  const out = [];
  let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}
`,
  },
  {
    problemId: 'parse-slugify',
    title: 'Slugify',
    language: 'js',
    starter:
      "function slugify(s) {\n  // 'Hello, World!' -> 'hello-world'\n}\n",
    tests: [
      {
        name: 'lowercases and dasherizes',
        body: `assertEqual(slugify('Hello, World!'), 'hello-world'); assertEqual(slugify('  Trim  Me  '), 'trim-me');`,
      },
    ],
    reference: `function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
`,
  },
  {
    problemId: 'parse-range-header',
    title: 'Parse A Range Header',
    language: 'js',
    starter:
      "function parseRange(header, size) {\n  // 'bytes=0-499' -> { start, end }; 'bytes=500-' / 'bytes=-200' supported\n}\n",
    tests: [
      {
        name: 'handles all three forms',
        body: `assertEqual(parseRange('bytes=0-499', 1000), { start: 0, end: 499 }); assertEqual(parseRange('bytes=500-', 1000), { start: 500, end: 999 }); assertEqual(parseRange('bytes=-200', 1000), { start: 800, end: 999 });`,
      },
    ],
    reference: `function parseRange(header, size) {
  const m = header.match(/^bytes=(\\d*)-(\\d*)$/);
  if (!m) return null;
  let start = m[1] === '' ? null : Number(m[1]);
  let end = m[2] === '' ? null : Number(m[2]);
  if (start === null) { start = size - end; end = size - 1; }
  else if (end === null) end = size - 1;
  return { start, end };
}
`,
  },

  // ----- Reliability & distributed systems -------------------------------
  {
    problemId: 'reliability-full-jitter',
    title: 'Backoff With Full Jitter',
    language: 'js',
    starter:
      'function retryFullJitter(attempt, base, cap, rand) {\n  // full jitter: rand in [0,1) scales the capped exponential delay\n}\n',
    tests: [
      {
        name: 'scales the capped delay by rand',
        body: `assertEqual(retryFullJitter(2, 100, 1000, 0.5), 200); assertEqual(retryFullJitter(0, 100, 1000, 0), 0); assertEqual(retryFullJitter(5, 100, 1000, 0.5), 500);`,
      },
    ],
    reference: `function retryFullJitter(attempt, base, cap, rand) {
  return rand * Math.min(cap, base * Math.pow(2, attempt));
}
`,
  },
  {
    problemId: 'tpc-decision',
    title: 'Two-Phase Commit Decision',
    language: 'js',
    starter:
      "function tpcDecision(votes) {\n  // 'commit' only if every participant voted 'yes', else 'abort'\n}\n",
    tests: [
      {
        name: 'commits only on unanimous yes',
        body: `assertEqual(tpcDecision(['yes','yes']), 'commit'); assertEqual(tpcDecision(['yes','no']), 'abort'); assertEqual(tpcDecision([]), 'commit');`,
      },
    ],
    reference: `function tpcDecision(votes) {
  return votes.every((v) => v === 'yes') ? 'commit' : 'abort';
}
`,
  },
  {
    problemId: 'arch-event-sourcing',
    title: 'Rebuild State From Events',
    language: 'js',
    starter:
      "function balanceFrom(events) {\n  // events: { type:'deposit'|'withdraw', amount }. withdraw only if funds suffice.\n}\n",
    tests: [
      {
        name: 'folds events into a balance',
        body: `assertEqual(balanceFrom([{type:'deposit',amount:100},{type:'withdraw',amount:30},{type:'withdraw',amount:1000}]), 70);`,
      },
    ],
    reference: `function balanceFrom(events) {
  let bal = 0;
  for (const e of events) {
    if (e.type === 'deposit') bal += e.amount;
    else if (e.type === 'withdraw' && bal >= e.amount) bal -= e.amount;
  }
  return bal;
}
`,
  },
  {
    problemId: 'arch-saga',
    title: 'Saga Compensation',
    language: 'js',
    starter:
      'function runSaga(steps) {\n  // steps: { name, ok }. On first failure, compensate completed steps in reverse.\n  // return { completed, compensated, failedAt }\n}\n',
    tests: [
      {
        name: 'compensates in reverse on failure',
        body: `assertEqual(runSaga([{name:'a',ok:true},{name:'b',ok:true},{name:'c',ok:false},{name:'d',ok:true}]), { completed: ['a','b'], compensated: ['b','a'], failedAt: 'c' });`,
      },
      {
        name: 'no compensation when all succeed',
        body: `assertEqual(runSaga([{name:'a',ok:true}]), { completed: ['a'], compensated: [], failedAt: null });`,
      },
    ],
    reference: `function runSaga(steps) {
  const completed = [];
  for (const s of steps) {
    if (s.ok) completed.push(s.name);
    else return { completed, compensated: [...completed].reverse(), failedAt: s.name };
  }
  return { completed, compensated: [], failedAt: null };
}
`,
  },
  {
    problemId: 'dist-consistent-hash',
    title: 'Consistent Hashing Ring',
    language: 'js',
    starter:
      'function assignNode(nodes, key) {\n  // place nodes on a hash ring; return the node a key maps to (clockwise)\n}\n',
    tests: [
      {
        name: 'stable and returns a real node',
        body: `const nodes = ['a','b','c']; assert(nodes.includes(assignNode(nodes, 'user-42')), 'member'); assert(assignNode(nodes, 'k') === assignNode(nodes, 'k'), 'stable');`,
      },
    ],
    reference: `function assignNode(nodes, key) {
  const hash = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = (((h << 5) + h) + s.charCodeAt(i)) >>> 0; return h; };
  const ring = nodes.map((n) => ({ h: hash(n), n })).sort((a, b) => a.h - b.h);
  const kh = hash(key);
  for (const p of ring) if (p.h >= kh) return p.n;
  return ring[0].n;
}
`,
  },

  // ----- Data structures --------------------------------------------------
  {
    problemId: 'ds-trie-autocomplete',
    title: 'Trie Autocomplete',
    language: 'js',
    starter:
      'class Trie {\n  insert(word) {}\n  startsWith(prefix) {} // sorted array of words with that prefix\n}\n',
    tests: [
      {
        name: 'returns words under a prefix',
        body: `const t = new Trie(); ['car','cart','dog'].forEach((w) => t.insert(w)); assertEqual(t.startsWith('car'), ['car','cart']); assertEqual(t.startsWith('do'), ['dog']); assertEqual(t.startsWith('z'), []);`,
      },
    ],
    reference: `class Trie {
  constructor() { this.root = {}; }
  insert(word) {
    let node = this.root;
    for (const c of word) node = node[c] = node[c] || {};
    node.$ = true;
  }
  startsWith(prefix) {
    let node = this.root;
    for (const c of prefix) { if (!node[c]) return []; node = node[c]; }
    const out = [];
    const dfs = (n, pre) => {
      if (n.$) out.push(pre);
      for (const c of Object.keys(n)) if (c !== '$') dfs(n[c], pre + c);
    };
    dfs(node, prefix);
    return out.sort();
  }
}
`,
  },
  {
    problemId: 'ds-moving-average',
    title: 'Moving Average',
    language: 'js',
    starter:
      'function movingAverage(values, window) {\n  // sliding average; output length = values.length - window + 1 (or [])\n}\n',
    tests: [
      {
        name: 'computes the windowed mean',
        body: `assertEqual(movingAverage([1,2,3,4], 2), [1.5, 2.5, 3.5]); assertEqual(movingAverage([1], 2), []);`,
      },
    ],
    reference: `function movingAverage(values, window) {
  const out = [];
  for (let i = window - 1; i < values.length; i++) {
    let s = 0;
    for (let j = i - window + 1; j <= i; j++) s += values[j];
    out.push(s / window);
  }
  return out;
}
`,
  },

  // ----- Protocols --------------------------------------------------------
  {
    problemId: 'protocol-varint',
    title: 'Varint Encode/Decode',
    language: 'js',
    starter:
      'function encodeVarint(n) {}\nfunction decodeVarint(bytes) {}\n// LEB128 unsigned, like protobuf/gRPC field lengths\n',
    tests: [
      {
        name: 'encodes 300 to two bytes',
        body: `assertEqual(encodeVarint(300), [0xac, 0x02]); assertEqual(encodeVarint(0), [0]);`,
      },
      {
        name: 'round-trips',
        body: `assertEqual(decodeVarint([0xac, 0x02]), 300); assertEqual(decodeVarint(encodeVarint(1000000)), 1000000);`,
      },
    ],
    reference: `function encodeVarint(n) {
  const out = [];
  do {
    let b = n & 0x7f;
    n = Math.floor(n / 128);
    if (n > 0) b |= 0x80;
    out.push(b);
  } while (n > 0);
  return out;
}
function decodeVarint(bytes) {
  let result = 0, shift = 0;
  for (const b of bytes) {
    result += (b & 0x7f) * Math.pow(2, shift);
    if ((b & 0x80) === 0) break;
    shift += 7;
  }
  return result;
}
`,
  },

  // ----- HTTP / API / caching / DB ---------------------------------------
  {
    problemId: 'http-build-query',
    title: 'Build A Query URL',
    language: 'js',
    starter:
      "function buildQueryUrl(base, params) {\n  // sorted, URL-encoded params; no '?' when params is empty\n}\n",
    tests: [
      {
        name: 'sorts and encodes params',
        body: `assertEqual(buildQueryUrl('/x', { b: 2, a: 1 }), '/x?a=1&b=2'); assertEqual(buildQueryUrl('/s', { q: 'a b' }), '/s?q=a%20b'); assertEqual(buildQueryUrl('/x', {}), '/x');`,
      },
    ],
    reference: `function buildQueryUrl(base, params) {
  const keys = Object.keys(params).sort();
  const qs = keys.map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
  return qs ? base + '?' + qs : base;
}
`,
  },
  {
    problemId: 'http-parse-cache-control',
    title: 'Parse Cache-Control',
    language: 'js',
    starter:
      "function parseCacheControl(header) {\n  // 'max-age=60, no-cache' -> { 'max-age': '60', 'no-cache': true }\n}\n",
    tests: [
      {
        name: 'parses directives and flags',
        body: `assertEqual(parseCacheControl('max-age=60, no-cache'), { 'max-age': '60', 'no-cache': true });`,
      },
    ],
    reference: `function parseCacheControl(header) {
  const out = {};
  for (const part of header.split(',')) {
    const p = part.trim();
    if (!p) continue;
    const i = p.indexOf('=');
    if (i >= 0) out[p.slice(0, i)] = p.slice(i + 1);
    else out[p] = true;
  }
  return out;
}
`,
  },
  {
    problemId: 'http-decode-chunked',
    title: 'Decode Chunked Transfer',
    language: 'js',
    starter:
      "function decodeChunked(s) {\n  // '4\\r\\nWiki\\r\\n0\\r\\n\\r\\n' -> 'Wiki' (hex sizes, CRLF framing)\n}\n",
    tests: [
      {
        name: 'reassembles the chunks',
        body: `assertEqual(decodeChunked('4\\r\\nWiki\\r\\n5\\r\\npedia\\r\\n0\\r\\n\\r\\n'), 'Wikipedia');`,
      },
    ],
    reference: `function decodeChunked(s) {
  let out = '', i = 0;
  while (i < s.length) {
    const nl = s.indexOf('\\r\\n', i);
    const size = parseInt(s.slice(i, nl), 16);
    if (size === 0) break;
    const start = nl + 2;
    out += s.slice(start, start + size);
    i = start + size + 2;
  }
  return out;
}
`,
  },
  {
    problemId: 'db-keyset-pagination',
    title: 'Keyset Pagination',
    language: 'js',
    starter:
      'function keysetPaginate(rows, afterId, limit) {\n  // rows sorted by id asc. return { rows: <=limit after afterId, nextAfter }\n}\n',
    tests: [
      {
        name: 'pages by last seen id',
        body: `assertEqual(keysetPaginate([{id:1},{id:2},{id:3},{id:4}], 2, 2), { rows: [{id:3},{id:4}], nextAfter: 4 }); assertEqual(keysetPaginate([{id:1}], 9, 2), { rows: [], nextAfter: null });`,
      },
    ],
    reference: `function keysetPaginate(rows, afterId, limit) {
  const page = rows.filter((r) => r.id > afterId).slice(0, limit);
  const nextAfter = page.length ? page[page.length - 1].id : null;
  return { rows: page, nextAfter };
}
`,
  },
]
