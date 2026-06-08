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

  // ----- Algorithms backends use -----------------------------------------
  {
    problemId: 'algo-binary-search',
    title: 'Binary Search',
    language: 'js',
    starter:
      'function binarySearch(arr, target) {\n  // sorted ascending. return index or -1\n}\n',
    tests: [
      {
        name: 'finds and misses',
        body: `assertEqual(binarySearch([1,3,5,7,9], 7), 3); assertEqual(binarySearch([1,3,5], 4), -1); assertEqual(binarySearch([], 1), -1);`,
      },
    ],
    reference: `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}
`,
  },
  {
    problemId: 'algo-merge-intervals',
    title: 'Merge Overlapping Intervals',
    language: 'js',
    starter:
      'function mergeIntervals(intervals) {\n  // [[1,3],[2,6]] -> [[1,6]]\n}\n',
    tests: [
      {
        name: 'merges and keeps gaps',
        body: `assertEqual(mergeIntervals([[1,3],[2,6],[8,10]]), [[1,6],[8,10]]); assertEqual(mergeIntervals([[1,4],[4,5]]), [[1,5]]);`,
      },
    ],
    reference: `function mergeIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [s, e] of sorted) {
    const last = out[out.length - 1];
    if (last && s <= last[1]) last[1] = Math.max(last[1], e);
    else out.push([s, e]);
  }
  return out;
}
`,
  },
  {
    problemId: 'algo-merge-sorted',
    title: 'Merge Two Sorted Arrays',
    language: 'js',
    starter:
      'function mergeSorted(a, b) {\n  // merge two ascending arrays into one ascending array\n}\n',
    tests: [
      {
        name: 'interleaves in order',
        body: `assertEqual(mergeSorted([1,3,5], [2,4,6]), [1,2,3,4,5,6]); assertEqual(mergeSorted([], [1]), [1]);`,
      },
    ],
    reference: `function mergeSorted(a, b) {
  const out = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) out.push(a[i] <= b[j] ? a[i++] : b[j++]);
  while (i < a.length) out.push(a[i++]);
  while (j < b.length) out.push(b[j++]);
  return out;
}
`,
  },

  // ----- Networking & utilities ------------------------------------------
  {
    problemId: 'net-ip-int',
    title: 'IPv4 To Int And Back',
    language: 'js',
    starter:
      'function ipToInt(ip) {}\nfunction intToIp(n) {}\n// round-trip an IPv4 address through a 32-bit integer\n',
    tests: [
      {
        name: 'converts both directions',
        body: `assertEqual(ipToInt('1.0.0.0'), 16777216); assertEqual(intToIp(16777217), '1.0.0.1'); assertEqual(ipToInt(intToIp(3232235521)), 3232235521);`,
      },
    ],
    reference: `function ipToInt(ip) {
  return ip.split('.').reduce((a, o) => a * 256 + Number(o), 0);
}
function intToIp(n) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}
`,
  },
  {
    problemId: 'util-semver-compare',
    title: 'Compare Semantic Versions',
    language: 'js',
    starter:
      "function semverCompare(a, b) {\n  // return -1, 0, or 1 comparing 'major.minor.patch'\n}\n",
    tests: [
      {
        name: 'orders versions numerically',
        body: `assertEqual(semverCompare('1.2.0', '1.10.0'), -1); assertEqual(semverCompare('2.0.0', '1.9.9'), 1); assertEqual(semverCompare('1.0.0', '1.0.0'), 0);`,
      },
    ],
    reference: `function semverCompare(a, b) {
  const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) { if (pa[i] > pb[i]) return 1; if (pa[i] < pb[i]) return -1; }
  return 0;
}
`,
  },
  {
    problemId: 'util-normalize-path',
    title: 'Normalize A URL Path',
    language: 'js',
    starter:
      "function normalizePath(p) {\n  // resolve '.' and '..' segments. '/a/b/../c' -> '/a/c'\n}\n",
    tests: [
      {
        name: 'resolves dot segments',
        body: `assertEqual(normalizePath('/a/b/../c'), '/a/c'); assertEqual(normalizePath('/a/./b'), '/a/b'); assertEqual(normalizePath('/a/../../x'), '/x');`,
      },
    ],
    reference: `function normalizePath(p) {
  const stack = [];
  for (const seg of p.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') stack.pop();
    else stack.push(seg);
  }
  return '/' + stack.join('/');
}
`,
  },
  {
    problemId: 'util-validate-email',
    title: 'Validate An Email',
    language: 'js',
    starter:
      'function validateEmail(s) {\n  // basic structural validation -> boolean\n}\n',
    tests: [
      {
        name: 'accepts valid and rejects malformed',
        body: `assert(validateEmail('a@b.com') === true); assert(validateEmail('a@b') === false); assert(validateEmail('a b@c.com') === false);`,
      },
    ],
    reference: `function validateEmail(s) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(s);
}
`,
  },
  {
    problemId: 'util-diff-arrays',
    title: 'Diff Two Arrays',
    language: 'js',
    starter:
      'function diffArrays(a, b) {\n  // return { added: in b not a, removed: in a not b }, preserving order\n}\n',
    tests: [
      {
        name: 'reports adds and removes',
        body: `assertEqual(diffArrays([1,2,3], [2,3,4]), { added: [4], removed: [1] });`,
      },
    ],
    reference: `function diffArrays(a, b) {
  const sa = new Set(a), sb = new Set(b);
  return { added: b.filter((x) => !sa.has(x)), removed: a.filter((x) => !sb.has(x)) };
}
`,
  },

  // ----- API & HTTP semantics --------------------------------------------
  {
    problemId: 'http-method-idempotent',
    title: 'Is The Method Idempotent?',
    language: 'js',
    starter:
      "function isIdempotent(method) {\n  // GET/HEAD/PUT/DELETE/OPTIONS are idempotent; POST/PATCH are not\n}\n",
    tests: [
      {
        name: 'classifies methods',
        body: `assert(isIdempotent('GET') === true); assert(isIdempotent('PUT') === true); assert(isIdempotent('POST') === false); assert(isIdempotent('PATCH') === false);`,
      },
    ],
    reference: `function isIdempotent(method) {
  return ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS'].includes(method.toUpperCase());
}
`,
  },
  {
    problemId: 'api-link-header',
    title: 'Pagination Link Header',
    language: 'js',
    starter:
      "function linkHeader(base, page, totalPages) {\n  // RFC5988-style. include next when not last, prev when not first.\n}\n",
    tests: [
      {
        name: 'emits next and prev when in the middle',
        body: `assertEqual(linkHeader('/items', 2, 3), '</items?page=3>; rel="next", </items?page=1>; rel="prev"');`,
      },
      {
        name: 'first page has only next',
        body: `assertEqual(linkHeader('/items', 1, 3), '</items?page=2>; rel="next"');`,
      },
    ],
    reference: `function linkHeader(base, page, totalPages) {
  const parts = [];
  if (page < totalPages) parts.push('<' + base + '?page=' + (page + 1) + '>; rel="next"');
  if (page > 1) parts.push('<' + base + '?page=' + (page - 1) + '>; rel="prev"');
  return parts.join(', ');
}
`,
  },

  // ----- Observability math ----------------------------------------------
  {
    problemId: 'perf-ewma',
    title: 'Exponential Moving Average',
    language: 'js',
    starter:
      'function ewma(values, alpha) {\n  // smoothed series; first value seeds it\n}\n',
    tests: [
      {
        name: 'smooths the series',
        body: `assertEqual(ewma([1,2,3], 0.5), [1, 1.5, 2.25]); assertEqual(ewma([], 0.5), []);`,
      },
    ],
    reference: `function ewma(values, alpha) {
  const out = [];
  let prev;
  values.forEach((v, i) => {
    prev = i === 0 ? v : alpha * v + (1 - alpha) * prev;
    out.push(prev);
  });
  return out;
}
`,
  },

  // ----- Auth & HTTP parsing ---------------------------------------------
  {
    problemId: 'http-parse-auth',
    title: 'Parse An Authorization Header',
    language: 'js',
    starter:
      "function parseAuth(header) {\n  // 'Bearer abc' -> { scheme: 'Bearer', token: 'abc' }; '' -> null\n}\n",
    tests: [
      {
        name: 'splits scheme and token',
        body: `assertEqual(parseAuth('Bearer abc'), { scheme: 'Bearer', token: 'abc' }); assertEqual(parseAuth('Basic dXNlcg=='), { scheme: 'Basic', token: 'dXNlcg==' }); assertEqual(parseAuth(''), null);`,
      },
    ],
    reference: `function parseAuth(header) {
  if (!header) return null;
  const [scheme, ...rest] = header.split(' ');
  return { scheme, token: rest.join(' ') };
}
`,
  },
  {
    problemId: 'auth-has-scope',
    title: 'Scope Check',
    language: 'js',
    starter:
      'function hasScope(granted, required) {\n  // true if every required scope is in granted\n}\n',
    tests: [
      {
        name: 'requires all scopes',
        body: `assert(hasScope(['read','write'], ['read']) === true); assert(hasScope(['read'], ['read','write']) === false); assert(hasScope(['a'], []) === true);`,
      },
    ],
    reference: `function hasScope(granted, required) {
  return required.every((r) => granted.includes(r));
}
`,
  },

  // ----- Caching & rate limiting -----------------------------------------
  {
    problemId: 'cache-evict-expired',
    title: 'Evict Expired Entries',
    language: 'js',
    starter:
      'function evictExpired(entries, now) {\n  // entries: { key, expiresAt }. return keys still valid at `now`.\n}\n',
    tests: [
      {
        name: 'keeps only unexpired keys',
        body: `assertEqual(evictExpired([{key:'a',expiresAt:100},{key:'b',expiresAt:50}], 75), ['a']);`,
      },
    ],
    reference: `function evictExpired(entries, now) {
  return entries.filter((e) => e.expiresAt > now).map((e) => e.key);
}
`,
  },
  {
    problemId: 'ratelimit-leaky-bucket',
    title: 'Leaky Bucket Limiter',
    language: 'js',
    starter:
      'function leakyBucket(times, capacity, leakPerSec) {\n  // water rises per request and leaks over time; allowed while level <= capacity\n}\n',
    tests: [
      {
        name: 'fills then leaks',
        body: `assertEqual(leakyBucket([0,0,0], 2, 1), [true, true, false]); assertEqual(leakyBucket([0,1000], 1, 1), [true, true]);`,
      },
    ],
    reference: `function leakyBucket(times, capacity, leakPerSec) {
  let level = 0, last = null;
  const out = [];
  for (const t of times) {
    if (last !== null) level = Math.max(0, level - ((t - last) / 1000) * leakPerSec);
    last = t;
    if (level + 1 <= capacity) { level += 1; out.push(true); } else out.push(false);
  }
  return out;
}
`,
  },
  {
    problemId: 'reliability-retry-schedule',
    title: 'Retry Schedule',
    language: 'js',
    starter:
      'function retrySchedule(maxRetries, base, cap) {\n  // return the array of backoff delays for each retry\n}\n',
    tests: [
      {
        name: 'doubles and caps each delay',
        body: `assertEqual(retrySchedule(3, 100, 1000), [100, 200, 400]); assertEqual(retrySchedule(5, 100, 300), [100, 200, 300, 300, 300]);`,
      },
    ],
    reference: `function retrySchedule(maxRetries, base, cap) {
  return Array.from({ length: maxRetries }, (_, i) => Math.min(cap, base * Math.pow(2, i)));
}
`,
  },

  // ----- Load balancing & SLAs -------------------------------------------
  {
    problemId: 'lb-expand-weights',
    title: 'Expand Weighted Pool',
    language: 'js',
    starter:
      'function expandWeights(items) {\n  // [{id,weight}] -> a flat list repeating each id `weight` times\n}\n',
    tests: [
      {
        name: 'repeats by weight',
        body: `assertEqual(expandWeights([{id:'a',weight:2},{id:'b',weight:1}]), ['a','a','b']);`,
      },
    ],
    reference: `function expandWeights(items) {
  const out = [];
  for (const it of items) for (let i = 0; i < it.weight; i++) out.push(it.id);
  return out;
}
`,
  },
  {
    problemId: 'sla-error-budget',
    title: 'Error Budget',
    language: 'js',
    starter:
      'function errorBudgetMs(slaPercent, periodMs) {\n  // allowed downtime in ms for an SLA over a period (rounded)\n}\n',
    tests: [
      {
        name: 'computes allowed downtime',
        body: `assertEqual(errorBudgetMs(99.9, 2592000000), 2592000); assertEqual(errorBudgetMs(99, 1000), 10);`,
      },
    ],
    reference: `function errorBudgetMs(slaPercent, periodMs) {
  return Math.round((1 - slaPercent / 100) * periodMs);
}
`,
  },

  // ----- JSON & parsing utilities ----------------------------------------
  {
    problemId: 'json-stable-stringify',
    title: 'Stable JSON Stringify',
    language: 'js',
    starter:
      'function stableStringify(v) {\n  // deterministic JSON with object keys sorted recursively\n}\n',
    tests: [
      {
        name: 'sorts keys at every level',
        body: `assertEqual(stableStringify({ b: 1, a: 2 }), '{"a":2,"b":1}'); assertEqual(stableStringify({ z: [3, { y: 1, x: 2 }] }), '{"z":[3,{"x":2,"y":1}]}');`,
      },
    ],
    reference: `function stableStringify(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(stableStringify).join(',') + ']';
  return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + stableStringify(v[k])).join(',') + '}';
}
`,
  },
  {
    problemId: 'json-flatten',
    title: 'Flatten Nested Object',
    language: 'js',
    starter:
      "function flatten(obj) {\n  // { a: { b: 1 }, c: 2 } -> { 'a.b': 1, 'c': 2 }\n}\n",
    tests: [
      {
        name: 'dots nested keys',
        body: `assertEqual(flatten({ a: { b: 1 }, c: 2 }), { 'a.b': 1, c: 2 }); assertEqual(flatten({ a: { b: { c: 3 } } }), { 'a.b.c': 3 });`,
      },
    ],
    reference: `function flatten(obj, prefix) {
  prefix = prefix || '';
  const out = {};
  for (const k of Object.keys(obj)) {
    const key = prefix ? prefix + '.' + k : k;
    const v = obj[k];
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flatten(v, key));
    else out[key] = v;
  }
  return out;
}
`,
  },
  {
    problemId: 'parse-duration',
    title: 'Parse A Duration',
    language: 'js',
    starter:
      "function parseDuration(s) {\n  // '1h30m' -> seconds (5400). supports h, m, s.\n}\n",
    tests: [
      {
        name: 'sums the units',
        body: `assertEqual(parseDuration('90s'), 90); assertEqual(parseDuration('2m'), 120); assertEqual(parseDuration('1h30m'), 5400);`,
      },
    ],
    reference: `function parseDuration(s) {
  let total = 0;
  const re = /(\\d+)([hms])/g;
  let m;
  while ((m = re.exec(s))) {
    const n = Number(m[1]);
    total += m[2] === 'h' ? n * 3600 : m[2] === 'm' ? n * 60 : n;
  }
  return total;
}
`,
  },

  // ----- Encoding ---------------------------------------------------------
  {
    problemId: 'enc-base64url',
    title: 'Base64URL Round-Trip',
    language: 'js',
    starter:
      'function base64url(str) {}\nfunction unbase64url(s) {}\n// URL-safe base64: -_ instead of +/, no padding\n',
    tests: [
      {
        name: 'encodes and round-trips',
        body: `assertEqual(base64url('Hello'), 'SGVsbG8'); assertEqual(unbase64url(base64url('a/b+c?d')), 'a/b+c?d');`,
      },
    ],
    reference: `function base64url(str) {
  return btoa(str).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
}
function unbase64url(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return atob(s);
}
`,
  },
  {
    problemId: 'enc-hex',
    title: 'Hex Encode/Decode Bytes',
    language: 'js',
    starter:
      'function toHex(bytes) {}\nfunction fromHex(s) {}\n// bytes are an array of 0..255\n',
    tests: [
      {
        name: 'round-trips bytes',
        body: `assertEqual(toHex([255, 0, 16]), 'ff0010'); assertEqual(fromHex('ff0010'), [255, 0, 16]);`,
      },
    ],
    reference: `function toHex(bytes) {
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
}
function fromHex(s) {
  const out = [];
  for (let i = 0; i < s.length; i += 2) out.push(parseInt(s.slice(i, i + 2), 16));
  return out;
}
`,
  },
  {
    problemId: 'data-rle',
    title: 'Run-Length Encode/Decode',
    language: 'js',
    starter:
      "function rleEncode(s) {}\nfunction rleDecode(s) {}\n// 'aaabb' <-> 'a3b2' (lowercase letters)\n",
    tests: [
      {
        name: 'encodes and decodes',
        body: `assertEqual(rleEncode('aaabb'), 'a3b2'); assertEqual(rleDecode('a3b2'), 'aaabb'); assertEqual(rleDecode(rleEncode('abcabc')), 'abcabc');`,
      },
    ],
    reference: `function rleEncode(s) {
  let out = '', i = 0;
  while (i < s.length) {
    let j = i;
    while (j < s.length && s[j] === s[i]) j++;
    out += s[i] + (j - i);
    i = j;
  }
  return out;
}
function rleDecode(s) {
  let out = '';
  const re = /([a-z])(\\d+)/g;
  let m;
  while ((m = re.exec(s))) out += m[1].repeat(Number(m[2]));
  return out;
}
`,
  },

  // ----- Algorithms -------------------------------------------------------
  {
    problemId: 'algo-two-sum',
    title: 'Two Sum',
    language: 'js',
    starter:
      'function twoSum(nums, target) {\n  // return indices [i, j] that sum to target, or null\n}\n',
    tests: [
      {
        name: 'finds the pair',
        body: `assertEqual(twoSum([2,7,11,15], 9), [0, 1]); assertEqual(twoSum([1,2,3], 100), null);`,
      },
    ],
    reference: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return null;
}
`,
  },
  {
    problemId: 'algo-valid-parens',
    title: 'Valid Parentheses',
    language: 'js',
    starter:
      'function validParens(s) {\n  // balanced (), [], {} -> boolean\n}\n',
    tests: [
      {
        name: 'checks balance and nesting',
        body: `assert(validParens('([])') === true); assert(validParens('([)]') === false); assert(validParens('(') === false);`,
      },
    ],
    reference: `function validParens(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const st = [];
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') st.push(c);
    else if (pairs[c]) { if (st.pop() !== pairs[c]) return false; }
  }
  return st.length === 0;
}
`,
  },
  {
    problemId: 'algo-kth-largest',
    title: 'Kth Largest',
    language: 'js',
    starter:
      'function kthLargest(nums, k) {\n  // 1-based: the kth largest value\n}\n',
    tests: [
      {
        name: 'returns the kth largest',
        body: `assertEqual(kthLargest([3,1,4,1,5], 2), 4); assertEqual(kthLargest([1], 1), 1);`,
      },
    ],
    reference: `function kthLargest(nums, k) {
  return [...nums].sort((a, b) => b - a)[k - 1];
}
`,
  },

  // ----- DB & API helpers -------------------------------------------------
  {
    problemId: 'db-build-insert',
    title: 'Build A Parameterized Insert',
    language: 'js',
    starter:
      "function buildInsert(table, row) {\n  // return { text: 'INSERT ... VALUES ($1, $2)', values: [...] }\n}\n",
    tests: [
      {
        name: 'uses placeholders, never interpolation',
        body: `assertEqual(buildInsert('users', { name: 'Ada', age: 36 }), { text: 'INSERT INTO users (name, age) VALUES ($1, $2)', values: ['Ada', 36] });`,
      },
    ],
    reference: `function buildInsert(table, row) {
  const cols = Object.keys(row);
  const values = cols.map((c) => row[c]);
  const placeholders = cols.map((_, i) => '$' + (i + 1)).join(', ');
  return { text: 'INSERT INTO ' + table + ' (' + cols.join(', ') + ') VALUES (' + placeholders + ')', values };
}
`,
  },
  {
    problemId: 'security-mask-email',
    title: 'Mask PII (Email)',
    language: 'js',
    starter:
      "function maskEmail(email) {\n  // 'john@example.com' -> 'j***@example.com' (keep first char + domain)\n}\n",
    tests: [
      {
        name: 'masks the local part',
        body: `assertEqual(maskEmail('john.doe@example.com'), 'j***@example.com');`,
      },
    ],
    reference: `function maskEmail(email) {
  const [local, domain] = email.split('@');
  return local[0] + '***@' + domain;
}
`,
  },
  {
    problemId: 'http-status-class',
    title: 'Status Class',
    language: 'js',
    starter:
      "function statusClass(code) {\n  // 204 -> '2xx', 404 -> '4xx', 503 -> '5xx'\n}\n",
    tests: [
      {
        name: 'buckets by hundreds',
        body: `assertEqual(statusClass(204), '2xx'); assertEqual(statusClass(404), '4xx'); assertEqual(statusClass(503), '5xx');`,
      },
    ],
    reference: `function statusClass(code) {
  return Math.floor(code / 100) + 'xx';
}
`,
  },

  // ----- Observability & distributed primitives --------------------------
  {
    problemId: 'obs-apdex',
    title: 'Apdex Score',
    language: 'js',
    starter:
      'function apdex(latencies, threshold) {\n  // (satisfied + tolerating/2) / total; tolerating is <= 4*threshold; [] -> 1\n}\n',
    tests: [
      {
        name: 'scores satisfaction',
        body: `assertEqual(apdex([10, 20, 300, 2000], 100), 0.625); assertEqual(apdex([], 100), 1);`,
      },
    ],
    reference: `function apdex(latencies, threshold) {
  if (latencies.length === 0) return 1;
  let sat = 0, tol = 0;
  for (const l of latencies) {
    if (l <= threshold) sat++;
    else if (l <= 4 * threshold) tol++;
  }
  return (sat + tol / 2) / latencies.length;
}
`,
  },
  {
    problemId: 'dist-quorum',
    title: 'Quorum Consistency',
    language: 'js',
    starter:
      'function hasQuorum(R, W, N) {\n  // strong consistency requires R + W > N\n}\n',
    tests: [
      {
        name: 'checks the inequality',
        body: `assert(hasQuorum(2, 2, 3) === true); assert(hasQuorum(1, 1, 3) === false);`,
      },
    ],
    reference: `function hasQuorum(R, W, N) {
  return R + W > N;
}
`,
  },
  {
    problemId: 'dist-vector-clock',
    title: 'Compare Vector Clocks',
    language: 'js',
    starter:
      "function vcCompare(a, b) {\n  // return 'before' | 'after' | 'concurrent' | 'equal'\n}\n",
    tests: [
      {
        name: 'orders and detects concurrency',
        body: `assertEqual(vcCompare({a:1,b:0}, {a:1,b:1}), 'before'); assertEqual(vcCompare({a:2}, {a:1}), 'after'); assertEqual(vcCompare({a:1,b:0}, {a:0,b:1}), 'concurrent'); assertEqual(vcCompare({a:1}, {a:1}), 'equal');`,
      },
    ],
    reference: `function vcCompare(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let less = false, greater = false;
  for (const k of keys) {
    const av = a[k] || 0, bv = b[k] || 0;
    if (av < bv) less = true;
    if (av > bv) greater = true;
  }
  if (less && greater) return 'concurrent';
  if (less) return 'before';
  if (greater) return 'after';
  return 'equal';
}
`,
  },

  // ----- Strings ----------------------------------------------------------
  {
    problemId: 'str-anagram',
    title: 'Anagram Check',
    language: 'js',
    starter:
      'function isAnagram(a, b) {\n  // same letters, any order -> boolean\n}\n',
    tests: [
      {
        name: 'detects anagrams',
        body: `assert(isAnagram('listen', 'silent') === true); assert(isAnagram('rat', 'car') === false); assert(isAnagram('a', 'ab') === false);`,
      },
    ],
    reference: `function isAnagram(a, b) {
  const norm = (s) => s.split('').sort().join('');
  return norm(a) === norm(b);
}
`,
  },
  {
    problemId: 'str-lcp',
    title: 'Longest Common Prefix',
    language: 'js',
    starter:
      "function lcp(strs) {\n  // longest common prefix of an array of strings; [] -> ''\n}\n",
    tests: [
      {
        name: 'finds the shared prefix',
        body: `assertEqual(lcp(['flower','flow','flight']), 'fl'); assertEqual(lcp(['a','b']), ''); assertEqual(lcp([]), '');`,
      },
    ],
    reference: `function lcp(strs) {
  if (!strs.length) return '';
  let p = strs[0];
  for (const s of strs) {
    while (s.indexOf(p) !== 0) p = p.slice(0, -1);
    if (!p) return '';
  }
  return p;
}
`,
  },

  // ----- Caching & conditional requests ----------------------------------
  {
    problemId: 'cache-ttl',
    title: 'TTL Cache',
    language: 'js',
    starter:
      'class TTLCache {\n  set(key, value, expiresAt) {}\n  get(key, now) {} // undefined if missing or expired\n}\n',
    tests: [
      {
        name: 'expires entries by time',
        body: `const c = new TTLCache(); c.set('a', 1, 100); assertEqual(c.get('a', 50), 1); assertEqual(c.get('a', 150), undefined); assertEqual(c.get('x', 0), undefined);`,
      },
    ],
    reference: `class TTLCache {
  constructor() { this.m = new Map(); }
  set(key, value, expiresAt) { this.m.set(key, { value, expiresAt }); }
  get(key, now) {
    const e = this.m.get(key);
    if (!e) return undefined;
    if (e.expiresAt <= now) { this.m.delete(key); return undefined; }
    return e.value;
  }
}
`,
  },
  {
    problemId: 'http-conditional-get',
    title: 'Conditional GET (ETag)',
    language: 'js',
    starter:
      'function conditionalStatus(etag, ifNoneMatch) {\n  // 304 when the ETag matches, else 200\n}\n',
    tests: [
      {
        name: 'returns 304 on match',
        body: `assertEqual(conditionalStatus('abc', 'abc'), 304); assertEqual(conditionalStatus('abc', 'xyz'), 200); assertEqual(conditionalStatus('abc', null), 200);`,
      },
    ],
    reference: `function conditionalStatus(etag, ifNoneMatch) {
  return ifNoneMatch === etag ? 304 : 200;
}
`,
  },

  // ----- Security ---------------------------------------------------------
  {
    problemId: 'security-safe-join',
    title: 'Path Traversal Defense',
    language: 'js',
    starter:
      'function safeJoin(base, userPath) {\n  // join base + userPath; return null if it escapes base\n}\n',
    tests: [
      {
        name: 'blocks escaping the base',
        body: `assertEqual(safeJoin('/var/www', 'a/b'), '/var/www/a/b'); assertEqual(safeJoin('/var/www', '../etc/passwd'), null); assertEqual(safeJoin('/var/www', './x'), '/var/www/x');`,
      },
    ],
    reference: `function safeJoin(base, userPath) {
  const norm = (p) => {
    const st = [];
    for (const s of p.split('/')) {
      if (s === '' || s === '.') continue;
      if (s === '..') st.pop();
      else st.push(s);
    }
    return '/' + st.join('/');
  };
  const b = norm(base);
  const full = norm(base + '/' + userPath);
  return full === b || full.startsWith(b + '/') ? full : null;
}
`,
  },
  {
    problemId: 'security-csrf-double-submit',
    title: 'CSRF Double-Submit',
    language: 'js',
    starter:
      'function csrfOk(cookieToken, headerToken) {\n  // both present and equal -> true\n}\n',
    tests: [
      {
        name: 'requires matching non-empty tokens',
        body: `assert(csrfOk('t', 't') === true); assert(csrfOk('t', 'x') === false); assert(csrfOk('', '') === false);`,
      },
    ],
    reference: `function csrfOk(cookieToken, headerToken) {
  return Boolean(cookieToken) && cookieToken === headerToken;
}
`,
  },
  {
    problemId: 'net-is-private-ip',
    title: 'Private IP Range Check',
    language: 'js',
    starter:
      'function isPrivateIp(ip) {\n  // 10/8, 172.16-31, 192.168, 127/8 -> true\n}\n',
    tests: [
      {
        name: 'classifies private vs public',
        body: `assert(isPrivateIp('10.0.0.1') === true); assert(isPrivateIp('192.168.1.1') === true); assert(isPrivateIp('172.20.0.1') === true); assert(isPrivateIp('8.8.8.8') === false); assert(isPrivateIp('172.32.0.1') === false);`,
      },
    ],
    reference: `function isPrivateIp(ip) {
  const [a, b] = ip.split('.').map(Number);
  if (a === 10 || a === 127) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}
`,
  },

  // ----- DB & distributed -------------------------------------------------
  {
    problemId: 'db-in-clause',
    title: 'Build An IN Clause',
    language: 'js',
    starter:
      "function inClause(column, n, start) {\n  // inClause('id', 3) -> 'id IN ($1, $2, $3)'. start defaults to 1.\n}\n",
    tests: [
      {
        name: 'numbers the placeholders',
        body: `assertEqual(inClause('id', 3), 'id IN ($1, $2, $3)'); assertEqual(inClause('id', 2, 5), 'id IN ($5, $6)');`,
      },
    ],
    reference: `function inClause(column, n, start) {
  start = start || 1;
  const ph = Array.from({ length: n }, (_, i) => '$' + (start + i)).join(', ');
  return column + ' IN (' + ph + ')';
}
`,
  },
  {
    problemId: 'db-optimistic-lock',
    title: 'Optimistic Lock Check',
    language: 'js',
    starter:
      'function canUpdate(currentVersion, expectedVersion) {\n  // update only if the row version still matches\n}\n',
    tests: [
      {
        name: 'matches versions',
        body: `assert(canUpdate(3, 3) === true); assert(canUpdate(3, 2) === false);`,
      },
    ],
    reference: `function canUpdate(currentVersion, expectedVersion) {
  return currentVersion === expectedVersion;
}
`,
  },
  {
    problemId: 'dist-leader-election',
    title: 'Leader Election (Bully)',
    language: 'js',
    starter:
      'function electLeader(nodeIds) {\n  // highest id wins\n}\n',
    tests: [
      {
        name: 'picks the max id',
        body: `assertEqual(electLeader([3, 1, 5, 2]), 5); assertEqual(electLeader([7]), 7);`,
      },
    ],
    reference: `function electLeader(nodeIds) {
  return Math.max(...nodeIds);
}
`,
  },

  // ----- Algorithms & data -----------------------------------------------
  {
    problemId: 'algo-gcd',
    title: 'Greatest Common Divisor',
    language: 'js',
    starter:
      'function gcd(a, b) {\n  // Euclid\n}\n',
    tests: [
      {
        name: 'computes gcd',
        body: `assertEqual(gcd(12, 18), 6); assertEqual(gcd(7, 1), 1); assertEqual(gcd(0, 5), 5);`,
      },
    ],
    reference: `function gcd(a, b) {
  while (b) { [a, b] = [b, a % b]; }
  return a;
}
`,
  },
  {
    problemId: 'data-csv-to-objects',
    title: 'CSV To Objects',
    language: 'js',
    starter:
      "function csvToObjects(lines) {\n  // first line is the header. ['a,b','1,2'] -> [{a:'1',b:'2'}]\n}\n",
    tests: [
      {
        name: 'maps rows onto headers',
        body: `assertEqual(csvToObjects(['a,b', '1,2', '3,4']), [{ a: '1', b: '2' }, { a: '3', b: '4' }]);`,
      },
    ],
    reference: `function csvToObjects(lines) {
  const header = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    const o = {};
    header.forEach((h, i) => { o[h] = cells[i]; });
    return o;
  });
}
`,
  },

  // ----- JavaScript fundamentals (loops & common methods, ground up) -----
  {
    problemId: 'jsf-sum-for',
    title: 'For Loop: Sum',
    language: 'js',
    starter: 'function sumLoop(nums) {\n  // add them with a for loop\n}\n',
    tests: [{ name: 'sums', body: 'assertEqual(sumLoop([1, 2, 3]), 6); assertEqual(sumLoop([]), 0);' }],
    reference: `function sumLoop(nums) {
  let total = 0;
  for (let i = 0; i < nums.length; i++) total += nums[i];
  return total;
}
`,
  },
  {
    problemId: 'jsf-countdown-while',
    title: 'While Loop: Countdown',
    language: 'js',
    starter: 'function countdown(n) {\n  // [n, n-1, ..., 1] with a while loop\n}\n',
    tests: [{ name: 'counts down', body: 'assertEqual(countdown(3), [3, 2, 1]); assertEqual(countdown(0), []);' }],
    reference: `function countdown(n) {
  const out = [];
  while (n > 0) { out.push(n); n--; }
  return out;
}
`,
  },
  {
    problemId: 'jsf-map-double',
    title: 'Array.map',
    language: 'js',
    starter: 'function doubleAll(nums) {\n  // use map\n}\n',
    tests: [{ name: 'doubles', body: 'assertEqual(doubleAll([1, 2, 3]), [2, 4, 6]);' }],
    reference: `function doubleAll(nums) {
  return nums.map((x) => x * 2);
}
`,
  },
  {
    problemId: 'jsf-filter-evens',
    title: 'Array.filter',
    language: 'js',
    starter: 'function evens(nums) {\n  // keep the even numbers\n}\n',
    tests: [{ name: 'filters', body: 'assertEqual(evens([1, 2, 3, 4]), [2, 4]);' }],
    reference: `function evens(nums) {
  return nums.filter((x) => x % 2 === 0);
}
`,
  },
  {
    problemId: 'jsf-reduce-product',
    title: 'Array.reduce',
    language: 'js',
    starter: 'function product(nums) {\n  // multiply them all; [] -> 1\n}\n',
    tests: [{ name: 'multiplies', body: 'assertEqual(product([1, 2, 3, 4]), 24); assertEqual(product([]), 1);' }],
    reference: `function product(nums) {
  return nums.reduce((a, b) => a * b, 1);
}
`,
  },
  {
    problemId: 'jsf-foreach-total',
    title: 'Array.forEach',
    language: 'js',
    starter: 'function total(nums) {\n  // sum using forEach\n}\n',
    tests: [{ name: 'totals', body: 'assertEqual(total([1, 2, 3]), 6);' }],
    reference: `function total(nums) {
  let s = 0;
  nums.forEach((n) => { s += n; });
  return s;
}
`,
  },
  {
    problemId: 'jsf-shout',
    title: 'String.toUpperCase',
    language: 'js',
    starter: 'function shout(s) {\n  pass\n}\n',
    tests: [{ name: 'uppercases', body: "assertEqual(shout('hi'), 'HI');" }],
    reference: `function shout(s) {
  return s.toUpperCase();
}
`,
  },
  {
    problemId: 'jsf-join-csv',
    title: 'Array.join',
    language: 'js',
    starter: 'function joinCsv(items) {\n  pass\n}\n',
    tests: [{ name: 'joins', body: "assertEqual(joinCsv(['a', 'b', 'c']), 'a,b,c');" }],
    reference: `function joinCsv(items) {
  return items.join(',');
}
`,
  },
  {
    problemId: 'jsf-contains',
    title: 'Array.includes',
    language: 'js',
    starter: 'function contains(arr, x) {\n  pass\n}\n',
    tests: [{ name: 'membership', body: 'assert(contains([1, 2], 2) === true); assert(contains([1], 3) === false);' }],
    reference: `function contains(arr, x) {
  return arr.includes(x);
}
`,
  },
  {
    problemId: 'jsf-position-of',
    title: 'Array.indexOf',
    language: 'js',
    starter: 'function positionOf(arr, x) {\n  // index, or -1\n}\n',
    tests: [{ name: 'finds index', body: "assertEqual(positionOf(['a', 'b'], 'b'), 1); assertEqual(positionOf([], 'x'), -1);" }],
    reference: `function positionOf(arr, x) {
  return arr.indexOf(x);
}
`,
  },
  {
    problemId: 'jsf-first-n',
    title: 'Array.slice',
    language: 'js',
    starter: 'function firstN(items, n) {\n  pass\n}\n',
    tests: [{ name: 'takes prefix', body: 'assertEqual(firstN([1, 2, 3, 4], 2), [1, 2]);' }],
    reference: `function firstN(items, n) {
  return items.slice(0, n);
}
`,
  },
  {
    problemId: 'jsf-key-count',
    title: 'Object.keys',
    language: 'js',
    starter: 'function keyCount(obj) {\n  pass\n}\n',
    tests: [{ name: 'counts keys', body: 'assertEqual(keyCount({ a: 1, b: 2 }), 2); assertEqual(keyCount({}), 0);' }],
    reference: `function keyCount(obj) {
  return Object.keys(obj).length;
}
`,
  },
  {
    problemId: 'jsf-entries',
    title: 'Object.entries',
    language: 'js',
    starter: 'function toPairs(obj) {\n  pass\n}\n',
    tests: [{ name: 'pairs', body: "assertEqual(toPairs({ a: 1, b: 2 }), [['a', 1], ['b', 2]]);" }],
    reference: `function toPairs(obj) {
  return Object.entries(obj);
}
`,
  },
  {
    problemId: 'jsf-reverse-str',
    title: 'Reverse A String',
    language: 'js',
    starter: 'function reverseStr(s) {\n  pass\n}\n',
    tests: [{ name: 'reverses', body: "assertEqual(reverseStr('abc'), 'cba');" }],
    reference: `function reverseStr(s) {
  return s.split('').reverse().join('');
}
`,
  },
  {
    problemId: 'jsf-fizzbuzz',
    title: 'FizzBuzz',
    language: 'js',
    starter: "function fizzbuzz(n) {\n  // 1..n with Fizz/Buzz/FizzBuzz, numbers as strings\n}\n",
    tests: [{ name: 'classic', body: "assertEqual(fizzbuzz(5), ['1', '2', 'Fizz', '4', 'Buzz']); assertEqual(fizzbuzz(15)[14], 'FizzBuzz');" }],
    reference: `function fizzbuzz(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push('FizzBuzz');
    else if (i % 3 === 0) out.push('Fizz');
    else if (i % 5 === 0) out.push('Buzz');
    else out.push(String(i));
  }
  return out;
}
`,
  },

  // ----- Writing API code (handlers, routing, responses, validation) -----
  {
    problemId: 'apidrill-route-match',
    title: 'API: Match A Route',
    language: 'js',
    starter: 'function matchRoute(routes, method, path) {\n  // routes: [{method, path, handler}]. return the handler or null\n}\n',
    tests: [
      { name: 'matches and misses', body: "assertEqual(matchRoute([{method:'GET',path:'/users',handler:'list'}], 'GET', '/users'), 'list'); assertEqual(matchRoute([], 'GET', '/x'), null);" },
    ],
    reference: `function matchRoute(routes, method, path) {
  for (const r of routes) if (r.method === method && r.path === path) return r.handler;
  return null;
}
`,
  },
  {
    problemId: 'apidrill-parse-params',
    title: 'API: Parse Query Params With Defaults',
    language: 'js',
    starter: "function parseParams(query) {\n  // return { page:1, limit:20, sort:'id' } defaults, overridden by query\n}\n",
    tests: [
      { name: 'defaults and overrides', body: "assertEqual(parseParams({ page:'2', limit:'10', sort:'name' }), { page:2, limit:10, sort:'name' }); assertEqual(parseParams({}), { page:1, limit:20, sort:'id' });" },
    ],
    reference: `function parseParams(query) {
  return { page: Number(query.page) || 1, limit: Number(query.limit) || 20, sort: query.sort || 'id' };
}
`,
  },
  {
    problemId: 'apidrill-status-for-error',
    title: 'API: Map Error To Status',
    language: 'js',
    starter: "function statusForError(type) {\n  // validation->400, unauthorized->401, forbidden->403, not_found->404, conflict->409, else 500\n}\n",
    tests: [
      { name: 'maps types', body: "assertEqual(statusForError('validation'), 400); assertEqual(statusForError('not_found'), 404); assertEqual(statusForError('weird'), 500);" },
    ],
    reference: `function statusForError(type) {
  const map = { validation: 400, unauthorized: 401, forbidden: 403, not_found: 404, conflict: 409 };
  return map[type] || 500;
}
`,
  },
  {
    problemId: 'apidrill-paginate',
    title: 'API: Paginate A Response',
    language: 'js',
    starter: 'function paginate(items, page, perPage) {\n  // return { data, page, perPage, total, totalPages }\n}\n',
    tests: [
      { name: 'shapes the page', body: 'assertEqual(paginate([1,2,3,4,5], 1, 2), { data:[1,2], page:1, perPage:2, total:5, totalPages:3 });' },
    ],
    reference: `function paginate(items, page, perPage) {
  const total = items.length;
  const start = (page - 1) * perPage;
  return { data: items.slice(start, start + perPage), page, perPage, total, totalPages: Math.ceil(total / perPage) };
}
`,
  },
  {
    problemId: 'apidrill-validate-body',
    title: 'API: Validate A Request Body',
    language: 'js',
    starter: 'function validateBody(rules, body) {\n  // rules: { field: { required?, type? } }. return { valid, errors }\n}\n',
    tests: [
      { name: 'valid and invalid', body: "assertEqual(validateBody({ name:{required:true,type:'string'} }, { name:'Ada' }), { valid:true, errors:{} }); assertEqual(validateBody({ name:{required:true} }, {}), { valid:false, errors:{ name:'required' } });" },
    ],
    reference: `function validateBody(rules, body) {
  const errors = {};
  for (const field of Object.keys(rules)) {
    const r = rules[field], v = body[field];
    if (r.required && (v === undefined || v === null || v === '')) errors[field] = 'required';
    else if (v !== undefined && r.type && typeof v !== r.type) errors[field] = 'type';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
`,
  },
  {
    problemId: 'apidrill-serialize',
    title: 'API: Serialize A Public DTO',
    language: 'js',
    starter: "function toPublic(user) {\n  // strip sensitive fields (password) before returning to clients\n}\n",
    tests: [
      { name: 'drops password', body: "assertEqual(toPublic({ id:1, name:'Ada', password:'x' }), { id:1, name:'Ada' });" },
    ],
    reference: `function toPublic(user) {
  const { password, ...rest } = user;
  return rest;
}
`,
  },
  {
    problemId: 'apidrill-authorize',
    title: 'API: Authorization Guard',
    language: 'js',
    starter: 'function authorize(user, requiredRole) {\n  // no user -> 401; wrong role -> 403; ok -> 200\n}\n',
    tests: [
      { name: 'auth states', body: "assertEqual(authorize(null, 'admin'), 401); assertEqual(authorize({ role:'user' }, 'admin'), 403); assertEqual(authorize({ role:'admin' }, 'admin'), 200);" },
    ],
    reference: `function authorize(user, requiredRole) {
  if (!user) return 401;
  if (user.role !== requiredRole) return 403;
  return 200;
}
`,
  },
  {
    problemId: 'apidrill-method-guard',
    title: 'API: Method Not Allowed',
    language: 'js',
    starter: 'function methodGuard(allowed, method) {\n  // 200 if allowed, else 405\n}\n',
    tests: [
      { name: 'allows or 405', body: "assertEqual(methodGuard(['GET','POST'], 'GET'), 200); assertEqual(methodGuard(['GET'], 'DELETE'), 405);" },
    ],
    reference: `function methodGuard(allowed, method) {
  return allowed.includes(method) ? 200 : 405;
}
`,
  },
  {
    problemId: 'apidrill-json-response',
    title: 'API: Build A JSON Response',
    language: 'js',
    starter: 'function jsonResponse(status, data) {\n  // return { status, headers: { Content-Type }, body: JSON string }\n}\n',
    tests: [
      { name: 'shapes the response', body: "assertEqual(jsonResponse(200, { ok:true }), { status:200, headers:{ 'Content-Type':'application/json' }, body:'{\"ok\":true}' });" },
    ],
    reference: `function jsonResponse(status, data) {
  return { status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
}
`,
  },
  {
    problemId: 'apidrill-error-envelope',
    title: 'API: Error Envelope',
    language: 'js',
    starter: 'function errorBody(code, message, fields) {\n  // { error: { code, message, fields? } } — omit fields when not given\n}\n',
    tests: [
      { name: 'with and without fields', body: "assertEqual(errorBody('VALIDATION', 'bad', { email:'required' }), { error:{ code:'VALIDATION', message:'bad', fields:{ email:'required' } } }); assertEqual(errorBody('NOT_FOUND', 'x'), { error:{ code:'NOT_FOUND', message:'x' } });" },
    ],
    reference: `function errorBody(code, message, fields) {
  const err = { code, message };
  if (fields) err.fields = fields;
  return { error: err };
}
`,
  },
  {
    problemId: 'apidrill-crud-handler',
    title: 'API: A Real CRUD Handler',
    language: 'js',
    starter: 'function handleRequest(store, req) {\n  // req: { method, id?, body? } over an array store.\n  // GET (no id)->200 list; GET id->200 item or 404; POST->201 created (id = len+1);\n  // DELETE->204 or 404; else 405. Return { status, body }.\n}\n',
    tests: [
      {
        name: 'handles the verbs',
        body: "const store = [{id:1,name:'a'}]; assertEqual(handleRequest(store,{method:'GET'}), {status:200, body:[{id:1,name:'a'}]}); assertEqual(handleRequest(store,{method:'GET',id:1}), {status:200, body:{id:1,name:'a'}}); assertEqual(handleRequest(store,{method:'GET',id:9}), {status:404, body:null}); assertEqual(handleRequest(store,{method:'POST',body:{name:'b'}}), {status:201, body:{id:2,name:'b'}}); assertEqual(handleRequest(store,{method:'DELETE',id:1}), {status:204, body:null}); assertEqual(handleRequest(store,{method:'PUT'}), {status:405, body:null});",
      },
    ],
    reference: `function handleRequest(store, req) {
  const { method, id, body } = req;
  if (method === 'GET' && id == null) return { status: 200, body: store };
  if (method === 'GET') {
    const item = store.find((x) => x.id === id);
    return item ? { status: 200, body: item } : { status: 404, body: null };
  }
  if (method === 'POST') {
    const item = { id: store.length + 1, ...body };
    store.push(item);
    return { status: 201, body: item };
  }
  if (method === 'DELETE') {
    const idx = store.findIndex((x) => x.id === id);
    if (idx === -1) return { status: 404, body: null };
    store.splice(idx, 1);
    return { status: 204, body: null };
  }
  return { status: 405, body: null };
}
`,
  },
  {
    problemId: 'apidrill-rate-headers',
    title: 'API: Rate-Limit Headers',
    language: 'js',
    starter: 'function rateHeaders(limit, remaining, resetSec) {\n  // return the three X-RateLimit-* headers as strings\n}\n',
    tests: [
      { name: 'builds headers', body: "assertEqual(rateHeaders(100, 99, 60), { 'X-RateLimit-Limit':'100', 'X-RateLimit-Remaining':'99', 'X-RateLimit-Reset':'60' });" },
    ],
    reference: `function rateHeaders(limit, remaining, resetSec) {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(resetSec),
  };
}
`,
  },

  // ----- Writing API code, part 2 ----------------------------------------
  {
    problemId: 'apidrill-path-params',
    title: 'API: Extract Path Params',
    language: 'js',
    starter: "function extractPathParams(pattern, path) {\n  // '/users/:id' vs '/users/42' -> { id: '42' }; no match -> null\n}\n",
    tests: [
      { name: 'matches and extracts', body: "assertEqual(extractPathParams('/users/:id/posts/:postId', '/users/42/posts/7'), { id:'42', postId:'7' }); assertEqual(extractPathParams('/users/:id', '/posts/1'), null); assertEqual(extractPathParams('/a', '/a/b'), null);" },
    ],
    reference: `function extractPathParams(pattern, path) {
  const pk = pattern.split('/'), pp = path.split('/');
  if (pk.length !== pp.length) return null;
  const params = {};
  for (let i = 0; i < pk.length; i++) {
    if (pk[i].startsWith(':')) params[pk[i].slice(1)] = pp[i];
    else if (pk[i] !== pp[i]) return null;
  }
  return params;
}
`,
  },
  {
    problemId: 'apidrill-rest-router',
    title: 'API: A Router With Params',
    language: 'js',
    starter: 'function restRouter(routes, method, path) {\n  // routes: [{method, pattern, handler}]. return { handler, params } or null\n}\n',
    tests: [
      { name: 'routes with params', body: "assertEqual(restRouter([{method:'GET',pattern:'/users/:id',handler:'getUser'}], 'GET', '/users/9'), { handler:'getUser', params:{ id:'9' } }); assertEqual(restRouter([], 'GET', '/x'), null);" },
    ],
    reference: `function restRouter(routes, method, path) {
  for (const r of routes) {
    if (r.method !== method) continue;
    const pk = r.pattern.split('/'), pp = path.split('/');
    if (pk.length !== pp.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < pk.length; i++) {
      if (pk[i].startsWith(':')) params[pk[i].slice(1)] = pp[i];
      else if (pk[i] !== pp[i]) { ok = false; break; }
    }
    if (ok) return { handler: r.handler, params };
  }
  return null;
}
`,
  },
  {
    problemId: 'apidrill-pagination-links',
    title: 'API: Pagination Links Object',
    language: 'js',
    starter: 'function paginationLinks(base, page, totalPages) {\n  // { self, first, last, next?, prev? } as ?page= URLs\n}\n',
    tests: [
      { name: 'middle page', body: "assertEqual(paginationLinks('/items', 2, 3), { self:'/items?page=2', first:'/items?page=1', last:'/items?page=3', next:'/items?page=3', prev:'/items?page=1' });" },
    ],
    reference: `function paginationLinks(base, page, totalPages) {
  const link = (p) => base + '?page=' + p;
  const out = { self: link(page), first: link(1), last: link(totalPages) };
  if (page < totalPages) out.next = link(page + 1);
  if (page > 1) out.prev = link(page - 1);
  return out;
}
`,
  },
  {
    problemId: 'apidrill-merge-patch',
    title: 'API: JSON Merge Patch',
    language: 'js',
    starter: 'function mergePatch(target, patch) {\n  // RFC 7386: null deletes a key, objects merge recursively, else replace\n}\n',
    tests: [
      { name: 'merges and deletes', body: "assertEqual(mergePatch({ a:1, b:2, c:{ x:1 } }, { b:null, c:{ y:2 }, d:3 }), { a:1, c:{ x:1, y:2 }, d:3 });" },
    ],
    reference: `function mergePatch(target, patch) {
  const out = { ...target };
  for (const k of Object.keys(patch)) {
    const v = patch[k];
    const mergeable = (x) => x && typeof x === 'object' && !Array.isArray(x);
    if (v === null) delete out[k];
    else if (mergeable(v) && mergeable(out[k])) out[k] = mergePatch(out[k], v);
    else out[k] = v;
  }
  return out;
}
`,
  },
  {
    problemId: 'apidrill-parse-sort',
    title: 'API: Parse A Sort Param',
    language: 'js',
    starter: "function parseSort(s) {\n  // '-created,name' -> [{field:'created',dir:'desc'},{field:'name',dir:'asc'}]\n}\n",
    tests: [
      { name: 'parses fields and direction', body: "assertEqual(parseSort('-created,name'), [{ field:'created', dir:'desc' }, { field:'name', dir:'asc' }]); assertEqual(parseSort(''), []);" },
    ],
    reference: `function parseSort(s) {
  if (!s) return [];
  return s.split(',').map((part) =>
    part.startsWith('-') ? { field: part.slice(1), dir: 'desc' } : { field: part, dir: 'asc' },
  );
}
`,
  },
  {
    problemId: 'apidrill-list-envelope',
    title: 'API: List Envelope With Meta',
    language: 'js',
    starter: 'function listEnvelope(items, page, perPage, total) {\n  // { data, meta: { page, perPage, total, totalPages } }\n}\n',
    tests: [
      { name: 'wraps with meta', body: 'assertEqual(listEnvelope([1,2], 1, 2, 5), { data:[1,2], meta:{ page:1, perPage:2, total:5, totalPages:3 } });' },
    ],
    reference: `function listEnvelope(items, page, perPage, total) {
  return { data: items, meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) } };
}
`,
  },
  {
    problemId: 'apidrill-require-fields',
    title: 'API: Required Fields',
    language: 'js',
    starter: 'function requireFields(body, fields) {\n  // return the list of required fields that are missing/empty\n}\n',
    tests: [
      { name: 'finds missing', body: "assertEqual(requireFields({ name:'a' }, ['name','email']), ['email']); assertEqual(requireFields({ name:'a', email:'b' }, ['name','email']), []);" },
    ],
    reference: `function requireFields(body, fields) {
  return fields.filter((f) => body[f] === undefined || body[f] === null || body[f] === '');
}
`,
  },
  {
    problemId: 'apidrill-content-type',
    title: 'API: Content-Type For Extension',
    language: 'js',
    starter: "function contentTypeFor(ext) {\n  // 'json' -> 'application/json'; unknown -> 'application/octet-stream'\n}\n",
    tests: [
      { name: 'maps extensions', body: "assertEqual(contentTypeFor('json'), 'application/json'); assertEqual(contentTypeFor('png'), 'image/png'); assertEqual(contentTypeFor('xyz'), 'application/octet-stream');" },
    ],
    reference: `function contentTypeFor(ext) {
  const map = { json: 'application/json', html: 'text/html', css: 'text/css', js: 'application/javascript', png: 'image/png', txt: 'text/plain' };
  return map[ext] || 'application/octet-stream';
}
`,
  },

  // ----- SQL semantics as code (query operations on in-memory rows) ------
  {
    problemId: 'sqldrill-select-where',
    title: 'SQL: SELECT ... WHERE',
    language: 'js',
    starter: 'function selectWhere(rows, predicate) {\n  // return rows matching the predicate (like a WHERE clause)\n}\n',
    tests: [
      { name: 'filters rows', body: 'assertEqual(selectWhere([{a:1},{a:2},{a:3}], (r) => r.a > 1), [{a:2},{a:3}]);' },
    ],
    reference: `function selectWhere(rows, predicate) {
  return rows.filter(predicate);
}
`,
  },
  {
    problemId: 'sqldrill-project',
    title: 'SQL: SELECT Specific Columns',
    language: 'js',
    starter: 'function project(rows, cols) {\n  // keep only the named columns from each row\n}\n',
    tests: [
      { name: 'projects columns', body: "assertEqual(project([{a:1,b:2,c:3}], ['a','c']), [{a:1,c:3}]);" },
    ],
    reference: `function project(rows, cols) {
  return rows.map((r) => {
    const o = {};
    for (const c of cols) o[c] = r[c];
    return o;
  });
}
`,
  },
  {
    problemId: 'sqldrill-order-by',
    title: 'SQL: ORDER BY',
    language: 'js',
    starter: "function orderBy(rows, key, dir) {\n  // sort rows by key; dir is 'asc' or 'desc'\n}\n",
    tests: [
      { name: 'asc and desc', body: "assertEqual(orderBy([{n:3},{n:1},{n:2}], 'n', 'asc'), [{n:1},{n:2},{n:3}]); assertEqual(orderBy([{n:1},{n:2}], 'n', 'desc'), [{n:2},{n:1}]);" },
    ],
    reference: `function orderBy(rows, key, dir) {
  const sorted = [...rows].sort((x, y) => (x[key] < y[key] ? -1 : x[key] > y[key] ? 1 : 0));
  return dir === 'desc' ? sorted.reverse() : sorted;
}
`,
  },
  {
    problemId: 'sqldrill-limit-offset',
    title: 'SQL: LIMIT / OFFSET',
    language: 'js',
    starter: 'function limitOffset(rows, n, offset) {\n  // offset defaults to 0\n}\n',
    tests: [
      { name: 'slices', body: 'assertEqual(limitOffset([1,2,3,4], 2, 1), [2,3]); assertEqual(limitOffset([1,2,3], 2), [1,2]);' },
    ],
    reference: `function limitOffset(rows, n, offset) {
  offset = offset || 0;
  return rows.slice(offset, offset + n);
}
`,
  },
  {
    problemId: 'sqldrill-distinct',
    title: 'SQL: SELECT DISTINCT',
    language: 'js',
    starter: 'function distinctBy(rows, key) {\n  // keep the first row per distinct key value\n}\n',
    tests: [
      { name: 'dedupes by key', body: 'assertEqual(distinctBy([{id:1},{id:1},{id:2}], "id"), [{id:1},{id:2}]);' },
    ],
    reference: `function distinctBy(rows, key) {
  const seen = new Set();
  const out = [];
  for (const r of rows) {
    if (!seen.has(r[key])) { seen.add(r[key]); out.push(r); }
  }
  return out;
}
`,
  },
  {
    problemId: 'sqldrill-count-by',
    title: 'SQL: COUNT GROUP BY',
    language: 'js',
    starter: 'function countBy(rows, key) {\n  // { value: count } for each distinct key value\n}\n',
    tests: [
      { name: 'counts groups', body: "assertEqual(countBy([{t:'a'},{t:'b'},{t:'a'}], 't'), {a:2, b:1});" },
    ],
    reference: `function countBy(rows, key) {
  const out = {};
  for (const r of rows) out[r[key]] = (out[r[key]] || 0) + 1;
  return out;
}
`,
  },
  {
    problemId: 'sqldrill-sum',
    title: 'SQL: SUM',
    language: 'js',
    starter: 'function sumBy(rows, key) {\n  pass\n}\n',
    tests: [
      { name: 'sums a column', body: 'assertEqual(sumBy([{n:1},{n:2},{n:3}], "n"), 6);' },
    ],
    reference: `function sumBy(rows, key) {
  return rows.reduce((s, r) => s + r[key], 0);
}
`,
  },
  {
    problemId: 'sqldrill-avg',
    title: 'SQL: AVG',
    language: 'js',
    starter: 'function avgBy(rows, key) {\n  // average of the column; [] -> 0\n}\n',
    tests: [
      { name: 'averages', body: 'assertEqual(avgBy([{n:2},{n:4}], "n"), 3); assertEqual(avgBy([], "n"), 0);' },
    ],
    reference: `function avgBy(rows, key) {
  if (rows.length === 0) return 0;
  return rows.reduce((s, r) => s + r[key], 0) / rows.length;
}
`,
  },
  {
    problemId: 'sqldrill-inner-join',
    title: 'SQL: INNER JOIN',
    language: 'js',
    starter: 'function innerJoin(left, right, leftKey, rightKey) {\n  // join rows where left[leftKey] === right[rightKey], merging them\n}\n',
    tests: [
      { name: 'joins on keys', body: "assertEqual(innerJoin([{uid:1,a:'x'}], [{id:1,b:'y'},{id:2,b:'z'}], 'uid', 'id'), [{uid:1,a:'x',id:1,b:'y'}]);" },
    ],
    reference: `function innerJoin(left, right, leftKey, rightKey) {
  const index = new Map();
  for (const r of right) {
    const k = r[rightKey];
    (index.get(k) || index.set(k, []).get(k)).push(r);
  }
  const out = [];
  for (const l of left) for (const r of index.get(l[leftKey]) || []) out.push({ ...l, ...r });
  return out;
}
`,
  },
  {
    problemId: 'sqldrill-update-where',
    title: 'SQL: UPDATE ... WHERE',
    language: 'js',
    starter: 'function updateWhere(rows, predicate, patch) {\n  // return new rows with patch applied to matching rows (immutable)\n}\n',
    tests: [
      { name: 'patches matches only', body: "assertEqual(updateWhere([{id:1,done:false},{id:2,done:false}], (r) => r.id === 1, {done:true}), [{id:1,done:true},{id:2,done:false}]);" },
    ],
    reference: `function updateWhere(rows, predicate, patch) {
  return rows.map((r) => (predicate(r) ? { ...r, ...patch } : r));
}
`,
  },

  // ----- Caching & reliability patterns ----------------------------------
  {
    problemId: 'cache-aside',
    title: 'Cache-Aside (Lazy Load)',
    language: 'js',
    starter: 'function cacheAside(cache, key, loader) {\n  // return cached value, or load + store it (loader runs once per key)\n}\n',
    tests: [
      { name: 'loads once', body: "let calls = 0; const cache = {}; const load = (k) => { calls++; return k.toUpperCase(); }; assertEqual(cacheAside(cache, 'a', load), 'A'); assertEqual(cacheAside(cache, 'a', load), 'A'); assertEqual(calls, 1);" },
    ],
    reference: `function cacheAside(cache, key, loader) {
  if (key in cache) return cache[key];
  const value = loader(key);
  cache[key] = value;
  return value;
}
`,
  },
  {
    problemId: 'cache-write-through',
    title: 'Write-Through Cache',
    language: 'js',
    starter: 'function writeThrough(cache, store, key, value) {\n  // write to both cache and store; return value\n}\n',
    tests: [
      { name: 'writes both', body: "const c = {}, s = {}; writeThrough(c, s, 'x', 5); assertEqual(c, { x:5 }); assertEqual(s, { x:5 });" },
    ],
    reference: `function writeThrough(cache, store, key, value) {
  cache[key] = value;
  store[key] = value;
  return value;
}
`,
  },
  {
    problemId: 'cache-lfu',
    title: 'LFU Cache',
    language: 'js',
    starter: 'class LFU {\n  constructor(capacity) {}\n  get(key) {}   // value or undefined; bumps frequency\n  put(key, value) {} // evicts least-frequently-used when full\n}\n',
    tests: [
      { name: 'evicts least used', body: "const c = new LFU(2); c.put('a',1); c.put('b',2); c.get('a'); c.get('a'); c.put('c',3); assertEqual(c.get('b'), undefined); assertEqual(c.get('a'), 1); assertEqual(c.get('c'), 3);" },
    ],
    reference: `class LFU {
  constructor(capacity) { this.cap = capacity; this.map = new Map(); this.freq = new Map(); }
  get(key) {
    if (!this.map.has(key)) return undefined;
    this.freq.set(key, (this.freq.get(key) || 0) + 1);
    return this.map.get(key);
  }
  put(key, value) {
    if (this.cap === 0) return;
    if (!this.map.has(key) && this.map.size >= this.cap) {
      let lfuKey = null, min = Infinity;
      for (const [k, f] of this.freq) if (f < min) { min = f; lfuKey = k; }
      this.map.delete(lfuKey); this.freq.delete(lfuKey);
    }
    this.map.set(key, value);
    this.freq.set(key, (this.freq.get(key) || 0) + 1);
  }
}
`,
  },
  {
    problemId: 'reliability-retry-until',
    title: 'Retry Until Success',
    language: 'js',
    starter: 'function retryUntil(results, maxAttempts) {\n  // results[i] = did attempt i succeed. return index of first success within maxAttempts, else -1\n}\n',
    tests: [
      { name: 'first success or -1', body: 'assertEqual(retryUntil([false, false, true], 5), 2); assertEqual(retryUntil([false, false], 3), -1); assertEqual(retryUntil([false, true], 1), -1);' },
    ],
    reference: `function retryUntil(results, maxAttempts) {
  for (let i = 0; i < Math.min(results.length, maxAttempts); i++) {
    if (results[i]) return i;
  }
  return -1;
}
`,
  },
  {
    problemId: 'reliability-dedupe-window',
    title: 'Dedupe Within A Window',
    language: 'js',
    starter: 'function dedupeWindow(events, windowMs) {\n  // events: [{key, t}]. drop a key seen again within windowMs. return kept keys\n}\n',
    tests: [
      { name: 'drops repeats in window', body: "assertEqual(dedupeWindow([{key:'a',t:0},{key:'a',t:100},{key:'a',t:1000},{key:'b',t:50}], 1000), ['a','a','b']);" },
    ],
    reference: `function dedupeWindow(events, windowMs) {
  const lastSeen = {};
  const out = [];
  for (const e of events) {
    const prev = lastSeen[e.key];
    if (prev === undefined || e.t - prev >= windowMs) {
      out.push(e.key);
      lastSeen[e.key] = e.t;
    }
  }
  return out;
}
`,
  },
  {
    problemId: 'backpressure-bounded-queue',
    title: 'Bounded Queue (Backpressure)',
    language: 'js',
    starter: 'function boundedEnqueue(queue, item, cap) {\n  // reject (do not grow) when at capacity. return { accepted, queue }\n}\n',
    tests: [
      { name: 'accepts then rejects', body: 'assertEqual(boundedEnqueue([1,2], 3, 3), { accepted:true, queue:[1,2,3] }); assertEqual(boundedEnqueue([1,2,3], 4, 3), { accepted:false, queue:[1,2,3] });' },
    ],
    reference: `function boundedEnqueue(queue, item, cap) {
  if (queue.length >= cap) return { accepted: false, queue };
  return { accepted: true, queue: [...queue, item] };
}
`,
  },
  {
    problemId: 'reliability-timeout-budget',
    title: 'Timeout Budget',
    language: 'js',
    starter: 'function timeoutBudget(totalMs, steps) {\n  // steps: [{ name, ms }]. return { ok, remaining, overBy }\n}\n',
    tests: [
      { name: 'tracks remaining and overrun', body: "assertEqual(timeoutBudget(1000, [{name:'db',ms:250},{name:'api',ms:300}]), { ok:true, remaining:450, overBy:0 }); assertEqual(timeoutBudget(500, [{name:'db',ms:300},{name:'api',ms:350}]), { ok:false, remaining:0, overBy:150 });" },
    ],
    reference: `function timeoutBudget(totalMs, steps) {
  const spent = steps.reduce((sum, step) => sum + step.ms, 0);
  return { ok: spent <= totalMs, remaining: Math.max(0, totalMs - spent), overBy: Math.max(0, spent - totalMs) };
}
`,
  },
  {
    problemId: 'reliability-bulkhead-limit',
    title: 'Bulkhead Capacity',
    language: 'js',
    starter: 'function bulkheadLimit(activeByPool, limits, request) {\n  // request: { pool }. return { allowed, reason }\n}\n',
    tests: [
      { name: 'allows below limit and rejects saturated pool', body: "assertEqual(bulkheadLimit({db:2,email:5}, {db:3,email:5}, {pool:'db'}), { allowed:true, reason:'ok' }); assertEqual(bulkheadLimit({db:2,email:5}, {db:3,email:5}, {pool:'email'}), { allowed:false, reason:'bulkhead_full' });" },
    ],
    reference: `function bulkheadLimit(activeByPool, limits, request) {
  const active = activeByPool[request.pool] || 0;
  const limit = limits[request.pool] || 0;
  if (active >= limit) return { allowed: false, reason: 'bulkhead_full' };
  return { allowed: true, reason: 'ok' };
}
`,
  },
  {
    problemId: 'reliability-outbox-ready',
    title: 'Outbox Ready Events',
    language: 'js',
    starter: 'function readyOutbox(events, now) {\n  // return ids for unpublished events whose availableAt <= now\n}\n',
    tests: [
      { name: 'selects ready unpublished events only', body: "assertEqual(readyOutbox([{id:1,published:false,availableAt:10},{id:2,published:true,availableAt:1},{id:3,published:false,availableAt:20}], 10), [1]);" },
    ],
    reference: `function readyOutbox(events, now) {
  return events.filter((event) => !event.published && event.availableAt <= now).map((event) => event.id);
}
`,
  },
  {
    problemId: 'reliability-idempotency-conflict',
    title: 'Idempotency Conflict Check',
    language: 'js',
    starter: 'function idempotencyDecision(seen, key, requestHash) {\n  // seen maps key -> { requestHash, response }. return replay, conflict, or process\n}\n',
    tests: [
      { name: 'replays same hash and conflicts on changed payload', body: "const seen = { k1:{ requestHash:'abc', response:{status:201} } }; assertEqual(idempotencyDecision(seen, 'k1', 'abc'), { action:'replay', response:{status:201} }); assertEqual(idempotencyDecision(seen, 'k1', 'xyz'), { action:'conflict' }); assertEqual(idempotencyDecision(seen, 'k2', 'abc'), { action:'process' });" },
    ],
    reference: `function idempotencyDecision(seen, key, requestHash) {
  const prior = seen[key];
  if (!prior) return { action: 'process' };
  if (prior.requestHash !== requestHash) return { action: 'conflict' };
  return { action: 'replay', response: prior.response };
}
`,
  },
  {
    problemId: 'reliability-retryable-error',
    title: 'Retryable Error Classifier',
    language: 'js',
    starter: 'function retryableError(err) {\n  // err: { status?, code? }. Retry timeouts, 429, and 5xx; do not retry 4xx validation/auth errors\n}\n',
    tests: [
      { name: 'classifies transient failures', body: "assertEqual(retryableError({code:'ETIMEDOUT'}), true); assertEqual(retryableError({status:503}), true); assertEqual(retryableError({status:429}), true); assertEqual(retryableError({status:400}), false); assertEqual(retryableError({status:401}), false);" },
    ],
    reference: `function retryableError(err) {
  if (err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') return true;
  if (err.status === 429) return true;
  return err.status >= 500 && err.status < 600;
}
`,
  },
  {
    problemId: 'reliability-dependency-result',
    title: 'Dependency Result Envelope',
    language: 'js',
    starter: 'function dependencyResult(name, outcome) {\n  // outcome: { ok, value?, error?, ms }. return a stable success/failure envelope\n}\n',
    tests: [
      { name: 'normalizes success and failure', body: "assertEqual(dependencyResult('db', {ok:true,value:3,ms:12}), { dependency:'db', ok:true, value:3, durationMs:12 }); assertEqual(dependencyResult('stripe', {ok:false,error:'timeout',ms:250}), { dependency:'stripe', ok:false, error:'timeout', durationMs:250 });" },
    ],
    reference: `function dependencyResult(name, outcome) {
  if (outcome.ok) return { dependency: name, ok: true, value: outcome.value, durationMs: outcome.ms };
  return { dependency: name, ok: false, error: outcome.error, durationMs: outcome.ms };
}
`,
  },
  {
    problemId: 'obs-request-id',
    title: 'Request ID Propagation',
    language: 'js',
    starter: 'function requestId(headers, generate) {\n  // use x-request-id if present, otherwise generate one\n}\n',
    tests: [
      { name: 'uses incoming id or generates one', body: "assertEqual(requestId({'x-request-id':'abc'}, () => 'new'), 'abc'); assertEqual(requestId({}, () => 'new'), 'new');" },
    ],
    reference: `function requestId(headers, generate) {
  return headers['x-request-id'] || headers['X-Request-Id'] || generate();
}
`,
  },
  {
    problemId: 'obs-span-duration',
    title: 'Span Duration',
    language: 'js',
    starter: 'function spanDuration(span) {\n  // span: { name, start, end, error? }. return { name, durationMs, status }\n}\n',
    tests: [
      { name: 'computes duration and status', body: "assertEqual(spanDuration({name:'db',start:10,end:35}), { name:'db', durationMs:25, status:'ok' }); assertEqual(spanDuration({name:'api',start:5,end:15,error:true}), { name:'api', durationMs:10, status:'error' });" },
    ],
    reference: `function spanDuration(span) {
  return { name: span.name, durationMs: span.end - span.start, status: span.error ? 'error' : 'ok' };
}
`,
  },
  {
    problemId: 'obs-slo-burn-rate',
    title: 'SLO Burn Rate',
    language: 'js',
    starter: 'function burnRate(errors, total, errorBudgetRatio) {\n  // return current error ratio divided by allowed error budget ratio\n}\n',
    tests: [
      { name: 'calculates burn multiple', body: 'assertEqual(burnRate(5, 1000, 0.001), 5); assertEqual(burnRate(0, 1000, 0.001), 0); assertEqual(burnRate(1, 0, 0.001), 0);' },
    ],
    reference: `function burnRate(errors, total, errorBudgetRatio) {
  if (total === 0) return 0;
  return (errors / total) / errorBudgetRatio;
}
`,
  },
  {
    problemId: 'obs-redact-fields',
    title: 'Redact Sensitive Fields',
    language: 'js',
    starter: 'function redactFields(obj, fields) {\n  // return a shallow copy with listed fields replaced by "[redacted]"\n}\n',
    tests: [
      { name: 'redacts configured fields only', body: "assertEqual(redactFields({email:'a@b.com',password:'pw',token:'t'}, ['password','token']), {email:'a@b.com',password:'[redacted]',token:'[redacted]'});" },
    ],
    reference: `function redactFields(obj, fields) {
  const out = { ...obj };
  for (const field of fields) if (field in out) out[field] = '[redacted]';
  return out;
}
`,
  },
  {
    problemId: 'obs-latency-buckets',
    title: 'Latency Buckets',
    language: 'js',
    starter: 'function latencyBuckets(values, buckets) {\n  // buckets are upper bounds. return counts per bucket plus +Inf\n}\n',
    tests: [
      { name: 'counts cumulative-style buckets', body: "assertEqual(latencyBuckets([20,75,120,900], [50,100,500]), { '50':1, '100':1, '500':1, '+Inf':1 });" },
    ],
    reference: `function latencyBuckets(values, buckets) {
  const out = {};
  for (const b of buckets) out[b] = 0;
  out['+Inf'] = 0;
  for (const value of values) {
    const bucket = buckets.find((b) => value <= b);
    if (bucket === undefined) out['+Inf']++;
    else out[bucket]++;
  }
  return out;
}
`,
  },
  {
    problemId: 'ops-health-rollup',
    title: 'Health Check Rollup',
    language: 'js',
    starter: 'function healthRollup(checks) {\n  // checks: { name: "ok" | "degraded" | "down" }. return overall status\n}\n',
    tests: [
      { name: 'down beats degraded beats ok', body: "assertEqual(healthRollup({db:'ok',cache:'ok'}), 'ok'); assertEqual(healthRollup({db:'ok',cache:'degraded'}), 'degraded'); assertEqual(healthRollup({db:'down',cache:'degraded'}), 'down');" },
    ],
    reference: `function healthRollup(checks) {
  const values = Object.values(checks);
  if (values.includes('down')) return 'down';
  if (values.includes('degraded')) return 'degraded';
  return 'ok';
}
`,
  },

  // ----- Files & object storage ------------------------------------------
  {
    problemId: 'storage-object-key',
    title: 'Storage: Build An Object Key',
    language: 'js',
    starter: "function buildKey(parts) {\n  // join parts into a clean key: trim stray slashes, drop empties\n}\n",
    tests: [
      { name: 'joins cleanly', body: "assertEqual(buildKey(['users', '42', 'avatar.png']), 'users/42/avatar.png'); assertEqual(buildKey(['/a/', '', 'b']), 'a/b');" },
    ],
    reference: `function buildKey(parts) {
  return parts
    .map((p) => String(p).replace(/^\\/+|\\/+$/g, ''))
    .filter((p) => p.length > 0)
    .join('/');
}
`,
  },
  {
    problemId: 'storage-validate-upload',
    title: 'Storage: Validate An Upload',
    language: 'js',
    starter: 'function validateUpload(file, rules) {\n  // file {size, type}, rules {maxSize, allowed[]}. size first, then type. { ok, error }\n}\n',
    tests: [
      { name: 'size then type', body: "assertEqual(validateUpload({size:100,type:'image/png'}, {maxSize:1000,allowed:['image/png']}), {ok:true,error:null}); assertEqual(validateUpload({size:5000,type:'image/png'}, {maxSize:1000,allowed:['image/png']}), {ok:false,error:'too_large'}); assertEqual(validateUpload({size:10,type:'text/plain'}, {maxSize:1000,allowed:['image/png']}), {ok:false,error:'bad_type'});" },
    ],
    reference: `function validateUpload(file, rules) {
  if (file.size > rules.maxSize) return { ok: false, error: 'too_large' };
  if (!rules.allowed.includes(file.type)) return { ok: false, error: 'bad_type' };
  return { ok: true, error: null };
}
`,
  },
  {
    problemId: 'storage-presign-valid',
    title: 'Storage: Is A Signed URL Still Valid?',
    language: 'js',
    starter: 'function isPresignValid(issuedAt, ttl, now) {\n  // valid while now is within issuedAt + ttl (inclusive)\n}\n',
    tests: [
      { name: 'expiry window', body: 'assertEqual(isPresignValid(1000, 60, 1050), true); assertEqual(isPresignValid(1000, 60, 1060), true); assertEqual(isPresignValid(1000, 60, 1100), false);' },
    ],
    reference: `function isPresignValid(issuedAt, ttl, now) {
  return now <= issuedAt + ttl;
}
`,
  },
  {
    problemId: 'storage-multipart-assemble',
    title: 'Storage: Assemble Multipart Upload',
    language: 'js',
    starter: 'function assembleParts(parts) {\n  // parts: [{partNumber, etag}]. return etags ordered by partNumber\n}\n',
    tests: [
      { name: 'orders by part number', body: "assertEqual(assembleParts([{partNumber:2,etag:'b'},{partNumber:1,etag:'a'},{partNumber:3,etag:'c'}]), ['a','b','c']);" },
    ],
    reference: `function assembleParts(parts) {
  return [...parts].sort((a, b) => a.partNumber - b.partNumber).map((p) => p.etag);
}
`,
  },
  {
    problemId: 'storage-content-disposition',
    title: 'Storage: Content-Disposition Header',
    language: 'js',
    starter: "function contentDisposition(filename) {\n  // force a download with the given name; strip quotes from the name\n}\n",
    tests: [
      { name: 'builds the header', body: "assertEqual(contentDisposition('report.pdf'), 'attachment; filename=\"report.pdf\"'); assertEqual(contentDisposition('a\"b.txt'), 'attachment; filename=\"ab.txt\"');" },
    ],
    reference: `function contentDisposition(filename) {
  const safe = filename.replace(/"/g, '');
  return 'attachment; filename="' + safe + '"';
}
`,
  },
  {
    problemId: 'storage-lifecycle-expire',
    title: 'Storage: Lifecycle Expiry',
    language: 'js',
    starter: 'function expiredKeys(objects, maxAgeDays) {\n  // objects: [{key, ageDays}]. return keys older than maxAgeDays\n}\n',
    tests: [
      { name: 'finds expired', body: "assertEqual(expiredKeys([{key:'a',ageDays:10},{key:'b',ageDays:40},{key:'c',ageDays:31}], 30), ['b','c']);" },
    ],
    reference: `function expiredKeys(objects, maxAgeDays) {
  return objects.filter((o) => o.ageDays > maxAgeDays).map((o) => o.key);
}
`,
  },
  {
    problemId: 'storage-cdn-url',
    title: 'Storage: Build A CDN URL',
    language: 'js',
    starter: 'function cdnUrl(base, bucket, key) {\n  // join into base/bucket/key with no double slashes\n}\n',
    tests: [
      { name: 'joins url parts', body: "assertEqual(cdnUrl('https://cdn.example.com/', 'assets', 'img/logo.png'), 'https://cdn.example.com/assets/img/logo.png');" },
    ],
    reference: `function cdnUrl(base, bucket, key) {
  return base.replace(/\\/+$/, '') + '/' + bucket + '/' + key;
}
`,
  },
  {
    problemId: 'storage-safe-key',
    title: 'Storage: Reject Path Traversal',
    language: 'js',
    starter: "function safeKey(key) {\n  // reject keys containing . or .. segments (return null); strip a leading slash\n}\n",
    tests: [
      { name: 'blocks traversal', body: "assertEqual(safeKey('users/42/a.png'), 'users/42/a.png'); assertEqual(safeKey('users/../secrets'), null); assertEqual(safeKey('/a/b'), 'a/b');" },
    ],
    reference: `function safeKey(key) {
  const parts = key.split('/');
  if (parts.some((p) => p === '..' || p === '.')) return null;
  return key.replace(/^\\/+/, '');
}
`,
  },

  // ----- Interview-classic algorithms (part 2) ---------------------------
  {
    problemId: 'algo-kadane',
    title: 'Max Subarray Sum (Kadane)',
    language: 'js',
    starter: 'function maxSubarray(nums) {\n  // largest sum of any contiguous subarray\n}\n',
    tests: [
      { name: 'classic + all-negative', body: 'assertEqual(maxSubarray([-2,1,-3,4,-1,2,1,-5,4]), 6); assertEqual(maxSubarray([-1,-2]), -1);' },
    ],
    reference: `function maxSubarray(nums) {
  let best = nums[0], cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}
`,
  },
  {
    problemId: 'algo-window-sum',
    title: 'Max Sum Of A Size-K Window',
    language: 'js',
    starter: 'function maxWindowSum(nums, k) {\n  // max sum of any k consecutive elements\n}\n',
    tests: [
      { name: 'slides the window', body: 'assertEqual(maxWindowSum([1,2,3,4,5], 2), 9); assertEqual(maxWindowSum([2,1,5,1,3,2], 3), 9);' },
    ],
    reference: `function maxWindowSum(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    best = Math.max(best, sum);
  }
  return best;
}
`,
  },
  {
    problemId: 'algo-longest-unique',
    title: 'Longest Substring Without Repeats',
    language: 'js',
    starter: 'function longestUnique(s) {\n  // length of the longest substring with all-unique chars\n}\n',
    tests: [
      { name: 'window cases', body: 'assertEqual(longestUnique("abcabcbb"), 3); assertEqual(longestUnique("bbbb"), 1); assertEqual(longestUnique(""), 0);' },
    ],
    reference: `function longestUnique(s) {
  const seen = new Map();
  let start = 0, best = 0;
  for (let i = 0; i < s.length; i++) {
    if (seen.has(s[i]) && seen.get(s[i]) >= start) start = seen.get(s[i]) + 1;
    seen.set(s[i], i);
    best = Math.max(best, i - start + 1);
  }
  return best;
}
`,
  },
  {
    problemId: 'algo-product-except-self',
    title: 'Product Of Array Except Self',
    language: 'js',
    starter: 'function productExceptSelf(nums) {\n  // res[i] = product of all others (no division)\n}\n',
    tests: [
      { name: 'prefix x suffix', body: 'assertEqual(productExceptSelf([1,2,3,4]), [24,12,8,6]);' },
    ],
    reference: `function productExceptSelf(nums) {
  const res = Array(nums.length).fill(1);
  let pre = 1;
  for (let i = 0; i < nums.length; i++) { res[i] = pre; pre *= nums[i]; }
  let post = 1;
  for (let i = nums.length - 1; i >= 0; i--) { res[i] *= post; post *= nums[i]; }
  return res;
}
`,
  },
  {
    problemId: 'algo-bfs',
    title: 'Breadth-First Order',
    language: 'js',
    starter: 'function bfs(adj, start) {\n  // adj: { node: [neighbors] }. return nodes in BFS order\n}\n',
    tests: [
      { name: 'level order', body: "assertEqual(bfs({ a:['b','c'], b:['d'], c:[], d:[] }, 'a'), ['a','b','c','d']);" },
    ],
    reference: `function bfs(adj, start) {
  const seen = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length) {
    const n = queue.shift();
    order.push(n);
    for (const next of adj[n] || []) if (!seen.has(next)) { seen.add(next); queue.push(next); }
  }
  return order;
}
`,
  },
  {
    problemId: 'algo-dfs',
    title: 'Depth-First Order',
    language: 'js',
    starter: 'function dfs(adj, start) {\n  // return nodes in DFS (pre-order) order\n}\n',
    tests: [
      { name: 'depth order', body: "assertEqual(dfs({ a:['b','c'], b:['d'], c:[], d:[] }, 'a'), ['a','b','d','c']);" },
    ],
    reference: `function dfs(adj, start) {
  const seen = new Set();
  const order = [];
  (function visit(n) {
    if (seen.has(n)) return;
    seen.add(n);
    order.push(n);
    for (const next of adj[n] || []) visit(next);
  })(start);
  return order;
}
`,
  },
  {
    problemId: 'algo-coin-change',
    title: 'Fewest Coins (Coin Change)',
    language: 'js',
    starter: 'function minCoins(coins, amount) {\n  // fewest coins to make amount, or -1 if impossible\n}\n',
    tests: [
      { name: 'dp cases', body: 'assertEqual(minCoins([1,2,5], 11), 3); assertEqual(minCoins([2], 3), -1); assertEqual(minCoins([1], 0), 0);' },
    ],
    reference: `function minCoins(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
`,
  },
  {
    problemId: 'algo-quicksort',
    title: 'Quicksort',
    language: 'js',
    starter: 'function quicksort(arr) {\n  // return a sorted copy using quicksort\n}\n',
    tests: [
      { name: 'sorts', body: 'assertEqual(quicksort([3,1,2,5,4]), [1,2,3,4,5]); assertEqual(quicksort([]), []);' },
    ],
    reference: `function quicksort(arr) {
  if (arr.length <= 1) return arr;
  const [pivot, ...rest] = arr;
  const left = rest.filter((x) => x < pivot);
  const right = rest.filter((x) => x >= pivot);
  return [...quicksort(left), pivot, ...quicksort(right)];
}
`,
  },
  {
    problemId: 'algo-rotate-matrix',
    title: 'Rotate A Matrix 90 Degrees',
    language: 'js',
    starter: 'function rotateMatrix(m) {\n  // rotate an n x n matrix clockwise\n}\n',
    tests: [
      { name: 'clockwise', body: 'assertEqual(rotateMatrix([[1,2],[3,4]]), [[3,1],[4,2]]);' },
    ],
    reference: `function rotateMatrix(m) {
  const n = m.length;
  const res = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) res[j][n - 1 - i] = m[i][j];
  return res;
}
`,
  },
  {
    problemId: 'algo-move-zeroes',
    title: 'Move Zeroes To The End',
    language: 'js',
    starter: 'function moveZeroes(nums) {\n  // move all zeroes to the end, keeping the order of the rest\n}\n',
    tests: [
      { name: 'keeps order', body: 'assertEqual(moveZeroes([0,1,0,3,12]), [1,3,12,0,0]);' },
    ],
    reference: `function moveZeroes(nums) {
  const out = nums.filter((x) => x !== 0);
  while (out.length < nums.length) out.push(0);
  return out;
}
`,
  },

  // ----- Data structures (build them yourself) ---------------------------
  {
    problemId: 'dsb-stack',
    title: 'Build A Stack',
    language: 'js',
    starter: 'class Stack {\n  push(x) {}\n  pop() {}     // returns the top\n  peek() {}    // top without removing\n  isEmpty() {}\n}\n',
    tests: [
      { name: 'LIFO', body: 'const s = new Stack(); assertEqual(s.isEmpty(), true); s.push(1); s.push(2); assertEqual(s.peek(), 2); assertEqual(s.pop(), 2); assertEqual(s.isEmpty(), false);' },
    ],
    reference: `class Stack {
  constructor() { this.items = []; }
  push(x) { this.items.push(x); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}
`,
  },
  {
    problemId: 'dsb-queue',
    title: 'Build A Queue',
    language: 'js',
    starter: 'class Queue {\n  enqueue(x) {}\n  dequeue() {} // returns the front\n  size() {}\n}\n',
    tests: [
      { name: 'FIFO', body: 'const q = new Queue(); q.enqueue(1); q.enqueue(2); assertEqual(q.dequeue(), 1); assertEqual(q.size(), 1);' },
    ],
    reference: `class Queue {
  constructor() { this.items = []; }
  enqueue(x) { this.items.push(x); }
  dequeue() { return this.items.shift(); }
  size() { return this.items.length; }
}
`,
  },
  {
    problemId: 'dsb-min-heap',
    title: 'Build A Min-Heap',
    language: 'js',
    starter: 'class MinHeap {\n  push(x) {}\n  popMin() {} // remove and return the smallest\n}\n',
    tests: [
      { name: 'pops in order', body: 'const h = new MinHeap(); [5,1,3,2,4].forEach((x) => h.push(x)); assertEqual(h.popMin(), 1); assertEqual(h.popMin(), 2); assertEqual(h.popMin(), 3);' },
    ],
    reference: `class MinHeap {
  constructor() { this.h = []; }
  push(x) {
    this.h.push(x);
    let i = this.h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p] <= this.h[i]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }
  popMin() {
    const top = this.h[0];
    const last = this.h.pop();
    if (this.h.length) {
      this.h[0] = last;
      let i = 0;
      const n = this.h.length;
      while (true) {
        let s = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && this.h[l] < this.h[s]) s = l;
        if (r < n && this.h[r] < this.h[s]) s = r;
        if (s === i) break;
        [this.h[s], this.h[i]] = [this.h[i], this.h[s]];
        i = s;
      }
    }
    return top;
  }
}
`,
  },
  {
    problemId: 'dsb-bst',
    title: 'Build A Binary Search Tree',
    language: 'js',
    starter: 'function bst() {\n  // return { add(val), contains(val) }\n}\n',
    tests: [
      { name: 'inserts and finds', body: 'const t = bst(); [5,3,7].forEach((v) => t.add(v)); assertEqual(t.contains(3), true); assertEqual(t.contains(9), false);' },
    ],
    reference: `function bst() {
  let root = null;
  function insert(node, val) {
    if (!node) return { val, left: null, right: null };
    if (val < node.val) node.left = insert(node.left, val);
    else node.right = insert(node.right, val);
    return node;
  }
  return {
    add(val) { root = insert(root, val); },
    contains(val) {
      let n = root;
      while (n) {
        if (val === n.val) return true;
        n = val < n.val ? n.left : n.right;
      }
      return false;
    },
  };
}
`,
  },
  {
    problemId: 'dsb-inorder',
    title: 'In-Order Tree Traversal',
    language: 'js',
    starter: 'function inorder(node) {\n  // node: { val, left, right } | null. return values in-order\n}\n',
    tests: [
      { name: 'left, root, right', body: 'assertEqual(inorder({ val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } }), [1, 2, 3]);' },
    ],
    reference: `function inorder(node) {
  if (!node) return [];
  return [...inorder(node.left), node.val, ...inorder(node.right)];
}
`,
  },
  {
    problemId: 'dsb-level-order',
    title: 'Level-Order Tree Traversal',
    language: 'js',
    starter: 'function levelOrder(root) {\n  // return values grouped by depth, e.g. [[2], [1, 3]]\n}\n',
    tests: [
      { name: 'by depth', body: 'assertEqual(levelOrder({ val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } }), [[2], [1, 3]]);' },
    ],
    reference: `function levelOrder(root) {
  if (!root) return [];
  const out = [];
  let level = [root];
  while (level.length) {
    out.push(level.map((n) => n.val));
    const next = [];
    for (const n of level) {
      if (n.left) next.push(n.left);
      if (n.right) next.push(n.right);
    }
    level = next;
  }
  return out;
}
`,
  },
  {
    problemId: 'dsb-reverse-list',
    title: 'Reverse A Linked List',
    language: 'js',
    starter: 'function reverseList(head) {\n  // head: { val, next } | null. return the new head\n}\n',
    tests: [
      { name: 'reverses', body: 'const c = { val: 3, next: null }, b = { val: 2, next: c }, a = { val: 1, next: b }; let n = reverseList(a); const out = []; while (n) { out.push(n.val); n = n.next; } assertEqual(out, [3, 2, 1]);' },
    ],
    reference: `function reverseList(head) {
  let prev = null;
  while (head) {
    const next = head.next;
    head.next = prev;
    prev = head;
    head = next;
  }
  return prev;
}
`,
  },
  {
    problemId: 'dsb-hashmap',
    title: 'Build A HashMap',
    language: 'js',
    starter: 'class HashMap {\n  set(key, val) {}\n  get(key) {} // value or undefined\n}\n',
    tests: [
      { name: 'set/get/overwrite', body: "const m = new HashMap(); m.set('a', 1); m.set('b', 2); m.set('a', 3); assertEqual(m.get('a'), 3); assertEqual(m.get('b'), 2); assertEqual(m.get('z'), undefined);" },
    ],
    reference: `class HashMap {
  constructor(size = 8) { this.buckets = Array.from({ length: size }, () => []); }
  _idx(key) {
    let h = 0;
    for (const ch of String(key)) h = (h * 31 + ch.charCodeAt(0)) % this.buckets.length;
    return h;
  }
  set(key, val) {
    const b = this.buckets[this._idx(key)];
    const e = b.find((p) => p[0] === key);
    if (e) e[1] = val;
    else b.push([key, val]);
  }
  get(key) {
    const b = this.buckets[this._idx(key)];
    const e = b.find((p) => p[0] === key);
    return e ? e[1] : undefined;
  }
}
`,
  },

  // ----- SQL semantics, part 2 (joins, windows, upsert) ------------------
  {
    problemId: 'sqldrill-having',
    title: 'SQL: GROUP BY ... HAVING',
    language: 'js',
    starter: 'function havingCount(rows, key, min) {\n  // keys whose group count is >= min, sorted\n}\n',
    tests: [
      { name: 'filters groups', body: "assertEqual(havingCount([{t:'a'},{t:'a'},{t:'b'}], 't', 2), ['a']);" },
    ],
    reference: `function havingCount(rows, key, min) {
  const counts = {};
  for (const r of rows) counts[r[key]] = (counts[r[key]] || 0) + 1;
  return Object.keys(counts).filter((k) => counts[k] >= min).sort();
}
`,
  },
  {
    problemId: 'sqldrill-left-join',
    title: 'SQL: LEFT JOIN',
    language: 'js',
    starter: 'function leftJoin(left, right, leftKey, rightKey) {\n  // every left row, merged with its match (or left as-is when none)\n}\n',
    tests: [
      { name: 'keeps unmatched left', body: "assertEqual(leftJoin([{uid:1},{uid:2}], [{id:1,name:'a'}], 'uid', 'id'), [{uid:1,id:1,name:'a'},{uid:2}]);" },
    ],
    reference: `function leftJoin(left, right, leftKey, rightKey) {
  const idx = new Map(right.map((r) => [r[rightKey], r]));
  return left.map((l) => ({ ...l, ...(idx.get(l[leftKey]) || {}) }));
}
`,
  },
  {
    problemId: 'sqldrill-self-join',
    title: 'SQL: Self Join (manager name)',
    language: 'js',
    starter: 'function withManager(employees) {\n  // employees: { id, name, managerId }. return { name, manager } (manager name or null)\n}\n',
    tests: [
      { name: 'resolves manager', body: "assertEqual(withManager([{id:1,name:'A',managerId:null},{id:2,name:'B',managerId:1}]), [{name:'A',manager:null},{name:'B',manager:'A'}]);" },
    ],
    reference: `function withManager(employees) {
  const byId = new Map(employees.map((e) => [e.id, e.name]));
  return employees.map((e) => ({ name: e.name, manager: byId.get(e.managerId) ?? null }));
}
`,
  },
  {
    problemId: 'sqldrill-running-total',
    title: 'SQL: Window Running Total',
    language: 'js',
    starter: 'function runningTotal(rows, valueKey) {\n  // annotate each row with the cumulative sum so far\n}\n',
    tests: [
      { name: 'accumulates', body: "assertEqual(runningTotal([{n:1},{n:2},{n:3}], 'n'), [{n:1,total:1},{n:2,total:3},{n:3,total:6}]);" },
    ],
    reference: `function runningTotal(rows, valueKey) {
  let sum = 0;
  return rows.map((r) => {
    sum += r[valueKey];
    return { ...r, total: sum };
  });
}
`,
  },
  {
    problemId: 'sqldrill-rank',
    title: 'SQL: RANK() With Ties',
    language: 'js',
    starter: 'function rankBy(rows, valueKey) {\n  // rank rows high-to-low; ties share a rank (competition ranking)\n}\n',
    tests: [
      { name: 'ties share rank', body: "assertEqual(rankBy([{s:90},{s:80},{s:90}], 's'), [{s:90,rank:1},{s:90,rank:1},{s:80,rank:3}]);" },
    ],
    reference: `function rankBy(rows, valueKey) {
  const sorted = [...rows].sort((a, b) => b[valueKey] - a[valueKey]);
  let rank = 0, prev = null, count = 0;
  return sorted.map((r) => {
    count++;
    if (r[valueKey] !== prev) { rank = count; prev = r[valueKey]; }
    return { ...r, rank };
  });
}
`,
  },
  {
    problemId: 'sqldrill-dedupe-latest',
    title: 'SQL: Latest Row Per Key',
    language: 'js',
    starter: 'function latestPerKey(rows, key, tsKey) {\n  // keep the row with the max timestamp for each key\n}\n',
    tests: [
      { name: 'keeps the newest', body: "assertEqual(latestPerKey([{id:1,t:1,v:'a'},{id:1,t:2,v:'b'},{id:2,t:1,v:'c'}], 'id', 't'), [{id:1,t:2,v:'b'},{id:2,t:1,v:'c'}]);" },
    ],
    reference: `function latestPerKey(rows, key, tsKey) {
  const best = new Map();
  for (const r of rows) {
    const k = r[key];
    if (!best.has(k) || r[tsKey] > best.get(k)[tsKey]) best.set(k, r);
  }
  return [...best.values()];
}
`,
  },
  {
    problemId: 'sqldrill-upsert',
    title: 'SQL: UPSERT (insert or update)',
    language: 'js',
    starter: 'function upsert(rows, key, row) {\n  // replace the row with the same key, or append it (immutable)\n}\n',
    tests: [
      { name: 'updates then inserts', body: "assertEqual(upsert([{id:1,v:'a'}], 'id', {id:1,v:'b'}), [{id:1,v:'b'}]); assertEqual(upsert([{id:1}], 'id', {id:2}), [{id:1},{id:2}]);" },
    ],
    reference: `function upsert(rows, key, row) {
  const idx = rows.findIndex((r) => r[key] === row[key]);
  if (idx === -1) return [...rows, row];
  return rows.map((r, i) => (i === idx ? row : r));
}
`,
  },
  {
    problemId: 'sqldrill-subquery-in',
    title: 'SQL: WHERE key IN (subquery)',
    language: 'js',
    starter: 'function whereIn(rows, key, values) {\n  // keep rows whose key is in the subquery values\n}\n',
    tests: [
      { name: 'membership filter', body: "assertEqual(whereIn([{uid:1},{uid:2},{uid:3}], 'uid', [1,3]), [{uid:1},{uid:3}]);" },
    ],
    reference: `function whereIn(rows, key, values) {
  const set = new Set(values);
  return rows.filter((r) => set.has(r[key]));
}
`,
  },

  // ----- Bit manipulation (interview classics) ---------------------------
  {
    problemId: 'bit-count-ones',
    title: 'Count Set Bits',
    language: 'js',
    starter: 'function countOnes(n) {\n  // how many 1 bits are in n\n}\n',
    tests: [
      { name: 'popcount', body: 'assertEqual(countOnes(7), 3); assertEqual(countOnes(0), 0); assertEqual(countOnes(8), 1);' },
    ],
    reference: `function countOnes(n) {
  let c = 0;
  while (n) { c += n & 1; n >>>= 1; }
  return c;
}
`,
  },
  {
    problemId: 'bit-single-number',
    title: 'Single Number (XOR)',
    language: 'js',
    starter: 'function singleNumber(nums) {\n  // every value appears twice except one — find it\n}\n',
    tests: [
      { name: 'xor cancels pairs', body: 'assertEqual(singleNumber([2,2,1]), 1); assertEqual(singleNumber([4,1,2,1,2]), 4);' },
    ],
    reference: `function singleNumber(nums) {
  return nums.reduce((a, b) => a ^ b, 0);
}
`,
  },
  {
    problemId: 'bit-power-of-two',
    title: 'Is A Power Of Two',
    language: 'js',
    starter: 'function isPowerOfTwo(n) {\n  // true when n is 1, 2, 4, 8, ...\n}\n',
    tests: [
      { name: 'n & (n-1)', body: 'assertEqual(isPowerOfTwo(16), true); assertEqual(isPowerOfTwo(0), false); assertEqual(isPowerOfTwo(6), false);' },
    ],
    reference: `function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}
`,
  },
  {
    problemId: 'bit-toggle',
    title: 'Toggle The i-th Bit',
    language: 'js',
    starter: 'function toggleBit(n, i) {\n  // flip bit i of n\n}\n',
    tests: [
      { name: 'xor a shifted 1', body: 'assertEqual(toggleBit(5, 1), 7); assertEqual(toggleBit(7, 1), 5);' },
    ],
    reference: `function toggleBit(n, i) {
  return n ^ (1 << i);
}
`,
  },
  {
    problemId: 'bit-lowest-set',
    title: 'Isolate The Lowest Set Bit',
    language: 'js',
    starter: 'function lowestSetBit(n) {\n  // the value of the lowest 1 bit (e.g. 12 -> 4)\n}\n',
    tests: [
      { name: 'n & -n', body: 'assertEqual(lowestSetBit(12), 4); assertEqual(lowestSetBit(1), 1);' },
    ],
    reference: `function lowestSetBit(n) {
  return n & -n;
}
`,
  },
  {
    problemId: 'bit-hamming',
    title: 'Hamming Distance',
    language: 'js',
    starter: 'function hamming(a, b) {\n  // count the bit positions where a and b differ\n}\n',
    tests: [
      { name: 'xor then popcount', body: 'assertEqual(hamming(1, 4), 2); assertEqual(hamming(3, 1), 1);' },
    ],
    reference: `function hamming(a, b) {
  let x = a ^ b, c = 0;
  while (x) { c += x & 1; x >>>= 1; }
  return c;
}
`,
  },
  {
    problemId: 'bit-missing-number',
    title: 'Missing Number (XOR)',
    language: 'js',
    starter: 'function missingNumber(nums) {\n  // nums holds 0..n with one missing — find it\n}\n',
    tests: [
      { name: 'xor indices and values', body: 'assertEqual(missingNumber([3,0,1]), 2); assertEqual(missingNumber([0,1]), 2);' },
    ],
    reference: `function missingNumber(nums) {
  let x = nums.length;
  for (let i = 0; i < nums.length; i++) x ^= i ^ nums[i];
  return x;
}
`,
  },
  {
    problemId: 'bit-reverse',
    title: 'Reverse Bits (fixed width)',
    language: 'js',
    starter: 'function reverseBits(n, width) {\n  // reverse the low `width` bits of n\n}\n',
    tests: [
      { name: 'reverses width bits', body: 'assertEqual(reverseBits(1, 8), 128); assertEqual(reverseBits(2, 8), 64);' },
    ],
    reference: `function reverseBits(n, width) {
  let r = 0;
  for (let i = 0; i < width; i++) { r = (r << 1) | (n & 1); n >>>= 1; }
  return r;
}
`,
  },

  // ----- Formatting & time math (practical backend helpers) --------------
  {
    problemId: 'fmt-seconds-hms',
    title: 'Seconds To HH:MM:SS',
    language: 'js',
    starter: 'function secondsToHMS(s) {\n  // 3661 -> "01:01:01" (zero-padded)\n}\n',
    tests: [
      { name: 'pads each part', body: 'assertEqual(secondsToHMS(3661), "01:01:01"); assertEqual(secondsToHMS(0), "00:00:00");' },
    ],
    reference: `function secondsToHMS(s) {
  var h = Math.floor(s / 3600);
  var m = Math.floor((s % 3600) / 60);
  var sec = s % 60;
  function pad(n) { return String(n).padStart(2, '0'); }
  return pad(h) + ':' + pad(m) + ':' + pad(sec);
}
`,
  },
  {
    problemId: 'fmt-humanize-ms',
    title: 'Humanize Milliseconds',
    language: 'js',
    starter: 'function humanizeMs(ms) {\n  // 90000 -> "1m 30s"\n}\n',
    tests: [
      { name: 'minutes and seconds', body: 'assertEqual(humanizeMs(90000), "1m 30s"); assertEqual(humanizeMs(5000), "0m 5s");' },
    ],
    reference: `function humanizeMs(ms) {
  var total = Math.floor(ms / 1000);
  var m = Math.floor(total / 60);
  var s = total % 60;
  return m + 'm ' + s + 's';
}
`,
  },
  {
    problemId: 'fmt-diff-days',
    title: 'Whole Days Between Timestamps',
    language: 'js',
    starter: 'function diffDays(a, b) {\n  // whole days between two epoch-ms values\n}\n',
    tests: [
      { name: 'floors the diff', body: 'assertEqual(diffDays(0, 86400000), 1); assertEqual(diffDays(0, 90000000), 1);' },
    ],
    reference: `function diffDays(a, b) {
  return Math.floor(Math.abs(a - b) / 86400000);
}
`,
  },
  {
    problemId: 'fmt-is-leap',
    title: 'Leap Year',
    language: 'js',
    starter: 'function isLeapYear(y) {\n  // divisible by 4, except centuries unless divisible by 400\n}\n',
    tests: [
      { name: 'rules', body: 'assertEqual(isLeapYear(2000), true); assertEqual(isLeapYear(1900), false); assertEqual(isLeapYear(2024), true); assertEqual(isLeapYear(2023), false);' },
    ],
    reference: `function isLeapYear(y) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}
`,
  },
  {
    problemId: 'fmt-days-in-month',
    title: 'Days In A Month',
    language: 'js',
    starter: 'function daysInMonth(year, month) {\n  // month is 1-12\n}\n',
    tests: [
      { name: 'feb + others', body: 'assertEqual(daysInMonth(2024, 2), 29); assertEqual(daysInMonth(2023, 2), 28); assertEqual(daysInMonth(2023, 4), 30); assertEqual(daysInMonth(2023, 1), 31);' },
    ],
    reference: `function daysInMonth(year, month) {
  if (month === 2) return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}
`,
  },
  {
    problemId: 'fmt-bytes',
    title: 'Format Bytes',
    language: 'js',
    starter: 'function formatBytes(n) {\n  // 1536 -> "1.5 KB", 512 -> "512 B"\n}\n',
    tests: [
      { name: 'scales units', body: 'assertEqual(formatBytes(512), "512 B"); assertEqual(formatBytes(1536), "1.5 KB"); assertEqual(formatBytes(1048576), "1 MB");' },
    ],
    reference: `function formatBytes(n) {
  if (n < 1024) return n + ' B';
  var units = ['KB', 'MB', 'GB', 'TB'];
  var i = -1;
  do { n /= 1024; i++; } while (n >= 1024 && i < units.length - 1);
  return (Math.round(n * 10) / 10) + ' ' + units[i];
}
`,
  },
  {
    problemId: 'fmt-ordinal',
    title: 'Ordinal Suffix',
    language: 'js',
    starter: 'function ordinal(n) {\n  // 1 -> "1st", 2 -> "2nd", 11 -> "11th", 21 -> "21st"\n}\n',
    tests: [
      { name: 'handles the teens', body: 'assertEqual(ordinal(1), "1st"); assertEqual(ordinal(2), "2nd"); assertEqual(ordinal(11), "11th"); assertEqual(ordinal(21), "21st"); assertEqual(ordinal(13), "13th");' },
    ],
    reference: `function ordinal(n) {
  var s = ['th', 'st', 'nd', 'rd'];
  var v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
`,
  },
  {
    problemId: 'fmt-truncate',
    title: 'Truncate With Ellipsis',
    language: 'js',
    starter: 'function truncate(str, max) {\n  // keep up to max chars, append "..." when cut\n}\n',
    tests: [
      { name: 'cuts long strings', body: 'assertEqual(truncate("hello", 10), "hello"); assertEqual(truncate("hello world", 5), "hello...");' },
    ],
    reference: `function truncate(str, max) {
  return str.length <= max ? str : str.slice(0, max) + '...';
}
`,
  },
]
