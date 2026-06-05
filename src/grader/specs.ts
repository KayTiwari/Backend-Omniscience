import type { GradeSpec } from './types'
import { backendSpecs } from './specs.backend.ts'
import { frameworkSpecs } from './specs.framework.ts'

// Auto-gradable drills. Each is a pure JS function the learner implements; the
// tests assert behavior. Attach a spec to a course problem via `problemId`.
const coreSpecs: GradeSpec[] = [
  {
    problemId: 'api-json-response',
    title: 'Build A JSON Response',
    language: 'js',
    starter:
      "function buildJsonResponse(data, status = 200) {\n  // return { status, headers: { 'Content-Type': 'application/json' }, body }\n}\n",
    tests: [
      {
        name: 'serializes data with JSON content type',
        body:
          "assertEqual(buildJsonResponse({ ok: true }, 201), { status: 201, headers: { 'Content-Type': 'application/json' }, body: '{\"ok\":true}' });",
      },
      {
        name: 'defaults status to 200',
        body:
          "assertEqual(buildJsonResponse(['a']), { status: 200, headers: { 'Content-Type': 'application/json' }, body: '[\"a\"]' });",
      },
    ],
    reference:
      "function buildJsonResponse(data, status = 200) {\n" +
      "  return { status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };\n" +
      "}\n",
  },
  {
    problemId: 'api-route-match',
    title: 'Match Method And Path',
    language: 'js',
    starter:
      "function matchRoute(method, path) {\n  // GET /users -> { name: 'listUsers', params: {} }\n  // POST /users -> { name: 'createUser', params: {} }\n  // GET /users/42 -> { name: 'getUser', params: { id: '42' } }\n  // otherwise null\n}\n",
    tests: [
      {
        name: 'matches collection routes by method',
        body:
          "assertEqual(matchRoute('GET', '/users'), { name: 'listUsers', params: {} }); assertEqual(matchRoute('POST', '/users'), { name: 'createUser', params: {} });",
      },
      {
        name: 'extracts user id route param',
        body: "assertEqual(matchRoute('GET', '/users/42'), { name: 'getUser', params: { id: '42' } });",
      },
      {
        name: 'returns null for unknown routes',
        body: "assertEqual(matchRoute('DELETE', '/users/42'), null); assertEqual(matchRoute('GET', '/projects'), null);",
      },
    ],
    reference:
      "function matchRoute(method, path) {\n" +
      "  if (method === 'GET' && path === '/users') return { name: 'listUsers', params: {} };\n" +
      "  if (method === 'POST' && path === '/users') return { name: 'createUser', params: {} };\n" +
      "  const match = path.match(/^\\/users\\/([^/]+)$/);\n" +
      "  if (method === 'GET' && match) return { name: 'getUser', params: { id: match[1] } };\n" +
      "  return null;\n" +
      "}\n",
  },
  {
    problemId: 'api-create-user-validation',
    title: 'Validate Create User Input',
    language: 'js',
    starter:
      "function validateCreateUser(body) {\n  // return errors like [{ field: 'email', message: 'valid email required' }]\n}\n",
    tests: [
      {
        name: 'accepts valid create user input',
        body: "assertEqual(validateCreateUser({ email: 'ada@example.com', name: 'Ada' }), []);",
      },
      {
        name: 'rejects missing and malformed fields',
        body:
          "assertEqual(validateCreateUser({ email: 'nope', name: '' }), [{ field: 'email', message: 'valid email required' }, { field: 'name', message: 'name required' }]);",
      },
      {
        name: 'handles missing body',
        body:
          "assertEqual(validateCreateUser(null), [{ field: 'email', message: 'valid email required' }, { field: 'name', message: 'name required' }]);",
      },
    ],
    reference:
      "function validateCreateUser(body) {\n" +
      "  const input = body || {};\n" +
      "  const errors = [];\n" +
      "  if (typeof input.email !== 'string' || !input.email.includes('@')) errors.push({ field: 'email', message: 'valid email required' });\n" +
      "  if (typeof input.name !== 'string' || input.name.trim() === '') errors.push({ field: 'name', message: 'name required' });\n" +
      "  return errors;\n" +
      "}\n",
  },
  {
    problemId: 'api-result-to-response',
    title: 'Map Service Results To HTTP',
    language: 'js',
    starter:
      "function resultToResponse(result) {\n  // result kinds: ok, validation_error, not_found, conflict\n  // return { status, body }\n}\n",
    tests: [
      {
        name: 'maps success',
        body: "assertEqual(resultToResponse({ kind: 'ok', data: { id: 1 } }), { status: 200, body: { id: 1 } });",
      },
      {
        name: 'maps client and domain errors',
        body:
          "assertEqual(resultToResponse({ kind: 'validation_error', errors: [{ field: 'email' }] }), { status: 400, body: { error: 'validation_error', details: [{ field: 'email' }] } }); assertEqual(resultToResponse({ kind: 'not_found', resource: 'user' }), { status: 404, body: { error: 'not_found', resource: 'user' } }); assertEqual(resultToResponse({ kind: 'conflict', message: 'email exists' }), { status: 409, body: { error: 'conflict', message: 'email exists' } });",
      },
    ],
    reference:
      "function resultToResponse(result) {\n" +
      "  if (result.kind === 'ok') return { status: 200, body: result.data };\n" +
      "  if (result.kind === 'validation_error') return { status: 400, body: { error: 'validation_error', details: result.errors } };\n" +
      "  if (result.kind === 'not_found') return { status: 404, body: { error: 'not_found', resource: result.resource } };\n" +
      "  if (result.kind === 'conflict') return { status: 409, body: { error: 'conflict', message: result.message } };\n" +
      "  return { status: 500, body: { error: 'internal_error' } };\n" +
      "}\n",
  },
  {
    problemId: 'api-create-user-handler',
    title: 'Tiny Create User Handler',
    language: 'js',
    starter:
      "function handleCreateUser(req, users) {\n  // req = { body: { email, name } }, users = [{ id, email, name }]\n  // return { status, body }; mutate users only on success\n}\n",
    tests: [
      {
        name: 'creates a user with the next id',
        body:
          "const users = [{ id: 1, email: 'a@example.com', name: 'A' }]; const res = handleCreateUser({ body: { email: 'b@example.com', name: 'B' } }, users); assertEqual(res, { status: 201, body: { id: 2, email: 'b@example.com', name: 'B' } }); assertEqual(users.length, 2);",
      },
      {
        name: 'rejects invalid input without mutating',
        body:
          "const users = []; const res = handleCreateUser({ body: { email: 'bad', name: '' } }, users); assertEqual(res.status, 400); assertEqual(users, []); assertEqual(res.body.error, 'validation_error');",
      },
      {
        name: 'rejects duplicate email',
        body:
          "const users = [{ id: 1, email: 'a@example.com', name: 'A' }]; assertEqual(handleCreateUser({ body: { email: 'a@example.com', name: 'Other' } }, users), { status: 409, body: { error: 'conflict', message: 'email already exists' } }); assertEqual(users.length, 1);",
      },
    ],
    reference:
      "function handleCreateUser(req, users) {\n" +
      "  const body = (req && req.body) || {};\n" +
      "  const errors = [];\n" +
      "  if (typeof body.email !== 'string' || !body.email.includes('@')) errors.push({ field: 'email', message: 'valid email required' });\n" +
      "  if (typeof body.name !== 'string' || body.name.trim() === '') errors.push({ field: 'name', message: 'name required' });\n" +
      "  if (errors.length) return { status: 400, body: { error: 'validation_error', details: errors } };\n" +
      "  if (users.some((user) => user.email === body.email)) return { status: 409, body: { error: 'conflict', message: 'email already exists' } };\n" +
      "  const nextId = users.reduce((max, user) => Math.max(max, user.id), 0) + 1;\n" +
      "  const user = { id: nextId, email: body.email, name: body.name };\n" +
      "  users.push(user);\n" +
      "  return { status: 201, body: user };\n" +
      "}\n",
  },
  {
    problemId: 'api-pagination',
    title: 'Cursor Pagination',
    language: 'js',
    starter:
      'function paginate(items, opts) {\n  // return { items: <page>, nextCursor: <number|null> }\n  // opts = { cursor = 0, limit = 10 }\n}\n',
    tests: [
      {
        name: 'first page returns the cursor for the next page',
        body:
          "const r = paginate([1,2,3,4,5], { limit: 2 }); assertEqual(r.items, [1,2], 'items'); assertEqual(r.nextCursor, 2, 'nextCursor');",
      },
      {
        name: 'middle page advances from the cursor',
        body:
          "const r = paginate([1,2,3,4,5], { cursor: 2, limit: 2 }); assertEqual(r.items, [3,4]); assertEqual(r.nextCursor, 4);",
      },
      {
        name: 'last page returns null cursor',
        body:
          "const r = paginate([1,2,3,4,5], { cursor: 4, limit: 2 }); assertEqual(r.items, [5]); assertEqual(r.nextCursor, null, 'no more pages');",
      },
    ],
    reference:
      'function paginate(items, opts) {\n' +
      '  const cursor = (opts && opts.cursor) || 0;\n' +
      '  const limit = (opts && opts.limit) || 10;\n' +
      '  const page = items.slice(cursor, cursor + limit);\n' +
      '  const next = cursor + limit < items.length ? cursor + limit : null;\n' +
      '  return { items: page, nextCursor: next };\n' +
      '}\n',
  },
  {
    problemId: 'security-rate-limit',
    title: 'Fixed-Window Rate Limiter',
    language: 'js',
    starter:
      'function rateLimit(times, limit, windowMs) {\n  // times: ascending request timestamps for one key\n  // return an array of booleans: was each request allowed?\n}\n',
    tests: [
      {
        name: 'allows up to the limit within a window',
        body: "assertEqual(rateLimit([0,1,2,3], 2, 1000), [true,true,false,false]);",
      },
      {
        name: 'resets when the window rolls over',
        body: "assertEqual(rateLimit([0,500,1000,1500], 1, 1000), [true,false,true,false]);",
      },
      {
        name: 'handles no requests',
        body: "assertEqual(rateLimit([], 5, 1000), []);",
      },
    ],
    reference:
      'function rateLimit(times, limit, windowMs) {\n' +
      '  const out = [];\n' +
      '  let start = null, count = 0;\n' +
      '  for (const t of times) {\n' +
      '    if (start === null || t - start >= windowMs) { start = t; count = 0; }\n' +
      '    count++;\n' +
      '    out.push(count <= limit);\n' +
      '  }\n' +
      '  return out;\n' +
      '}\n',
  },
  {
    problemId: 'internet-query-parser',
    title: 'Parse A Query String',
    language: 'js',
    starter:
      "function parseQuery(qs) {\n  // Return an object of decoded key/value pairs.\n  // Example: 'a=1&b=2' -> { a: '1', b: '2' }\n  // Example: '' -> {}\n}\n",
    tests: [
      {
        name: 'parses simple pairs',
        body: "assertEqual(parseQuery('a=1&b=2'), { a: '1', b: '2' });",
      },
      {
        name: 'percent-decodes values',
        body: "assertEqual(parseQuery('q=hello%20world'), { q: 'hello world' });",
      },
      {
        name: 'empty string is an empty object',
        body: "assertEqual(parseQuery(''), {});",
      },
    ],
    reference:
      'function parseQuery(qs) {\n' +
      '  const out = {};\n' +
      '  if (!qs) return out;\n' +
      "  for (const pair of qs.split('&')) {\n" +
      '    if (!pair) continue;\n' +
      "    const idx = pair.indexOf('=');\n" +
      '    const k = decodeURIComponent(idx >= 0 ? pair.slice(0, idx) : pair);\n' +
      "    const v = idx >= 0 ? decodeURIComponent(pair.slice(idx + 1)) : '';\n" +
      '    out[k] = v;\n' +
      '  }\n' +
      '  return out;\n' +
      '}\n',
  },
  {
    problemId: 'language-data-shapes',
    title: 'Data Shape Transformer',
    language: 'js',
    starter:
      'function groupEvents(events) {\n  // events: [{ userId: string, type: string }]\n  // return { [userId]: { [type]: count } }\n}\n',
    tests: [
      {
        name: 'groups event counts by user',
        body:
          "const events = [{userId:'u1', type:'login'}, {userId:'u1', type:'click'}, {userId:'u1', type:'login'}]; assertEqual(groupEvents(events), { u1: { login: 2, click: 1 } });",
      },
      {
        name: 'keeps users separate',
        body:
          "const events = [{userId:'u1', type:'login'}, {userId:'u2', type:'login'}]; assertEqual(groupEvents(events), { u1: { login: 1 }, u2: { login: 1 } });",
      },
      {
        name: 'empty input returns empty object',
        body: 'assertEqual(groupEvents([]), {});',
      },
    ],
    reference:
      'function groupEvents(events) {\n' +
      '  const out = {};\n' +
      '  for (const event of events) {\n' +
      '    out[event.userId] ||= {};\n' +
      '    out[event.userId][event.type] = (out[event.userId][event.type] || 0) + 1;\n' +
      '  }\n' +
      '  return out;\n' +
      '}\n',
  },
  {
    problemId: 'sql-join-practice',
    title: 'Join The Mental Model',
    language: 'js',
    starter:
      'function usersWithOrderCounts(users, orders) {\n  // return each user with an orderCount property\n}\n',
    tests: [
      {
        name: 'counts orders for each user',
        body:
          "const users = [{id:1, name:'Ada'}, {id:2, name:'Lin'}]; const orders = [{userId:1}, {userId:1}, {userId:2}]; assertEqual(usersWithOrderCounts(users, orders), [{id:1, name:'Ada', orderCount:2}, {id:2, name:'Lin', orderCount:1}]);",
      },
      {
        name: 'keeps users with zero orders',
        body:
          "assertEqual(usersWithOrderCounts([{id:1}], []), [{id:1, orderCount:0}]);",
      },
      {
        name: 'does not mutate the original user objects',
        body:
          "const users = [{id:1}]; usersWithOrderCounts(users, [{userId:1}]); assertEqual(users, [{id:1}]);",
      },
    ],
    reference:
      'function usersWithOrderCounts(users, orders) {\n' +
      '  const counts = {};\n' +
      '  for (const order of orders) counts[order.userId] = (counts[order.userId] || 0) + 1;\n' +
      '  return users.map((user) => ({ ...user, orderCount: counts[user.id] || 0 }));\n' +
      '}\n',
  },
  {
    problemId: 'api-filter-builder',
    title: 'Filter Builder',
    language: 'js',
    starter:
      'function buildFilters(query) {\n  // support only status, ownerId, and createdAfter\n}\n',
    tests: [
      {
        name: 'keeps whitelisted filters',
        body:
          "assertEqual(buildFilters({ status: 'open', ownerId: 'u1' }), { status: 'open', ownerId: 'u1' });",
      },
      {
        name: 'drops unknown filters',
        body:
          "assertEqual(buildFilters({ status: 'open', admin: 'true', debug: '1' }), { status: 'open' });",
      },
      {
        name: 'omits empty values',
        body:
          "assertEqual(buildFilters({ status: '', ownerId: null, createdAfter: '2026-01-01' }), { createdAfter: '2026-01-01' });",
      },
    ],
    reference:
      'function buildFilters(query) {\n' +
      '  const out = {};\n' +
      "  for (const key of ['status', 'ownerId', 'createdAfter']) {\n" +
      '    if (query[key]) out[key] = query[key];\n' +
      '  }\n' +
      '  return out;\n' +
      '}\n',
  },
  {
    problemId: 'security-token-parser',
    title: 'Bearer Token Parser',
    language: 'js',
    starter:
      'function parseBearer(header) {\n  // return token string or null\n}\n',
    tests: [
      {
        name: 'extracts a valid bearer token',
        body: "assertEqual(parseBearer('Bearer abc123'), 'abc123');",
      },
      {
        name: 'rejects other schemes',
        body: "assertEqual(parseBearer('Basic abc123'), null);",
      },
      {
        name: 'rejects missing or extra token parts',
        body:
          "assertEqual(parseBearer('Bearer'), null); assertEqual(parseBearer('Bearer a b'), null); assertEqual(parseBearer(null), null);",
      },
    ],
    reference:
      'function parseBearer(header) {\n' +
      "  if (typeof header !== 'string') return null;\n" +
      "  const parts = header.split(' ');\n" +
      "  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) return null;\n" +
      '  return parts[1];\n' +
      '}\n',
  },
  {
    problemId: 'architecture-idempotent-worker',
    title: 'Idempotent Worker Handler',
    language: 'js',
    starter:
      'function decideJob(job, maxAttempts) {\n  // return "run", "skip", "retry", or "dead-letter"\n}\n',
    tests: [
      {
        name: 'skips completed jobs',
        body: "assertEqual(decideJob({ completed: true, attempts: 0, lastError: null }, 3), 'skip');",
      },
      {
        name: 'runs new jobs',
        body: "assertEqual(decideJob({ completed: false, attempts: 0, lastError: null }, 3), 'run');",
      },
      {
        name: 'retries failed jobs under the max',
        body: "assertEqual(decideJob({ completed: false, attempts: 2, lastError: 'timeout' }, 3), 'retry');",
      },
      {
        name: 'dead-letters exhausted failures',
        body: "assertEqual(decideJob({ completed: false, attempts: 3, lastError: 'timeout' }, 3), 'dead-letter');",
      },
    ],
    reference:
      'function decideJob(job, maxAttempts) {\n' +
      "  if (job.completed) return 'skip';\n" +
      "  if (!job.lastError) return 'run';\n" +
      "  if (job.attempts >= maxAttempts) return 'dead-letter';\n" +
      "  return 'retry';\n" +
      '}\n',
  },
]

export const specs: GradeSpec[] = [...coreSpecs, ...backendSpecs, ...frameworkSpecs]
