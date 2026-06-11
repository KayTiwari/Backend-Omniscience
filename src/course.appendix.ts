import type { Problem, Subject } from './course'
import { glossaryTerms } from './glossary'
import { BookIcon } from './TechIcons'

// The glossary as a reference course: every term rendered as a concept card,
// grouped into topic maps with a flow diagram and the need-to-know facts for
// each area. Definitions come straight from glossary.ts so the appendix can
// never drift out of sync with the inline glossary links.

type AppendixSection = {
  id: string
  title: string
  intro: string
  // Rendered by the prose renderer as a numbered flow chain: the area's map.
  flow?: string
  terms: string[]
  facts: string[]
}

const SECTIONS: AppendixSection[] = [
  {
    id: 'appendix-http',
    title: 'Appendix: HTTP & The Web',
    intro:
      'The vocabulary of the request journey: how a client finds a server, what the two messages contain, and the infrastructure between them.',
    flow: 'URL typed -> DNS resolves -> TCP connects -> TLS encrypts -> request sent -> reverse proxy routes -> server code runs -> response returns',
    terms: ['URL', 'DNS', 'TCP', 'TLS', 'HTTP', 'request', 'response', 'header', 'body', 'query string', 'status code', 'reverse proxy', 'CORS', 'request path'],
    facts: [
      'Status code families: 2xx worked, 3xx moved, 4xx client erred, 5xx server erred.',
      '401 means who are you; 403 means you may not; the difference matters.',
      'GET is safe and idempotent; POST is neither, which is why retried POSTs double-charge.',
      'A blank line separates headers from body in both HTTP messages.',
    ],
  },
  {
    id: 'appendix-api',
    title: 'Appendix: APIs & Services',
    intro:
      'The contract layer: how programs expose work to other programs, and the shapes requests and responses agree on.',
    flow: 'client -> endpoint -> middleware -> validation -> business rule -> service -> response',
    terms: ['API', 'endpoint', 'JSON', 'middleware', 'service', 'service shape', 'business rule', 'validation', 'controller', 'repository', 'config', 'framework'],
    facts: [
      'Paths are plural nouns; the HTTP method is the verb.',
      'Every error response should carry a machine code, a human message, and a request id.',
      'Validate at the door: presence, type, format, bounds, and an allowlist of fields.',
      'JSON has exactly six value types: object, array, string, number, boolean, null.',
    ],
  },
  {
    id: 'appendix-data',
    title: 'Appendix: Databases & SQL',
    intro:
      'Where the truth lives: tables and keys, the query pipeline, and the structures that keep reads fast and writes safe.',
    flow: 'FROM table -> WHERE filters -> GROUP BY buckets -> ORDER BY sorts -> LIMIT cuts -> result',
    terms: ['database', 'SQL', 'PostgreSQL', 'table', 'primary key', 'foreign key', 'index', 'transaction', 'migration', 'N+1 query'],
    facts: [
      'Primary keys are unique and never null; foreign keys point at them.',
      'NULL needs IS NULL; comparing with = NULL matches nothing, ever.',
      'UPDATE and DELETE without a WHERE hit every row in the table.',
      'Index the columns you filter and join on; each index taxes writes slightly.',
      'The N+1 bug is one query per row in a loop where a single JOIN would do.',
    ],
  },
  {
    id: 'appendix-security',
    title: 'Appendix: Auth & Security',
    intro:
      'Who is asking, what they may do, and how data stays out of the wrong hands. Every input is attacker-controlled until validated.',
    flow: 'attacker input -> trust boundary -> validate -> authenticate -> authorize -> audit',
    terms: ['authentication', 'authorization', 'JWT', 'OAuth', 'CSRF', 'XSS'],
    facts: [
      'Authentication asks who you are; authorization asks what you may do.',
      'Passwords are stored as slow salted hashes (bcrypt, Argon2), never as text.',
      'JWT payloads are readable by anyone; signed means untampered, never secret.',
      'Injection in every form (SQL, XSS, command) is user data executed as code; parameterize and escape.',
      'Secrets live in the environment; a committed secret must be rotated, never just deleted.',
    ],
  },
  {
    id: 'appendix-async',
    title: 'Appendix: Caching & Async Work',
    intro:
      'The performance pair: keep copies of expensive answers close (caching), and move slow work off the request clock (queues).',
    flow: 'request -> cache check -> hit serves copy -> miss pays full price -> store with TTL',
    terms: ['cache', 'CDN', 'cache invalidation', 'queue', 'worker', 'dead-letter queue', 'idempotency', 'retry', 'backpressure', 'rate limit'],
    facts: [
      'Hit rate is the cache health metric; consumer lag is the queue health metric.',
      'Every cache trades freshness for speed; the TTL is the staleness budget.',
      'Queues deliver at least once, so duplicates are normal input; idempotent consumers make them harmless.',
      'Retries use exponential backoff plus jitter, and permanent failures skip retries entirely.',
      'A DLQ without an alert is silent data loss with extra steps.',
    ],
  },
  {
    id: 'appendix-ops',
    title: 'Appendix: Operations & Scale',
    intro:
      'Running the thing: shipping changes safely, seeing inside production, and growing past one machine.',
    flow: 'commit -> CI tests -> build container -> deploy -> logs, metrics, traces -> alert on SLO',
    terms: ['deployment', 'CI/CD', 'container', 'observability', 'log', 'metric', 'trace', 'latency', 'SLO', 'graceful shutdown', 'horizontal scaling', 'sharding', 'replication', 'CAP theorem', 'eventual consistency'],
    facts: [
      'Logs tell you what happened, metrics how much, traces where the time went.',
      'Percentiles beat averages: p99 latency is what your unluckiest users feel.',
      'Horizontal scaling adds machines; it requires state to live outside the process.',
      'Replication copies data for reads and safety; sharding splits it for size.',
      'During a network partition you choose consistency or availability; that is the CAP trade.',
    ],
  },
  {
    id: 'appendix-language',
    title: 'Appendix: Language & Runtime',
    intro:
      'The building blocks under every backend, whatever the language: values, control flow, and how the process actually runs.',
    flow: 'source code -> runtime loads -> functions call -> side effects at the edges -> graceful shutdown',
    terms: ['function', 'class', 'object', 'array', 'dictionary', 'for loop', 'while loop', 'runtime', 'concurrency model', 'side effect', 'memory usage', 'dependency management', 'runtime profiling'],
    facts: [
      'Return values are testable; printed output is not. Logic returns, edges print.',
      'Pure cores with side effects at the edges is the most testable shape of code.',
      'A dictionary lookup by key is the data move behind JSON, headers, and caches alike.',
      'Concurrency models differ (event loop, threads), but the race conditions rhyme.',
    ],
  },
]

const termsByName = new Map(glossaryTerms.map((entry) => [entry.term, entry]))

function sectionProblem(section: AppendixSection, extraTerms: string[] = []): Problem {
  const names = [...section.terms, ...extraTerms]
  const cards = names
    .map((name) => termsByName.get(name))
    .filter((entry) => entry !== undefined)
    .map((entry) => {
      const synonyms = entry.synonyms?.length ? ` Also called: ${entry.synonyms.join(', ')}.` : ''
      return `**${entry.term}.** ${entry.definition}${synonyms}`
    })
    .join('\n\n')

  const flowBlock = section.flow ? `${section.flow}\n\n` : ''

  return {
    id: section.id,
    title: section.title,
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 8,
    prompt: 'Reference module: skim the map, read the cards, tick the facts you can say from memory.',
    explanation: `${section.intro}\n\n${flowBlock}${cards}`,
    checklist: section.facts,
  }
}

// Any glossary term not claimed by a section lands in the last one, so new
// glossary entries always surface somewhere in the appendix.
const claimed = new Set(SECTIONS.flatMap((section) => section.terms))
const unclaimed = glossaryTerms.map((entry) => entry.term).filter((term) => !claimed.has(term))

export const appendixSubject: Subject = {
  id: 'appendix-glossary',
  title: 'Appendix: Glossary & Maps',
  subtitle:
    'Every term on the site as scannable reference cards, grouped into topic maps with the need-to-know facts per area.',
  icon: BookIcon,
  color: '#888892',
  problems: SECTIONS.map((section, index) =>
    sectionProblem(section, index === SECTIONS.length - 1 ? unclaimed : []),
  ),
}
