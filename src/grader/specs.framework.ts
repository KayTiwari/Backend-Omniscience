import type { GradeSpec } from './types.ts'

export const frameworkSpecs: GradeSpec[] = [
  {
    problemId: 'nodejs-mastery-05-environment-and-process-basics',
    title: 'Parse Environment Config',
    language: 'js',
    starter:
      "function parseConfig(env) {\n  // return { port: number, nodeEnv: string }\n  // PORT is required and must be a number; NODE_ENV defaults to 'development'\n}\n",
    tests: [
      {
        name: 'parses required port and default env',
        body: "assertEqual(parseConfig({ PORT: '3000' }), { port: 3000, nodeEnv: 'development' });",
      },
      {
        name: 'uses NODE_ENV when provided',
        body: "assertEqual(parseConfig({ PORT: '8080', NODE_ENV: 'production' }), { port: 8080, nodeEnv: 'production' });",
      },
      {
        name: 'throws on missing or invalid port',
        body: "let ok = false; try { parseConfig({}); } catch { ok = true; } assert(ok, 'missing port should throw'); ok = false; try { parseConfig({ PORT: 'abc' }); } catch { ok = true; } assert(ok, 'invalid port should throw');",
      },
    ],
    reference:
      "function parseConfig(env) {\n" +
      "  const port = Number(env.PORT);\n" +
      "  if (!env.PORT || !Number.isFinite(port)) throw new Error('PORT is required');\n" +
      "  return { port, nodeEnv: env.NODE_ENV || 'development' };\n" +
      "}\n",
  },
  {
    problemId: 'nodejs-mastery-07-express-app-structure',
    title: 'Tiny Router Match',
    language: 'js',
    starter:
      "function matchRoute(routes, method, path) {\n  // routes: [{ method, path, handler }]\n  // return handler or null\n}\n",
    tests: [
      {
        name: 'matches by method and path',
        body: "assertEqual(matchRoute([{ method: 'GET', path: '/health', handler: 'health' }], 'GET', '/health'), 'health');",
      },
      {
        name: 'does not match wrong method',
        body: "assertEqual(matchRoute([{ method: 'POST', path: '/users', handler: 'create' }], 'GET', '/users'), null);",
      },
    ],
    reference:
      "function matchRoute(routes, method, path) {\n" +
      "  const route = routes.find((r) => r.method === method && r.path === path);\n" +
      "  return route ? route.handler : null;\n" +
      "}\n",
  },
  {
    problemId: 'nodejs-mastery-10-error-middleware',
    title: 'Error Envelope',
    language: 'js',
    starter:
      "function errorEnvelope(err, requestId) {\n  // err may have status/code/message. Hide 5xx messages.\n}\n",
    tests: [
      {
        name: 'returns client-safe validation error',
        body: "assertEqual(errorEnvelope({ status: 400, code: 'VALIDATION', message: 'bad email' }, 'r1'), { status: 400, error: { code: 'VALIDATION', message: 'bad email', requestId: 'r1' } });",
      },
      {
        name: 'hides internal messages',
        body: "assertEqual(errorEnvelope({ status: 500, code: 'SQL', message: 'password leaked' }, 'r2'), { status: 500, error: { code: 'INTERNAL', message: 'Internal server error', requestId: 'r2' } });",
      },
    ],
    reference:
      "function errorEnvelope(err, requestId) {\n" +
      "  const status = err.status || 500;\n" +
      "  if (status >= 500) return { status, error: { code: 'INTERNAL', message: 'Internal server error', requestId } };\n" +
      "  return { status, error: { code: err.code || 'ERROR', message: err.message || 'Request failed', requestId } };\n" +
      "}\n",
  },
  {
    problemId: 'nodejs-mastery-22-rate-limiting',
    title: 'Login Key Builder',
    language: 'js',
    starter:
      "function loginLimitKeys(ip, account) {\n  // return separate limiter keys for ip and normalized account\n}\n",
    tests: [
      {
        name: 'normalizes account identifier',
        body: "assertEqual(loginLimitKeys('1.2.3.4', 'Ada@Example.COM'), ['ip:1.2.3.4', 'acct:ada@example.com']);",
      },
      {
        name: 'handles missing account',
        body: "assertEqual(loginLimitKeys('1.2.3.4', ''), ['ip:1.2.3.4']);",
      },
    ],
    reference:
      "function loginLimitKeys(ip, account) {\n" +
      "  const keys = ['ip:' + ip];\n" +
      "  if (account) keys.push('acct:' + account.trim().toLowerCase());\n" +
      "  return keys;\n" +
      "}\n",
  },
  {
    problemId: 'python-mastery-25-configuration-loading',
    title: 'Python Settings Parser Logic',
    language: 'js',
    starter:
      "function parsePythonSettings(env) {\n  // DATABASE_URL required; DEBUG true only for '1' or 'true'\n}\n",
    tests: [
      {
        name: 'parses database and debug',
        body: "assertEqual(parsePythonSettings({ DATABASE_URL: 'postgres://db', DEBUG: 'true' }), { databaseUrl: 'postgres://db', debug: true });",
      },
      {
        name: 'debug defaults false',
        body: "assertEqual(parsePythonSettings({ DATABASE_URL: 'sqlite:///db' }), { databaseUrl: 'sqlite:///db', debug: false });",
      },
      {
        name: 'throws without database url',
        body: "let ok = false; try { parsePythonSettings({}); } catch { ok = true; } assert(ok);",
      },
    ],
    reference:
      "function parsePythonSettings(env) {\n" +
      "  if (!env.DATABASE_URL) throw new Error('DATABASE_URL required');\n" +
      "  return { databaseUrl: env.DATABASE_URL, debug: env.DEBUG === '1' || env.DEBUG === 'true' };\n" +
      "}\n",
  },
  {
    problemId: 'python-mastery-28-testing-with-pytest',
    title: 'Parametrize Cases',
    language: 'js',
    starter:
      "function makeCases(inputs, expected) {\n  // pair each input with matching expected: [{ input, expected }]\n}\n",
    tests: [
      {
        name: 'zips inputs and expected values',
        body: "assertEqual(makeCases(['a', 'b'], [1, 2]), [{ input: 'a', expected: 1 }, { input: 'b', expected: 2 }]);",
      },
      {
        name: 'throws on length mismatch',
        body: "let ok = false; try { makeCases(['a'], [1, 2]); } catch { ok = true; } assert(ok);",
      },
    ],
    reference:
      "function makeCases(inputs, expected) {\n" +
      "  if (inputs.length !== expected.length) throw new Error('mismatch');\n" +
      "  return inputs.map((input, i) => ({ input, expected: expected[i] }));\n" +
      "}\n",
  },
  {
    problemId: 'python-mastery-35-serialization-boundaries',
    title: 'Safe JSON DTO',
    language: 'js',
    starter:
      "function moneyDto(amountCents, currency) {\n  // return stable JSON-safe money representation\n}\n",
    tests: [
      {
        name: 'keeps money precise as integer cents',
        body: "assertEqual(moneyDto(1234, 'usd'), { amountCents: 1234, currency: 'USD' });",
      },
      {
        name: 'rejects fractional cents',
        body: "let ok = false; try { moneyDto(12.5, 'USD'); } catch { ok = true; } assert(ok);",
      },
    ],
    reference:
      "function moneyDto(amountCents, currency) {\n" +
      "  if (!Number.isInteger(amountCents)) throw new Error('amountCents must be integer');\n" +
      "  return { amountCents, currency: currency.toUpperCase() };\n" +
      "}\n",
  },
  {
    problemId: 'django-mastery-07-relationships',
    title: 'Membership Constraint Check',
    language: 'js',
    starter:
      "function canAddMembership(existing, userId, projectId) {\n  // false if that user is already a member of that project\n}\n",
    tests: [
      {
        name: 'rejects duplicate membership',
        body: "assertEqual(canAddMembership([{ userId: 1, projectId: 2 }], 1, 2), false);",
      },
      {
        name: 'allows different user or project',
        body: "assertEqual(canAddMembership([{ userId: 1, projectId: 2 }], 1, 3), true); assertEqual(canAddMembership([{ userId: 1, projectId: 2 }], 9, 2), true);",
      },
    ],
    reference:
      "function canAddMembership(existing, userId, projectId) {\n" +
      "  return !existing.some((m) => m.userId === userId && m.projectId === projectId);\n" +
      "}\n",
  },
  {
    problemId: 'django-mastery-28-drf-permissions',
    title: 'DRF Permission Logic',
    language: 'js',
    starter:
      "function canAccessProject(user, project) {\n  // staff can access all; otherwise user must be a member id\n}\n",
    tests: [
      {
        name: 'staff can access all projects',
        body: "assertEqual(canAccessProject({ id: 1, isStaff: true }, { memberIds: [] }), true);",
      },
      {
        name: 'members can access their projects',
        body: "assertEqual(canAccessProject({ id: 2, isStaff: false }, { memberIds: [2, 3] }), true);",
      },
      {
        name: 'non-members are denied',
        body: "assertEqual(canAccessProject({ id: 4, isStaff: false }, { memberIds: [2, 3] }), false);",
      },
    ],
    reference:
      "function canAccessProject(user, project) {\n" +
      "  return Boolean(user.isStaff || project.memberIds.includes(user.id));\n" +
      "}\n",
  },
  {
    problemId: 'django-mastery-29-drf-pagination',
    title: 'DRF Pagination Shape',
    language: 'js',
    starter:
      "function pageEnvelope(results, count, next, previous) {\n  // return DRF-style pagination envelope\n}\n",
    tests: [
      {
        name: 'returns stable envelope',
        body: "assertEqual(pageEnvelope([1,2], 5, '/p=2', null), { count: 5, next: '/p=2', previous: null, results: [1,2] });",
      },
    ],
    reference:
      "function pageEnvelope(results, count, next, previous) {\n" +
      "  return { count, next, previous, results };\n" +
      "}\n",
  },
]
