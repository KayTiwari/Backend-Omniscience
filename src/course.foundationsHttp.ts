import type { Problem } from './course'

// HTTP and the web from absolute zero. Request and response examples captured
// from real traffic with curl, lightly trimmed for readability.

export const httpFoundations: Problem[] = [
  {
    id: 'http-rung-what-happens',
    title: 'Module 1: What Happens When You Visit A URL?',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 12,
    prompt:
      'Trace the journey from typing a URL to seeing a page, and name each hop in order.',
    explanation: `The whole internet story fits in one sentence: your computer sends a request to another computer, and that computer sends back a response. Everything else is detail on those two messages.

**The client.** Your browser, an app, or a command-line tool like curl. It starts every conversation.

**The server.** A program on another machine, listening for requests. Backends are these programs, and writing them is what this site teaches.

**The journey.** The hostname becomes an IP address (DNS), a connection opens (TCP), gets encrypted (TLS for https), the request travels, the server's code runs, and a response travels back. Each hop is a place things can fail, which is exactly why engineers learn the order: debugging is walking this chain and asking which link broke.

The flow below is worth saying out loud until it feels boring. It is the map for every networking conversation you will ever have.`,
    production:
      "When production breaks, this chain is the diagnosis checklist. DNS pointing at the wrong place, a certificate expired at the TLS hop, the server hanging at the code step: each failure has a distinct symptom, and naming the layer before guessing the fix is the senior engineer's signature move.",
    walkthrough: [
      'Say the chain: DNS, then connection, then encryption, then request, then server code, then response.',
      'Identify the client and the server in a browser visit.',
      'Pick any hop and name one way it could fail.',
    ],
    questions: [
      'What two messages define all of HTTP?',
      'What does DNS contribute to the journey?',
      'Where in the chain does your backend code run?',
    ],
    checklist: [
      'Recite the request journey in order.',
      'Define client and server.',
      'Name one failure mode for one hop.',
    ],
    interactive: {
      coldOpen:
        'You visit a site every day. Right now, can you name every hop your request makes, in order, from your keyboard to the server and back? Most engineers get four. Here is the whole chain.',
      mental:
        'The web is a postal service: the URL addresses the envelope, DNS finds the building, TCP and TLS are the sealed courier, and your backend is the mailroom that writes the reply.',
      diagram: {
        nodes: ['Type URL', 'DNS lookup', 'TCP connect', 'TLS encrypt', 'Request', 'Server code', 'Response'],
        explanations: [
          'You give the browser an address. Nothing has left your machine yet; the URL is just structured text naming a destination and a resource.',
          'DNS translates the hostname into an IP address, like looking up a street address for a building name. Wrong DNS means every later step talks to the wrong machine.',
          'TCP opens a reliable two-way byte pipe to that IP. It guarantees ordered delivery, and nothing more: no encryption, no meaning.',
          'TLS wraps the pipe in encryption and proves the server is who it claims via certificates. This is the s in https.',
          'The HTTP request travels through the pipe: a verb, a path, headers, maybe a body. Plain structured text.',
          'The server program receives it, routes by path, runs your handler code, talks to databases, and builds a response. This step is the backend job.',
          'The response travels back through the same pipe: a status verdict, headers, and the body the client asked for.',
        ],
      },
      example: {
        code: '# You type this into a browser:\nhttps://example.com\n\n# The journey your request takes:',
        output:
          'type URL -> DNS finds the IP -> TCP connects -> TLS encrypts -> HTTP request sent -> server code runs -> HTTP response returns -> browser renders',
        explain:
          'Eight hops, every single time, for every page and every API call. The first four set up the pipe; the last four use it.',
      },
      predicts: [
        {
          question: 'Which happens first?',
          options: [
            'the server runs your code',
            'DNS turns the name into an IP address',
            'the response renders',
          ],
          correct: 1,
          why: 'Nothing can connect until the client knows which machine to talk to. DNS resolution opens the journey.',
        },
        {
          question: 'In this story, a backend is...',
          options: [
            'the browser',
            'the program on the server that receives requests and builds responses',
            'the network cable',
          ],
          correct: 1,
          why: 'A backend is the listening program. Requests arrive, its code runs, responses leave. That is the job.',
        },
      ],
      build: {
        simple: 'Your computer asks another computer for a page, and it sends one back.',
        actually:
          'That request crosses six hops: DNS turns the name into an IP, TCP opens a pipe, TLS encrypts it, the HTTP request travels, the server runs your code, and the response returns.',
        breaks:
          'Each hop fails differently: DNS pointing at the wrong machine, an expired TLS certificate, a server hanging on a slow query. Naming the broken hop before guessing the fix is the senior move.',
      },
      doThisNow: [
        {
          task: 'Run curl against a real site and read the raw response a browser would render.',
          command: 'curl -s https://example.com | head -n 12',
          reveal:
            'You get the page HTML with no rendering: exactly what the server sent. curl is your window into raw HTTP, and you will use it constantly.',
        },
        {
          task: 'Now ask curl to narrate the journey, not just the result. Read the lines that start with *.',
          command: 'curl -v https://example.com 2>&1 | head -n 10',
          reveal:
            'The * lines are curl walking the chain: Trying <ip> (DNS done), Connected (TCP), a TLS line, then your GET request. You can watch every hop you just learned.',
        },
      ],
      warStory:
        'When production breaks, this chain is the diagnosis checklist. A 27-minute outage at a major provider in 2019 was not the servers: a bad DNS push meant names stopped resolving, so nothing downstream could even start.',
      tweak: {
        instruction: 'Run this in a terminal: curl https://example.com and read what comes back.',
        reveal:
          'You get the HTML of the page: the same response a browser receives, without the rendering. curl is the engineer’s window into raw HTTP, and you will use it constantly.',
      },
      receipt: {
        explain: [
          'The six hops from URL to response, in order.',
          'Why every hop is a distinct place a request can fail.',
        ],
        command: 'curl -v https://example.com',
        question: 'The first hop turns a name into a number. How does DNS do that so fast?',
      },
      recap: [
        'HTTP is two messages: a request and a response.',
        'The chain: DNS, connect, encrypt, request, server code, response.',
        'Debugging means finding which hop broke.',
      ],
    },
  },
  {
    id: 'http-rung-urls',
    title: 'Module 2: Anatomy Of A URL',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 10,
    prompt: 'Break a URL into scheme, host, path, and query string, and learn what each part decides.',
    explanation: `A URL is a structured address, and each segment has a distinct job.

**Scheme.** https decides the protocol and that the connection is encrypted. http (no s) is the unencrypted ancestor, now reserved for local development.

**Host.** api.example.com names the machine (via DNS). Subdomains like api. conventionally separate services.

**Path.** /users/42 names the resource on that server. The server's router reads it to choose which code runs. Paths are the nouns of an API.

**Query string.** Everything after ?, as key=value pairs joined by &: ?role=admin&limit=10. Queries carry options: filters, pagination, search terms. Order does not matter, and every value arrives as text, which is why backends parse and validate them.

One address, four decisions: how to talk, to whom, about what, with which options.`,
    production:
      'Every routing bug and every "works locally, 404s in production" mystery starts with one of these four parts pointing somewhere unexpected. Engineers read URLs the way mechanics hear engines, and the skill is just knowing the parts.',
    walkthrough: [
      'Dissect https://api.example.com/users/42?fields=name into its four parts.',
      'Say what each part decides.',
      'Write a URL for: products of the shop service, filtered to category books, page 2.',
    ],
    questions: [
      'What does the scheme decide?',
      'Who reads the path, and what for?',
      'What type are query values when they arrive?',
    ],
    checklist: [
      'Split any URL into scheme, host, path, query.',
      'Explain the job of each part.',
      'Construct a URL with two query parameters.',
    ],
    interactive: {
      coldOpen:
        'Here is a URL: https://api.example.com/users/42?fields=name&limit=10. Four different parts, four different jobs, and a routing bug usually hides in exactly one of them. Can you point to which part decides which code runs?',
      mental:
        'A URL is a mailing address: the scheme is the carrier, the host is the building, the path is the apartment, and the query string is the delivery instructions.',
      diagram: {
        nodes: ['Scheme', 'Host', 'Path', 'Query'],
        explanations: [
          'https decides how to talk: which protocol, and that the connection is encrypted. http without the s is the unencrypted ancestor.',
          'api.example.com names which machine to find via DNS. Subdomains conventionally separate services.',
          '/users/42 names the resource on that machine. The router on the server reads it to pick which code runs.',
          'Everything after ? is options as key=value pairs: filters, pagination, search. Values always arrive as text.',
        ],
      },
      example: {
        code: 'https://api.example.com/users/42?fields=name&limit=10',
        output:
          'scheme: https        (encrypted HTTP)\nhost:   api.example.com (which machine, via DNS)\npath:   /users/42       (which resource on it)\nquery:  fields=name, limit=10  (options, as text)',
        explain:
          'Four parts, four jobs. The path identifies user 42; the query tweaks how the response comes back.',
      },
      predicts: [
        {
          question: 'In /users/42, what does 42 most likely identify?',
          options: ['a page number', 'the id of one specific user', 'a port'],
          correct: 1,
          why: 'REST paths put the resource id in the path: collection name, then which one.',
        },
        {
          question: 'In ?limit=10, what type is 10 when the server receives it?',
          options: ['a number', 'the string "10"', 'a boolean'],
          correct: 1,
          why: 'Query strings are text end to end. The backend must convert and validate before doing math, exactly the coercion lesson from JavaScript.',
        },
      ],
      build: {
        simple: 'A URL is the address of a page.',
        actually:
          'A URL is four decisions: scheme (how to talk), host (which machine, via DNS), path (which resource, read by the router), and query (options, always arriving as text).',
        breaks:
          'The classic "works locally, 404s in production" bug is almost always one of these four pointing somewhere unexpected: wrong host, a path the router does not recognize, or a query value the backend never validated.',
      },
      doThisNow: [
        {
          task: 'Pull apart a real URL by hand. Pick any link, and name its scheme, host, path, and query out loud before moving on.',
          reveal:
            'Scheme says how to talk, host says which machine, path names the resource the router will match, and query carries options as text. Four parts, four jobs, every time.',
        },
        {
          task: 'Write a URL from a sentence: the products of the shop service, filtered to category books, page 2.',
          reveal:
            'Something like https://shop.example.com/products?category=books&page=2. The path names the collection; the query narrows it. The order of query keys does not matter.',
        },
      ],
      warStory:
        'A team shipped a feature that 404d for half of users. The cause: a trailing slash. /users/42 and /users/42/ matched different routes, and only one had the new handler. Reading the path precisely is a real debugging skill.',
      tweak: {
        instruction: 'Add &sort=name to the query string and say what changed.',
        reveal:
          'Just one more key=value option. Queries grow with & and never change which resource the path names, only how it is returned.',
      },
      receipt: {
        explain: [
          'The four parts of a URL and the job of each.',
          'Why query values always need parsing and validation.',
        ],
        command: 'curl -s "https://httpbin.org/get?a=1&b=2"',
        question: 'The path names a resource. What verb tells the server whether to read it, create it, or delete it?',
      },
      writeDrillId: 'internet-query-parser',
      recap: [
        'scheme://host/path?query, four parts with four jobs.',
        'Path picks the resource; query carries the options.',
        'Query values arrive as text and need parsing.',
      ],
    },
  },
  {
    id: 'http-rung-request',
    title: 'Module 3: The Request: Method, Path, Headers',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 12,
    prompt: 'Read a raw HTTP request: the request line, the headers, and the optional body.',
    explanation: `An HTTP request is plain text with a strict shape, and once you can read one, half of web debugging unlocks.

**The request line.** Method, path, version: GET / HTTP/1.1. The method is the verb (what kind of action), the path is the noun (which resource).

**Headers.** One per line, Name: value. They carry metadata: Host says which site (one machine often serves many), User-Agent identifies the client, Accept says what response formats the client can handle, and Authorization carries credentials. Header names are case-insensitive.

**A blank line ends the headers.** Whatever follows is the body: the data of a POST or PUT. GET requests almost never carry one.

The request below is real, captured from curl talking to example.com. This is genuinely all there is: a verb, an address, some labeled metadata, maybe a payload.`,
    production:
      'Reading raw requests is the daily bread of debugging: is the Authorization header actually being sent? Did the client declare Content-Type: application/json? Proxy and CDN issues in particular are diagnosed by comparing the request that left the client with the one that reached the server.',
    walkthrough: [
      'Read the request line and name the method and path.',
      'Read each header as a label: value pair.',
      'Find the blank line that would separate headers from a body.',
      'Capture one yourself: curl -v https://example.com and read the lines marked >.',
    ],
    questions: [
      'What three things are on the request line?',
      'Why does the Host header exist?',
      'Where does a request body begin?',
    ],
    checklist: [
      'Parse a request line into method, path, version.',
      'Explain three common headers.',
      'Capture a real request with curl -v.',
    ],
    interactive: {
      coldOpen:
        'The entire web rides on a few lines of plain text a human can type. Here is a real request a browser sends. Once you can read these four lines, half of web debugging unlocks: is the Authorization header even being sent?',
      mental:
        'A request is a form letter: the first line states what you want, the headers are labeled fields, and the body is the enclosed package.',
      diagram: {
        nodes: ['Request line', 'Headers', 'Blank line', 'Body'],
        explanations: [
          'METHOD path VERSION, like GET / HTTP/2. The verb says the kind of action; the path says which resource.',
          'One Name: value pair per line. Host picks the site, Authorization carries credentials, Accept declares formats the client understands.',
          'A single empty line marks where headers end. Everything before it is metadata.',
          'The payload for POST and PUT: form data or JSON. GET requests almost never carry one.',
        ],
      },
      example: {
        code: '# captured with: curl -v https://example.com\n# lines the client sent:',
        output: 'GET / HTTP/2\nHost: example.com\nUser-Agent: curl/8.7.1\nAccept: */*',
        explain:
          'The verb is GET, the path is / (the root), and three headers follow: which site, which client, and which formats are acceptable. No body, because GET reads.',
      },
      predicts: [
        {
          question: 'In GET / HTTP/2, what is the / ?',
          options: ['a typo', 'the path: the root resource', 'a division'],
          correct: 1,
          why: 'Visiting a bare domain requests the root path /. The path is always present even when short.',
        },
        {
          question: 'What does Accept: */* tell the server?',
          options: [
            'accept any client',
            'the client can handle any response format',
            'allow all origins',
          ],
          correct: 1,
          why: 'Accept declares response formats the client understands. */* means anything goes; an API client would send application/json.',
        },
      ],
      build: {
        simple: 'The browser tells the server which page it wants.',
        actually:
          'A request is a request line (METHOD path VERSION), a stack of Name: value headers (Host, Authorization, Accept), a blank line, then an optional body for POST and PUT.',
        breaks:
          'Most "it works in curl but not in the app" bugs are a header difference: a missing Authorization, a wrong Content-Type, or a proxy stripping a header between client and server. You diagnose it by comparing the request that left with the one that arrived.',
      },
      doThisNow: [
        {
          task: 'Capture your own request lines and read them against the example. Look for the Host header.',
          command: 'curl -v https://example.com 2>&1 | grep "^>"',
          reveal:
            'The > prefix marks bytes you sent. You will see GET / HTTP/2, then Host, User-Agent, and Accept. < marks bytes received. This one flag turns curl into an HTTP microscope.',
        },
        {
          task: 'Send a custom header and prove it arrives. httpbin echoes back what it received.',
          command: 'curl -s -H "X-Demo: hello" https://httpbin.org/headers',
          reveal:
            'The JSON response lists every header the server saw, including your X-Demo: hello. This is exactly how you confirm an Authorization header is really being sent.',
        },
      ],
      warStory:
        'An API call worked from a laptop but failed in production with 401. The load balancer was stripping the Authorization header on one route. Nobody suspected it until someone compared the request that left the client with the one the server logged.',
      tweak: {
        instruction: 'Run curl -v https://example.com 2>&1 | grep "^>" to see your own request lines.',
        reveal:
          'You will see this same shape with your curl version. The > prefix marks bytes sent; < marks bytes received. This one flag turns curl into an HTTP microscope.',
      },
      receipt: {
        explain: [
          'The three parts of a request line and why Host is mandatory.',
          'How to prove a specific header is being sent.',
        ],
        command: 'curl -s -H "X-Demo: hi" https://httpbin.org/headers',
        question: 'The request arrives and the server runs. What shape does its reply take?',
      },
      writeDrillId: 'internet-request-line',
      recap: [
        'Request line: METHOD path VERSION.',
        'Headers are labeled metadata; blank line, then optional body.',
        'curl -v shows the raw conversation.',
      ],
    },
  },
  {
    id: 'http-rung-response',
    title: 'Module 4: The Response: Status, Headers, Body',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 12,
    prompt: 'Read a raw HTTP response: the status line, the headers, and the body your code builds.',
    explanation: `The response mirrors the request shape: a status line, headers, a blank line, then the body.

**The status line.** Version and a three-digit code: HTTP/2 200. The code is the server's one-glance verdict on how it went; the next module maps the families.

**Response headers.** content-type tells the client how to interpret the body (text/html renders as a page, application/json parses as data). date, server, and cache headers describe the response itself. As a backend developer, your code sets these.

**The body.** The payload: HTML for browsers, JSON for APIs, bytes for images. This is the part users actually see, and the part your handler functions return.

The response below is real, from example.com, trimmed to the essential headers. Request and response are the complete conversation: everything you build as a backend engineer is deciding what goes in the second message.`,
    production:
      'A wrong content-type is a classic integration bug: the body is perfect JSON but the header says text/html, so the client refuses to parse it. Cache headers, covered later, are also just response headers, and misconfiguring them has taken sites down in both directions.',
    walkthrough: [
      'Read the status line and the verdict it carries.',
      'Find content-type and say what the client will do with the body.',
      'See the full thing yourself: curl -i https://example.com.',
    ],
    questions: [
      'What three sections make up a response?',
      'What does content-type decide?',
      'Which side writes the response headers?',
    ],
    checklist: [
      'Parse a status line.',
      'Explain content-type with two examples.',
      'Capture a full response with curl -i.',
    ],
    interactive: {
      coldOpen:
        'The server got your request. Now it builds a reply with the same shape: a verdict, some labels, and the contents. As a backend engineer, every byte of that reply is yours to decide. What is the first line a browser reads to know if it worked?',
      mental:
        'A response is the reply envelope: a verdict stamped on top, labels describing the contents, then the contents themselves.',
      diagram: {
        nodes: ['Status line', 'Headers', 'Blank line', 'Body'],
        explanations: [
          'Version plus a three-digit verdict: HTTP/2 200. The first thing every client and dashboard reads.',
          'Metadata about the payload and the response: content-type tells the client how to interpret the body, cache headers say how long to keep it.',
          'The same empty-line divider as the request. Symmetry makes both messages easy to read raw.',
          'The payload your handler built: HTML for browsers, JSON for APIs. This is what users actually see.',
        ],
      },
      example: {
        code: '# captured with: curl -i https://example.com (trimmed)',
        output:
          'HTTP/2 200\ndate: Wed, 10 Jun 2026 21:33:19 GMT\ncontent-type: text/html\nserver: cloudflare\n\n<!doctype html><html lang="en">...',
        explain:
          'Verdict 200 (success), then headers describing the payload, then the blank line, then the HTML body the browser renders.',
      },
      predicts: [
        {
          question: 'For an API returning data, content-type would be...',
          options: ['text/html', 'application/json', 'image/png'],
          correct: 1,
          why: 'JSON bodies declare application/json so clients parse instead of render.',
        },
        {
          question: 'Who decided this response would be 200 with content-type text/html?',
          options: [
            'the browser',
            'code running on the server',
            'the network',
          ],
          correct: 1,
          why: 'Server code builds every part of the response. Writing that code is the backend job described literally.',
        },
      ],
      build: {
        simple: 'The server sends back the page.',
        actually:
          'A response is a status line (HTTP/2 200), headers describing the payload (content-type) and caching, a blank line, then the body. Your handler code authors all three sections.',
        breaks:
          'A wrong content-type is a silent integration bug: the body is perfect JSON but the header says text/html, so the client refuses to parse it. The data is fine; the label lied.',
      },
      doThisNow: [
        {
          task: 'Capture a full response, headers and body together, and find the content-type line.',
          command: 'curl -i https://example.com | head -n 10',
          reveal:
            '-i includes headers with the body. The first line is the status verdict; content-type tells the browser to render the body as a page rather than download it.',
        },
        {
          task: 'Compare two content-types: one HTML page and one JSON API. Notice how the header changes what you get.',
          command: 'curl -sI https://httpbin.org/json | grep -i content-type',
          reveal:
            'The API declares application/json, so clients parse it as data. An HTML page declares text/html, so browsers render it. Same mechanism, different instruction to the client.',
        },
      ],
      warStory:
        'An endpoint returned valid JSON but with content-type text/html. Browsers showed it as a wall of text, and one frontend silently broke for a week. The fix was one header line. Reviewers check content-type for exactly this reason.',
      tweak: {
        instruction: 'Run curl -i https://example.com and compare your capture to the example.',
        reveal:
          'Same shape, fresher date header, possibly different cache headers. The -i flag includes headers with the body; -v shows both directions.',
      },
      receipt: {
        explain: [
          'The three sections of a response and who writes them.',
          'How content-type changes what the client does with the body.',
        ],
        command: 'curl -i https://example.com',
        question: 'That verdict was a three-digit code. What do the five code families mean?',
      },
      writeDrillId: 'internet-build-response',
      recap: [
        'Response = status line, headers, blank line, body.',
        'content-type tells the client how to treat the body.',
        'Your backend code authors all three sections.',
      ],
    },
  },
  {
    id: 'http-rung-status-codes',
    title: 'Module 5: Status Codes By Family',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 12,
    prompt: 'Learn the five status families and the dozen individual codes that cover daily work.',
    explanation: `Three digits, and the first one tells the story. Learn the families first, then the handful of members you will meet daily.

**2xx: it worked.** 200 OK for reads, 201 Created when a POST made something, 204 No Content for success with nothing to say (a delete, typically).

**3xx: look elsewhere.** 301 permanent redirect, 302 temporary, 304 Not Modified (your cached copy is still good).

**4xx: the client erred.** 400 Bad Request (malformed input), 401 Unauthorized (who are you?), 403 Forbidden (I know who you are; no), 404 Not Found, 409 Conflict (duplicate, usually), 429 Too Many Requests.

**5xx: the server erred.** 500 Internal Server Error (an unhandled crash), 502 Bad Gateway and 503 Service Unavailable (infrastructure trouble).

The load-bearing distinction is 4xx versus 5xx: whose fault. A 4xx says fix the request; a 5xx says page the backend team. Picking the right one is a design decision your code makes on every error path.`,
    production:
      'Monitoring dashboards alarm on 5xx rates because those are your bugs; 4xx spikes usually mean a confused client or an attack probe. Returning 500 for bad user input pollutes that signal and wakes engineers for nothing, which is why reviewers care about error codes.',
    walkthrough: [
      'Recite the five families and whose fault each implies.',
      'Distinguish 401 (unauthenticated) from 403 (unauthorized).',
      'Pick codes for: created a user, duplicate email, missing record, crashed handler.',
    ],
    questions: [
      'Whose fault is a 4xx? A 5xx?',
      'When is 201 more precise than 200?',
      'What is the difference between 401 and 403?',
    ],
    checklist: [
      'Name the five families.',
      'Choose correct codes for four common outcomes.',
      'Explain why error code accuracy matters for monitoring.',
    ],
    interactive: {
      coldOpen:
        'A logged-in user asks for someone else\'s private data. Should the server say 401, 403, or 404? Pick before you read on. The wrong choice either leaks information or wakes the on-call engineer at 3am for nothing.',
      mental:
        'Status codes are five traffic lights: 2 means go, 3 means detour, 4 means you erred, 5 means we erred.',
      diagram: {
        nodes: ['2xx Success', '3xx Redirect', '4xx Client error', '5xx Server error'],
        explanations: [
          'It worked. 200 for reads, 201 when something was created, 204 for success with nothing to say.',
          'Look elsewhere. 301 moved permanently, 302 temporarily, 304 your cached copy is still good.',
          'The request was wrong. 400 malformed, 401 unidentified, 403 known and refused, 404 missing, 429 slow down. The client must change something.',
          'The server failed. 500 unhandled crash, 502 and 503 infrastructure trouble. These are your bugs, and monitoring alarms on them.',
        ],
      },
      example: {
        code: '# One request, many possible verdicts:\nGET /users/42',
        output:
          '200 OK            user found, body has the data\n404 Not Found     no user with id 42\n401 Unauthorized  no valid credentials sent\n403 Forbidden     valid user, but not allowed to see 42\n500 Internal      the handler crashed',
        explain:
          'Same request, five stories. The code is the first thing a client (and a dashboard) reads, before any body.',
      },
      predicts: [
        {
          question: 'A POST creates a new user. The most precise success code is...',
          options: ['200', '201', '204'],
          correct: 1,
          why: '201 Created announces a new resource exists. 200 is generic; 204 means success with an empty body.',
        },
        {
          question: 'A logged-in user requests another user’s private data. Correct refusal?',
          options: ['401', '403', '404'],
          correct: 1,
          why: 'Identity is known (so 401 is wrong); permission is lacking. 403 Forbidden is the precise verdict. Some APIs return 404 deliberately to avoid leaking existence, which is a documented trade.',
        },
        {
          question: 'Your handler throws an unhandled exception. The client sees...',
          options: ['400', '500', 'nothing; the request hangs'],
          correct: 1,
          why: 'Framework middleware converts crashes into 500 responses. The 5xx family is the "our fault" signal that monitoring watches.',
        },
      ],
      build: {
        simple: 'The status code says whether it worked.',
        actually:
          'The first digit picks a family: 2xx worked, 3xx go elsewhere, 4xx the client erred, 5xx the server erred. The load-bearing split is 4xx versus 5xx: whose fault.',
        breaks:
          'Returning 500 for bad user input pollutes the one signal that matters: 5xx rate. It pages the backend team for what was really a malformed request. Returning 200 for an error hides failures from monitoring entirely.',
      },
      doThisNow: [
        {
          task: 'Trigger a real 404 and read the status line. Predict the family before you run it.',
          command: 'curl -sI https://example.com/nonexistent-page | head -n 1',
          reveal:
            'A 404: a 4xx, meaning the client asked for something that is not there. Every URL you mistype produces one. Status codes are not theory.',
        },
        {
          task: 'Ask httpbin to return any code you want, and confirm the first line matches. Try 503.',
          command: 'curl -sI https://httpbin.org/status/503 | head -n 1',
          reveal:
            'You get exactly 503 Service Unavailable, a 5xx: the server signaling its own failure. This endpoint lets you rehearse how clients and dashboards react to each code.',
        },
      ],
      warStory:
        'A service returned 500 whenever a user submitted a bad form. The 5xx alerts fired constantly, the team learned to ignore them, and a real outage hid in the noise for an hour. Accurate 4xx versus 5xx is what keeps alerts trustworthy.',
      tweak: {
        instruction: 'Run curl -i https://example.com/nonexistent-page and read the status line.',
        reveal: 'A 404, with an error body. Status codes are not theory; every URL you mistype produces one.',
      },
      receipt: {
        explain: [
          'The five families and whose fault each implies.',
          'Why 4xx versus 5xx accuracy keeps monitoring honest.',
        ],
        command: 'curl -sI https://httpbin.org/status/404',
        question: 'The code tells you the outcome. What part of the request decided whether it was a read or a write?',
      },
      recap: [
        '2xx worked, 3xx moved, 4xx client erred, 5xx server erred.',
        '401 is who-are-you; 403 is you-may-not.',
        'Accurate codes keep monitoring honest.',
      ],
    },
  },
  {
    id: 'http-rung-methods',
    title: 'Module 6: Methods: GET, POST, PUT, PATCH, DELETE',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 13,
    prompt: 'Map the HTTP verbs to read, create, replace, modify, and remove, plus the two properties that make them safe to retry (or not).',
    explanation: `Methods are the verbs of HTTP, and each carries a meaning that clients, caches, and proxies all rely on.

**GET reads.** No body, no side effects. Browsers prefetch GETs and caches store them precisely because they promise not to change anything.

**POST creates** (or triggers). The request body carries the new thing: POST /users with a JSON body makes a user. POST is the verb for "do this action".

**PUT replaces** a resource wholesale at a known address. **PATCH modifies** part of one. PUT /users/42 sends the complete user; PATCH /users/42 sends just the changed fields.

**DELETE removes.**

**The two properties.** Safe means no changes (GET). Idempotent means repeating gives the same result: PUT the same data twice, same outcome; DELETE twice, still gone. POST is neither, which is why a double-submitted POST can charge a card twice, and why payment APIs add idempotency keys. Retry logic in every client and proxy is built on these promises, so honoring them is part of the contract.`,
    production:
      'A team that tunnels everything through POST loses free retries, caching, and prefetching, and turns every client integration into guesswork. The double-charge bug from retried POSTs is real enough that idempotency keys are a standard interview topic.',
    walkthrough: [
      'Map the five verbs to read, create, replace, modify, remove.',
      'Say which are safe, which are idempotent.',
      'Explain why a network retry of POST is dangerous and of PUT is fine.',
    ],
    questions: [
      'Why must GET have no side effects?',
      'PUT versus PATCH in one sentence?',
      'Why is POST not idempotent?',
    ],
    checklist: [
      'Choose the right verb for five operations.',
      'Define safe and idempotent.',
      'Explain the POST retry hazard.',
    ],
    interactive: {
      coldOpen:
        'A payment request times out. The client retries it. The user gets charged twice. This bug is so common that an entire feature (idempotency keys) exists to prevent it. The root cause is a single property of one HTTP verb. Which one?',
      mental:
        'Methods are verbs stamped on the envelope: the same address means different work depending on the stamp.',
      diagram: {
        nodes: ['GET read', 'POST create', 'PUT replace', 'PATCH modify', 'DELETE remove'],
        explanations: [
          'Reads a resource with no side effects. Safe and idempotent, which is why caches and prefetchers trust it.',
          'Creates or triggers. The body carries the new thing. Neither safe nor idempotent: a retried POST can create twice.',
          'Replaces a resource wholesale at a known address. Idempotent: the same PUT twice leaves the same result.',
          'Modifies part of a resource: send only the changed fields. The polite verb for updates.',
          'Removes the resource. Idempotent: deleting twice is still deleted.',
        ],
      },
      example: {
        code: '# The verb changes the meaning; the path stays the same:\nGET    /users/42\nPUT    /users/42\nPATCH  /users/42\nDELETE /users/42\nPOST   /users',
        output:
          'GET     read user 42            safe, idempotent\nPUT     replace user 42 fully   idempotent\nPATCH   change part of user 42  (usually) idempotent\nDELETE  remove user 42          idempotent\nPOST    create a new user       neither',
        explain:
          'Five verbs against one resource family. POST targets the collection because the new user has no id yet; the server assigns one.',
      },
      predicts: [
        {
          question: 'A request times out and the client retries it. Which verb is risky to retry?',
          options: ['GET', 'PUT', 'POST'],
          correct: 2,
          why: 'If the first POST actually succeeded before the timeout, the retry creates a second user (or a second charge). Idempotent verbs are retry-safe by definition.',
        },
        {
          question: 'Updating just the email of user 42 fits which verb best?',
          options: ['PUT with one field', 'PATCH', 'POST'],
          correct: 1,
          why: 'PATCH means partial modification. PUT semantically replaces the whole resource, so sending one field via PUT implies erasing the rest.',
        },
      ],
      build: {
        simple: 'Different verbs do different things to a resource.',
        actually:
          'Each verb carries a contract clients, caches, and proxies rely on. Safe means no changes (GET). Idempotent means repeating is harmless (PUT, DELETE). POST is neither, so a retried POST can act twice.',
        breaks:
          'A team that tunnels everything through POST loses free retries, caching, and prefetching. And the double-charge from a retried POST is real enough that idempotency keys are a standard interview topic.',
      },
      doThisNow: [
        {
          task: 'Send the same GET twice and a POST twice (httpbin echoes each). Notice the GET is identical and harmless to repeat.',
          command: 'curl -s -X POST -d "amount=10" https://httpbin.org/post | grep -i form',
          reveal:
            'Every POST is processed fresh: if this were a real charge endpoint, two requests would mean two charges. A GET, by contrast, can be repeated forever with no effect. That is the safe/idempotent difference made concrete.',
        },
        {
          task: 'Assign a verb and path to three operations: list all orders, cancel order 7, re-run a failed export.',
          reveal:
            'GET /orders, DELETE /orders/7 (or PATCH if cancel is a status change), POST /exports/7/retries for the action. Actions without a natural noun usually become POST.',
        },
      ],
      warStory:
        'After a brief network blip, a checkout service retried in-flight POSTs and double-charged a batch of customers. The postmortem fix was textbook: an idempotency key on the POST so the second attempt returns the first result instead of charging again.',
      tweak: {
        instruction: 'Decide the verb and path for: list all orders, cancel order 7, re-run a failed export.',
        reveal:
          'GET /orders, DELETE /orders/7 (or PATCH if cancel is a status change), POST /exports/7/retries for the action. Actions without a natural noun usually become POST.',
      },
      receipt: {
        explain: [
          'Each verb\'s job and which are safe or idempotent.',
          'Why a retried POST can double-charge and how idempotency keys fix it.',
        ],
        command: 'curl -s -X POST -d "k=v" https://httpbin.org/post',
        question: 'Programs usually exchange JSON, not HTML. What does the full JSON conversation look like end to end?',
      },
      recap: [
        'GET read, POST create, PUT replace, PATCH modify, DELETE remove.',
        'Safe = no changes; idempotent = repeat freely.',
        'POST retries can double-charge; that is what idempotency keys solve.',
      ],
    },
  },
  {
    id: 'http-rung-json-api',
    title: 'Module 7: JSON APIs: The Full Conversation',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 14,
    prompt: 'Put it all together: a JSON request, a JSON response, and curl driving the whole exchange.',
    explanation: `Browsers fetch HTML; programs fetch JSON. An API is just HTTP where both sides agree the bodies are JSON, and at this module you can read the entire conversation.

**The request side.** POST /users with content-type: application/json and a JSON body. The header is the promise; the body keeps it. Servers reject mismatches, which is the most common beginner integration error.

**The response side.** 201 Created, content-type: application/json, and a JSON body echoing the new resource with its server-assigned id. The client parses it with the JSON tools from your language modules: this is where the object and string lessons cash out.

**Driving it with curl.** -X picks the method, -H adds a header, -d supplies the body. With those three flags you can exercise any API on earth from a terminal, no app required. That makes curl the lingua franca of bug reports: a failing request pasted as a curl command is reproducible by anyone.`,
    production:
      'API integrations live and die on this conversation shape. The four usual suspects when one fails: missing content-type header, malformed JSON body, wrong method, wrong path. Reading both raw messages side by side finds the culprit in minutes.',
    walkthrough: [
      'Read the request: verb, path, header, JSON body.',
      'Read the response: code, header, JSON body with the new id.',
      'Compose the curl command that sends it.',
      'Name the four usual failure suspects.',
    ],
    questions: [
      'What does content-type: application/json promise?',
      'Why does the response echo the created resource?',
      'Which three curl flags drive any API?',
    ],
    checklist: [
      'Read a full JSON request/response pair.',
      'Write the equivalent curl command.',
      'List the four usual integration failure causes.',
    ],
    interactive: {
      mental:
        'An API call is a vending machine: exact buttons in (method, path, JSON), predictable item out (status code, JSON).',
      diagram: {
        nodes: ['Compose request', 'Declare JSON', 'Server validates', '201 + body', 'Client parses'],
        explanations: [
          'Pick the verb and path: POST /users to create. curl -X sets the method.',
          'content-type: application/json is the promise; the -d body keeps it. Servers reject mismatches.',
          'The server checks presence, types, format, and bounds before any logic runs. Bad input gets a 400 with details.',
          'Success answers 201 Created with the new resource echoed, including the server-assigned id.',
          'The client parses the JSON text into live data with the tools from the language ladders.',
        ],
      },
      coldOpen:
        'You send a perfect JSON body to an API and get back a 400. The data is valid. The bug is one missing header. This is the single most common mistake when people first call an API, and it takes ten seconds to spot once you know the shape of the conversation.',
      intro: 'Every module of this course appears in this one exchange.',
      example: {
        code: 'curl -X POST https://api.example.com/users \\\n  -H "content-type: application/json" \\\n  -d \'{"name": "Kay", "role": "admin"}\'',
        output:
          'HTTP/2 201\ncontent-type: application/json\n\n{"id": 43, "name": "Kay", "role": "admin"}',
        explain:
          'The verb is POST, the body is JSON and says so in its header. The server answers 201 Created and returns the user with its new id 43, ready for the client to parse.',
      },
      predicts: [
        {
          question: 'Where did the id 43 come from?',
          options: ['the request body', 'the server assigned it', 'curl generated it'],
          correct: 1,
          why: 'Clients send the data they know; the server owns identity. That is why POST targets the collection and the response echoes the result.',
        },
        {
          question: 'Send the same body with no content-type header. Likely outcome?',
          options: [
            'works the same',
            'a 4xx: the server refuses or misreads the body',
            'the server guesses correctly forever',
          ],
          correct: 1,
          why: 'Without the header, frameworks may not parse the body as JSON at all. This is the single most common beginner API bug.',
        },
        {
          question: 'To fetch user 43 afterward, the request is...',
          options: ['POST /users/43', 'GET /users/43', 'GET /users?create=43'],
          correct: 1,
          why: 'Reading is GET, and the path names the resource. The verbs and paths compose exactly as the previous modules promised.',
        },
      ],
      build: {
        simple: 'An API call sends JSON and gets JSON back.',
        actually:
          'It is plain HTTP where both sides agree the bodies are JSON. The request declares content-type: application/json and carries the body; the server validates, then answers with a status code and a JSON body, often echoing the created resource with its new id.',
        breaks:
          'Four usual suspects when an integration fails: missing content-type header, malformed JSON body, wrong method, wrong path. Reading both raw messages side by side finds the culprit in minutes.',
      },
      doThisNow: [
        {
          task: 'POST real JSON to a live echo API and read what the server saw. Confirm your body parsed.',
          command: 'curl -s -X POST https://httpbin.org/post -H "content-type: application/json" -d \'{"name":"Kay"}\'',
          reveal:
            'The response has a "json" field with your parsed object, because you declared content-type correctly. Drop that header and watch it land in "data" as an unparsed string instead: that is the most common beginner API bug.',
        },
        {
          task: 'Now remove the content-type header and run it again. Compare where your data shows up.',
          command: 'curl -s -X POST https://httpbin.org/post -d \'{"name":"Kay"}\'',
          reveal:
            'Without the header, the JSON arrives as a raw string in "data", and "json" is null. A real API would reject or misread it. The header is the promise; the body keeps it.',
        },
      ],
      warStory:
        'A mobile team filed a bug as "the API is broken." A backend engineer asked for the exact curl command. It had no content-type header. The whole thing was reproduced, diagnosed, and closed in five minutes, because curl made the request shareable.',
      tweak: {
        instruction: 'Modify the curl to create a viewer named Sam instead.',
        reveal:
          'Only the -d body changes: \'{"name": "Sam", "role": "viewer"}\'. Method, path, and header are the stable skeleton; the body is the variable data.',
      },
      receipt: {
        explain: [
          'The full JSON request/response conversation and the role of content-type.',
          'The three curl flags (-X, -H, -d) that drive any API on earth.',
        ],
        command: 'curl -s -X POST https://httpbin.org/post -H "content-type: application/json" -d \'{"a":1}\'',
        question: 'You can read the whole HTTP conversation now. What does the server do with the request before it replies?',
      },
      writeDrillId: 'api-json-response',
      recap: [
        'An API is HTTP with JSON bodies and honest content-type headers.',
        'curl -X, -H, -d can drive any API from a terminal.',
        'Server assigns ids; 201 echoes the created resource.',
      ],
    },
  },
]
