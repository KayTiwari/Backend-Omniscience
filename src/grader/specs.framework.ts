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
  {
    problemId: 'nodejs-mastery-24-metrics-for-apis',
    title: 'HTTP Metric Labels',
    language: 'js',
    starter:
      "function metricLabels(method, route, status) {\n  // return stable low-cardinality metric labels\n}\n",
    tests: [
      {
        name: 'normalizes method and status class',
        body: "assertEqual(metricLabels('get', '/users/:id', 200), { method: 'GET', route: '/users/:id', statusClass: '2xx' });",
      },
      {
        name: 'does not use raw ids in route labels',
        body: "assertEqual(metricLabels('POST', '/projects/:id/invites', 404), { method: 'POST', route: '/projects/:id/invites', statusClass: '4xx' });",
      },
    ],
    reference:
      "function metricLabels(method, route, status) {\n" +
      "  return { method: method.toUpperCase(), route, statusClass: Math.floor(status / 100) + 'xx' };\n" +
      "}\n",
  },
  {
    problemId: 'nodejs-mastery-27-testing-routes',
    title: 'Route Test Matrix',
    language: 'js',
    starter:
      "function routeTestMatrix(routeName) {\n  // return common API route test names\n}\n",
    tests: [
      {
        name: 'includes success and failure branches',
        body: "assertEqual(routeTestMatrix('create user'), ['create user success', 'create user validation failure', 'create user auth failure', 'create user not found or conflict']);",
      },
    ],
    reference:
      "function routeTestMatrix(routeName) {\n" +
      "  return [routeName + ' success', routeName + ' validation failure', routeName + ' auth failure', routeName + ' not found or conflict'];\n" +
      "}\n",
  },
  {
    problemId: 'nodejs-mastery-31-queues-and-workers',
    title: 'Retry Or Dead Letter',
    language: 'js',
    starter:
      "function nextJobState(job, maxAttempts) {\n  // return 'retry', 'dead-letter', or 'done'\n}\n",
    tests: [
      {
        name: 'done jobs stay done',
        body: "assertEqual(nextJobState({ status: 'done', attempts: 1 }, 3), 'done');",
      },
      {
        name: 'failed jobs retry before max',
        body: "assertEqual(nextJobState({ status: 'failed', attempts: 2 }, 3), 'retry');",
      },
      {
        name: 'failed jobs dead letter at max',
        body: "assertEqual(nextJobState({ status: 'failed', attempts: 3 }, 3), 'dead-letter');",
      },
    ],
    reference:
      "function nextJobState(job, maxAttempts) {\n" +
      "  if (job.status === 'done') return 'done';\n" +
      "  return job.attempts >= maxAttempts ? 'dead-letter' : 'retry';\n" +
      "}\n",
  },
  {
    problemId: 'nodejs-mastery-32-graceful-shutdown',
    title: 'Shutdown Step Order',
    language: 'js',
    starter:
      "function shutdownSteps(hasQueue) {\n  // return ordered shutdown steps\n}\n",
    tests: [
      {
        name: 'orders web shutdown safely',
        body: "assertEqual(shutdownSteps(false), ['stop-accepting-requests', 'drain-inflight', 'close-db-pool', 'exit']);",
      },
      {
        name: 'includes worker drain when queue exists',
        body: "assertEqual(shutdownSteps(true), ['stop-accepting-requests', 'pause-workers', 'drain-inflight', 'close-db-pool', 'exit']);",
      },
    ],
    reference:
      "function shutdownSteps(hasQueue) {\n" +
      "  const steps = ['stop-accepting-requests'];\n" +
      "  if (hasQueue) steps.push('pause-workers');\n" +
      "  steps.push('drain-inflight', 'close-db-pool', 'exit');\n" +
      "  return steps;\n" +
      "}\n",
  },
  {
    problemId: 'nodejs-mastery-43-caching-in-node-apis',
    title: 'Cache Key Builder',
    language: 'js',
    starter:
      "function productCacheKey(productId, version) {\n  // include namespace and version\n}\n",
    tests: [
      {
        name: 'builds versioned product key',
        body: "assertEqual(productCacheKey(42, 'v3'), 'product:v3:42');",
      },
      {
        name: 'rejects missing id',
        body: "let ok = false; try { productCacheKey('', 'v1'); } catch { ok = true; } assert(ok);",
      },
    ],
    reference:
      "function productCacheKey(productId, version) {\n" +
      "  if (!productId) throw new Error('product id required');\n" +
      "  return `product:${version}:${productId}`;\n" +
      "}\n",
  },
  {
    problemId: 'python-mastery-08-exceptions-and-error-boundaries',
    title: 'Domain Error To API Error',
    language: 'js',
    starter:
      "function domainErrorToApi(err) {\n  // map known domain codes to HTTP status and body\n}\n",
    tests: [
      {
        name: 'maps validation domain error',
        body: "assertEqual(domainErrorToApi({ code: 'INVALID_EMAIL', message: 'invalid email' }), { status: 400, body: { error: { code: 'INVALID_EMAIL', message: 'invalid email' } } });",
      },
      {
        name: 'hides unknown errors',
        body: "assertEqual(domainErrorToApi({ code: 'DB_DOWN', message: 'secret' }), { status: 500, body: { error: { code: 'INTERNAL', message: 'Internal server error' } } });",
      },
    ],
    reference:
      "function domainErrorToApi(err) {\n" +
      "  if (err.code === 'INVALID_EMAIL') return { status: 400, body: { error: { code: err.code, message: err.message } } };\n" +
      "  return { status: 500, body: { error: { code: 'INTERNAL', message: 'Internal server error' } } };\n" +
      "}\n",
  },
  {
    problemId: 'python-mastery-11-decorators-for-cross-cutting-behavior',
    title: 'Timing Log Envelope',
    language: 'js',
    starter:
      "function timingLog(name, startedMs, endedMs, ok) {\n  // return structured timing log object\n}\n",
    tests: [
      {
        name: 'records duration and success',
        body: "assertEqual(timingLog('sendEmail', 100, 175, true), { name: 'sendEmail', durationMs: 75, ok: true });",
      },
    ],
    reference:
      "function timingLog(name, startedMs, endedMs, ok) {\n" +
      "  return { name, durationMs: endedMs - startedMs, ok };\n" +
      "}\n",
  },
  {
    problemId: 'python-mastery-15-asyncio-fundamentals',
    title: 'Async Gather Result Envelope',
    language: 'js',
    starter:
      "function gatherEnvelope(results) {\n  // results contain { ok, value?, error? }; return successes and errors\n}\n",
    tests: [
      {
        name: 'splits success values and errors',
        body: "assertEqual(gatherEnvelope([{ ok: true, value: 'a' }, { ok: false, error: 'timeout' }]), { values: ['a'], errors: ['timeout'] });",
      },
    ],
    reference:
      "function gatherEnvelope(results) {\n" +
      "  return { values: results.filter((r) => r.ok).map((r) => r.value), errors: results.filter((r) => !r.ok).map((r) => r.error) };\n" +
      "}\n",
  },
  {
    problemId: 'python-mastery-31-celery-rq-background-jobs',
    title: 'Idempotent Job Claim',
    language: 'js',
    starter:
      "function claimJob(processedKeys, key) {\n  // return { claimed, processedKeys }\n}\n",
    tests: [
      {
        name: 'claims unseen key',
        body: "assertEqual(claimJob(['a'], 'b'), { claimed: true, processedKeys: ['a', 'b'] });",
      },
      {
        name: 'rejects duplicate key',
        body: "assertEqual(claimJob(['a'], 'a'), { claimed: false, processedKeys: ['a'] });",
      },
    ],
    reference:
      "function claimJob(processedKeys, key) {\n" +
      "  if (processedKeys.includes(key)) return { claimed: false, processedKeys };\n" +
      "  return { claimed: true, processedKeys: [...processedKeys, key] };\n" +
      "}\n",
  },
  {
    problemId: 'python-mastery-43-health-checks',
    title: 'Readiness Decision',
    language: 'js',
    starter:
      "function readiness(dependencies) {\n  // dependencies: [{ name, ok }]\n}\n",
    tests: [
      {
        name: 'ready when all dependencies are ok',
        body: "assertEqual(readiness([{ name: 'db', ok: true }, { name: 'redis', ok: true }]), { ready: true, failed: [] });",
      },
      {
        name: 'not ready when dependency fails',
        body: "assertEqual(readiness([{ name: 'db', ok: false }, { name: 'redis', ok: true }]), { ready: false, failed: ['db'] });",
      },
    ],
    reference:
      "function readiness(dependencies) {\n" +
      "  const failed = dependencies.filter((dep) => !dep.ok).map((dep) => dep.name);\n" +
      "  return { ready: failed.length === 0, failed };\n" +
      "}\n",
  },
  {
    problemId: 'django-mastery-09-filtering-and-managers',
    title: 'Active QuerySet Filter',
    language: 'js',
    starter:
      "function activeRows(rows) {\n  // return rows where isActive is true and deletedAt is null/undefined\n}\n",
    tests: [
      {
        name: 'filters active non-deleted rows',
        body: "assertEqual(activeRows([{ id: 1, isActive: true }, { id: 2, isActive: false }, { id: 3, isActive: true, deletedAt: 'x' }]), [{ id: 1, isActive: true }]);",
      },
    ],
    reference:
      "function activeRows(rows) {\n" +
      "  return rows.filter((row) => row.isActive === true && row.deletedAt == null);\n" +
      "}\n",
  },
  {
    problemId: 'django-mastery-10-select-related-vs-prefetch-related',
    title: 'Eager Loading Choice',
    language: 'js',
    starter:
      "function eagerLoadingFor(relationType) {\n  // one-to-one/many-to-one -> select_related; many-to-many/reverse -> prefetch_related\n}\n",
    tests: [
      {
        name: 'chooses select_related for singular relationships',
        body: "assertEqual(eagerLoadingFor('foreign-key'), 'select_related'); assertEqual(eagerLoadingFor('one-to-one'), 'select_related');",
      },
      {
        name: 'chooses prefetch_related for plural relationships',
        body: "assertEqual(eagerLoadingFor('many-to-many'), 'prefetch_related'); assertEqual(eagerLoadingFor('reverse-foreign-key'), 'prefetch_related');",
      },
    ],
    reference:
      "function eagerLoadingFor(relationType) {\n" +
      "  return relationType === 'foreign-key' || relationType === 'one-to-one' ? 'select_related' : 'prefetch_related';\n" +
      "}\n",
  },
  {
    problemId: 'django-mastery-15-zero-downtime-migrations',
    title: 'Expand Contract Steps',
    language: 'js',
    starter:
      "function expandContractSteps(fieldName) {\n  // return safe rollout steps for required field\n}\n",
    tests: [
      {
        name: 'returns safe migration sequence',
        body: "assertEqual(expandContractSteps('slug'), ['add nullable slug', 'deploy writer for slug', 'backfill slug in batches', 'validate slug constraint', 'enforce slug not null', 'remove fallback code']);",
      },
    ],
    reference:
      "function expandContractSteps(fieldName) {\n" +
      "  return [`add nullable ${fieldName}`, `deploy writer for ${fieldName}`, `backfill ${fieldName} in batches`, `validate ${fieldName} constraint`, `enforce ${fieldName} not null`, 'remove fallback code'];\n" +
      "}\n",
  },
  {
    problemId: 'django-mastery-34-testing-django-apis',
    title: 'Permission Test Matrix',
    language: 'js',
    starter:
      "function permissionCases(action) {\n  // return anonymous, non-member, member, staff cases\n}\n",
    tests: [
      {
        name: 'creates standard permission cases',
        body: "assertEqual(permissionCases('update project'), ['anonymous cannot update project', 'non-member cannot update project', 'member can update project', 'staff can update project']);",
      },
    ],
    reference:
      "function permissionCases(action) {\n" +
      "  return [`anonymous cannot ${action}`, `non-member cannot ${action}`, `member can ${action}`, `staff can ${action}`];\n" +
      "}\n",
  },
  {
    problemId: 'django-mastery-35-performance-query-counts',
    title: 'Query Count Budget',
    language: 'js',
    starter:
      "function queryCountOk(actual, budget) {\n  // return { ok, overBy }\n}\n",
    tests: [
      {
        name: 'passes within budget',
        body: "assertEqual(queryCountOk(3, 5), { ok: true, overBy: 0 });",
      },
      {
        name: 'reports over budget',
        body: "assertEqual(queryCountOk(101, 3), { ok: false, overBy: 98 });",
      },
    ],
    reference:
      "function queryCountOk(actual, budget) {\n" +
      "  return { ok: actual <= budget, overBy: Math.max(0, actual - budget) };\n" +
      "}\n",
  },
  {
    problemId: 'node-fundamentals-01-sum-with-for-loop',
    title: 'Sum With A For Loop',
    language: 'js',
    starter: "function sumNumbers(nums) {\n  // use a for loop and return the total\n}\n",
    tests: [
      { name: 'sums positive numbers', body: 'assertEqual(sumNumbers([2, 3, 5]), 10);' },
      { name: 'handles empty arrays and negatives', body: 'assertEqual(sumNumbers([]), 0); assertEqual(sumNumbers([-2, 5]), 3);' },
    ],
    reference: "function sumNumbers(nums) {\n  let total = 0;\n  for (let i = 0; i < nums.length; i++) total += nums[i];\n  return total;\n}\n",
  },
  {
    problemId: 'node-fundamentals-02-count-even-numbers',
    title: 'Count Even Numbers',
    language: 'js',
    starter: "function countEvens(nums) {\n  // count numbers divisible by 2\n}\n",
    tests: [
      { name: 'counts even values', body: 'assertEqual(countEvens([1, 2, 4, 7]), 2);' },
      { name: 'handles zero and negatives', body: 'assertEqual(countEvens([0, -2, -3]), 2);' },
    ],
    reference: "function countEvens(nums) {\n  let count = 0;\n  for (const n of nums) if (n % 2 === 0) count++;\n  return count;\n}\n",
  },
  {
    problemId: 'node-fundamentals-03-while-countdown',
    title: 'While Countdown',
    language: 'js',
    starter: "function countdown(n) {\n  // return [n, n-1, ... 1]\n}\n",
    tests: [
      { name: 'counts down from n', body: 'assertEqual(countdown(4), [4, 3, 2, 1]);' },
      { name: 'non-positive values return empty array', body: 'assertEqual(countdown(0), []); assertEqual(countdown(-2), []);' },
    ],
    reference: "function countdown(n) {\n  const out = [];\n  while (n > 0) out.push(n--);\n  return out;\n}\n",
  },
  {
    problemId: 'node-fundamentals-04-map-user-names',
    title: 'Map User Names',
    language: 'js',
    starter: "function userNames(users) {\n  // return each user's name\n}\n",
    tests: [
      { name: 'maps names in order', body: "assertEqual(userNames([{ name: 'Ada' }, { name: 'Lin' }]), ['Ada', 'Lin']);" },
      { name: 'empty input returns empty output', body: 'assertEqual(userNames([]), []);' },
    ],
    reference: "function userNames(users) {\n  return users.map((user) => user.name);\n}\n",
  },
  {
    problemId: 'node-fundamentals-05-filter-active-users',
    title: 'Filter Active Users',
    language: 'js',
    starter: "function activeUsers(users) {\n  // return users where active is true\n}\n",
    tests: [
      { name: 'filters active users', body: "assertEqual(activeUsers([{ id: 1, active: true }, { id: 2, active: false }]), [{ id: 1, active: true }]);" },
      { name: 'requires true, not truthy', body: "assertEqual(activeUsers([{ id: 1, active: 1 }, { id: 2, active: true }]), [{ id: 2, active: true }]);" },
    ],
    reference: "function activeUsers(users) {\n  return users.filter((user) => user.active === true);\n}\n",
  },
  {
    problemId: 'node-fundamentals-06-find-by-id',
    title: 'Find By ID',
    language: 'js',
    starter: "function findById(items, id) {\n  // return matching item or null\n}\n",
    tests: [
      { name: 'finds matching item', body: "assertEqual(findById([{ id: 'a' }, { id: 'b' }], 'b'), { id: 'b' });" },
      { name: 'returns null when missing', body: "assertEqual(findById([{ id: 'a' }], 'x'), null);" },
    ],
    reference: "function findById(items, id) {\n  return items.find((item) => item.id === id) || null;\n}\n",
  },
  {
    problemId: 'node-fundamentals-07-count-by-status',
    title: 'Count By Status',
    language: 'js',
    starter: "function countByStatus(rows) {\n  // return { status: count }\n}\n",
    tests: [
      { name: 'counts statuses', body: "assertEqual(countByStatus([{ status: 'open' }, { status: 'open' }, { status: 'done' }]), { open: 2, done: 1 });" },
      { name: 'empty rows return empty object', body: 'assertEqual(countByStatus([]), {});' },
    ],
    reference: "function countByStatus(rows) {\n  const counts = {};\n  for (const row of rows) counts[row.status] = (counts[row.status] || 0) + 1;\n  return counts;\n}\n",
  },
  {
    problemId: 'node-fundamentals-08-safe-json-parse',
    title: 'Safe JSON Parse',
    language: 'js',
    starter: "function safeJsonParse(text) {\n  // return { ok: true, value } or { ok: false, error: 'invalid json' }\n}\n",
    tests: [
      { name: 'parses valid json', body: "assertEqual(safeJsonParse('{\"a\":1}'), { ok: true, value: { a: 1 } });" },
      { name: 'returns controlled failure', body: "assertEqual(safeJsonParse('{bad'), { ok: false, error: 'invalid json' });" },
    ],
    reference: "function safeJsonParse(text) {\n  try { return { ok: true, value: JSON.parse(text) }; }\n  catch { return { ok: false, error: 'invalid json' }; }\n}\n",
  },
  {
    problemId: 'node-fundamentals-09-require-fields',
    title: 'Require Fields',
    language: 'js',
    starter: "function requireFields(obj, fields) {\n  // return missing field names\n}\n",
    tests: [
      { name: 'returns missing fields', body: "assertEqual(requireFields({ email: 'a@b.com' }, ['email', 'name']), ['name']);" },
      { name: 'treats null and undefined as missing', body: "assertEqual(requireFields({ a: null, b: undefined, c: 0 }, ['a', 'b', 'c']), ['a', 'b']);" },
    ],
    reference: "function requireFields(obj, fields) {\n  return fields.filter((field) => obj[field] == null);\n}\n",
  },
  {
    problemId: 'node-fundamentals-10-normalize-email',
    title: 'Normalize Email',
    language: 'js',
    starter: "function normalizeEmail(email) {\n  // trim and lowercase\n}\n",
    tests: [
      { name: 'normalizes whitespace and case', body: "assertEqual(normalizeEmail(' Ada@Example.COM '), 'ada@example.com');" },
      { name: 'keeps already-normal input', body: "assertEqual(normalizeEmail('a@b.com'), 'a@b.com');" },
    ],
    reference: "function normalizeEmail(email) {\n  return email.trim().toLowerCase();\n}\n",
  },
  {
    problemId: 'node-fundamentals-11-slug-from-title',
    title: 'Slug From Title',
    language: 'js',
    starter: "function slugFromTitle(title) {\n  // lowercase, hyphenate, strip edge hyphens\n}\n",
    tests: [
      { name: 'creates url-safe slug', body: "assertEqual(slugFromTitle(' Hello, API World! '), 'hello-api-world');" },
      { name: 'collapses repeated punctuation', body: "assertEqual(slugFromTitle('Node---Streams'), 'node-streams');" },
    ],
    reference: "function slugFromTitle(title) {\n  return title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');\n}\n",
  },
  {
    problemId: 'node-fundamentals-12-parse-integer-param',
    title: 'Parse Integer Param',
    language: 'js',
    starter: "function parsePositiveInt(value) {\n  // return positive integer or null\n}\n",
    tests: [
      { name: 'parses positive integer strings', body: "assertEqual(parsePositiveInt('42'), 42);" },
      { name: 'rejects zero, decimals, and junk', body: "assertEqual(parsePositiveInt('0'), null); assertEqual(parsePositiveInt('4.2'), null); assertEqual(parsePositiveInt('abc'), null);" },
    ],
    reference: "function parsePositiveInt(value) {\n  if (!/^\\d+$/.test(String(value))) return null;\n  const n = Number(value);\n  return Number.isInteger(n) && n > 0 ? n : null;\n}\n",
  },
  {
    problemId: 'node-fundamentals-13-build-query-string',
    title: 'Build Query String',
    language: 'js',
    starter: "function toQueryString(params) {\n  // encode non-null params\n}\n",
    tests: [
      { name: 'encodes keys and values', body: "assertEqual(toQueryString({ q: 'hello world', page: 2 }), 'q=hello%20world&page=2');" },
      { name: 'skips nullish values', body: "assertEqual(toQueryString({ a: 1, b: null, c: undefined }), 'a=1');" },
    ],
    reference: "function toQueryString(params) {\n  return Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(String(v))).join('&');\n}\n",
  },
  {
    problemId: 'node-fundamentals-14-read-header-case-insensitive',
    title: 'Read Header Case-Insensitive',
    language: 'js',
    starter: "function getHeader(headers, name) {\n  // return matching header value regardless of case\n}\n",
    tests: [
      { name: 'reads mixed-case header', body: "assertEqual(getHeader({ 'Content-Type': 'application/json' }, 'content-type'), 'application/json');" },
      { name: 'returns undefined when absent', body: "assertEqual(getHeader({ Accept: 'json' }, 'authorization'), undefined);" },
    ],
    reference: "function getHeader(headers, name) {\n  const target = name.toLowerCase();\n  for (const key of Object.keys(headers)) if (key.toLowerCase() === target) return headers[key];\n  return undefined;\n}\n",
  },
  {
    problemId: 'node-fundamentals-15-basic-auth-parser',
    title: 'Basic Auth Parser',
    language: 'js',
    starter: "function parseBasicAuth(header) {\n  // Basic base64(username:password) -> { username, password }\n}\n",
    tests: [
      { name: 'parses basic credentials', body: "assertEqual(parseBasicAuth('Basic YWRhOnNlY3JldA=='), { username: 'ada', password: 'secret' });" },
      { name: 'rejects missing or non-basic header', body: "assertEqual(parseBasicAuth('Bearer token'), null); assertEqual(parseBasicAuth(''), null);" },
    ],
    reference: "function parseBasicAuth(header) {\n  if (!header || !header.startsWith('Basic ')) return null;\n  const decoded = atob(header.slice(6));\n  const index = decoded.indexOf(':');\n  if (index < 0) return null;\n  return { username: decoded.slice(0, index), password: decoded.slice(index + 1) };\n}\n",
  },
  {
    problemId: 'node-fundamentals-16-error-envelope',
    title: 'Error Envelope',
    language: 'js',
    starter: "function makeError(status, code, message, requestId) {\n  // return stable API error object\n}\n",
    tests: [
      { name: 'builds stable error object', body: "assertEqual(makeError(400, 'VALIDATION', 'bad input', 'r1'), { error: { status: 400, code: 'VALIDATION', message: 'bad input', requestId: 'r1' } });" },
    ],
    reference: "function makeError(status, code, message, requestId) {\n  return { error: { status, code, message, requestId } };\n}\n",
  },
  {
    problemId: 'node-fundamentals-17-compose-middleware',
    title: 'Compose Middleware',
    language: 'js',
    starter: "function runMiddleware(req, middleware) {\n  // run each (req, next) middleware in order and return req\n}\n",
    tests: [
      {
        name: 'runs middleware in order',
        body: "const req = runMiddleware({}, [(req, next) => { req.steps = ['auth']; next(); }, (req, next) => { req.steps.push('route'); next(); }]); assertEqual(req, { steps: ['auth', 'route'] });",
      },
      {
        name: 'stops when next is not called',
        body: "const req = runMiddleware({}, [(req) => { req.blocked = true; }, (req, next) => { req.after = true; next(); }]); assertEqual(req, { blocked: true });",
      },
    ],
    reference:
      "function runMiddleware(req, middleware) {\n" +
      "  let index = 0;\n" +
      "  function next() {\n" +
      "    const fn = middleware[index++];\n" +
      "    if (fn) fn(req, next);\n" +
      "  }\n" +
      "  next();\n" +
      "  return req;\n" +
      "}\n",
  },
  {
    problemId: 'node-fundamentals-18-promise-all-settled-summary',
    title: 'Promise Results Summary',
    language: 'js',
    starter: "function summarizeSettled(results) {\n  // count fulfilled/rejected and collect fulfilled values\n}\n",
    tests: [
      { name: 'summarizes settled results', body: "assertEqual(summarizeSettled([{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: 'x' }]), { fulfilled: 1, rejected: 1, values: [1] });" },
    ],
    reference: "function summarizeSettled(results) {\n  return { fulfilled: results.filter((r) => r.status === 'fulfilled').length, rejected: results.filter((r) => r.status === 'rejected').length, values: results.filter((r) => r.status === 'fulfilled').map((r) => r.value) };\n}\n",
  },
  {
    problemId: 'node-fundamentals-19-timeout-race-shape',
    title: 'Timeout Result Shape',
    language: 'js',
    starter: "function timeoutResult(ms) {\n  // return a predictable timeout error shape\n}\n",
    tests: [
      { name: 'returns stable timeout shape', body: "assertEqual(timeoutResult(250), { timeoutMs: 250, error: 'timeout' });" },
      { name: 'preserves caller-provided duration', body: "assertEqual(timeoutResult(5000), { timeoutMs: 5000, error: 'timeout' });" },
    ],
    reference: "function timeoutResult(ms) {\n  return { timeoutMs: ms, error: 'timeout' };\n}\n",
  },
  {
    problemId: 'node-fundamentals-20-retryable-status',
    title: 'Retryable Status',
    language: 'js',
    starter: "function isRetryableStatus(status) {\n  // true for 408, 429, and 5xx\n}\n",
    tests: [
      { name: 'allows transient statuses', body: 'assertEqual(isRetryableStatus(408), true); assertEqual(isRetryableStatus(429), true); assertEqual(isRetryableStatus(503), true);' },
      { name: 'rejects client and success statuses', body: 'assertEqual(isRetryableStatus(400), false); assertEqual(isRetryableStatus(200), false);' },
    ],
    reference: "function isRetryableStatus(status) {\n  return status === 408 || status === 429 || status >= 500;\n}\n",
  },
  {
    problemId: 'node-fundamentals-21-buffer-byte-length',
    title: 'Byte Length',
    language: 'js',
    starter: "function byteLength(value) {\n  // return the UTF-8 byte length of a string\n}\n",
    tests: [
      { name: 'counts ascii bytes', body: "assertEqual(byteLength('hello'), 5);" },
      { name: 'counts utf-8 bytes, not characters', body: "assertEqual(byteLength('é'), 2);" },
    ],
    reference: "function byteLength(value) {\n  return new TextEncoder().encode(value).length;\n}\n",
  },
  {
    problemId: 'node-fundamentals-22-chunk-array-for-batches',
    title: 'Chunk Array For Batches',
    language: 'js',
    starter: "function chunkForBatches(items, size) {\n  // split into ordered batches\n}\n",
    tests: [
      { name: 'chunks into batches', body: 'assertEqual(chunkForBatches([1,2,3,4,5], 2), [[1,2],[3,4],[5]]);' },
      { name: 'empty input returns empty array', body: 'assertEqual(chunkForBatches([], 3), []);' },
    ],
    reference: "function chunkForBatches(items, size) {\n  const out = [];\n  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));\n  return out;\n}\n",
  },
  {
    problemId: 'node-fundamentals-23-idempotency-key',
    title: 'Idempotency Key',
    language: 'js',
    starter: "function idempotencyKey(method, path, bodyHash) {\n  // return METHOD:path:bodyHash with a normalized method\n}\n",
    tests: [
      { name: 'builds stable key', body: "assertEqual(idempotencyKey('POST', '/orders', 'abc'), 'POST:/orders:abc');" },
      { name: 'normalizes method casing', body: "assertEqual(idempotencyKey('post', '/orders', 'abc'), 'POST:/orders:abc');" },
    ],
    reference: "function idempotencyKey(method, path, bodyHash) {\n  return `${method.toUpperCase()}:${path}:${bodyHash}`;\n}\n",
  },
  {
    problemId: 'node-fundamentals-24-redact-secret-fields',
    title: 'Redact Secret Fields',
    language: 'js',
    starter: "function redactSecrets(obj) {\n  // copy object and redact password/token/secret fields\n}\n",
    tests: [
      { name: 'redacts sensitive fields', body: "assertEqual(redactSecrets({ email: 'a', password: 'pw', token: 't', secret: 's' }), { email: 'a', password: '[redacted]', token: '[redacted]', secret: '[redacted]' });" },
      { name: 'does not mutate original object', body: "const input = { password: 'pw' }; redactSecrets(input); assertEqual(input, { password: 'pw' });" },
    ],
    reference: "function redactSecrets(obj) {\n  const out = { ...obj };\n  for (const key of ['password', 'token', 'secret']) if (key in out) out[key] = '[redacted]';\n  return out;\n}\n",
  },
  {
    problemId: 'node-fundamentals-25-request-log-line',
    title: 'Request Log Line',
    language: 'js',
    starter: "function requestLog(req, res, durationMs) {\n  // return { method, path, status, durationMs }\n}\n",
    tests: [
      {
        name: 'creates structured request log',
        body: "assertEqual(requestLog({ method: 'GET', path: '/health' }, { status: 200 }, 12), { method: 'GET', path: '/health', status: 200, durationMs: 12 });",
      },
      {
        name: 'does not include request body or headers',
        body: "assertEqual(requestLog({ method: 'POST', path: '/login', body: { password: 'pw' } }, { status: 401 }, 44), { method: 'POST', path: '/login', status: 401, durationMs: 44 });",
      },
    ],
    reference:
      "function requestLog(req, res, durationMs) {\n" +
      "  return { method: req.method, path: req.path, status: res.status, durationMs };\n" +
      "}\n",
  },
]
