import type { Subject } from './course'
import { CacheIcon, QueueIcon, TestTubeIcon } from './TechIcons'

// Three concept courses filling the gaps in the backend track: caching,
// queues and background jobs, and testing. Same interactive module format as
// the rest of the site; every code example output verified with Node, and
// every embedded drill maps to an existing graded spec.

export const cachingSubject: Subject = {
  id: 'caching',
  title: 'Caching',
  subtitle:
    'From zero: why caches exist, HTTP caching, memoization, eviction, invalidation, and where Redis and CDNs fit.',
  icon: CacheIcon,
  color: '#f59f00',
  problems: [
    {
      id: 'caching-rung-why',
      title: 'Module 1: Why Caching Exists',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 12,
      prompt:
        'Understand the latency ladder and the three words that define every cache: hit, miss, evict.',
      explanation: `Computers fetch data from places with wildly different speeds, and caching exists because the gaps are enormous.

**The latency ladder.** Reading from process memory takes around 100 nanoseconds. A Redis call on the same network takes around 1 millisecond, ten thousand times slower. A SQL query with disk access can take tens of milliseconds, and a call to a third-party API can take hundreds. Each rung down the ladder costs roughly 10 to 100 times more than the one above.

**The idea.** Keep a copy of expensive-to-fetch data somewhere cheap to read. Serve the copy while it is still useful, and pay the expensive fetch only when you must.

**The vocabulary.** A hit means the cache had the data: fast path. A miss means it did not, so you pay the slow fetch and usually store the result for next time. Eviction is the cache throwing data out, because memory is finite. Hit rate, the fraction of reads served from cache, is the single number that tells you whether a cache is earning its complexity.

**The cost.** Every cache is a second copy of the truth, and second copies can go stale. The whole craft of caching is choosing where staleness is acceptable and for how long.`,
      production:
        'Most backend performance wins are cache wins: the database did not get faster, the system just stopped asking it the same question a thousand times a second. The flip side fills postmortems: stale caches serving deleted data, cache stampedes taking databases down, and debugging sessions that end with "it was cached".',
      walkthrough: [
        'Say the ladder: memory, then Redis, then database, then external API, each step roughly 10 to 100 times slower.',
        'Define hit, miss, and evict in one sentence each.',
        'Name the trade: speed for staleness.',
        'Pick one thing in an app you know and argue whether caching it is safe.',
      ],
      questions: [
        'Why is hit rate the headline cache metric?',
        'What does a cache trade away for speed?',
        'Where does the fetched value go after a miss?',
      ],
      checklist: [
        'Recite the latency ladder.',
        'Define hit, miss, and eviction.',
        'Explain staleness as the core trade.',
      ],
      interactive: {
        coldOpen:
          'Reading from memory takes about 100 nanoseconds. Calling a third-party API takes about 100 milliseconds: a million times slower. Most "make it faster" work is really one move: stop paying the slow price for answers you already computed. A cache that helps only half the time still removes enormous cost. Why?',
        mental:
          'A cache is the chef’s counter: a tiny copy of the pantry kept within arm’s reach, refilled when something runs out, and occasionally holding ingredients that went off.',
        diagram: {
          nodes: ['Request', 'Cache check', 'Hit: serve copy', 'Miss: slow fetch', 'Store + serve'],
          explanations: [
            'A read arrives: a user profile, a rendered page, a computed result.',
            'The cache is consulted first, because reading it costs almost nothing compared to the source.',
            'On a hit, the copy is returned in microseconds and the expensive source never hears about it.',
            'On a miss, the request pays full price: database query, API call, or computation.',
            'The fetched value is stored with a lifetime, so the next request becomes a hit.',
          ],
        },
        example: {
          code: '# What each fetch roughly costs:',
          output:
            'process memory     ~100 ns     the cache\nRedis over LAN     ~1 ms       shared cache, 10,000x slower than memory\nSQL with disk      ~10-50 ms   the thing you are protecting\nthird-party API    ~100-500 ms the thing you REALLY want to avoid',
          explain:
            'The gaps are why caching works: even a cache that helps only half the time removes enormous cost, because the slow path is thousands of times more expensive.',
        },
        predicts: [
          {
            question: 'A cache with a 90% hit rate in front of a 50ms query serves most requests in...',
            options: ['about 50ms', 'well under 1ms', 'about 25ms'],
            correct: 1,
            why: 'Nine of ten requests never touch the query; they read the copy at memory or Redis speed. Only the misses pay the 50ms.',
          },
          {
            question: 'What is the inherent risk every cache carries?',
            options: [
              'it uses too much CPU',
              'the copy can be older than the truth',
              'it makes requests slower',
            ],
            correct: 1,
            why: 'A cache is a second copy. The source can change while the copy sits there, and serving the old copy is the staleness problem.',
          },
        ],
        build: {
          simple: 'A cache makes things faster by keeping a copy.',
          actually:
            'Each storage rung costs 10-100x more than the one above (memory ~100ns, Redis ~1ms, SQL ~10-50ms, third-party API ~100-500ms). A hit serves the copy in microseconds; a miss pays full price and stores the result so the next read hits. Even a 50% hit rate removes huge cost because the slow path is thousands of times pricier.',
          breaks:
            'A cache is a second copy, so it can fall behind the source: serving the old value is the staleness problem. The whole craft is choosing where stale answers are harmless and where they are not.',
        },
        doThisNow: [
          {
            task: 'Do the latency math: a 90% hit rate sits in front of a 50ms query. Roughly what does the average request cost now?',
            reveal:
              'About 5ms average: 9 of 10 requests read the copy at sub-millisecond speed, only the 1 miss pays 50ms (0.9×~0 + 0.1×50 ≈ 5ms). The hit rate, not the query, now dominates.',
          },
          {
            task: 'Sort two values by caching safety: a user\'s account balance vs the list of countries in a dropdown. Which caches freely, which barely?',
            reveal:
              'Countries: barely change, a day stale is harmless, cache aggressively. Balance: changes constantly and staleness is visible money, so cache with very short lifetimes or not at all. Safety is per-data-type.',
          },
        ],
        warStory:
          'A page made the same expensive recommendations API call on every load, 300ms each, for data that changed daily. Wrapping it in a one-hour cache cut page load from 800ms to under 100ms and dropped the API bill by 95%, all without touching the recommendation logic.',
        tweak: {
          instruction:
            'Decide which is a better caching candidate: a user’s account balance, or the list of countries in a dropdown.',
          reveal:
            'The country list barely changes and being a day stale is harmless: perfect candidate. The balance changes constantly and staleness is visible money: cache it carefully with short lifetimes, or never.',
        },
        receipt: {
          explain: [
            'Why each storage rung is 10-100x slower than the one above.',
            'Why even a moderate hit rate removes most of the cost.',
          ],
          question: 'Before writing any caching code, what cache already ships free with every HTTP response?',
        },
        recap: [
          'Each storage rung costs 10 to 100 times more than the one above.',
          'Hit serves the copy; miss pays full price and stores the result.',
          'Caching trades freshness for speed; choose where that trade is safe.',
        ],
      },
    },
    {
      id: 'caching-rung-http',
      title: 'Module 2: HTTP Caching: Cache-Control And ETags',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 14,
      prompt:
        'Use the cache built into every browser and CDN: Cache-Control, max-age, and ETag revalidation.',
      explanation: `Before adding any caching code, use the cache that already ships with HTTP. Your response headers program it.

**Cache-Control: max-age.** max-age=300 tells every browser and CDN between you and the user to reuse this response for 300 seconds without asking again. During that window, repeat requests cost you nothing: they never reach your server.

**public and private.** private restricts caching to the end user's browser, for personalized responses. public allows shared caches like CDNs to store one copy and serve thousands of users from it.

**ETag and 304.** An ETag is a fingerprint of the response body. When the cached copy expires, the client sends If-None-Match with the fingerprint. If the content is unchanged, the server answers 304 Not Modified with an empty body, skipping the transfer. The client keeps using its copy, revalidated for free.

**no-store and no-cache.** no-store forbids caching entirely (sensitive data). no-cache allows storing the copy yet requires revalidation before each use. The names are famously backwards; memorize them once.`,
      production:
        'Static assets ship with max-age of a year plus hashed filenames, so deploys change the URL instead of fighting the cache. API responses lean on ETags and short max-age. The classic incident is the reverse: a personalized page marked public, served from a CDN, showing one user another user’s account.',
      walkthrough: [
        'Set Cache-Control: public, max-age=300 on a stable GET response.',
        'Compute an ETag from the body and return it.',
        'Honor If-None-Match by answering 304 with no body.',
        'Mark personalized responses private and sensitive ones no-store.',
      ],
      questions: [
        'Who obeys Cache-Control besides the browser?',
        'What does a 304 response save?',
        'When is public dangerous?',
      ],
      checklist: [
        'Explain max-age and where it is enforced.',
        'Trace an ETag revalidation round trip.',
        'Choose between public, private, and no-store for three response types.',
      ],
      interactive: {
        coldOpen:
          'You can make repeat requests cost your server literally nothing, without writing a line of caching code. Every browser and CDN already has a cache; your response headers program it. Get one header wrong, though, and a CDN serves one user another user\'s account page. Which header, and which mistake?',
        mental:
          'Cache-Control headers are instructions taped to a parcel: every courier between you and the recipient reads them and decides whether to keep a copy in their depot.',
        diagram: {
          nodes: ['Response + headers', 'Browser cache', 'CDN cache', 'Expiry', 'ETag revalidate'],
          explanations: [
            'The server attaches Cache-Control and ETag headers; the body travels with its own caching rules.',
            'The browser stores the response and serves repeats locally for max-age seconds: zero network.',
            'With public, shared caches keep one copy for many users; your origin sees a fraction of the traffic.',
            'After max-age expires, the copy is suspect rather than deleted.',
            'The client asks "still this fingerprint?" via If-None-Match. A 304 answer renews the copy without resending the body.',
          ],
        },
        example: {
          code: 'GET /api/countries\n\nHTTP/2 200\ncache-control: public, max-age=300\netag: "ab12cd"\n\n[...body...]\n\n# 6 minutes later, the copy has expired:\nGET /api/countries\nif-none-match: "ab12cd"\n\nHTTP/2 304',
          output:
            'first request:  full body, cached for 300s by browser and CDN\nnext 5 minutes: served from cache, origin never called\nafter expiry:   one cheap 304, copy renewed, body never resent',
          explain:
            'Three hundred seconds of free traffic, then a revalidation that costs a fingerprint comparison instead of a body transfer.',
        },
        predicts: [
          {
            question: 'During the max-age window, what does your server see for repeat requests?',
            options: ['every request', 'nothing at all', 'only the headers'],
            correct: 1,
            why: 'Fresh cached responses are served by the browser or CDN without contacting the origin. That silence is the win.',
          },
          {
            question: 'A 304 response carries...',
            options: ['the full body again', 'no body: just headers saying your copy is still good', 'half the body'],
            correct: 1,
            why: 'Not Modified means keep what you have. The savings is the entire body transfer.',
          },
          {
            question: 'Cache-Control: public on GET /api/me (the logged-in user profile) causes...',
            options: [
              'faster profiles, no downside',
              'one user’s profile served to other users from the shared cache',
              'a compile error',
            ],
            correct: 1,
            why: 'public lets CDNs store one copy and share it. Personalized responses must be private or no-store.',
          },
        ],
        build: {
          simple: 'Cache-Control headers tell browsers to reuse responses.',
          actually:
            'max-age=N lets every browser and CDN reuse the response for N seconds with no request to you. public allows shared caches (CDNs) to serve one copy to many; private restricts to one browser. An ETag fingerprints the body so an expired copy can be revalidated with a cheap 304 (no body resent).',
          breaks:
            'public on a personalized response lets a CDN serve one user another user\'s data. no-store forbids caching; no-cache stores but revalidates every time. The names are backwards, so memorize them once.',
        },
        doThisNow: [
          {
            task: 'Read a real site\'s caching policy. Fetch headers and look at Cache-Control and ETag.',
            command: 'curl -sI https://example.com | grep -i "cache-control\\|etag"',
            reveal:
              'You see the policy in the wild: static sites declare long max-age, APIs vary, and a missing Cache-Control means every request pays full price. The header is the entire program.',
          },
          {
            task: 'Classify three responses as public, private, or no-store: a logo image, GET /api/me (logged-in profile), and a password-reset page.',
            reveal:
              'Logo: public with a long max-age (shareable, rarely changes). /api/me: private (personalized, never share across users). Password-reset: no-store (sensitive, never cache anywhere).',
          },
        ],
        warStory:
          'An engineer added Cache-Control: public, max-age=600 to speed up the account page, not noticing it was personalized. A CDN cached one user\'s page and served it to everyone for ten minutes. People saw strangers\' names and balances. The fix was one word: private.',
        tweak: {
          instruction: 'Run: curl -si https://example.com | grep -i "cache-control\\|etag" and read what a real site declares.',
          reveal:
            'You will see real caching policy in the wild. Most static sites declare long max-age values; APIs vary widely, and missing headers mean every request pays full price.',
        },
        receipt: {
          explain: [
            'How max-age, ETags, and 304 revalidation save work.',
            'Why public on a personalized response is a data leak.',
          ],
          command: 'curl -sI https://example.com | grep -i cache-control',
          question: 'HTTP caching handles responses. How do you cache an expensive computation inside your own app?',
        },
        writeDrillId: 'http-parse-cache-control',
        recap: [
          'max-age programs every cache between you and the user.',
          'ETag plus 304 renews expired copies without resending bodies.',
          'public shares, private personalizes, no-store forbids.',
        ],
      },
    },
    {
      id: 'caching-rung-memoize',
      title: 'Module 3: Application Caching: Memoization And TTLs',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 13,
      prompt:
        'Cache inside your code: memoize pure work, attach TTLs to anything that can change.',
      explanation: `The simplest cache is a Map in front of a function.

**Memoization.** Check the cache before computing; store the result after. For a pure function (same input, same output, no side effects), the cached value is correct forever, and the only cost is memory.

**The cache key.** The key must capture every input that changes the answer. Memoize a price calculation on product id alone while the answer also depends on currency, and you will serve euro prices to dollar customers. Most memoization bugs are key bugs.

**TTLs for impure data.** Database rows and API responses change behind your back, so their cache entries carry a time-to-live: store the value with a timestamp and treat it as a miss after, say, 60 seconds. The TTL is your staleness budget, a direct dial between freshness and load.

**Where this lives.** In-process caches (a Map, an LRU library) are per-instance: ten servers means ten caches warming separately. That is fine for small hot data and the reason the next modules introduce shared caches.`,
      production:
        'Config lookups, feature flags, permission checks, and rendered fragments are the everyday memoization targets. The recurring bug is memoizing something that was quietly impure, like a function reading the current time or a global, and serving its frozen first answer forever.',
      walkthrough: [
        'Wrap an expensive pure function with a Map-based memoizer.',
        'Prove the second call skips the work.',
        'List every input that affects the output; make all of them part of the key.',
        'Add a TTL when the underlying data can change.',
      ],
      questions: [
        'Why are pure functions safe to memoize forever?',
        'What goes wrong with an incomplete cache key?',
        'What does a TTL actually budget?',
      ],
      checklist: [
        'Memoize a function with a Map.',
        'Construct a key from all relevant inputs.',
        'Explain when a TTL is required.',
      ],
      interactive: {
        coldOpen:
          'Memoizing a function is four lines and feels like free speed. Then someone memoizes getPrice(productId), and every customer sees the price in whoever-asked-first\'s currency, forever. The cache was right; the key was wrong. What belongs in a cache key, and what makes a function unsafe to memoize at all?',
        mental:
          'Memoization is writing the answer in the margin of the textbook: the second time the question comes up, you read the margin instead of redoing the math.',
        diagram: {
          nodes: ['Call', 'Key lookup', 'Hit: return', 'Miss: compute', 'Store with TTL'],
          explanations: [
            'A function call arrives with arguments.',
            'The arguments become the cache key. Every input that changes the answer must be in it.',
            'A hit returns the stored result; the expensive body never runs.',
            'A miss runs the real computation exactly once.',
            'The result is stored, with a TTL when the underlying truth can drift.',
          ],
        },
        example: {
          code: 'const cache = new Map();\n\nfunction expensiveSquare(n) {\n  console.log(`computing ${n}`);\n  return n * n;\n}\n\nfunction memoSquare(n) {\n  if (cache.has(n)) return cache.get(n);\n  const result = expensiveSquare(n);\n  cache.set(n, result);\n  return result;\n}\n\nconsole.log(memoSquare(4));\nconsole.log(memoSquare(4));\nconsole.log(cache.size);',
          output: 'computing 4\n16\n16\n1',
          explain:
            '"computing 4" prints once. The second call found the answer in the Map and skipped the work entirely, which is the entire idea in four lines.',
        },
        predicts: [
          {
            question: 'How many times does expensiveSquare run if you call memoSquare(4) ten times?',
            options: ['10', '1', '0'],
            correct: 1,
            why: 'The first call computes and stores; the next nine are Map lookups.',
          },
          {
            question: 'getPrice(productId) is memoized on productId, but prices also vary by currency. What happens?',
            options: [
              'nothing, it still works',
              'whoever asks first locks in their currency for everyone',
              'the cache refuses the key',
            ],
            correct: 1,
            why: 'The key is missing an input. The first caller’s answer is stored under the id and served to every currency. Keys must include everything that changes the output.',
          },
        ],
        build: {
          simple: 'Remember a function\'s result so you do not recompute it.',
          actually:
            'Check a Map by a key built from the arguments; on a hit return the stored value, on a miss compute once and store. Pure functions cache forever; anything whose underlying data changes needs a TTL. The key must include every input that affects the output.',
          breaks:
            'An incomplete key serves one caller\'s answer to everyone (getPrice keyed only on id ignores currency). And memoizing an impure function (one reading the clock or a global) freezes its first answer forever.',
        },
        doThisNow: [
          {
            task: 'Prove memoization skips the work: run a memoized function twice and count how many times the expensive body executes.',
            command: 'node -e \'const c=new Map(); const f=n=>{console.log("computing",n); return n*n}; const m=n=>c.has(n)?c.get(n):(c.set(n,f(n)),c.get(n)); m(4); m(4); m(4)\'',
            reveal:
              '"computing 4" prints once; the next two calls are Map lookups. One computation, three calls. That is the entire idea.',
          },
          {
            task: 'Spot the broken key: getPrice(productId) is memoized on productId, but price also depends on currency. What is the bug and the fix?',
            reveal:
              'The first caller\'s currency price is stored under the id and served to everyone. Fix: key on productId + currency (every input that changes the answer). Incomplete keys are the classic memoization bug.',
          },
        ],
        warStory:
          'A team memoized a getConfig() that secretly read the current time to pick a daily theme. It cached the first call and served yesterday\'s theme indefinitely. Memoizing an impure function froze its one accidental answer. The rule: only memoize functions whose output depends solely on their inputs.',
        tweak: {
          instruction: 'Call memoSquare(5) after the existing calls and predict every printed line.',
          reveal: 'computing 5, then 25, and cache.size becomes 2. New keys pay once; old keys stay free.',
        },
        receipt: {
          explain: [
            'Why the cache key must contain every input that changes the output.',
            'Why only pure functions are safe to memoize without a TTL.',
          ],
          command: 'node -e \'const c=new Map(); /* check, compute, store */\'',
          question: 'Your in-memory cache grows forever. What stops it from eating all the RAM?',
        },
        writeDrillId: 'caching-memoize',
        recap: [
          'Check the Map, compute on miss, store the result.',
          'The key must contain every input that changes the answer.',
          'Pure results cache forever; changeable data gets a TTL.',
        ],
      },
    },
    {
      id: 'caching-rung-eviction',
      title: 'Module 4: Eviction: LRU And Bounded Memory',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 13,
      prompt:
        'Caches are finite: learn LRU, the policy that evicts the least recently used entry.',
      explanation: `An unbounded cache is a memory leak with good intentions. Every production cache has a maximum size and a rule for choosing the victim when it is full.

**LRU: least recently used.** Track the order entries were last touched. When full, evict the one untouched the longest. The bet is temporal locality: data used recently will likely be used again soon, and data idle for an hour can probably be refetched if needed.

**The mechanics.** An LRU needs fast lookup plus an access ordering. A JavaScript Map iterates in insertion order, so the trick is: on every read, delete the key and re-insert it, moving it to the back. The front of the Map is then always the least recently used, ready for eviction.

**The relatives.** LFU evicts the least frequently used. FIFO evicts the oldest insert regardless of use. TTL expiry removes by age. Redis ships several variants of these behind one config flag. LRU is the default choice because temporal locality holds for most workloads.

**The symptom of wrong sizing.** A cache much smaller than its hot set thrashes: entries get evicted moments before they would have hit, and the hit rate collapses while memory looks fine.`,
      production:
        'Redis in production runs with maxmemory plus an eviction policy, commonly allkeys-lru. The sizing conversation is real engineering: hit rate climbs with size until the hot set fits, then flattens. Watching the eviction rate alongside the hit rate tells you which side of that curve you are on.',
      walkthrough: [
        'State the LRU bet: recent use predicts future use.',
        'Walk the Map trick: read means delete plus re-insert.',
        'Identify the eviction victim: the front of the Map.',
        'Name the thrash symptom: high evictions, falling hit rate.',
      ],
      questions: [
        'Why must every real cache be bounded?',
        'What assumption justifies LRU over FIFO?',
        'How does the Map re-insertion trick maintain access order?',
      ],
      checklist: [
        'Explain the LRU policy and its bet.',
        'Trace an eviction by hand.',
        'Name one alternative policy and when it wins.',
      ],
      interactive: {
        coldOpen:
          'A cache that never forgets is a memory leak with good intentions: it grows until the process dies. So every real cache is full most of the time and must choose what to throw away. Pick wrong and the cache "thrashes", evicting entries moments before they would have been hits, while memory looks perfectly fine. What policy picks the right victim?',
        mental:
          'LRU is a crowded coat rack by the door: every coat you wear goes back on the nearest hook, and when a new coat needs space, the dusty one at the far end is donated.',
        diagram: {
          nodes: ['Bounded cache', 'Read: move to back', 'Full: evict front', 'Hot set fits?'],
          explanations: [
            'The cache has a maximum entry count or byte size. Unbounded caches are leaks.',
            'Every access refreshes the entry’s position, recording that it is still loved.',
            'When space is needed, the entry untouched the longest is the statistically safest sacrifice.',
            'If the working set fits, hit rate is high and evictions are rare. If it does not, the cache thrashes and the metric pair (evictions up, hits down) tells the story.',
          ],
        },
        example: {
          code: "const lru = new Map();\n\nfunction touch(key) {\n  const v = lru.get(key);\n  lru.delete(key);\n  lru.set(key, v);\n}\n\nlru.set('a', 1);\nlru.set('b', 2);\nlru.set('c', 3);\n\ntouch('a');\n\nlru.delete(lru.keys().next().value);\nconsole.log([...lru.keys()]);",
          output: "[ 'c', 'a' ]",
          explain:
            'Touching a moved it behind c, leaving b at the front as least recently used. The eviction removed b. Maps remembering insertion order is what makes this four-line LRU possible.',
        },
        predicts: [
          {
            question: 'Order of operations: set a, set b, set c, read b, evict one. Who goes?',
            options: ['a', 'b', 'c'],
            correct: 0,
            why: 'Reading b refreshed it. a is now the entry untouched the longest, so a is the victim.',
          },
          {
            question: 'A 1,000-entry cache serving a workload that constantly touches 10,000 distinct keys will...',
            options: [
              'work fine',
              'thrash: evict entries right before they would have hit',
              'grow to fit',
            ],
            correct: 1,
            why: 'The hot set is ten times the capacity. Entries rotate out before their next use, so the hit rate collapses despite the cache being "full and working".',
          },
        ],
        build: {
          simple: 'When the cache is full, remove something.',
          actually:
            'Bound every cache, then pick a victim policy. LRU evicts the least recently used entry, betting that recent use predicts future use (temporal locality). A Map trick implements it: on each read, delete and re-insert the key so the front is always the oldest. LFU, FIFO, and TTL expiry are the alternatives.',
          breaks:
            'A cache much smaller than its hot set thrashes: entries rotate out just before their next hit, so the hit rate collapses while the cache looks full and healthy. Rising evictions plus falling hits is the signature.',
        },
        doThisNow: [
          {
            task: 'Trace an eviction by hand: set a, set b, set c, read b, then evict one. Who gets evicted, and why?',
            reveal:
              'a. Reading b refreshed it to the back, leaving a as the entry untouched the longest. LRU evicts a. Walk the access order and the victim is always the front.',
          },
          {
            task: 'Diagnose sizing: a 1,000-entry cache serves a workload that constantly touches 10,000 distinct keys. What happens to the hit rate?',
            reveal:
              'It collapses (thrashing). The hot set is 10x the capacity, so entries get evicted before their next use. The fix is a bigger cache or a smaller hot set, not a different policy.',
          },
        ],
        warStory:
          'A Redis cache had no maxmemory set. It grew quietly for weeks until it consumed all the box\'s RAM, the OS killed it, and every request fell through to the database at once. The fix was two lines: maxmemory plus allkeys-lru. Every cache must be bounded.',
        tweak: {
          instruction: 'Add touch("c") before the eviction line and predict the new survivor list.',
          reveal: "The order becomes a, c after b... walk it: after touch('a') order is b,c,a; touch('c') makes it b,a,c; evicting the front removes b, leaving [ 'a', 'c' ]. Tracing by hand once makes the policy stick.",
        },
        receipt: {
          explain: [
            'The LRU bet and how the Map re-insertion trick implements it.',
            'Why a too-small cache thrashes instead of just being slower.',
          ],
          question: 'Eviction handles a full cache. What handles a cache entry that has gone stale because the source changed?',
        },
        writeDrillId: 'caching-lru',
        recap: [
          'Bound every cache; choose a victim policy.',
          'LRU bets that recent use predicts future use.',
          'Evictions rising while hits fall means the hot set does not fit.',
        ],
      },
    },
    {
      id: 'caching-rung-invalidation',
      title: 'Module 5: Invalidation: The Famously Hard Part',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 14,
      prompt:
        'Keep copies honest: TTL expiry, explicit invalidation, write-through, and stampede protection.',
      explanation: `"There are only two hard things in computer science: cache invalidation and naming things." The joke survives because the problem is real: the truth changed, and copies of the old truth are still out there being served.

**Strategy 1: TTL and tolerate.** Let entries expire on a clock. Simple, robust, and always your default. The question to ask per data type is "how stale is acceptable?" A product description can be five minutes stale; an account balance cannot.

**Strategy 2: invalidate on write.** When code updates the database, it also deletes the relevant cache keys. Fresh reads repopulate. This keeps staleness near zero at the cost of coupling: every write path must know every key that depends on the data, and the ones nobody remembered are the bugs.

**Strategy 3: write-through.** Writes update the cache and the database together, so the cache never holds stale data for keys written through it. Costs write latency; reads stay fast and honest.

**The stampede.** A popular key expires, and a thousand concurrent requests all miss at once, all hitting the database together: a thundering herd that can take it down. Defenses: lock so one request refetches while others wait or serve the stale value briefly, and jitter TTLs so popular keys do not expire in synchronized waves.`,
      production:
        'Invalidation bugs are the cache bugs that reach users: the deleted post that keeps appearing, the price change that takes an hour, the permissions revocation that does not stick. Teams handle it with short TTLs as the safety net under explicit invalidation, so a missed delete heals in minutes instead of forever.',
      walkthrough: [
        'Assign a staleness budget to three data types you know.',
        'Pick TTL-only for the tolerant ones.',
        'Add delete-on-write for the strict ones, and list every key each write touches.',
        'Name the stampede defense for your hottest key.',
      ],
      questions: [
        'Why is TTL the default even when you also invalidate explicitly?',
        'What makes invalidate-on-write fragile?',
        'What triggers a cache stampede?',
      ],
      checklist: [
        'Choose a strategy per data type with a staleness budget.',
        'Explain why TTLs back up explicit invalidation.',
        'Describe stampede protection.',
      ],
      interactive: {
        coldOpen:
          'A user deletes a post. It vanishes from the database instantly. And it keeps showing on the homepage for ten more minutes, because a cached copy nobody remembered to delete is still being served. "Cache invalidation" is half of the famous hardest-things-in-CS joke for a reason. How do you keep copies honest without going mad?',
        mental:
          'A cache entry is a sticky note copied from a whiteboard. TTL throws notes away on a schedule; invalidation chases down every note when the board changes; the stampede is everyone rushing to the board the moment a popular note expires.',
        diagram: {
          nodes: ['Write happens', 'Delete cache keys', 'TTL as backstop', 'Popular key expires', 'Stampede guard'],
          explanations: [
            'The database row changes: a price update, a deletion, a permission revoke.',
            'The write path deletes every cache key derived from that data. The ones nobody listed keep serving the old truth.',
            'Short TTLs cap the damage of a missed invalidation: the wrong answer heals on the clock instead of living forever.',
            'When a hot entry expires, every concurrent reader misses simultaneously.',
            'One request refetches while the rest wait or briefly take the stale value; TTL jitter prevents synchronized expiry waves.',
          ],
        },
        example: {
          code: '# A price update with delete-on-write plus TTL backstop:\n\nUPDATE products SET price = 12 WHERE id = 42;\nDEL cache:product:42\nDEL cache:product-list:page1\n\n# entry was stored with: SET cache:product:42 ... EX 300',
          output:
            'next read of product 42: miss, refetch, fresh price\nforgotten key (search results page): stale for at most 300s, then heals\nwithout the TTL: the forgotten key is stale forever',
          explain:
            'Explicit deletes give instant freshness for the keys you remembered. The 300-second TTL is insurance for the one you forgot, and there is always one.',
        },
        predicts: [
          {
            question: 'A deleted post keeps appearing on the homepage for users. Most likely cause?',
            options: [
              'the database delete failed',
              'a cached homepage fragment was never invalidated',
              'browsers are broken',
            ],
            correct: 1,
            why: 'The truth changed and a derived copy (the rendered homepage) was not on the write path’s delete list. The signature of an invalidation bug is old truth outliving the source.',
          },
          {
            question: 'A key serving 5,000 requests per second expires. Without protection, the database receives...',
            options: [
              'one refetch',
              'a burst of thousands of identical queries at once',
              'nothing',
            ],
            correct: 1,
            why: 'Every concurrent reader misses at the same moment. The stampede guard exists to collapse that burst into one fetch.',
          },
        ],
        build: {
          simple: 'When data changes, update or drop the cached copy.',
          actually:
            'Three strategies: TTL (expire on a clock, your default), invalidate-on-write (delete derived keys when the source changes), and write-through (update cache and DB together). TTL backs up the others, so a missed invalidation heals in minutes instead of forever. Guard hot keys against stampedes.',
          breaks:
            'Invalidate-on-write is fragile: every write path must know every derived key, and the forgotten one is the bug (the deleted post that lingers). A hot key expiring sends thousands of simultaneous misses at the database: a stampede.',
        },
        doThisNow: [
          {
            task: 'Assign a staleness budget and pick a strategy for three data types: product description, account balance, country dropdown.',
            reveal:
              'Description: minutes, TTL-only. Balance: effectively zero, invalidate-on-write or do not cache. Country list: hours/days, long TTL. The budget decides the strategy, never the reverse.',
          },
          {
            task: 'Diagnose: a deleted post keeps appearing on the homepage. Name the cause and the two-part fix.',
            reveal:
              'A derived cache key (the rendered homepage fragment) was not on the write path\'s delete list. Fix: add it to the invalidation, and keep a short TTL as a backstop so the next forgotten key heals on its own.',
          },
        ],
        warStory:
          'A pricing change invalidated the product page cache but not the search-results cache, which nobody remembered derived from the same data. Customers saw the old price in search for an hour and ordered at it. A short TTL on every cached key would have capped the damage to minutes; the team added one everywhere.',
        tweak: {
          instruction: 'Assign staleness budgets: product description, account balance, country dropdown.',
          reveal:
            'Description: minutes, TTL-only is fine. Balance: effectively zero, invalidate on write or do not cache. Country list: hours or days. The budget decides the strategy, never the other way around.',
        },
        receipt: {
          explain: [
            'The three invalidation strategies and why TTL backstops them all.',
            'What causes a cache stampede and how to guard against it.',
          ],
          question: 'You have mastered single caches. How do the browser, CDN, and Redis caches stack into one system?',
        },
        recap: [
          'TTL is the default and the backstop under everything else.',
          'Invalidate-on-write must list every dependent key; the missed one is the bug.',
          'Guard hot keys against stampedes with single-flight refetch and TTL jitter.',
        ],
      },
    },
    {
      id: 'caching-rung-layers',
      title: 'Module 6: The Cache Map: Browser To CDN To Redis',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 13,
      prompt:
        'Place every cache layer on one map and decide what belongs in each.',
      explanation: `A real request can be served from four different caches before reaching your database. Knowing the map tells you what to cache where, and where to look when something stale appears.

**Browser cache.** Closest to the user, free, controlled by your headers (module 2). Static assets and anything personal-and-cacheable.

**CDN.** Shared cache at the network edge, also header-controlled. One copy serves a whole region: static files, public API responses, images.

**Redis (or Memcached).** The shared application cache. All your server instances see the same entries, which fixes the per-instance cold cache problem from module 3. Sessions, computed results, hot query results, rate-limit counters. It costs a network hop, around a millisecond, which is still 10 to 50 times cheaper than the database.

**In-process memory.** A Map inside the server. Fastest possible, per instance, best for small hot data like config and feature flags, usually with a short TTL so instances converge.

**The decision, in one line.** Cache as close to the user as freshness allows: headers first, CDN for the shareable, Redis for the dynamic-but-expensive, in-process for the tiny and hot.`,
      production:
        'Debugging staleness means walking this map in order: is the browser holding it, the CDN, Redis, or did the database really say that? Engineers who know the map check layers; engineers who do not restart servers and hope. The layers also fail differently: a cold Redis after a restart is a stampede risk against the database, which is why warm-up and stampede guards matter on deploy day.',
      walkthrough: [
        'Draw the four layers between user and database.',
        'Assign each: static asset, session, feature flag, public API response.',
        'Walk a staleness bug through the layers in order.',
        'Name what happens to the database when Redis restarts cold.',
      ],
      questions: [
        'Why does Redis fix the problem in-process caches have?',
        'Which layers do response headers control?',
        'Where do you look first when a user reports stale data?',
      ],
      checklist: [
        'Place four data types on the correct layers.',
        'Explain header-controlled versus code-controlled layers.',
        'Walk the staleness debugging order.',
      ],
      interactive: {
        coldOpen:
          'A user reports stale data. There are four caches between them and your database, and the bug could be in any one. The engineers who know the map check layers in order and find it in minutes; the ones who do not restart servers and pray. What are the four layers, and which one do you check first?',
        mental:
          'The cache map is a supply chain: pantry in the kitchen (browser), neighborhood depot (CDN), regional warehouse (Redis), factory (database). Stock what each tier can hold, and trace shortages tier by tier.',
        diagram: {
          nodes: ['Browser', 'CDN edge', 'Redis', 'In-process', 'Database'],
          explanations: [
            'The user’s own cache, programmed by your response headers. Free requests are the ones that never leave the device.',
            'Shared edge cache near users worldwide. One cached copy can absorb a region’s traffic for public content.',
            'The shared application cache every server instance reads. Sessions, hot queries, computed values, counters. About a millisecond away.',
            'A Map inside each server process: nanoseconds away, per instance, ideal for tiny hot data with short TTLs.',
            'The source of truth, and the thing every layer above exists to protect.',
          ],
        },
        example: {
          code: '# One page load, four caches:\n\nGET /app.js            -> browser cache (max-age=31536000, hashed filename)\nGET /logo.png          -> CDN edge (public, shared)\nGET /api/dashboard     -> Redis (computed result, TTL 60s)\nfeature flag check     -> in-process Map (TTL 30s)\nfresh order insert     -> database (the truth, never cached)',
          output:
            'origin server work for the page: one Redis read, one flag lookup\ndatabase work: only the genuinely uncacheable insert',
          explain:
            'Each piece of the page settles at the cheapest layer its freshness budget allows. The database only sees what nothing else could answer.',
        },
        predicts: [
          {
            question: 'Ten server instances each memoize permissions in-process. A user’s role changes. What do users see?',
            options: [
              'instant updates everywhere',
              'inconsistent behavior until each instance’s TTL expires',
              'an error',
            ],
            correct: 1,
            why: 'Per-instance caches expire independently, so some servers honor the new role while others serve the old one. Shared state belongs in Redis precisely to avoid this.',
          },
          {
            question: 'Redis restarts empty during peak traffic. The immediate risk is...',
            options: [
              'nothing, it refills',
              'every former hit becomes a database query at once',
              'the CDN breaks',
            ],
            correct: 1,
            why: 'A cold shared cache converts the entire hit rate into misses simultaneously: a stampede against the database. Warm-up and single-flight guards exist for this moment.',
          },
        ],
        build: {
          simple: 'There are several caches between the user and the database.',
          actually:
            'Four layers, each a distance and a sharing scope: browser (free, header-controlled), CDN (shared edge, header-controlled), Redis (shared app cache, ~1ms, all instances), in-process Map (nanoseconds, per instance). Cache as close to the user as the freshness budget allows.',
          breaks:
            'Per-instance in-process caches disagree until each TTL expires, so a role change applies unevenly across servers. And a cold Redis after a restart turns the whole hit rate into simultaneous database misses: a stampede on deploy day.',
        },
        doThisNow: [
          {
            task: 'Place four things on the right layer: a rate-limit counter, the marketing homepage, a user avatar image, and the /api/me response.',
            reveal:
              'Counter: Redis (shared, atomic). Homepage: CDN with public max-age. Avatar: CDN, long max-age, hashed URL. /api/me: private, short or no cache. Personal data never goes in a shared layer.',
          },
          {
            task: 'Walk a staleness bug: a user sees old data. List the layers you would check, in order, from closest to the user.',
            reveal:
              'Browser cache, then CDN, then Redis, then the database itself. Check in order rather than restarting servers blindly; the stale copy lives in exactly one layer, and order finds it fastest.',
          },
        ],
        warStory:
          'After a deploy that flushed Redis, a high-traffic site fell over: every cached read became a database query at the same instant, a self-inflicted stampede. They added cache warm-up on deploy and a single-flight guard, so a cold cache refills gently instead of all at once.',
        tweak: {
          instruction: 'Place these on the map: rate-limit counter, marketing homepage, user avatar image, /api/me response.',
          reveal:
            'Counter: Redis (shared, atomic). Homepage: CDN with public max-age. Avatar: CDN with a long max-age and hashed URL. /api/me: private, short or no cache; personal data never goes in shared layers.',
        },
        receipt: {
          explain: [
            'The four cache layers and what belongs in each.',
            'How to debug staleness by walking the layers in order.',
          ],
          question: 'Caching speeds up reads. What lets a slow task happen without making the user wait at all?',
        },
        recap: [
          'Four layers: browser, CDN, Redis, in-process, each with a distance and a sharing scope.',
          'Cache as close to the user as the freshness budget allows.',
          'Debug staleness by walking the layers in order toward the truth.',
        ],
      },
    },
  ],
}

export const queuesSubject: Subject = {
  id: 'queues',
  title: 'Queues & Background Jobs',
  subtitle:
    'From zero: why async work exists, at-least-once delivery, idempotent consumers, retries, dead letters, and ordering.',
  icon: QueueIcon,
  color: '#7c3aed',
  problems: [
    {
      id: 'queues-rung-why',
      title: 'Module 1: Why Queues Exist',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 12,
      prompt:
        'Understand the core move of backend architecture: take slow work out of the request and do it later.',
      explanation: `A user taps "place order". The order must be saved now; the confirmation email, the warehouse notification, and the analytics event do not. A queue is how the request hands that work to the future.

**The shape.** A producer (your request handler) appends a message describing work to a queue. A consumer (a worker process) reads messages and does the work. The queue between them is durable storage, so the work survives crashes and restarts.

**What this buys.** The request returns in 50ms instead of 3 seconds because it no longer waits for the email service. The system absorbs spikes: ten thousand orders in a minute become a backlog the workers drain steadily. And a failing email provider stops breaking checkout, because the messages just wait.

**The vocabulary.** Enqueue and dequeue. Backlog (messages waiting). Throughput (messages per second drained). Consumer lag (how far behind the workers are). Lag is the queue's health metric the way hit rate was the cache's.

**The price.** The work is now eventual rather than immediate, and "did it happen yet?" becomes a real question. Everything else in this course is the craft of handling that honestly.`,
      production:
        'Emails, receipts, image and video processing, report generation, webhooks, sync jobs, and ML scoring all run behind queues in real systems. The classic anti-pattern is doing them inline: checkout that takes eight seconds because the email provider is slow, and falls over entirely when it is down.',
      walkthrough: [
        'Split a request you know into must-happen-now and can-happen-soon.',
        'Name the producer, the queue, and the consumer for the soon list.',
        'Say what the user experiences before and after the split.',
        'Define consumer lag and why it is the health metric.',
      ],
      questions: [
        'What belongs in the request, and what belongs in the queue?',
        'How does a queue absorb a traffic spike?',
        'What new question does async work create?',
      ],
      checklist: [
        'Identify queue-worthy work in a real flow.',
        'Define producer, consumer, backlog, and lag.',
        'Explain the latency and resilience wins.',
      ],
      interactive: {
        coldOpen:
          'Checkout takes 2.8 seconds because it waits for the email service to send a receipt. Worse, when the email provider goes down, customers cannot buy anything. The fix is not a faster email service. It is refusing to make the user wait for work that does not have to happen now. What carries that work into the future?',
        mental:
          'A queue is the ticket rail in a restaurant kitchen: waiters clip orders and immediately go back to tables, cooks pull tickets at their own pace, and a rush becomes a long rail instead of chaos.',
        diagram: {
          nodes: ['Request', 'Save the order', 'Enqueue the rest', 'Return 200', 'Worker drains'],
          explanations: [
            'The user action arrives: place order, upload video, request report.',
            'The part that must be true immediately is done synchronously: the order row exists.',
            'Everything deferrable becomes messages: send-email, notify-warehouse, track-event.',
            'The user gets their answer in milliseconds, before any slow work begins.',
            'Workers consume the backlog at their own pace, steadily, even through spikes and downstream outages.',
          ],
        },
        example: {
          code: '# Inline (before):\nPOST /orders          2.8s    saves order, sends email, notifies warehouse\n\n# With a queue (after):\nPOST /orders          60ms    saves order, enqueues 3 messages\nworker, seconds later:        send-email, notify-warehouse, track-event',
          output:
            'user-facing latency: 2.8s -> 60ms\nemail provider outage: checkout unaffected, messages wait\ntraffic spike: backlog grows, workers drain it, nothing falls over',
          explain:
            'The work did not get faster; it moved off the user’s clock. The queue also turned two failure modes (slow provider, spike) into a growing backlog instead of errors.',
        },
        predicts: [
          {
            question: 'The email provider goes down for an hour. With a queue, checkout...',
            options: [
              'fails for an hour',
              'works normally while email messages accumulate and send later',
              'slows down',
            ],
            correct: 1,
            why: 'The producer only appends messages. The dependency on the email provider moved to the worker, where failure means waiting instead of breaking.',
          },
          {
            question: 'Which belongs in the request rather than the queue?',
            options: [
              'sending the receipt email',
              'writing the order row the confirmation page reads',
              'notifying analytics',
            ],
            correct: 1,
            why: 'The user immediately sees their order, so it must exist before the response. Deferred work is everything the user does not need in the next second.',
          },
        ],
        build: {
          simple: 'A queue lets work happen later.',
          actually:
            'A producer appends a message to durable storage; a consumer (worker) reads and does the work at its own pace. The request returns in milliseconds instead of waiting, spikes become a backlog workers drain steadily, and a failing downstream just delays messages instead of breaking checkout. Consumer lag is the health metric.',
          breaks:
            'The work is now eventual, not immediate, so "did it happen yet?" becomes a real question. Everything else in queueing (delivery guarantees, idempotency, retries) is the craft of answering that honestly.',
        },
        doThisNow: [
          {
            task: 'Split "user uploads a video" into must-happen-now vs can-go-on-a-queue. List both.',
            reveal:
              'Now: store the raw file, create the row, return an id. Queue: transcode, generate thumbnails, run moderation, notify subscribers. The page feels instant because everything heavy is deferred.',
          },
          {
            task: 'Reason about resilience: the email provider is down for an hour. With the receipt email behind a queue, what does the customer experience at checkout?',
            reveal:
              'Nothing wrong: checkout succeeds in milliseconds, the receipt message waits in the queue, and it sends once the provider recovers. The dependency moved from the request to the worker, where failure means waiting, not breaking.',
          },
        ],
        warStory:
          'A site sent welcome emails inline during signup. When the email vendor had a slow morning, signups took 30 seconds and many timed out, so the company lost users it had already convinced. Moving the email to a queue made signup instant and immune to the vendor\'s bad days.',
        tweak: {
          instruction: 'Split "user uploads a video" into now versus queue.',
          reveal:
            'Now: store the raw file, create the database row, return an id. Queue: transcode, generate thumbnails, run moderation, notify subscribers. Upload pages feel instant precisely because everything heavy is deferred.',
        },
        receipt: {
          explain: [
            'What belongs in the request vs on a queue.',
            'How queues turn spikes and outages into backlog instead of failures.',
          ],
          question: 'The worker might read the same message twice. Is that a bug, or something to expect?',
        },
        recap: [
          'Requests do the minimum; queues carry the rest to workers.',
          'Queues convert spikes and outages into backlog instead of failures.',
          'Consumer lag is the health metric of the whole arrangement.',
        ],
      },
    },
    {
      id: 'queues-rung-delivery',
      title: 'Module 2: At-Least-Once: Why Duplicates Are Normal',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 13,
      prompt:
        'Learn the delivery contract real queues offer, and why the same message will sometimes arrive twice.',
      explanation: `Queues make a promise about delivery, and the promise has a sharp edge.

**The ack cycle.** A worker receives a message, does the work, then acknowledges (acks) it, telling the queue to delete it. If the worker crashes before acking, the queue assumes the work did not happen and redelivers the message to another worker. That redelivery is the safety net.

**The sharp edge.** Suppose the worker finished the work and crashed just before the ack. The queue cannot tell the difference between "crashed before working" and "crashed after working, before acking". It redelivers either way, and the work happens twice.

**The contract.** This is at-least-once delivery: every message is processed one or more times. The alternative, at-most-once (ack before working), risks silently losing work on a crash, which is worse for almost everything. Exactly-once delivery, despite marketing, is achievable only as at-least-once plus deduplication on your side.

**The reframe.** Duplicates are weather. They are a normal, expected input that every consumer must handle, and the next module is the standard technique.`,
      production:
        'The duplicate-charge incident is the canonical version: a payment worker processed a charge, crashed before acking, and the redelivery charged the card again. Every team that runs queues either designs for duplicates or learns this lesson from a customer.',
      walkthrough: [
        'Trace the happy path: receive, work, ack, delete.',
        'Trace the crash-before-work path and see the safety net.',
        'Trace the crash-after-work path and see the duplicate.',
        'Say the contract out loud: at least once, so duplicates are input.',
      ],
      questions: [
        'Why does the queue redeliver unacked messages?',
        'Why can the queue never know whether the work happened?',
        'Why is at-most-once usually worse?',
      ],
      checklist: [
        'Explain the ack cycle.',
        'Trace both crash timings.',
        'State the at-least-once contract.',
      ],
      interactive: {
        coldOpen:
          'A payment worker charges a card, then crashes a millisecond before telling the queue "done." The queue, seeing no acknowledgment, assumes the work never happened and sends the message again. The card gets charged twice. This is not a bug in the queue; it is the contract working as designed. Why is the duplicate unavoidable?',
        mental:
          'A delivery driver needs a signature. If the customer takes the parcel and the signature pad dies, the depot sends the parcel again, because an unsigned delivery never happened as far as the depot knows.',
        diagram: {
          nodes: ['Deliver to worker', 'Work runs', 'Ack', 'Crash before ack', 'Redelivery'],
          explanations: [
            'The queue hands the message to a worker and starts a visibility timer.',
            'The worker sends the email, charges the card, transcodes the video.',
            'The ack tells the queue the message is done and can be deleted. This is the only proof the queue accepts.',
            'A crash between work and ack leaves the queue with no proof. From its side, nothing happened.',
            'The message is delivered again, and the work runs a second time. Safety against loss, at the price of duplicates.',
          ],
        },
        example: {
          code: "const queue = ['email:42'];\n\nfunction send(msg) {\n  console.log('sending', msg);\n}\n\nsend(queue[0]);\n\nsend(queue[0]);",
          output: 'sending email:42\nsending email:42',
          explain:
            'A redelivery after a lost ack is exactly this: the same message processed twice by code that never planned for it. User 42 gets two emails, or far worse, two charges.',
        },
        predicts: [
          {
            question: 'A worker charges a card, then crashes before acking. The queue will...',
            options: [
              'know the charge happened and delete the message',
              'redeliver, and the charge code runs again',
              'alert an operator',
            ],
            correct: 1,
            why: 'No ack means no proof. The queue’s only safe move against losing work is redelivery, which makes the duplicate your problem to handle.',
          },
          {
            question: 'Acking before doing the work (at-most-once) trades duplicates for...',
            options: [
              'nothing, it is strictly better',
              'silently lost work whenever a worker crashes mid-job',
              'slower processing',
            ],
            correct: 1,
            why: 'The message is already deleted when the crash hits, so the work never happens and nothing ever retries it. Lost work is invisible; duplicates at least leave evidence.',
          },
        ],
        build: {
          simple: 'A queue delivers each message to a worker.',
          actually:
            'A worker receives a message, does the work, then acks it so the queue deletes it. If it crashes before acking, the queue redelivers (the safety net against losing work). But it cannot tell "crashed before working" from "crashed after working, before acking," so it redelivers either way. That is at-least-once delivery.',
          breaks:
            'Every message is processed one OR MORE times, so duplicates are normal input, not a rare bug. "Exactly-once" is just at-least-once plus your own deduplication. At-most-once avoids duplicates but silently loses work on a crash, which is usually worse.',
        },
        doThisNow: [
          {
            task: 'Trace both crash timings: worker crashes (a) before doing the work, (b) after the work but before the ack. What does the queue do in each, and which causes a duplicate?',
            reveal:
              '(a) No work happened, queue redelivers, correct. (b) Work happened but no ack, queue redelivers anyway, so the work runs twice: a duplicate. The queue has no proof either way, so it always redelivers.',
          },
          {
            task: 'Rank the failure: which is worse, a duplicate receipt email or a lost password-reset email? Use it to justify at-least-once.',
            reveal:
              'Duplicate receipt: mildly annoying. Lost reset: a locked-out user and a support ticket. Loss is usually worse, which is why at-least-once (redeliver, risk duplicates) beats at-most-once (ack first, risk loss).',
          },
        ],
        warStory:
          'A subscription billing worker charged a card, then the box was killed by an autoscaler a moment before the ack. The queue redelivered and charged again. Dozens of customers were double-billed before anyone noticed. The queue did exactly what it promised; the consumer just was not built for duplicates.',
        tweak: {
          instruction: 'Decide which is worse for a receipt email versus a password reset email: duplicate or loss.',
          reveal:
            'Duplicate receipt: mildly annoying. Lost password reset: a user locked out and a support ticket. Loss is usually the worse failure, which is why at-least-once is the standard contract.',
        },
        receipt: {
          explain: [
            'Why the ack cycle makes duplicates unavoidable.',
            'Why at-least-once beats at-most-once for most work.',
          ],
          question: 'Duplicates are guaranteed. How do you write a worker that processing twice does no harm?',
        },
        recap: [
          'Ack is the only proof of work the queue accepts.',
          'Crash-after-work, before-ack produces duplicates by design.',
          'At least once is the contract: duplicates are normal input.',
        ],
      },
    },
    {
      id: 'queues-rung-idempotency',
      title: 'Module 3: Idempotent Consumers',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 14,
      prompt:
        'Make duplicates harmless: process each message id exactly once, no matter how many times it arrives.',
      explanation: `If duplicates are weather, idempotency is the umbrella.

**The definition.** An operation is idempotent when doing it twice has the same effect as doing it once. Setting status to "paid" is idempotent. Adding 10 to a balance is not: do it twice and the balance is wrong by 10.

**The standard technique.** Give every message a unique id at enqueue time. The consumer records processed ids; on receive, it checks the record first and skips anything already seen. The pattern is three lines: seen? skip : (do work, record id).

**The subtlety.** The check and the record must not race. Two workers receiving the same duplicate simultaneously can both pass the "seen?" check before either records. The fix is making the record atomic: a unique constraint in the database, or Redis SET NX. The constraint violation IS the duplicate detection.

**The other road.** Sometimes you can make the operation naturally idempotent instead of tracking ids: "set state to X" and "create with this specific key" can run any number of times safely. Where the operation allows it, this is simpler and stronger than bookkeeping.`,
      production:
        'Payment processors expose this as idempotency keys: send the same key twice and the second charge attempt returns the first result instead of charging again. Internally, every consumer that touches money, inventory, or email runs the same pattern. It is the single most asked-about queue topic in backend interviews.',
      walkthrough: [
        'Classify operations: set-to-value versus increment.',
        'Add a unique message id at enqueue time.',
        'Guard the consumer: check, work, record, with the record made atomic.',
        'Re-deliver a message on purpose and watch it skip.',
      ],
      questions: [
        'Why is "add 10" dangerous and "set to 50" safe?',
        'Where does the duplicate check race, and what fixes it?',
        'What does an idempotency key buy at a payment API?',
      ],
      checklist: [
        'Define idempotency with one safe and one unsafe example.',
        'Implement the check-work-record pattern.',
        'Explain the atomic record requirement.',
      ],
      interactive: {
        coldOpen:
          'You cannot stop a queue from delivering twice. So you build a worker where running twice does no harm. "Set status to paid" is safe to repeat; "add $10 to the balance" is a disaster to repeat. The pattern that makes any worker safe is three lines, with one subtle race that ruins it. What is the pattern, and where does it race?',
        mental:
          'An idempotent consumer is a passport stamp: the officer checks the page first, and a second trip through the booth changes nothing because the stamp is already there.',
        diagram: {
          nodes: ['Message + id', 'Seen check', 'Skip duplicate', 'Do the work', 'Record atomically'],
          explanations: [
            'Every message carries a unique id assigned when it was enqueued. The id is what makes "same message" detectable.',
            'The consumer consults the processed-ids record before any work.',
            'A hit means this exact message already ran. Acknowledge and move on; the duplicate becomes a no-op.',
            'A miss means first delivery: charge the card, send the email.',
            'The id is recorded with an atomic operation (unique constraint, SET NX), so two simultaneous duplicates cannot both pass the check.',
          ],
        },
        example: {
          code: "const seen = new Set();\n\nfunction processOnce(id, msg) {\n  if (seen.has(id)) {\n    console.log('skip duplicate', id);\n    return;\n  }\n  seen.add(id);\n  console.log('sending', msg);\n}\n\nprocessOnce('m1', 'email:42');\nprocessOnce('m1', 'email:42');",
          output: 'sending email:42\nskip duplicate m1',
          explain:
            'Same redelivery as the previous module, harmless this time. In production the Set is a database table or Redis, so the memory survives worker restarts.',
        },
        predicts: [
          {
            question: 'Which operation is already idempotent without any tracking?',
            options: [
              "balance = balance + 10",
              "status = 'shipped'",
              'append a row to the audit log',
            ],
            correct: 1,
            why: 'Setting a value to a constant lands in the same state no matter how many times it runs. Increments and appends accumulate, so they need the id guard.',
          },
          {
            question: 'Why must the seen-record be a database or Redis instead of an in-memory Set?',
            options: [
              'Sets are slow',
              'worker restarts wipe memory, and other workers cannot see it',
              'JavaScript Sets have size limits',
            ],
            correct: 1,
            why: 'The whole point is remembering across crashes and across workers. Per-process memory forgets exactly when the redelivery arrives.',
          },
        ],
        build: {
          simple: 'Make processing a message twice harmless.',
          actually:
            'An operation is idempotent when twice equals once. Give each message a unique id; the consumer checks a record of processed ids, skips anything seen, and otherwise does the work and records the id. Better still, make the operation naturally idempotent (set-to-value, upsert) so no bookkeeping is needed.',
          breaks:
            'The check-then-record can race: two duplicates arriving at once both pass "seen?" before either records. Fix it with an atomic record (a unique constraint or Redis SET NX); the constraint violation IS the duplicate detection. And the record must be in a database/Redis, not memory, or restarts forget it.',
        },
        doThisNow: [
          {
            task: 'Classify three operations as naturally idempotent or not: balance = balance + 10, status = \'shipped\', append a row to the audit log.',
            reveal:
              'status = \'shipped\' is idempotent (same state however many times). The increment and the append accumulate, so they need the id-guard. Where you can, rewrite to set-to-value instead of tracking ids.',
          },
          {
            task: 'See the guard work: run a check-work-record over the same id twice and confirm the second run skips.',
            command: 'node -e \'const seen=new Set(); const p=(id,m)=>seen.has(id)?console.log("skip",id):(seen.add(id),console.log("send",m)); p("m1","email:42"); p("m1","email:42")\'',
            reveal:
              '"send email:42" then "skip m1". The redelivery is now a no-op. In production the Set is a database table or Redis so the memory survives restarts and is shared across workers.',
          },
        ],
        warStory:
          'A team fixed double-charges with an in-memory Set of processed ids. It worked in testing and failed in production: each worker had its own Set, and a restart wiped it, so duplicates sailed through exactly when it mattered. Moving the record to a unique DB constraint made the dedup real and atomic.',
        tweak: {
          instruction: 'Call processOnce("m2", "email:43") after the existing lines and predict the output.',
          reveal:
            'sending email:43. New ids do work; repeated ids skip. Two behaviors, one three-line guard.',
        },
        receipt: {
          explain: [
            'The check-work-record pattern and why the record must be atomic.',
            'Why naturally idempotent operations beat id bookkeeping.',
          ],
          question: 'A worker fails because a downstream service is briefly down. Should it retry immediately, and how often?',
        },
        writeDrillId: 'architecture-idempotency',
        recap: [
          'Idempotent: twice has the same effect as once.',
          'Check the id, do the work, record the id atomically.',
          'Prefer naturally idempotent operations (set, upsert) where possible.',
        ],
      },
    },
    {
      id: 'queues-rung-retries',
      title: 'Module 4: Retries: Backoff And Jitter',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 13,
      prompt:
        'Retry transient failures without making the outage worse: exponential backoff plus jitter.',
      explanation: `Work fails for two different reasons, and only one deserves a retry.

**Transient versus permanent.** A network timeout or a 503 is transient: the same attempt may succeed in a minute. A malformed payload or a validation error is permanent: retrying replays the same failure forever. Consumers classify first, retry second.

**Why immediate retries hurt.** A downstream service stumbles, a thousand messages fail, and a thousand immediate retries arrive while it is still on the floor. Naive retries turn a stumble into a pile-on. Retrying is load, and load against a struggling service is how outages extend themselves.

**Exponential backoff.** Wait longer after each failure: 1s, 2s, 4s, 8s, capped at some maximum. Early retries catch blips; later ones give a real outage room to recover.

**Jitter.** Backoff alone synchronizes the herd: everything that failed together retries together, in waves. Adding randomness (anywhere from zero to the computed delay) spreads the retries smoothly. Backoff sets the schedule; jitter breaks the synchronization. Production retry policies use both, always.`,
      production:
        'AWS, Stripe, and Google client libraries all ship exponential backoff with jitter as the default, and their engineering blogs document why: retry storms have taken down recovering services seconds after they came back. The interview version of this question is "what happens when the service comes back up?"',
      walkthrough: [
        'Classify a timeout, a 503, and a validation error.',
        'Compute the backoff series for base 1s and a 60s cap.',
        'Explain the synchronized-wave problem backoff alone creates.',
        'Add jitter and say what changes on the receiving end.',
      ],
      questions: [
        'Why is retrying a validation error useless?',
        'What does the cap in the backoff series protect against?',
        'What problem does jitter solve that backoff does not?',
      ],
      checklist: [
        'Classify failures before retrying.',
        'Compute an exponential backoff series.',
        'Explain jitter in one sentence.',
      ],
      interactive: {
        coldOpen:
          'A downstream service stumbles. A thousand jobs fail, and your retries instantly send a thousand more requests at the service already on the floor, finishing it off. Then it recovers, and all thousand retry in the same instant and knock it down again. Retrying is load. How do you retry without turning a stumble into an outage?',
        mental:
          'Retrying without backoff is redialing a busy number nonstop; backoff is waiting longer between calls; jitter is the whole crowd not redialing in unison the second the line frees up.',
        diagram: {
          nodes: ['Failure', 'Transient?', 'Backoff delay', 'Add jitter', 'Retry or give up'],
          explanations: [
            'The attempt failed: timeout, 5xx, connection refused, or a permanent rejection.',
            'Permanent failures (bad payload, validation) skip retrying entirely; they go straight toward the dead letter module.',
            'Transient failures wait exponentially longer each attempt: 1s, 2s, 4s, 8s, capped.',
            'A random fraction of the delay spreads thousands of simultaneous failures into a smooth trickle.',
            'After max attempts the message escalates rather than retrying forever.',
          ],
        },
        example: {
          code: 'function backoff(attempt, base = 1000, cap = 60000) {\n  return Math.min(cap, base * 2 ** attempt);\n}\n\nconsole.log([0, 1, 2, 3, 4, 5].map((a) => backoff(a)));',
          output: '[ 1000, 2000, 4000, 8000, 16000, 32000 ]',
          explain:
            'Each attempt doubles the wait, capped at 60s. Production adds jitter: delay = random(0, backoff(attempt)), so a thousand workers retry at a thousand different moments.',
        },
        predicts: [
          {
            question: 'One thousand messages fail together at 12:00:00 with plain 2s-4s-8s backoff. At 12:00:02...',
            options: [
              'retries trickle in smoothly',
              'one thousand retries arrive in the same instant',
              'nothing happens',
            ],
            correct: 1,
            why: 'Identical schedules from an identical starting moment stay synchronized. The waves arrive together at 2s, 4s, 8s. Jitter exists to break exactly this.',
          },
          {
            question: 'A message fails validation (permanent). The right move is...',
            options: [
              'retry with backoff',
              'skip retries and route it to the dead letter queue',
              'retry once',
            ],
            correct: 1,
            why: 'The payload will be malformed on every attempt. Retrying burns capacity replaying a guaranteed failure; the DLQ path exists for it.',
          },
        ],
        build: {
          simple: 'If a job fails, try it again.',
          actually:
            'Classify first: transient failures (timeout, 503) deserve a retry; permanent ones (bad payload, validation) never will and skip straight to the dead-letter path. Retry transient failures with exponential backoff (1s, 2s, 4s, 8s, capped) plus jitter (randomize the delay) so the herd does not retry in synchronized waves.',
          breaks:
            'Immediate retries pile load on a struggling service and extend the outage. Backoff without jitter just moves the pile-on to 2s, 4s, 8s marks: synchronized waves. Retrying a permanent failure replays a guaranteed error forever, burning capacity.',
        },
        doThisNow: [
          {
            task: 'Compute the backoff series for base 1s, cap 60s, attempts 0-5. Then say what the cap protects against.',
            command: 'node -e \'const b=(a,base=1000,cap=60000)=>Math.min(cap,base*2**a); console.log([0,1,2,3,4,5].map(b))\'',
            reveal:
              '[1000, 2000, 4000, 8000, 16000, 32000]. Each attempt doubles the wait. The cap keeps attempt 10 from becoming a multi-hour wait. Production adds jitter: delay = random(0, backoff(attempt)).',
          },
          {
            task: 'Classify three failures and pick retry vs dead-letter: a network timeout, an HTTP 503, and a JSON validation error.',
            reveal:
              'Timeout and 503: transient, retry with backoff. Validation error: permanent, it will fail identically every time, so route it to the dead-letter queue instead of retrying.',
          },
        ],
        warStory:
          'A service recovered from a brief blip, and the instant it came back, every job that had failed retried at the exact same millisecond (backoff with no jitter) and knocked it down again. Three times. Adding jitter spread the retries into a smooth trickle and the recovery finally stuck.',
        tweak: {
          instruction: 'Change the base to 500 and the cap to 8000, and predict the series.',
          reveal: '[ 500, 1000, 2000, 4000, 8000, 8000 ]. The cap flattens the tail so attempt ten is not a 8-minute wait.',
        },
        receipt: {
          explain: [
            'Why backoff and jitter together prevent retry storms.',
            'Why permanent failures must not be retried.',
          ],
          command: 'node -e \'const b=(a)=>Math.min(60000,1000*2**a); console.log([0,1,2,3].map(b))\'',
          question: 'A message keeps failing after every retry. Where does it go so it stops clogging the queue?',
        },
        writeDrillId: 'architecture-backoff',
        recap: [
          'Classify first: transient retries, permanent never.',
          'Backoff doubles the wait per attempt, capped.',
          'Jitter desynchronizes the herd; production uses both.',
        ],
      },
    },
    {
      id: 'queues-rung-dlq',
      title: 'Module 5: Dead Letter Queues',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 12,
      prompt:
        'Give messages that keep failing somewhere to go: the DLQ, its alert, and its replay path.',
      explanation: `A message has now failed every retry. Something has to happen, and both naive options are bad: dropping it loses work silently, and retrying forever wedges a poison message at the front of the queue burning capacity.

**The dead letter queue.** After max attempts, the queue moves the message to a side queue, the DLQ, along with its error history. The main queue flows on; the failure is preserved instead of lost.

**A DLQ is an inbox, never a trash can.** Its entire value comes from three attachments: an alert when messages land (and on depth growth), enough context to diagnose (payload, attempt count, last errors), and a replay path so that after the bug is fixed, an operator can push the messages back through the now-working consumer. The work completes late instead of never.

**What lands there.** Poison messages (malformed payloads that crash the consumer), bugs in handler code, and outages that outlasted the whole retry schedule. Each gets a different response: fix the producer, fix the consumer, or just replay.

**The metric.** DLQ depth should be zero. Anything above is a pile of broken promises with names and payloads, which is exactly what makes it actionable.`,
      production:
        'The grim discovery in many a postmortem is a DLQ that had been collecting silently for weeks: thousands of unsent receipts or unsynced records, found only when a customer asked. A DLQ without an alert is a trash can with extra steps. SQS, RabbitMQ, and every serious queue system ship DLQ support natively.',
      walkthrough: [
        'Set max attempts so retries end.',
        'Route exhausted messages to the DLQ with their error history.',
        'Alert on DLQ depth above zero.',
        'Write the replay runbook: diagnose, fix, push back through.',
      ],
      questions: [
        'Why is retrying forever as bad as dropping?',
        'What three things make a DLQ useful instead of a trash can?',
        'What does a poison message do to a queue without a DLQ?',
      ],
      checklist: [
        'Explain when a message moves to the DLQ.',
        'Name the alert, context, and replay requirements.',
        'Describe the operator flow after a bug fix.',
      ],
      interactive: {
        coldOpen:
          'A message has now failed every retry. Drop it and you lose work silently; retry it forever and one poison message wedges the whole queue. There is a third door, and the most common postmortem sentence in the world is "the dead letter queue had been filling up silently for three weeks." What makes that door useful instead of a quiet graveyard?',
        mental:
          'The DLQ is the returns desk: failed deliveries wait there with their paperwork attached, someone is paged when the pile grows, and after the address is fixed the parcels go back out for delivery.',
        diagram: {
          nodes: ['Retries exhausted', 'Move to DLQ', 'Alert fires', 'Diagnose', 'Replay'],
          explanations: [
            'The message failed its final attempt. Backoff is done; the consumer will never succeed on this one as things stand.',
            'The queue moves it aside with payload, attempt count, and the error from each try. The main queue keeps flowing.',
            'Depth above zero pages someone. An unwatched DLQ silently converts failures into lost work.',
            'The error history says whether this is a poison payload, a consumer bug, or an outage that outlived the retry schedule.',
            'After the fix, the operator pushes the messages back through the consumer. Late beats never.',
          ],
        },
        example: {
          code: "# A message's journey to the DLQ:\n\nattempt 1   12:00:00   timeout\nattempt 2   12:00:02   timeout\nattempt 3   12:00:06   HTTP 500\nattempt 4   12:00:14   HTTP 500\nattempt 5   12:00:30   HTTP 500\n\n-> moved to orders-dlq with all five errors attached\n-> alert: orders-dlq depth = 1",
          output:
            'main queue: unblocked, flowing\nthe failure: preserved with full history\non-call: paged with everything needed to diagnose',
          explain:
            'Five attempts across thirty seconds, then escalation to a human. Nothing dropped, nothing wedged, and the message can be replayed once the 500s are fixed.',
        },
        predicts: [
          {
            question: 'A malformed message crashes the consumer on every attempt, and there is no DLQ. The queue...',
            options: [
              'skips it automatically',
              'wedges: the poison message blocks or burns capacity forever',
              'fixes the message',
            ],
            correct: 1,
            why: 'It will be redelivered and crash the consumer in a loop. The DLQ is the escape hatch that gets it out of the way while preserving it.',
          },
          {
            question: 'A DLQ with no alert configured is effectively...',
            options: [
              'fine, you check it weekly',
              'silent data loss with a delay',
              'a performance optimization',
            ],
            correct: 1,
            why: 'Work lands there and nobody knows. The failures are preserved in theory and lost in practice until a customer complaint triggers the archaeology.',
          },
        ],
        build: {
          simple: 'Messages that keep failing go to a dead letter queue.',
          actually:
            'After max attempts, the queue moves the message to a side queue with its error history, so the main queue flows on and nothing is lost. A DLQ is only useful with three attachments: an alert on depth above zero, enough context to diagnose, and a replay path to push fixed messages back through. Target depth is zero.',
          breaks:
            'Without a DLQ, a poison message wedges the queue in a crash loop forever. With a DLQ but no alert, failures pile up silently and become lost work discovered weeks later by a customer complaint. A DLQ without an alert is a trash can with extra steps.',
        },
        doThisNow: [
          {
            task: 'Decide the operator response for two DLQ situations: a poison payload from a buggy producer, and 400 messages from a 2-hour downstream outage.',
            reveal:
              'Poison: fix the producer, then discard or transform the bad message (replaying it unchanged just crashes again). Outage backlog: pure replay, the consumer was never wrong. The error history tells you which case you have.',
          },
          {
            task: 'Name the one thing that turns a DLQ from "silent data loss with a delay" into a safety net. What must you add?',
            reveal:
              'An alert on depth > 0. Work lands in an unwatched DLQ and nobody knows until a customer asks. The alert is what makes the preserved failures actually actionable.',
          },
        ],
        warStory:
          'A team discovered their receipts DLQ had quietly collected 12,000 messages over a month: 12,000 customers who never got a receipt. There was a DLQ, but no alert on it. They wired a page on depth > 0, replayed the backlog, and never let a DLQ go unwatched again.',
        tweak: {
          instruction: 'Decide what the operator does for: a poison payload from a buggy producer, versus 400 messages from a 2-hour outage.',
          reveal:
            'Poison: fix the producer, then discard or transform the bad message; replaying it unchanged just crashes again. Outage backlog: pure replay, the consumer was never wrong. The error history is what tells you which case you have.',
        },
        receipt: {
          explain: [
            'When a message moves to the DLQ and what travels with it.',
            'The alert/context/replay trio that makes a DLQ an inbox, not a graveyard.',
          ],
          question: 'Some workloads need messages handled in order. How do queues give you ordering and parallelism at once?',
        },
        writeDrillId: 'queue-dlq',
        recap: [
          'After max attempts, messages move aside with their error history.',
          'Alert, context, replay: the three things that make a DLQ an inbox.',
          'DLQ depth should be zero, and someone is paged when it is not.',
        ],
      },
    },
    {
      id: 'queues-rung-ordering',
      title: 'Module 6: Ordering, Partitions, And Fan-Out',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 14,
      prompt:
        'Scale beyond one worker without breaking order: partition by key, and fan out with pub/sub.',
      explanation: `One worker processes messages in order, slowly. Ten workers process fast, in no order at all: worker B finishes "update shipped" before worker A finishes "create order", and the database writes happen backwards.

**The honest question.** Total order across everything is incompatible with parallelism. The almost-always answer is that you only need order within an entity: order 42's events must stay sequenced; order 42 versus order 99 can happen in any order.

**Partitions.** Split the queue into N lanes. Each message routes by a key: hash(orderId) % N. Same key, same partition, always; one consumer owns each partition and processes it sequentially. Per-key order preserved, N-way parallelism gained. This is the heart of Kafka and of FIFO queue message groups.

**The trap.** A hot key (one celebrity account, one giant tenant) saturates its single lane while others idle. Partitioning distributes load only as well as the keys do.

**Fan-out: pub/sub.** A queue delivers each message to one consumer. A topic delivers each event to every subscribed consumer group: the order-placed event drives email, analytics, and inventory simultaneously, with each subscriber maintaining its own position. Queues distribute work; topics broadcast facts. Real systems use both, often chained.`,
      production:
        'Out-of-order processing causes real money bugs: refund-before-charge, ship-before-pay, state machines walked backwards. Partition keys are the standard answer, and "how do you scale consumers without breaking order?" is a top-three queue interview question. The hot-partition pager alert is its production sequel.',
      walkthrough: [
        'Name the entity whose events must stay ordered.',
        'Route by hash(entityId) % N and confirm same key, same lane.',
        'Identify your hottest key and its lane-saturation risk.',
        'Split work-distribution (queue) from event-broadcast (topic) in a flow you know.',
      ],
      questions: [
        'Why does adding workers break global ordering?',
        'What exactly does partitioning by key guarantee?',
        'When do you want a topic instead of a queue?',
      ],
      checklist: [
        'Choose a partition key for a real workload.',
        'Explain per-key versus total ordering.',
        'Distinguish queue semantics from pub/sub semantics.',
      ],
      interactive: {
        coldOpen:
          'You add workers to drain the queue faster, and orders start shipping before they are paid for. Ten workers process in no shared order, so "ship" finishes before "create" and the database is written backwards. But you cannot give up parallelism. How do you get speed AND keep each order\'s events in sequence?',
        mental:
          'Partitions are supermarket checkout lanes with a rule: your whole family must use the same lane, in arrival order. Different families in parallel, each family sequential. Pub/sub is the store loudspeaker: one announcement, every department hears it.',
        diagram: {
          nodes: ['Message + key', 'hash(key) % N', 'Same key, same lane', 'One consumer per lane', 'Topic: all hear'],
          explanations: [
            'Each message carries the id of the entity whose order matters: the order id, the user id, the account.',
            'The hash routes deterministically. Nothing is remembered; the math itself is the guarantee.',
            'Every event for order 42 lands in the same lane forever, behind its predecessors.',
            'Each lane has exactly one consumer, so within a lane processing is sequential. Across lanes, full parallelism.',
            'Pub/sub is the other shape: one event, many independent subscriber groups, each with its own pace and position.',
          ],
        },
        example: {
          code: "function partitionFor(key, partitions) {\n  let h = 0;\n  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) | 0;\n  return Math.abs(h) % partitions;\n}\n\nconsole.log(partitionFor('user-42', 4));\nconsole.log(partitionFor('user-42', 4));\nconsole.log(partitionFor('user-7', 4));",
          output: '0\n0\n3',
          explain:
            'user-42 routes to lane 0 every single time, so their events stay ordered behind each other. user-7 lands in lane 3 and processes in parallel.',
        },
        predicts: [
          {
            question: 'Order 42 has events create, pay, ship. With partitioning by order id, can ship process before create?',
            options: [
              'yes, parallelism is parallelism',
              'no: same key means same lane means sequential',
              'only on Tuesdays',
            ],
            correct: 1,
            why: 'All three events share the key, share the lane, and one consumer drains that lane in order. Cross-order parallelism is untouched.',
          },
          {
            question: 'One tenant generates 80% of all messages. Partitioning by tenant id gives you...',
            options: [
              'perfectly balanced lanes',
              'one saturated lane and N-1 idle ones',
              'an error',
            ],
            correct: 1,
            why: 'The hot key owns one lane by design. Fixes involve a finer-grained key for that tenant or special-casing them, and noticing requires per-partition lag metrics.',
          },
          {
            question: 'Email, analytics, and inventory all need the order-placed event. The right shape is...',
            options: [
              'one queue, three competing consumers',
              'a topic with three subscriber groups',
              'three API calls from the checkout handler',
            ],
            correct: 1,
            why: 'A queue would give each message to exactly one of the three. A topic broadcasts to all groups independently. The API-call option is the inline coupling queues exist to remove.',
          },
        ],
        build: {
          simple: 'Add workers to go faster.',
          actually:
            'Total order across everything kills parallelism, but you usually only need order within an entity. Partition the queue into N lanes by hash(entityId) % N: same key always lands in the same lane, one consumer drains each lane sequentially. Per-key order plus N-way parallelism. Pub/sub topics broadcast one event to many subscriber groups.',
          breaks:
            'A hot key (one whale tenant) saturates its single lane while others idle, because partitioning balances only as well as the keys do. And resizing partition count reshuffles keys, which is why counts are chosen generously upfront.',
        },
        doThisNow: [
          {
            task: 'Prove deterministic routing: hash the same key twice and a different key once across 4 partitions. Confirm same key, same lane.',
            command: 'node -e \'const p=(k,n)=>{let h=0;for(const c of k)h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)%n}; console.log(p("user-42",4),p("user-42",4),p("user-7",4))\'',
            reveal:
              'Something like 0, 0, 3: user-42 always lands in the same lane (its events stay ordered), user-7 lands elsewhere and runs in parallel. The math itself is the ordering guarantee.',
          },
          {
            task: 'Pick the shape: email, analytics, and inventory all need the order-placed event. Queue or topic, and why?',
            reveal:
              'A topic with three subscriber groups. A queue gives each message to exactly one consumer; a topic broadcasts to all groups independently, each at its own pace. Queues distribute work; topics broadcast facts.',
          },
        ],
        warStory:
          'A payments team scaled to 12 workers and started seeing refunds processed before the original charge. Same-entity events were spread across workers and ran out of order. Partitioning by account id (same account, same lane) fixed it without giving up the throughput of the other 11 workers.',
        tweak: {
          instruction: 'Run partitionFor("user-42", 8) in your head: does changing N change the lane?',
          reveal:
            'Yes, the modulo changes, so resizing partition counts reshuffles keys. This is why partition counts are chosen generously upfront, and why consistent hashing exists for systems that resize often.',
        },
        receipt: {
          explain: [
            'How partitioning by key gives per-entity order with parallelism.',
            'When to use a topic (broadcast) instead of a queue (distribute).',
          ],
          question: 'Async work is solid. How do you prove code works before it ever reaches production?',
        },
        writeDrillId: 'msg-partition',
        recap: [
          'Order within a key, parallelism across keys: hash(key) % N.',
          'Hot keys saturate their lane; watch per-partition lag.',
          'Queues distribute work to one consumer; topics broadcast to all groups.',
        ],
      },
    },
  ],
}

export const testingSubject: Subject = {
  id: 'testing',
  title: 'Testing & Quality',
  subtitle:
    'From zero: why tests exist, the pyramid, assertions, table-driven cases, failure paths, test doubles, and deterministic time.',
  icon: TestTubeIcon,
  color: '#0d9488',
  problems: [
    {
      id: 'testing-rung-why',
      title: 'Module 1: Why Tests Exist, And The Pyramid',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 12,
      prompt:
        'Understand what a test buys you, and how unit, integration, and end-to-end tests divide the work.',
      explanation: `A test is a small program that runs your code with known inputs and complains when the output is wrong. That is the whole mechanism. What it buys is bigger than it looks.

**The real product is the safety net.** The first run proves the code works today. Every run after that proves nobody broke it since, including you, six months from now, refactoring with no memory of the edge cases. Tests convert "I think this still works" into a command you can run.

**The pyramid.** Unit tests check one function in isolation: thousands of them, milliseconds each. Integration tests check pieces working together, like a handler hitting a real test database: fewer, slower. End-to-end tests drive the whole running system like a user: a handful, seconds each, the most realistic and the most fragile. The pyramid shape (many unit, some integration, few e2e) exists because cost and flakiness climb as you go up.

**What makes code testable.** Pure logic with inputs and returns is trivially testable. Code that grabs globals, reads the clock, and calls networks mid-function is painful. The discipline that returns values instead of printing, from every language ladder on this site, was always about this.`,
      production:
        'Teams without tests do not ship slower; they ship scared. Every change risks distant breakage, so changes shrink, refactors stop, and the codebase ossifies. The test suite wired into CI (the DevOps course) is what makes "merge it" a calm sentence.',
      walkthrough: [
        'Say what one test asserts: known input, expected output.',
        'Place unit, integration, and e2e on the pyramid with counts.',
        'Explain why the pyramid narrows at the top.',
        'Name what makes a function easy or painful to test.',
      ],
      questions: [
        'What does a passing suite actually certify?',
        'Why not write mostly end-to-end tests, since they are most realistic?',
        'What design choices make code testable?',
      ],
      checklist: [
        'Define the three pyramid layers.',
        'Explain the cost/flakiness gradient.',
        'Connect testability to pure functions.',
      ],
      interactive: {
        coldOpen:
          'You refactor a payment function on a Friday. Without tests, you "think" it still works and push it, then spend the weekend on a customer-reported bug. With 2,000 tests passing, you know every behavior they describe still holds. Tests are not about proving you are smart now; they are a gift to the you of six months from now. Where should they concentrate?',
        mental:
          'A test suite is a smoke detector wired through the whole house: silent while things are fine, loud the moment something starts burning, and valuable precisely because it is always on.',
        diagram: {
          nodes: ['Unit: many, fast', 'Integration: some', 'E2E: few', 'CI runs all'],
          explanations: [
            'One function, isolated, milliseconds. Hundreds or thousands of these form the base. When one fails, it points at the exact function.',
            'Several pieces together: a route handler against a real test database, a service calling a real queue. Slower, and failures need some diagnosis.',
            'The whole system driven like a user: browser to API to database. Most realistic, slowest, flakiest, so you keep only the critical paths here.',
            'Continuous integration runs the entire pyramid on every change, which is what turns tests from a habit into a guarantee.',
          ],
        },
        example: {
          code: '# The same bug caught at each layer:\n\nunit:         add(2, 2) returned 5            (3ms, points at add)\nintegration:  POST /orders total was wrong     (300ms, points at the route)\ne2e:          checkout page showed $5.00       (8s, points at... something)',
          output:
            'lower layers: faster, more precise, cheaper to run thousands of times\nhigher layers: more realistic, slower, vaguer when they fail',
          explain:
            'All three catch the bug. The unit test catches it in milliseconds and names the function. That precision-per-cost is why the pyramid is wide at the bottom.',
        },
        predicts: [
          {
            question: 'A suite of 2,000 tests passes in CI after your refactor. What do you now know?',
            options: [
              'the code is bug-free',
              'every behavior the tests describe still holds',
              'nothing useful',
            ],
            correct: 1,
            why: 'Tests certify exactly what they check. That is weaker than "no bugs" and far stronger than hope: every described behavior survived your refactor.',
          },
          {
            question: 'Why keep only a handful of end-to-end tests?',
            options: [
              'they are too realistic',
              'they are slow and flaky, so each one must earn its place',
              'browsers are expensive',
            ],
            correct: 1,
            why: 'An e2e test crosses every network hop and timing window, so it fails for reasons besides bugs. A few on critical paths buy realism; hundreds buy a red suite nobody trusts.',
          },
        ],
        build: {
          simple: 'Tests check that your code works.',
          actually:
            'A test runs code with known input and complains on wrong output, certifying exactly the behaviors it describes. The pyramid: many fast, precise unit tests at the base; some integration tests (a handler against a real test DB); few end-to-end tests on critical paths. CI runs all of it on every change.',
          breaks:
            'Top-heavy suites are slow and flaky: e2e tests cross every network hop and timing window, so they fail for reasons besides bugs. A hundred e2e tests buy a red suite nobody trusts; a handful on critical paths buy realism.',
        },
        doThisNow: [
          {
            task: 'Classify three tests by layer: slugify("Hello World"), GET /users against a test database, a Playwright signup flow.',
            reveal:
              'Unit, integration, e2e, in that order. The isolation level decides the layer, never the tool. Most of your tests should be the first kind: fast and precise.',
          },
          {
            task: 'Run a trivial assertion to feel the loop: assert that 2 + 2 is 4, and see what a failing one looks like.',
            command: 'node -e \'const a=require("assert"); a.equal(2+2,4); console.log("pass"); a.equal(2+2,5)\'',
            reveal:
              'It prints "pass", then throws AssertionError: 4 == 5 on the bad line. A test is exactly this: known input, assert the output, get loud on mismatch.',
          },
        ],
        warStory:
          'A team with no tests refactored their tax calculation and shipped it confidently. It was subtly wrong for one country, and they found out from an angry customer three weeks later. A single unit test on the tax function would have caught it in milliseconds, before the commit ever landed.',
        tweak: {
          instruction: 'Classify these: a test of slugify("Hello World"), a test of GET /users against a test DB, a Playwright signup flow.',
          reveal: 'Unit, integration, e2e, in that order: isolation level decides the layer, never the tool used.',
        },
        receipt: {
          explain: [
            'What a passing suite does and does not certify.',
            'Why the test pyramid is wide at the bottom.',
          ],
          command: 'node -e \'require("assert").equal(2+2,4)\'',
          question: 'You know tests matter. What are the three parts every single test is built from?',
        },
        recap: [
          'A test runs code with known input and complains on wrong output.',
          'The suite is a safety net for the you of six months from now.',
          'Many unit, some integration, few e2e: cost and flakiness climb upward.',
        ],
      },
    },
    {
      id: 'testing-rung-assertions',
      title: 'Module 2: Anatomy Of A Test: Arrange, Act, Assert',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 12,
      prompt:
        'Write your first real test: set up input, run the code, assert on the result.',
      explanation: `Every test in every framework has the same skeleton, named arrange-act-assert.

**Arrange** builds the input and any needed state. **Act** calls the code under test, once. **Assert** compares the result to the expected value and fails loudly on mismatch. Reading a test top to bottom should tell a tiny story: given this, when that runs, expect this.

**The assertion is the teeth.** assertEqual(actual, expected) throws when they differ, and that thrown error is what turns a script into a test: frameworks catch it, mark the test red, and fail the build. A test that checks nothing passes forever and protects nothing.

**One behavior per test.** A test named "add handles negatives" that also checks zero and strings will fail ambiguously. Small tests with specific names turn a red suite into a diagnosis: the name of the failing test IS the bug report.

**Failure messages matter.** "expected 5, got 4" beats "test failed". You write the message once; you read it at 2am many times.`,
      production:
        'Test frameworks (Jest, pytest, xUnit) are organized assertion runners: they find tests, run them, catch assertion errors, and report. Understanding that an assertion is just a conditional throw demystifies the whole category, and writing one by hand makes every framework feel familiar afterward.',
      walkthrough: [
        'Write the three sections in order with a blank line between.',
        'Call the code under test exactly once in act.',
        'Assert with a message that names expected and actual.',
        'Name the test after the behavior it pins down.',
      ],
      questions: [
        'What does each of the three As contain?',
        'Why must an assertion throw rather than log?',
        'What makes a failure message useful?',
      ],
      checklist: [
        'Structure a test as arrange, act, assert.',
        'Write an assertion that throws with context.',
        'Name tests after behaviors.',
      ],
      interactive: {
        coldOpen:
          'Here is a test that passes forever and protects nothing: it calls the function and never checks the result. Green, toothless, and worse than no test because it radiates false confidence. Every real test has exactly three parts, and skipping the third is how this happens. What are they?',
        mental:
          'A test is a lab experiment with a written hypothesis: prepare the sample (arrange), run the procedure (act), compare against the prediction (assert), and a mismatch means the experiment screams.',
        diagram: {
          nodes: ['Arrange', 'Act', 'Assert', 'Throw on mismatch'],
          explanations: [
            'Build inputs and state: the user object, the cart with three items, the date.',
            'Invoke the code under test, once. Two acts in one test means you no longer know which one failed.',
            'Compare actual against expected. This line is the entire reason the test exists.',
            'The mismatch throws with a message naming both values. The framework catches it, the test goes red, the build fails, the bug is caught before users meet it.',
          ],
        },
        example: {
          code: "function assertEqual(actual, expected) {\n  if (actual !== expected) throw new Error(`expected ${expected}, got ${actual}`);\n  console.log('ok');\n}\n\nfunction add(a, b) {\n  return a + b;\n}\n\nassertEqual(add(2, 2), 4);\n\ntry {\n  assertEqual(add(2, 2), 5);\n} catch (e) {\n  console.log('FAIL:', e.message);\n}",
          output: 'ok\nFAIL: expected 5, got 4',
          explain:
            'The first assertion passes silently, which is what passing should be. The second throws with both values in the message. Every test framework is this pattern with reporting around it.',
        },
        predicts: [
          {
            question: 'A test calls the function but never asserts anything. It will...',
            options: [
              'fail',
              'pass forever, protecting nothing',
              'warn',
            ],
            correct: 1,
            why: 'No assertion means no way to go red (unless the code throws on its own). Green-but-toothless tests are worse than absent ones because they radiate false confidence.',
          },
          {
            question: 'Why is `expected 5, got 4` better than `test failed`?',
            options: [
              'it is shorter',
              'the reader starts debugging with both values already in hand',
              'frameworks require it',
            ],
            correct: 1,
            why: 'Failure messages are read during incidents and late-night debugging. Carrying the actual and expected values saves the first ten minutes of every investigation.',
          },
        ],
        build: {
          simple: 'A test sets up data, runs code, and checks the result.',
          actually:
            'Arrange (build inputs and state), Act (call the code under test once), Assert (compare actual to expected). The assertion is a conditional throw, and the throw is what makes the test able to go red. Failure messages must carry both values.',
          breaks:
            'A test with no assertion passes forever and protects nothing. And "test failed" with no values forces you to add print statements; "expected 5, got 4" starts the debugging with both numbers in hand.',
        },
        doThisNow: [
          {
            task: 'Run a tiny arrange-act-assert by hand: define add, assert add(2,2) is 4, then watch a wrong expectation fail with both values.',
            command: 'node -e \'const eq=(a,e)=>{if(a!==e)throw new Error(`expected ${e}, got ${a}`);console.log("ok")}; const add=(a,b)=>a+b; eq(add(2,2),4); try{eq(add(2,2),5)}catch(e){console.log("FAIL:",e.message)}\'',
            reveal:
              '"ok" then "FAIL: expected 5, got 4". Passing is silent; failing names both values. Every test framework is this pattern with reporting wrapped around it.',
          },
          {
            task: 'Design a behavior by writing its assertion first: what should assertEqual(slugify("Hello World"), ?) expect?',
            reveal:
              '"hello-world" (or whatever your contract says). Writing the expected value first is the test designing the behavior: the core idea behind test-driven development.',
          },
        ],
        warStory:
          'A reviewer found a test file full of green tests that called functions but never asserted anything; someone had deleted the assertions to "make the build pass" during a crunch. The suite was 100% green and 0% protective. A bug shipped through it the same week. An assertion-free test is a lie that compiles.',
        tweak: {
          instruction: 'Write the assertion for a slugify function: assertEqual(slugify("Hello World"), ?).',
          reveal:
            '"hello-world", or whatever your contract says. Writing the expected value first is the test designing the behavior, which is the entire idea behind test-driven development.',
        },
        receipt: {
          explain: [
            'The arrange-act-assert structure of every test.',
            'Why an assertion-free test is worse than no test.',
          ],
          command: 'node -e \'require("assert").equal(slugify?.("a"),"a")\'',
          question: 'Your second test looks just like your first with different numbers. How do you cover many cases without copy-paste?',
        },
        writeDrillId: 'test-assert-same',
        recap: [
          'Arrange, act, assert: every test, every framework.',
          'An assertion is a conditional throw; the throw is the teeth.',
          'Failure messages carry expected and actual, always.',
        ],
      },
    },
    {
      id: 'testing-rung-table',
      title: 'Module 3: Table-Driven Tests',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 12,
      prompt:
        'Test many cases without copy-paste: a table of inputs and expected outputs, one loop.',
      explanation: `The second test you write for a function looks exactly like the first with different numbers. The fifth one too. Table-driven testing extracts the pattern.

**The shape.** A list of cases, each holding inputs and the expected output, plus one loop that runs every case through the same arrange-act-assert. Adding coverage becomes adding a row, which is so cheap that coverage actually happens.

**Choosing rows.** This is where the testing skill lives. The happy path, then the boundaries: zero, negative numbers, the empty string, the empty list, the maximum, the one-past-the-maximum. Bugs cluster at edges, so rows should too. A table with five happy-path rows and no edges is five copies of one test.

**Per-row identification.** When row seven fails, the output must say which row and what differed, or you will be adding print statements to your own tests. Include the inputs in the failure message.

**Regression rows.** Every production bug becomes a permanent row: the exact input that broke, the output that should have happened. The bug can never quietly return, and the table becomes a fossil record of everything the function ever got wrong.`,
      production:
        'Parsers, validators, formatters, price calculators, and permission checks all have table-shaped test suites in real codebases, frequently dozens of rows deep. Frameworks formalize the pattern as parameterized tests (test.each in Jest, pytest.mark.parametrize), and recognizing it makes those features obvious.',
      walkthrough: [
        'Extract the repeated test into cases plus a loop.',
        'Add boundary rows: zero, negative, empty.',
        'Make the failure message name the row’s inputs.',
        'Add a regression row for the last bug you remember.',
      ],
      questions: [
        'What does the table remove, and what does it keep?',
        'Where do bugs cluster, and what does that imply for rows?',
        'Why do production bugs become permanent rows?',
      ],
      checklist: [
        'Convert repeated tests into a table.',
        'Choose boundary-heavy rows.',
        'Identify failing rows by their inputs.',
      ],
      interactive: {
        coldOpen:
          'Most test suites are five copies of the same happy-path test with different numbers, proving the same thing five times while the real bugs hide at the edges: the empty cart, the 100% discount, the value one past the maximum. There is a shape that makes adding an edge case cost one line, so coverage actually happens. What is it?',
        mental:
          'A table-driven test is a gauntlet: the function walks a corridor of challengers one by one, and the report names exactly which challenger landed the hit.',
        diagram: {
          nodes: ['Case table', 'One loop', 'Assert per row', 'Name the row'],
          explanations: [
            'Each row is inputs plus expected output. The table reads as a specification of the function.',
            'One loop runs every row through identical arrange-act-assert, so there is exactly one copy of the test logic.',
            'Each row asserts independently; one failing row does not hide the others.',
            'The failure output includes the row’s inputs, so "row 7 failed" never requires archaeology.',
          ],
        },
        example: {
          code: "function add(a, b) {\n  return a + b;\n}\n\nconst cases = [\n  [2, 2, 4],\n  [0, 5, 5],\n  [-1, 1, 0],\n];\n\nfor (const [a, b, want] of cases) {\n  const got = add(a, b);\n  console.log(got === want ? `pass: add(${a}, ${b})` : `FAIL: add(${a}, ${b}) gave ${got}`);\n}",
          output: 'pass: add(2, 2)\npass: add(0, 5)\npass: add(-1, 1)',
          explain:
            'Three behaviors, one test body, and every line of output names its inputs. A fourth behavior costs one more row.',
        },
        predicts: [
          {
            question: 'Which row is most likely to catch a bug in a discount calculator?',
            options: [
              'a normal $50 cart',
              'a $0 cart, a 100% discount, and a discount larger than the total',
              'two more normal carts',
            ],
            correct: 1,
            why: 'Boundaries are where logic bends: empty, zero, maximum, past-maximum. Happy-path rows mostly re-prove what the first row proved.',
          },
          {
            question: 'A bug ships: add(0.1, 0.2) returned 0.30000000000000004 where money math expected 0.3. After fixing, you should...',
            options: [
              'move on',
              'add the exact case as a permanent row',
              'delete the table',
            ],
            correct: 1,
            why: 'A regression row makes the specific bug unrepeatable. Suites grow rows the way codebases grow scars, and that is healthy.',
          },
        ],
        build: {
          simple: 'Test many inputs with a list and a loop.',
          actually:
            'A table of cases (inputs plus expected output) and one loop running each through identical arrange-act-assert. Adding coverage becomes adding a row. Choose rows at the boundaries (zero, negative, empty, maximum, one-past) where bugs cluster, and put the inputs in the failure message so a failing row names itself.',
          breaks:
            'A table of five happy-path rows is five copies of one test. The skill is the rows, not the loop. And a failure that says only "row 7 failed" without the inputs sends you back to adding print statements.',
        },
        doThisNow: [
          {
            task: 'Run a table-driven test: loop over cases for add, including a boundary, and print pass/fail per row with inputs named.',
            command: 'node -e \'const add=(a,b)=>a+b; for(const [a,b,w] of [[2,2,4],[0,5,5],[-1,1,0]]){const g=add(a,b); console.log(g===w?`pass add(${a},${b})`:`FAIL add(${a},${b}) gave ${g}`)}\'',
            reveal:
              'Three passes, each naming its inputs. A fourth behavior costs exactly one more row. That low marginal cost is why table-driven coverage actually happens.',
          },
          {
            task: 'Pick the row most likely to catch a bug in a discount calculator: a normal $50 cart, or a $0 cart plus a 100% discount plus a discount larger than the total?',
            reveal:
              'The boundary set. Empty, zero, maximum, and past-maximum are where logic bends. Another normal cart just re-proves the first one. Rows belong at the edges.',
          },
        ],
        warStory:
          'A money function shipped with add(0.1, 0.2) returning 0.30000000000000004, a classic floating-point bug. After fixing it, the team added that exact case as a permanent table row. It never regressed again. Production bugs become rows the way codebases grow scars: each one makes a specific failure unrepeatable.',
        tweak: {
          instruction: 'Add the row [-5, -5, -10] and predict the output line.',
          reveal: 'pass: add(-5, -5). One row, one new pinned behavior. The marginal cost of coverage is what the table optimizes.',
        },
        receipt: {
          explain: [
            'How a case table plus one loop removes copy-paste.',
            'Why rows belong at boundaries and why bugs become permanent rows.',
          ],
          command: 'node -e \'for(const c of [[2,2,4]]){/* assert */}\'',
          question: 'Tests so far check success. How do you test that code fails correctly when it should?',
        },
        writeDrillId: 'test-run-cases',
        recap: [
          'Cases in a table, logic in one loop.',
          'Rows live at the boundaries, where the bugs are.',
          'Every production bug becomes a permanent regression row.',
        ],
      },
    },
    {
      id: 'testing-rung-failure',
      title: 'Module 4: Testing The Failure Paths',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 12,
      prompt:
        'Half the code is error handling: assert that the right errors happen at the right times.',
      explanation: `Tests that only cover success leave the error half of the code unverified, and the error half runs during your worst moments.

**Asserting a throw.** "Withdrawing more than the balance throws InsufficientFunds" is a behavior, exactly like a return value. The pattern inverts the usual logic: run the code, and if it does NOT throw, the test fails; if it throws the wrong thing, the test also fails. Frameworks wrap this as expect(...).toThrow() and pytest.raises.

**The wrong-error case matters.** A test that accepts any throw will happily pass when your validation crashes on a typo before reaching its check. Asserting the error type or message pins the actual behavior.

**Returned errors too.** Failure also arrives as return values: the {ok: false, error} shape, the 400 response from a handler. Same discipline, normal assertions: feed invalid input, assert the error shape, assert the status code.

**What this catches.** Error paths are where unhandled cases hide, where messages leak internals, and where a try/catch quietly swallows what should have propagated. Untested error handling is folklore; tested error handling is a contract.`,
      production:
        'The error path runs during outages, bad deploys, and attacks, when you most need it correct and least want surprises. The classic gap: a validation suite green on every valid input, never once fed an invalid one, discovered the day a malformed payload sails through to the database.',
      walkthrough: [
        'List the documented failure behaviors of a function you know.',
        'Write an inverted test: fails if no throw, fails on wrong throw.',
        'Assert the error type or message, never just "it threw".',
        'Feed a handler invalid input and assert the 400 and the error shape.',
      ],
      questions: [
        'Why is "throws on invalid input" a behavior worth a test?',
        'What does asserting the error type prevent?',
        'Where do swallowed exceptions hide?',
      ],
      checklist: [
        'Assert a specific expected throw.',
        'Test an error return shape.',
        'Cover at least one failure row per table.',
      ],
      interactive: {
        coldOpen:
          'A validation suite is green on every valid input. It has never once been fed an invalid one. Then a malformed payload sails straight through to the database, because "rejects bad input" was a behavior nobody tested. The error path runs during outages and attacks, exactly when you need it correct. How do you test that code fails the right way?',
        mental:
          'Testing failure paths is the fire drill: you trigger the alarm on purpose, in daylight, to make sure it rings, because the alternative is discovering a dead alarm during the fire.',
        diagram: {
          nodes: ['Invalid input', 'Expect the throw', 'No throw: FAIL', 'Wrong error: FAIL'],
          explanations: [
            'The test deliberately feeds the bad case: negative amount, missing field, malformed payload.',
            'The assertion is inverted: an exception of the right type is the passing outcome.',
            'Code that silently accepts invalid input fails the test. This is the case that catches missing validation.',
            'A different exception (a TypeError from a typo, say) also fails, because any-throw assertions certify nothing.',
          ],
        },
        example: {
          code: "function withdraw(balance, amount) {\n  if (amount > balance) throw new Error('insufficient funds');\n  return balance - amount;\n}\n\nfunction expectThrows(fn, message) {\n  try {\n    fn();\n  } catch (e) {\n    if (e.message === message) {\n      console.log('ok: threw', JSON.stringify(message));\n      return;\n    }\n    console.log('FAIL: wrong error:', e.message);\n    return;\n  }\n  console.log('FAIL: expected a throw, got none');\n}\n\nexpectThrows(() => withdraw(50, 100), 'insufficient funds');",
          output: 'ok: threw "insufficient funds"',
          explain:
            'The test passes because the right error happened. Delete the validation line from withdraw and this test goes red with "expected a throw, got none", which is exactly the regression it guards against.',
        },
        predicts: [
          {
            question: 'The validation line is deleted from withdraw. What does the test print?',
            options: [
              'ok: threw "insufficient funds"',
              'FAIL: expected a throw, got none',
              'nothing',
            ],
            correct: 1,
            why: 'withdraw(50, 100) now returns -50 without throwing. The inverted assertion catches the missing validation, which is its entire job.',
          },
          {
            question: 'Why assert the message instead of accepting any throw?',
            options: [
              'style preference',
              'a crash from an unrelated bug would otherwise pass as "validation works"',
              'messages are faster',
            ],
            correct: 1,
            why: 'Any-throw tests certify only that something exploded. Pinning the type or message certifies the behavior you actually designed.',
          },
        ],
        build: {
          simple: 'Test that bad input produces an error.',
          actually:
            'Error behaviors are contracts, tested like return values. For thrown errors, invert the assertion: the test fails if nothing throws AND fails if the wrong error throws. For returned errors ({ok:false} or a 400), feed invalid input and assert the error shape and status. Pin the specific type or message.',
          breaks:
            'A suite that only ever feeds valid input never exercises the rejection path, so missing validation ships silently. And "accept any throw" certifies nothing: an unrelated TypeError from a typo would pass as "validation works".',
        },
        doThisNow: [
          {
            task: 'Write an inverted assertion: confirm withdraw(50, 100) throws "insufficient funds", and watch it fail the right way if it does not.',
            command: 'node -e \'const w=(b,a)=>{if(a>b)throw new Error("insufficient funds");return b-a}; try{w(50,100);console.log("FAIL: no throw")}catch(e){console.log(e.message==="insufficient funds"?"ok: threw":"FAIL: wrong error")}\'',
            reveal:
              '"ok: threw". Now imagine deleting the validation line: w(50,100) returns -50, no throw, and the test prints "FAIL: no throw". That is the regression the inverted assertion guards.',
          },
          {
            task: 'Explain why asserting the message beats accepting any throw. What bug would "any throw passes" hide?',
            reveal:
              'A crash from an unrelated bug (a typo causing a TypeError) would pass as "validation works". Pinning the message certifies the behavior you designed, not just that something exploded.',
          },
        ],
        warStory:
          'A handler\'s tests covered every valid request and passed for a year. A refactor accidentally removed the input validation, but no test fed it invalid input, so the suite stayed green. A malformed request later wrote garbage to the database. One inverted test (invalid input must 400) would have caught it instantly.',
        tweak: {
          instruction: 'Call expectThrows(() => withdraw(100, 50), "insufficient funds") and predict the output.',
          reveal:
            'FAIL: expected a throw, got none. A valid withdrawal should not throw, and the test correctly reports that no error happened. Negative tests need positive controls too.',
        },
        receipt: {
          explain: [
            'How to invert an assertion so no-throw is the failure.',
            'Why pinning the error type beats accepting any throw.',
          ],
          command: 'node -e \'try{badInput()}catch(e){/* assert e */}\'',
          question: 'Your code calls a payment API. How do you test it without charging a real card every run?',
        },
        writeDrillId: 'test-expect-throws',
        recap: [
          'Error behaviors are contracts; test them like return values.',
          'The inverted assertion: no throw is the failure.',
          'Pin the error type or message, never just "it threw".',
        ],
      },
    },
    {
      id: 'testing-rung-doubles',
      title: 'Module 5: Test Doubles: Stubs And Spies',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 14,
      prompt:
        'Test code that calls databases and APIs without the databases and APIs: stand-ins you control.',
      explanation: `Your function charges cards through Stripe. Testing it cannot mean charging real cards, and it had better not mean skipping the test. The answer is a stand-in: a test double.

**Stubs answer.** A stub replaces a dependency and returns canned values: a fake payment API whose charge() always returns success, or always returns a decline, letting you steer the code down whichever branch you are testing. Stubs control the inputs your code receives from the world.

**Spies record.** A spy additionally writes down every call it receives: arguments, order, count. Your assertions then check the conversation: charged exactly once, with the right amount, with the right currency. Spies verify the outputs your code sends to the world.

**The enabling design.** Doubles require a seam. A function that imports Stripe directly and calls it from its guts cannot be handed a fake. A function that receives the payment API as a parameter can be handed anything, including a test double. This is dependency injection, and testability is its original sales pitch.

**The boundary rule.** Stub what you do not own (network, third parties, the clock). Prefer real things you do own (your own pure logic, an in-memory or test database for integration layers). Over-mocking produces suites that pass while the real wiring is broken.`,
      production:
        'Every serious codebase tests payment, email, and external API logic with doubles; CI cannot depend on Stripe being up and on charging real money. The matching interview question is "how do you test code that calls an external API?", and the answer starts with the seam.',
      walkthrough: [
        'Find the dependency your function calls out to.',
        'Make it a parameter: create the seam.',
        'Hand in a stub for the branch you want; assert the result.',
        'Upgrade to a spy; assert the call count and arguments.',
      ],
      questions: [
        'What does a stub control, and what does a spy verify?',
        'Why does direct importing defeat test doubles?',
        'What goes wrong with over-mocking?',
      ],
      checklist: [
        'Inject a dependency through a parameter.',
        'Steer a branch with a stub.',
        'Assert call arguments with a spy.',
      ],
      interactive: {
        coldOpen:
          'Your function charges real cards through Stripe. You cannot charge a real card on every test run, and you absolutely cannot skip testing the payment code. So you hand it a fake Stripe that you control, and ask it afterward: did you charge exactly once, for the right amount? What makes a function acceptable a fake in the first place?',
        mental:
          'A stub is a stunt double who performs the scripted line on cue; a spy is the same double wearing a wire, so afterward you can verify exactly what your hero said to them.',
        diagram: {
          nodes: ['Seam: injected dep', 'Stub: canned answers', 'Spy: records calls', 'Assert the conversation'],
          explanations: [
            'The dependency arrives as a parameter instead of an import, so tests can substitute it. No seam, no double.',
            'The stub returns whatever the test scripts: success, decline, timeout. Each canned answer steers one branch of the code under test.',
            'The spy logs every call it receives: arguments, count, order. The test gains a transcript.',
            'Assertions read the transcript: charge was called once, with 999 cents, for user 42. The collaboration itself is now pinned behavior.',
          ],
        },
        example: {
          code: "function chargeUser(api, userId, amount) {\n  return api.charge(userId, amount);\n}\n\nconst calls = [];\nconst fakeApi = {\n  charge: (...args) => {\n    calls.push(args);\n    return 'ok';\n  },\n};\n\nconsole.log(chargeUser(fakeApi, 42, 999));\nconsole.log(calls);",
          output: "ok\n[ [ 42, 999 ] ]",
          explain:
            'fakeApi is stub and spy at once: it answers "ok" (steering the success path) and records [42, 999] (proving the charge call carried the right arguments). No network, no Stripe, no real money.',
        },
        predicts: [
          {
            question: 'chargeUser is called once. What does calls.length tell you if it equals 2?',
            options: [
              'nothing important',
              'the code charged twice for one request: a real money bug, caught for free',
              'the spy is broken',
            ],
            correct: 1,
            why: 'The transcript exposes duplicate calls that a return-value assertion would never see. Spies catch the double-charge class of bug.',
          },
          {
            question: 'To test the decline branch, the stub should...',
            options: [
              'throw a test-framework error',
              "return 'declined' (or whatever the real API returns), steering the code down that branch",
              'call the real API once',
            ],
            correct: 1,
            why: 'Stubs script the world. One test scripts success, another scripts decline, and together they cover both branches without a network in sight.',
          },
        ],
        build: {
          simple: 'Replace real dependencies with fakes in tests.',
          actually:
            'A stub returns canned values to steer a branch (charge always succeeds, or always declines). A spy also records every call (arguments, count, order) so you can assert the conversation: charged once, right amount. Both require a seam: the dependency arrives as a parameter, not a hardcoded import. That is dependency injection.',
          breaks:
            'A function that imports Stripe and calls it from its guts cannot be handed a fake; no seam, no double. And over-mocking (stubbing things you own) produces suites that stay green while the real wiring is broken. Stub what you do not own; keep your own logic real.',
        },
        doThisNow: [
          {
            task: 'Build a fake that is stub and spy at once: it returns "ok" and records its calls. Charge through it and inspect the transcript.',
            command: 'node -e \'const calls=[]; const api={charge:(...a)=>{calls.push(a);return "ok"}}; const charge=(api,u,amt)=>api.charge(u,amt); console.log(charge(api,42,999)); console.log(calls)\'',
            reveal:
              '"ok" then [[42,999]]. No network, no Stripe, no real money. The stub steered the success path; the spy proved the charge carried the right arguments. If calls.length were 2, you would have caught a double-charge for free.',
          },
          {
            task: 'Script the decline branch: what should the stub\'s charge return to test how your code handles a declined payment?',
            reveal:
              "Return 'declined' (whatever the real API returns), steering the code down the decline branch. One test scripts success, another scripts decline, covering both with no network in sight.",
          },
        ],
        warStory:
          'A team tested their checkout against the real Stripe sandbox. CI broke every time Stripe had a hiccup, and a flaky test culture set in where red builds got ignored. Switching to a stubbed payment API made the tests fast, deterministic, and trustworthy, and a real double-charge bug surfaced the next week via a spy\'s call count.',
        tweak: {
          instruction: 'Write the fakeApi for testing a timeout: charge throws. What does chargeUser need to make that branch survivable?',
          reveal:
            'charge: () => { throw new Error("timeout") }, and chargeUser needs try/catch handling, which the previous module taught you to assert. The doubles module and the failure module compose.',
        },
        receipt: {
          explain: [
            'What stubs control vs what spies verify.',
            'Why the injected seam enables doubles, and the boundary rule for what to fake.',
          ],
          command: 'node -e \'const api={charge:(...a)=>"ok"}; /* inject + assert */\'',
          question: 'Your test passes on Monday and fails on Friday with no code change. What makes a test flaky?',
        },
        drills: ['test-stub-returns', 'test-spy'],
        recap: [
          'Stubs script the world; spies transcript your code’s side.',
          'The seam (injected dependency) is what makes doubles possible.',
          'Stub what you do not own; keep your own logic real.',
        ],
      },
    },
    {
      id: 'testing-rung-determinism',
      title: 'Module 6: Determinism: Time, Randomness, And Flaky Tests',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 13,
      prompt:
        'Kill flaky tests at the source: control the clock, the randomness, and the order.',
      explanation: `A flaky test passes and fails with no code change. Each flake costs a re-run, then trust: once a suite cries wolf, red stops meaning anything, and that is the beginning of the end of the safety net.

**The usual suspects.** Real time (a token-expiry test that passes before midnight), real randomness, shared state leaking between tests, sleeps racing against slow CI machines, and real network calls. Every one is code reaching for something the test does not control.

**Fake the clock.** Time is just another dependency, so give it a seam: code asks an injected clock instead of Date.now(), and the test hands in a clock it can set and advance. "Advance 31 days, assert the token expired" runs in microseconds, on any machine, at any hour, forever.

**Seed or inject randomness** the same way. **Isolate state** by giving each test a fresh fixture, never order-dependent leftovers. **Replace sleeps with waits** on explicit conditions.

**The policy.** Quarantine or fix flakes immediately. A team that tolerates 2% flake on a 1,000-test suite sees phantom failures on most runs, and starts the slide into "just re-run it", which is how safety nets die.`,
      production:
        'Flaky suites are a top developer-experience complaint across the industry: pipelines red for no reason, merges blocked on re-runs, and eventually engineers force-merging past the suite. The fake clock pattern appears in every mature codebase, formalized in libraries like Jest fake timers and freezegun.',
      walkthrough: [
        'List the nondeterminism in a flaky test you have met: time, random, state, sleep, network.',
        'Inject a clock; advance it explicitly in the test.',
        'Give every test a fresh fixture.',
        'Adopt the policy: a flake is a bug with the same priority as a failure.',
      ],
      questions: [
        'Why does a flaky suite destroy more value than a missing test?',
        'How does injecting the clock fix time-dependent tests?',
        'What does a sleep in a test actually race against?',
      ],
      checklist: [
        'Name the five flake sources.',
        'Test time-dependent logic with a fake clock.',
        'Explain the quarantine-or-fix policy.',
      ],
      interactive: {
        coldOpen:
          'A suite of 1,000 tests, each 99.9% reliable, passes a full run only about 37% of the time (0.999^1000 ≈ 0.37). Tiny per-test flakiness compounds into a suite that fails most runs for no reason. Once it cries wolf, "just re-run it" sets in and the safety net dies. Where does the randomness sneak in, and how do you seal it out?',
        mental:
          'A deterministic test is a chemistry experiment in a sealed lab: same reagents, same temperature, same result, every run. A flaky test left a window open, and the weather participates in the experiment.',
        diagram: {
          nodes: ['Flake source', 'Inject the clock', 'Advance explicitly', 'Same result forever'],
          explanations: [
            'The test depends on something it does not control: wall-clock time, randomness, leftover state, machine speed, the network.',
            'Time becomes a parameter: code calls clock.now() instead of Date.now(), and tests pass in a controllable clock. Same seam idea as the doubles module.',
            'The test moves time deliberately: tick(31 days), then assert expiry. No waiting, no midnight edge cases, no slow-CI races.',
            'The experiment is sealed. It produces the same answer on a laptop, in CI, at 11:59pm on December 31st.',
          ],
        },
        example: {
          code: "function makeClock(start) {\n  let now = start;\n  return {\n    now: () => now,\n    tick: (ms) => { now += ms; },\n  };\n}\n\nfunction isExpired(createdAt, ttl, clock) {\n  return clock.now() - createdAt > ttl;\n}\n\nconst clock = makeClock(0);\nconsole.log(isExpired(0, 1000, clock));\nclock.tick(1500);\nconsole.log(isExpired(0, 1000, clock));",
          output: 'false\ntrue',
          explain:
            'The test time-traveled 1.5 seconds in zero real time and verified both sides of the expiry boundary. With Date.now() hardcoded inside isExpired, this test would need a real sleep and a prayer.',
        },
        predicts: [
          {
            question: 'A test asserts a session created "now" expires "in 24 hours" using real Date.now() and runs at 23:59:59. It...',
            options: [
              'is fine',
              'can fail on day-boundary edge cases and is unfixable without controlling time',
              'runs faster at night',
            ],
            correct: 1,
            why: 'Real time makes the test depend on when it runs. The fake clock removes the dependency entirely, which is the only real fix.',
          },
          {
            question: 'A suite has 1,000 tests, each 99.9% reliable. A full run passes...',
            options: [
              'about 99.9% of the time',
              'about 37% of the time',
              'always',
            ],
            correct: 1,
            why: '0.999 to the 1000th power is roughly 0.37. Tiny per-test flake compounds into a suite that fails most runs, which is why flakes are bugs with failure-level priority.',
          },
        ],
        build: {
          simple: 'Make tests give the same result every run.',
          actually:
            'Flakes come from things the test does not control: real time, randomness, shared state, sleeps racing slow CI, and real network calls. Fix each with a seam: inject a clock the test can advance, seed randomness, give every test a fresh fixture, wait on conditions instead of sleeping. A flake is a bug with failure-level priority.',
          breaks:
            'A token-expiry test using real Date.now() can fail at the day boundary and is unfixable without controlling time. And tolerating even 2% flake on a large suite means phantom red on most runs, which trains the team to ignore failures.',
        },
        doThisNow: [
          {
            task: 'Time-travel a test with a fake clock: check expiry before and after advancing fake time, in zero real seconds.',
            command: 'node -e \'const c=(s=>({now:()=>s,tick(ms){s+=ms}}))(0); const exp=(t,ttl)=>c.now()-t>ttl; console.log(exp(0,1000)); c.tick(1500); console.log(exp(0,1000))\'',
            reveal:
              'false then true. You crossed the expiry boundary by moving fake time, instantly, on any machine, at any hour. With Date.now() hardcoded this test would need a real sleep and luck.',
          },
          {
            task: 'Boundary-test it: change the tick to exactly the TTL (1000) and predict both lines. Why?',
            reveal:
              'false then false: the check is strictly greater-than, and 1000 is not > 1000. You just boundary-tested expiry logic by moving fake time, which is the whole technique in one line.',
          },
        ],
        warStory:
          'A team\'s suite flaked about 3% per run from real-time and network dependencies. Builds went red constantly, so people re-ran until green, then started force-merging past failures. A genuine bug rode through on a red build everyone had learned to ignore. They froze the clock, stubbed the network, and made flakes a stop-the-line bug; trust came back.',
        tweak: {
          instruction: 'Change tick(1500) to tick(1000) and predict both printed lines.',
          reveal:
            'false then false: the check is strictly greater-than, and 1000 is not greater than 1000. You just boundary-tested expiry logic by moving fake time, which is the whole technique in one line.',
        },
        receipt: {
          explain: [
            'The five common sources of test flakiness.',
            'How injecting the clock makes time-dependent tests deterministic.',
          ],
          command: 'node -e \'const c={now:()=>0,tick(){}}; /* inject clock */\'',
          question: 'You can test thoroughly. Which language and runtime will you go deep on to write the code under test?',
        },
        writeDrillId: 'test-fake-clock',
        recap: [
          'Flakes come from time, randomness, shared state, sleeps, and networks.',
          'The clock is a dependency: inject it, advance it explicitly.',
          'A flaky test is a bug; tolerated flakes kill the suite’s meaning.',
        ],
      },
    },
  ],
}

export const conceptSubjects: Subject[] = [cachingSubject, queuesSubject, testingSubject]
