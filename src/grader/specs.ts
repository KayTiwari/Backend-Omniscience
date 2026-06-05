import type { GradeSpec } from './types'

// Auto-gradable drills. Each is a pure JS function the learner implements; the
// tests assert behavior. Attach a spec to a course problem via `problemId`.
export const specs: GradeSpec[] = [
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
    problemId: 'internet-status-codes',
    title: 'Parse A Query String',
    language: 'js',
    starter:
      "function parseQuery(qs) {\n  // 'a=1&b=2' -> { a: '1', b: '2' }; decode %20; '' -> {}\n}\n",
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
]
