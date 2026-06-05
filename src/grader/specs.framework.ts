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
  {
    problemId: 'nodejs-mastery-12-timers-and-scheduling',
    title: 'Heartbeat Scheduler Plan',
    language: 'js',
    starter:
      "function shouldRunJob(lastRunAtMs, nowMs, intervalMs) {\n  // return true only when enough time has elapsed\n}\n",
    tests: [
      {
        name: 'runs when interval has elapsed',
        body: "assertEqual(shouldRunJob(1000, 7000, 5000), true);",
      },
      {
        name: 'does not run early',
        body: "assertEqual(shouldRunJob(1000, 5999, 5000), false);",
      },
      {
        name: 'runs when there is no prior run',
        body: "assertEqual(shouldRunJob(null, 1000, 5000), true);",
      },
    ],
    reference:
      "function shouldRunJob(lastRunAtMs, nowMs, intervalMs) {\n" +
      "  if (lastRunAtMs == null) return true;\n" +
      "  return nowMs - lastRunAtMs >= intervalMs;\n" +
      "}\n",
  },
  {
    problemId: 'nodejs-mastery-17-authentication-middleware',
    title: 'Bearer Token Parser',
    language: 'js',
    starter:
      "function parseBearer(authorization) {\n  // return token string or null\n}\n",
    tests: [
      {
        name: 'extracts bearer token',
        body: "assertEqual(parseBearer('Bearer abc.def'), 'abc.def');",
      },
      {
        name: 'rejects non-bearer headers',
        body: "assertEqual(parseBearer('Basic xyz'), null); assertEqual(parseBearer(''), null);",
      },
      {
        name: 'trims surrounding whitespace',
        body: "assertEqual(parseBearer('  Bearer token-123  '), 'token-123');",
      },
    ],
    reference:
      "function parseBearer(authorization) {\n" +
      "  const value = String(authorization || '').trim();\n" +
      "  if (!value.startsWith('Bearer ')) return null;\n" +
      "  const token = value.slice('Bearer '.length).trim();\n" +
      "  return token || null;\n" +
      "}\n",
  },
  {
    problemId: 'nodejs-mastery-21-cors-in-express',
    title: 'CORS Allowlist Decision',
    language: 'js',
    starter:
      "function corsDecision(origin, allowedOrigins) {\n  // return { allowed, origin }\n}\n",
    tests: [
      {
        name: 'allows configured origin',
        body: "assertEqual(corsDecision('https://app.example.com', ['https://app.example.com']), { allowed: true, origin: 'https://app.example.com' });",
      },
      {
        name: 'rejects missing or unknown origin',
        body: "assertEqual(corsDecision('https://evil.example', ['https://app.example.com']), { allowed: false, origin: null }); assertEqual(corsDecision('', ['https://app.example.com']), { allowed: false, origin: null });",
      },
    ],
    reference:
      "function corsDecision(origin, allowedOrigins) {\n" +
      "  if (origin && allowedOrigins.includes(origin)) return { allowed: true, origin };\n" +
      "  return { allowed: false, origin: null };\n" +
      "}\n",
  },
  {
    problemId: 'nodejs-mastery-34-configuration-validation',
    title: 'Required Config Keys',
    language: 'js',
    starter:
      "function requireConfig(env, keys) {\n  // return object with required keys or throw listing missing keys\n}\n",
    tests: [
      {
        name: 'returns selected config',
        body: "assertEqual(requireConfig({ A: '1', B: '2', C: '3' }, ['A', 'C']), { A: '1', C: '3' });",
      },
      {
        name: 'throws with missing names',
        body: "let ok = false; try { requireConfig({ A: '1' }, ['A', 'B']); } catch (err) { ok = String(err.message).includes('B'); } assert(ok);",
      },
    ],
    reference:
      "function requireConfig(env, keys) {\n" +
      "  const missing = keys.filter((key) => !env[key]);\n" +
      "  if (missing.length) throw new Error('Missing config: ' + missing.join(', '));\n" +
      "  return Object.fromEntries(keys.map((key) => [key, env[key]]));\n" +
      "}\n",
  },
  {
    problemId: 'nodejs-mastery-41-api-versioning',
    title: 'Versioned Response Mapper',
    language: 'js',
    starter:
      "function mapUserVersion(user, version) {\n  // v1 uses fullName; v2 uses name\n}\n",
    tests: [
      {
        name: 'maps v1 contract',
        body: "assertEqual(mapUserVersion({ id: 7, name: 'Ada' }, 'v1'), { id: 7, fullName: 'Ada' });",
      },
      {
        name: 'maps v2 contract',
        body: "assertEqual(mapUserVersion({ id: 7, name: 'Ada' }, 'v2'), { id: 7, name: 'Ada' });",
      },
    ],
    reference:
      "function mapUserVersion(user, version) {\n" +
      "  if (version === 'v1') return { id: user.id, fullName: user.name };\n" +
      "  return { id: user.id, name: user.name };\n" +
      "}\n",
  },
  {
    problemId: 'python-mastery-17-http-clients',
    title: 'HTTP Timeout Options',
    language: 'js',
    starter:
      "function buildTimeouts(options) {\n  // defaults: connect 1000ms, read 3000ms\n}\n",
    tests: [
      {
        name: 'uses defaults',
        body: "assertEqual(buildTimeouts({}), { connectMs: 1000, readMs: 3000 });",
      },
      {
        name: 'overrides individual values',
        body: "assertEqual(buildTimeouts({ connectMs: 200, readMs: 900 }), { connectMs: 200, readMs: 900 });",
      },
    ],
    reference:
      "function buildTimeouts(options) {\n" +
      "  return { connectMs: options.connectMs ?? 1000, readMs: options.readMs ?? 3000 };\n" +
      "}\n",
  },
  {
    problemId: 'python-mastery-23-transactions-in-python',
    title: 'Transfer Transaction Steps',
    language: 'js',
    starter:
      "function transferSteps(fromId, toId, cents) {\n  // return ordered transaction operation names\n}\n",
    tests: [
      {
        name: 'returns safe transaction order',
        body: "assertEqual(transferSteps('a', 'b', 500), ['begin', 'debit:a:500', 'credit:b:500', 'commit']);",
      },
      {
        name: 'rejects non-positive transfer',
        body: "let ok = false; try { transferSteps('a', 'b', 0); } catch { ok = true; } assert(ok);",
      },
    ],
    reference:
      "function transferSteps(fromId, toId, cents) {\n" +
      "  if (!Number.isInteger(cents) || cents <= 0) throw new Error('invalid amount');\n" +
      "  return ['begin', `debit:${fromId}:${cents}`, `credit:${toId}:${cents}`, 'commit'];\n" +
      "}\n",
  },
  {
    problemId: 'python-mastery-30-mocking-and-fakes',
    title: 'Fake Email Provider',
    language: 'js',
    starter:
      "function makeFakeEmailProvider() {\n  // return { sent, send(to, subject) }\n}\n",
    tests: [
      {
        name: 'records sent emails',
        body: "const fake = makeFakeEmailProvider(); fake.send('a@example.com', 'Hi'); assertEqual(fake.sent, [{ to: 'a@example.com', subject: 'Hi' }]);",
      },
      {
        name: 'keeps separate fake instances isolated',
        body: "const a = makeFakeEmailProvider(); const b = makeFakeEmailProvider(); a.send('x', 'one'); assertEqual(b.sent, []);",
      },
    ],
    reference:
      "function makeFakeEmailProvider() {\n" +
      "  return { sent: [], send(to, subject) { this.sent.push({ to, subject }); } };\n" +
      "}\n",
  },
  {
    problemId: 'python-mastery-36-timezone-handling',
    title: 'Require UTC Timestamp',
    language: 'js',
    starter:
      "function normalizeUtcTimestamp(value) {\n  // accept ISO strings ending in Z, return milliseconds\n}\n",
    tests: [
      {
        name: 'parses utc timestamp',
        body: "assertEqual(normalizeUtcTimestamp('2026-06-05T12:00:00Z'), Date.parse('2026-06-05T12:00:00Z'));",
      },
      {
        name: 'rejects naive timestamp',
        body: "let ok = false; try { normalizeUtcTimestamp('2026-06-05T12:00:00'); } catch { ok = true; } assert(ok);",
      },
    ],
    reference:
      "function normalizeUtcTimestamp(value) {\n" +
      "  if (typeof value !== 'string' || !value.endsWith('Z')) throw new Error('UTC timestamp required');\n" +
      "  const ms = Date.parse(value);\n" +
      "  if (!Number.isFinite(ms)) throw new Error('invalid timestamp');\n" +
      "  return ms;\n" +
      "}\n",
  },
  {
    problemId: 'python-mastery-40-cli-management-commands',
    title: 'Dry Run Flag Parser',
    language: 'js',
    starter:
      "function parseBackfillArgs(argv) {\n  // support --dry-run and --limit=N\n}\n",
    tests: [
      {
        name: 'parses dry run and limit',
        body: "assertEqual(parseBackfillArgs(['--dry-run', '--limit=25']), { dryRun: true, limit: 25 });",
      },
      {
        name: 'uses safe defaults',
        body: "assertEqual(parseBackfillArgs([]), { dryRun: false, limit: 100 });",
      },
    ],
    reference:
      "function parseBackfillArgs(argv) {\n" +
      "  const limitArg = argv.find((arg) => arg.startsWith('--limit='));\n" +
      "  return { dryRun: argv.includes('--dry-run'), limit: limitArg ? Number(limitArg.slice(8)) : 100 };\n" +
      "}\n",
  },
  {
    problemId: 'django-mastery-12-transactions-and-atomic',
    title: 'On Commit Queue',
    language: 'js',
    starter:
      "function transactionPlan(actions) {\n  // send emails after commit, not before\n}\n",
    tests: [
      {
        name: 'moves email side effects after commit',
        body: "assertEqual(transactionPlan(['saveInvite', 'sendEmail']), ['begin', 'saveInvite', 'commit', 'sendEmail']);",
      },
      {
        name: 'keeps non-email actions inside transaction',
        body: "assertEqual(transactionPlan(['saveA', 'saveB']), ['begin', 'saveA', 'saveB', 'commit']);",
      },
    ],
    reference:
      "function transactionPlan(actions) {\n" +
      "  const inside = actions.filter((action) => action !== 'sendEmail');\n" +
      "  const after = actions.filter((action) => action === 'sendEmail');\n" +
      "  return ['begin', ...inside, 'commit', ...after];\n" +
      "}\n",
  },
  {
    problemId: 'django-mastery-20-authorization-patterns',
    title: 'Scoped Project Query',
    language: 'js',
    starter:
      "function visibleProjects(user, projects) {\n  // staff see all; users see projects where memberIds includes user.id\n}\n",
    tests: [
      {
        name: 'staff sees all projects',
        body: "assertEqual(visibleProjects({ id: 1, isStaff: true }, [{ id: 1 }, { id: 2 }]), [{ id: 1 }, { id: 2 }]);",
      },
      {
        name: 'member sees only own projects',
        body: "assertEqual(visibleProjects({ id: 2, isStaff: false }, [{ id: 1, memberIds: [2] }, { id: 2, memberIds: [3] }]), [{ id: 1, memberIds: [2] }]);",
      },
    ],
    reference:
      "function visibleProjects(user, projects) {\n" +
      "  if (user.isStaff) return projects;\n" +
      "  return projects.filter((project) => (project.memberIds || []).includes(user.id));\n" +
      "}\n",
  },
  {
    problemId: 'django-mastery-30-drf-filtering-and-search',
    title: 'Safe Filter Builder',
    language: 'js',
    starter:
      "function buildProjectFilters(query) {\n  // allow only status, ownerId, search\n}\n",
    tests: [
      {
        name: 'keeps allowed filters',
        body: "assertEqual(buildProjectFilters({ status: 'active', ownerId: '7', ignored: 'x' }), { status: 'active', ownerId: 7 });",
      },
      {
        name: 'trims search',
        body: "assertEqual(buildProjectFilters({ search: '  api  ' }), { search: 'api' });",
      },
    ],
    reference:
      "function buildProjectFilters(query) {\n" +
      "  const filters = {};\n" +
      "  if (query.status) filters.status = query.status;\n" +
      "  if (query.ownerId) filters.ownerId = Number(query.ownerId);\n" +
      "  if (query.search && query.search.trim()) filters.search = query.search.trim();\n" +
      "  return filters;\n" +
      "}\n",
  },
  {
    problemId: 'django-mastery-31-drf-error-shapes',
    title: 'DRF Error Normalizer',
    language: 'js',
    starter:
      "function normalizeErrors(errors) {\n  // convert field arrays to [{ field, message }]\n}\n",
    tests: [
      {
        name: 'normalizes field errors',
        body: "assertEqual(normalizeErrors({ email: ['required'], role: ['invalid'] }), [{ field: 'email', message: 'required' }, { field: 'role', message: 'invalid' }]);",
      },
      {
        name: 'handles non field errors',
        body: "assertEqual(normalizeErrors({ non_field_errors: ['bad combo'] }), [{ field: null, message: 'bad combo' }]);",
      },
    ],
    reference:
      "function normalizeErrors(errors) {\n" +
      "  return Object.entries(errors).map(([field, messages]) => ({ field: field === 'non_field_errors' ? null : field, message: messages[0] }));\n" +
      "}\n",
  },
  {
    problemId: 'django-mastery-37-celery-with-django',
    title: 'Idempotent Task Key',
    language: 'js',
    starter:
      "function taskKey(taskName, payload) {\n  // create stable idempotency key from task and payload id\n}\n",
    tests: [
      {
        name: 'builds stable key',
        body: "assertEqual(taskKey('sendInvite', { inviteId: 42 }), 'task:sendInvite:42');",
      },
      {
        name: 'throws without payload id',
        body: "let ok = false; try { taskKey('sendInvite', {}); } catch { ok = true; } assert(ok);",
      },
    ],
    reference:
      "function taskKey(taskName, payload) {\n" +
      "  const id = payload.inviteId || payload.id;\n" +
      "  if (!id) throw new Error('payload id required');\n" +
      "  return `task:${taskName}:${id}`;\n" +
      "}\n",
  },
]
