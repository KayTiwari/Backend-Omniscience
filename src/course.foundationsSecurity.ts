import type { Problem } from './course'

// Security from absolute zero: the attacker model, passwords, sessions and
// tokens, injection, and secrets. Concrete examples over abstractions.

export const securityFoundations: Problem[] = [
  {
    id: 'security-rung-attacker-model',
    title: 'Rung 1: Think Like The Attacker',
    type: 'lesson',
    difficulty: 'Warmup',
    minutes: 12,
    prompt:
      'Adopt the security mindset: every input is attacker-controlled until proven otherwise.',
    explanation: `Security is one mental shift: stop imagining users and start imagining adversaries. The browser form is a suggestion; an attacker talks to your API directly with curl, sending any bytes in any field at any speed.

**Attacker-controlled means everything.** Body fields, query strings, headers, cookies, file uploads, even the URL path. If a client can set it, an attacker will, and your frontend validation might as well not exist because attackers do not use your frontend.

**The trust boundary.** The line between data you control and data someone else composes. Everything crossing inbound gets validated, everything used in a sensitive context gets escaped or parameterized, and nothing is believed because it "should" be impossible from the UI.

**Bots, not movie hackers.** Most attacks are automated scanners probing every public IP for known mistakes: default passwords, exposed admin panels, unpatched libraries, debug endpoints left on. Being boring and disciplined defeats almost all of it, which is why security work is mostly habits.

**Whose fault is the model.** The 4xx/5xx split returns: a well-designed system makes the attacker's malformed input a clean 400 story rather than a 500 with a stack trace that maps your internals.`,
    production:
      'New endpoints get probed within hours of going live; certificate transparency logs and IP scanners make discovery automatic. The teams that survive are the ones whose every endpoint assumed adversarial input on the day it shipped.',
    walkthrough: [
      'List every attacker-controlled input on a login endpoint.',
      'Explain why client-side validation provides zero security.',
      'Name three things automated scanners look for.',
    ],
    questions: [
      'What does attacker-controlled mean for a request header?',
      'Why is frontend validation not a defense?',
    ],
    checklist: [
      'Enumerate the attacker-controlled inputs of an endpoint.',
      'Define the trust boundary.',
      'Explain why most attacks are automated.',
    ],
    interactive: {
      mental:
        'Treat every request like a package from a stranger: inspect the contents, and ignore how pretty the form it supposedly came from was.',
      diagram: {
        nodes: ['Attacker input', 'Trust boundary', 'Validate', 'Neutralize', 'Safe core'],
        explanations: [
          'Anything a client can set: body fields, query strings, headers, cookies, paths, uploads. Attackers compose requests directly; your form is irrelevant.',
          'The line where outside data enters your system. Everything crossing it is hostile until checked.',
          'Presence, type, format, bounds, allowlist: the API ladder checklist, applied as a security layer.',
          'Wherever data meets an interpreter, use the inert channel: parameterized SQL, escaped HTML, argument arrays for shells.',
          'Inside the boundary, code can finally trust its inputs, because the door did its job.',
        ],
      },
      example: {
        code: '# Your form sends this:\nPOST /login {"email": "kay@example.com", "password": "..."}\n\n# An attacker sends whatever they want:\ncurl -X POST https://yoursite.com/login \\\n  -H "content-type: application/json" \\\n  -d \'{"email": {"$ne": null}, "password": "x", "admin": true}\'',
        output:
          'Your frontend never made this request.\nThe email field is an object, the admin field is uninvited.\nYour backend alone decides what happens next.',
        explain:
          'The attacker skipped the form entirely. Whatever validation lived in the browser is irrelevant; the backend is the only defense that exists.',
      },
      predicts: [
        {
          question: 'Your signup form limits names to 50 characters. An attacker can send...',
          options: [
            'at most 50 characters',
            'any length at all, because they call the API directly',
            'nothing: the form blocks them',
          ],
          correct: 1,
          why: 'Forms constrain honest users only. The API accepts raw requests, so the backend must enforce every limit itself.',
        },
        {
          question: 'Who finds an unprotected admin endpoint on a brand new site?',
          options: [
            'nobody, it is too new',
            'automated scanners, usually within hours',
            'only insiders',
          ],
          correct: 1,
          why: 'Discovery is automated and constant. Obscurity is not a delay tactic worth counting in days.',
        },
      ],
      tweak: {
        instruction: 'List the attacker-controlled inputs of GET /search?q=term with a session cookie.',
        reveal:
          'The q parameter, every header including the cookie itself, and the path. All of it crosses the trust boundary, and the cookie being present does not make the rest trustworthy.',
      },
      recap: [
        'Every client-settable byte is attacker-controlled.',
        'Frontend validation is UX; backend validation is security.',
        'Attacks are automated; disciplined habits beat them.',
      ],
    },
  },
  {
    id: 'security-rung-passwords',
    title: 'Rung 2: Passwords: Hash, Never Store',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 14,
    prompt: 'Store passwords so a stolen database does not become stolen accounts: slow hashing with salt.',
    explanation: `The rule has no exceptions: a password is never stored, logged, or emailed in its original form. What you store is a hash, and the details of the hashing are the whole game.

**A hash is one-way.** A function that turns "hunter2" into a fixed-length scramble, with no way to run it backward. At login, hash the submitted password and compare hashes; the original is never needed again after signup.

**Fast hashes lose.** SHA-256 is built for speed, and speed is the attacker's friend: a GPU guesses billions of fast hashes per second against a stolen database. Password hashing uses deliberately slow algorithms (bcrypt, scrypt, Argon2) tuned to take ~100ms, turning a weekend crack into centuries.

**Salt kills precomputation.** A random value mixed into each hash, stored alongside it. Two users with the same password get different hashes, and precomputed lookup tables (rainbow tables) become useless. Modern libraries salt automatically; you just need to never roll your own.

**The library does this.** bcrypt.hash(password) and bcrypt.compare(submitted, stored) are the entire integration. The engineering discipline is everything around it: no plaintext in logs, no maximum length under 64, no "send me my password" feature (a recovery email proves storage was plaintext).`,
    production:
      'Database breaches are a when, not an if, across the industry. Companies that hashed with bcrypt notify users to rotate as a precaution; companies that stored plaintext or fast hashes make international news and class actions. The difference was one library choice years earlier.',
    walkthrough: [
      'State the rule: hash at signup, compare at login, plaintext never persists.',
      'Explain slow-by-design with the GPU math.',
      'Explain what salt defeats.',
      'Spot the tell: any service that can email your password stored it wrong.',
    ],
    questions: [
      'Why must password hashing be slow?',
      'What does the salt prevent?',
      'Why is "we will email you your password" an instant red flag?',
    ],
    checklist: [
      'Explain one-way hashing at signup and login.',
      'Justify bcrypt/Argon2 over SHA-256.',
      'Explain salting.',
    ],
    interactive: {
      mental:
        'A password hash is a meat grinder: meat in, no recipe back out, and deliberately slow grinding ruins the thief whole weekend.',
      diagram: {
        nodes: ['Password', '+ Salt', 'Slow hash', 'Stored', 'Compare'],
        explanations: [
          'Exists in memory only during signup and login. Never written to disk, logs, or email.',
          'A random per-user value mixed in, so identical passwords produce unrelated hashes and precomputed tables are useless.',
          'bcrypt, scrypt, or Argon2, tuned to take around 100ms. Slowness is the defense: GPU guessing drops from billions to dozens per second.',
          'Only the salted hash persists. A stolen table is a pile of grinders output, with each guess costing real compute.',
          'Login re-hashes the attempt with the same salt and compares results. The original is never needed again.',
        ],
      },
      example: {
        code: '// signup\nconst stored = await bcrypt.hash("hunter2", 12);\n// stored: "$2b$12$N9qo8uLOickgx2ZMRZoMye..." (salt lives inside)\n\n// login\nconst ok = await bcrypt.compare("hunter2", stored);\nconst bad = await bcrypt.compare("hunter3", stored);',
        output: 'ok:  true\nbad: false\n\nThe original "hunter2" was never stored anywhere.',
        explain:
          'hash produces a salted, slow hash with the salt embedded in the string. compare re-hashes the attempt with that same salt and checks the result. The plaintext exists only in memory, briefly.',
      },
      predicts: [
        {
          question: 'A breach leaks your users table. With bcrypt hashes, the attacker has...',
          options: [
            'every password immediately',
            'a very slow guessing problem per user',
            'nothing at all to work with',
          ],
          correct: 1,
          why: 'Slow hashing makes each guess cost ~100ms of compute. Strong passwords become impractical to crack; weak ones still fall, which is why both layers matter.',
        },
        {
          question: 'Two users both choose "hunter2". Their stored hashes are...',
          options: ['identical', 'different, because each hash has its own salt'],
          correct: 1,
          why: 'Per-user salt means identical passwords produce unrelated hashes, so cracking one reveals nothing about the other.',
        },
        {
          question: 'Why is SHA-256 wrong for passwords despite being cryptographically sound?',
          options: [
            'it is reversible',
            'it is fast, and fast helps the attacker guess at GPU speed',
            'it produces output that is too short',
          ],
          correct: 1,
          why: 'Speed is a feature for file checksums and a vulnerability for password storage. Deliberate slowness is the defense.',
        },
      ],
      tweak: {
        instruction: 'A user clicks "forgot password". Design what happens without ever revealing a password.',
        reveal:
          'Email a single-use, expiring reset link; the user sets a new password, which gets hashed fresh. Nothing to reveal exists, because storage was correct.',
      },
      writeDrillId: 'security-strong-password',
      recap: [
        'Hash at signup, compare at login, plaintext never touches disk.',
        'Slow algorithms (bcrypt/Argon2) turn GPU cracking into centuries.',
        'Salt makes every hash unique; libraries handle it.',
      ],
    },
  },
  {
    id: 'security-rung-sessions-tokens',
    title: 'Rung 3: Sessions And Tokens: Staying Logged In',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 15,
    prompt: 'How a server remembers who you are: session cookies and bearer tokens, and what each trades.',
    explanation: `HTTP forgets everything between requests, so logins need a memory mechanism. Two patterns dominate.

**Sessions: the server remembers.** At login, the server stores a session record and hands the browser a cookie holding a random session id. The browser attaches the cookie automatically on every request; the server looks the id up. Logout deletes the record, and the session dies instantly server-side. The cookie needs three flags: HttpOnly (JavaScript cannot read it), Secure (HTTPS only), SameSite (blunts cross-site request forgery).

**Tokens: the client carries proof.** At login, the server signs a token (commonly a JWT) containing the user id and an expiry, and the client sends it in the Authorization: Bearer header. The server verifies the signature instead of looking anything up, which scales beautifully across services. The cost: a signed token is valid until expiry, so revocation needs extra machinery (short lifetimes plus refresh tokens, or a denylist).

**The crucial JWT fact.** Tokens are signed, not encrypted: anyone can read the payload with a base64 decode. Signing proves it was not tampered with; it hides nothing. Secrets never go inside.

**Choosing.** Server-rendered site with one backend: sessions are simpler and instantly revocable. Mobile apps and service-to-service APIs: bearer tokens travel better. Most real systems run both somewhere.`,
    production:
      'The classic token incident: a leaked JWT keeps working for its full lifetime because nothing can revoke it, while a leaked session id dies with one DELETE. Short expiries and refresh rotation are the standard mitigation, and "why" is a favorite interview question.',
    walkthrough: [
      'Trace a session login: record, cookie, automatic attachment, lookup.',
      'Trace a token login: sign, store client-side, bearer header, verify.',
      'Name the three cookie flags and what each blocks.',
      'Decode a JWT payload mentally: readable, not secret.',
    ],
    questions: [
      'Where does the state live in each pattern?',
      'Why is instant revocation easy for sessions and hard for JWTs?',
      'What does HttpOnly protect against?',
    ],
    checklist: [
      'Explain both login flows end to end.',
      'Set the three cookie flags with reasons.',
      'State what JWT signatures do and do not provide.',
    ],
    interactive: {
      mental:
        'A session is a coat check (the club keeps your coat, you hold a numbered ticket); a JWT is a stamped wristband (anyone can read it, only the club can stamp it, and it works until it expires).',
      diagram: {
        nodes: ['Login', 'Session record', 'Cookie id', 'Signed JWT', 'Bearer header'],
        explanations: [
          'Credentials are verified once, against the hashed password from the previous rung.',
          'Session pattern: the server stores a record and remembers. Logout deletes it, killing the credential instantly.',
          'The browser holds only a random id in a cookie flagged HttpOnly, Secure, and SameSite, attached automatically to every request.',
          'Token pattern: the server signs a payload (user id, expiry) and keeps nothing. Anyone can read it; nobody can alter it without breaking the signature.',
          'The client sends it manually in Authorization: Bearer. Verification is a signature check, which scales across services but makes revocation the hard part.',
        ],
      },
      example: {
        code: '# Session flow                        # Token flow\nPOST /login                            POST /login\n  -> server stores session abc123        -> server signs a JWT\n  <- Set-Cookie: sid=abc123;             <- {"token": "eyJhbGc..."}\n     HttpOnly; Secure; SameSite=Lax\n\nGET /profile                           GET /profile\n  Cookie: sid=abc123 (automatic)         Authorization: Bearer eyJhbGc...\n  -> server looks up abc123              -> server verifies the signature',
        output:
          'Sessions: state on the server, id in a guarded cookie, revoke = delete the record.\nTokens:   state in the signed token, sent manually, revoke = wait for expiry (or build more).',
        explain:
          'Same goal, opposite homes for the state. The cookie travels automatically and needs flags; the bearer header is manual and needs client storage care.',
      },
      predicts: [
        {
          question: 'A user clicks logout. Which mechanism can guarantee the credential is dead immediately?',
          options: [
            'the session: delete the server record',
            'the JWT: it stops working on its own',
            'both equally',
          ],
          correct: 0,
          why: 'Sessions die with their server record. A signed JWT verifies successfully until it expires, no matter what the user clicked.',
        },
        {
          question: 'You put a user’s salary inside a JWT payload. Who can read it?',
          options: [
            'only your server, it is encrypted',
            'anyone holding the token: payloads are just encoded, not encrypted',
            'nobody',
          ],
          correct: 1,
          why: 'base64 is an encoding, not encryption. Signatures prevent tampering and reveal nothing less.',
        },
        {
          question: 'What does the HttpOnly flag prevent?',
          options: [
            'the cookie traveling over HTTP',
            'page JavaScript reading the cookie, blunting XSS theft',
            'the cookie expiring',
          ],
          correct: 1,
          why: 'HttpOnly hides the cookie from document.cookie, so script injection cannot exfiltrate the session id. Secure is the HTTPS-only flag.',
        },
      ],
      tweak: {
        instruction: 'Your mobile app and your server-rendered site both need auth. Sketch the choice for each.',
        reveal:
          'Site: session cookie with all three flags, instant logout. App: short-lived bearer token plus refresh rotation, because cookies are a browser mechanism. Mixed deployments like this are the norm.',
      },
      writeDrillId: 'security-jwt-payload',
      recap: [
        'Sessions: server-side state, cookie id, instant revocation.',
        'Tokens: signed client-side proof, scales across services, revocation is the hard part.',
        'JWTs are readable by anyone; signed means untampered, never secret.',
      ],
    },
  },
  {
    id: 'security-rung-injection',
    title: 'Rung 4: Injection: Data Must Never Become Code',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 15,
    prompt: 'Understand SQL injection and XSS as one disease: user data executed as code. Learn the two cures.',
    explanation: `The most damaging vulnerability class in web history is one idea wearing different costumes: a system pastes user text into a place where text gets executed.

**SQL injection.** Code builds a query by gluing strings: "SELECT * FROM users WHERE name = '" + input + "'". The attacker submits a name containing quote characters and SQL: '; DROP TABLE users; -- and the database executes both statements. The input crossed from data into code.

**The cure is parameterized queries.** query("SELECT * FROM users WHERE name = $1", [input]) sends the SQL and the data down separate channels; the database treats the input as a value forever, no matter what characters it holds. Every database library offers this, and string-built SQL is simply banned in serious codebases.

**XSS is the same disease in HTML.** A comment containing <script>steal(document.cookie)</script> rendered raw into a page executes in every visitor's browser. The cure is output escaping: render user text as text (&lt;script&gt;), which frameworks like React do by default unless you explicitly opt out with the dangerously-named escape hatches.

**The unified rule.** Wherever user data meets an interpreter (SQL, HTML, shell commands, file paths), use the channel that keeps data inert: parameters, escaping, allowlists. Never sanitize by hand with regex; the bypass lists are longer than your patience.`,
    production:
      "SQL injection has emptied real companies' databases for twenty-five years and still tops vulnerability reports, almost always via one forgotten string-built query in a corner of the codebase. Code reviewers grep for string concatenation near query calls as a reflex.",
    walkthrough: [
      'Build the vulnerable query by hand and trace the attack input through it.',
      'Rewrite it parameterized and trace the same input.',
      'Map the same story onto a comment box and XSS.',
      'State the unified rule from memory.',
    ],
    questions: [
      'What single mistake unifies SQLi and XSS?',
      'Why do parameters defeat injection completely?',
      'Why is hand-rolled sanitization a losing game?',
    ],
    checklist: [
      'Demonstrate the injection with a crafted input.',
      'Fix it with a parameterized query.',
      'Explain output escaping for HTML.',
    ],
    interactive: {
      mental:
        'Injection is a forged form field that escapes its box and rewrites the whole form; parameters are boxes nothing can escape.',
      diagram: {
        nodes: ['User input', 'Glued = code', 'Parameterized = data', 'Same cure for HTML'],
        explanations: [
          'Hostile text arrives in any field: a name containing quotes and SQL, a comment containing script tags.',
          'String concatenation pastes it into the query text, where the database reads it as instructions. One tautology and the WHERE matches every row.',
          'Placeholders send SQL and values down separate channels. The same hostile text arrives as an inert value, compared literally, matching nothing.',
          'XSS is the identical disease in the browser interpreter, and output escaping is its parameterized query. One rule everywhere: data never becomes code.',
        ],
      },
      example: {
        code: "// vulnerable: data glued into code\nconst q = \"SELECT * FROM users WHERE name = '\" + input + \"'\";\n// attacker input:  ' OR '1'='1\n// q becomes: SELECT * FROM users WHERE name = '' OR '1'='1'\n\n// safe: data stays data\nawait db.query('SELECT * FROM users WHERE name = $1', [input]);",
        output:
          "glued:        WHERE name = '' OR '1'='1'   -> every row returned\nparameterized: WHERE name = <the literal text>  -> 0 rows, harmless",
        explain:
          "The glued version let quote characters rewrite the query's logic into a tautology that matches everything. The parameterized version carries the same hostile text as an inert value.",
      },
      predicts: [
        {
          question: "With the glued query, what does input ' OR '1'='1 return?",
          options: [
            'an error',
            'every user in the table, because the condition became always-true',
            'nothing',
          ],
          correct: 1,
          why: "The injected quotes close the string and add OR '1'='1', a condition true for every row. Authentication bypasses work exactly like this.",
        },
        {
          question: 'Send the same hostile input to the parameterized query. Result?',
          options: [
            'same breach',
            'zero rows: it searched for a user literally named that text',
            'a syntax error',
          ],
          correct: 1,
          why: 'Parameters travel outside the SQL text. The database compares names against the weird string and finds none.',
        },
        {
          question: 'A comment renders as <script>...</script> and runs in visitors’ browsers. This is...',
          options: ['SQL injection', 'XSS: the HTML flavor of the same disease', 'a CSS bug'],
          correct: 1,
          why: 'User data became code, this time in the browser’s interpreter. Output escaping is the parameterized query of HTML.',
        },
      ],
      tweak: {
        instruction: 'Find the third costume: code runs exec("convert " + filename) on an uploaded filename.',
        reveal:
          'Command injection: a filename like "x; rm -rf /" becomes shell code. Same disease, same cure shape: pass arguments as an array, never build command strings.',
      },
      writeDrillId: 'security-escape-html',
      recap: [
        'Injection = user data executed as code, in any interpreter.',
        'Parameterized queries make SQL injection impossible.',
        'Escape on output for HTML; never sanitize by regex.',
      ],
    },
  },
  {
    id: 'security-rung-secrets',
    title: 'Rung 5: Secrets, HTTPS, And The Boring Discipline',
    type: 'lesson',
    difficulty: 'Core',
    minutes: 13,
    prompt: 'Keep credentials out of code, understand what HTTPS actually buys, and adopt the habits that prevent famous incidents.',
    explanation: `The last rung is the unglamorous layer where most real breaches start: leaked credentials and unencrypted channels.

**Secrets never enter the repository.** Database passwords, API keys, signing keys: one git commit makes them permanent history that survives deletion, and scanners watch public repositories in real time, with leaked AWS keys exploited in minutes. Secrets live in environment variables or a secrets manager, and code reads process.env.DATABASE_URL without ever knowing the value at rest.

**.env files stay local.** The .env file pattern works only with .env in .gitignore from the first commit, plus a committed .env.example listing the names without values, so teammates know what to set.

**What HTTPS buys.** Encryption (nobody on the network reads the traffic, including the coffee shop wifi and the ISP), integrity (nobody alters it in flight), and authentication (you are talking to the real server, via certificates). Without it, the session cookie from rung 3 crosses the network readable, and one public wifi sniff equals a stolen login.

**Rotation and least privilege.** Keys get rotated on a schedule and revoked on any suspicion; each service gets credentials that can do only its own job, so one leak does not open everything. None of this is clever, which is exactly the point: security is mostly the discipline of boring habits, held every day.`,
    production:
      'The leaked-key-in-git incident is so common that GitHub runs secret scanning over every public push and AWS auto-quarantines keys it finds. The postmortems all read the same: committed in a hurry, force-pushed a "removal" that removed nothing, exploited before lunch.',
    walkthrough: [
      'Move a hardcoded connection string into an environment variable.',
      'Set up .gitignore with .env and commit .env.example instead.',
      'List the three guarantees of HTTPS.',
      'Apply least privilege to a reporting service’s database user.',
    ],
    questions: [
      'Why does deleting a committed secret not unleak it?',
      'What three things does HTTPS guarantee?',
      'What does least privilege limit?',
    ],
    checklist: [
      'Read configuration from the environment.',
      'Keep .env ignored and .env.example committed.',
      'Explain the three HTTPS guarantees.',
    ],
    interactive: {
      mental:
        'A committed secret is a tattoo: deleting the commit is a cover-up, everyone already took photos. Keys live in wallets (the environment), never on skin (the repo).',
      diagram: {
        nodes: ['Secret', '.gitignore .env', 'Env vars', 'Code reads name', 'Rotate'],
        explanations: [
          'Database passwords, API keys, signing keys: anything that grants access. Scanners watch public repos in real time.',
          'The .env file holds local values and never enters git. A committed .env.example documents the names without the values.',
          'Production platforms inject real values as environment variables, different per deployment, visible to the process alone.',
          'Code references process.env.DATABASE_URL: the name of the secret, never the secret. The repo stays clean forever.',
          'Leaked or suspected keys get revoked immediately and rotated on schedule. History cannot be unleaked; rotation is the only cure.',
        ],
      },
      example: {
        code: '// committed to git: permanent, scanned, exploited\nconst db = connect("postgres://admin:Hunter2!@prod-db:5432/app");\n\n// environment: the value never enters the repo\nconst db = connect(process.env.DATABASE_URL);\n\n// .gitignore        // .env.example (committed)\n.env                  DATABASE_URL=\n                      STRIPE_KEY=',
        output:
          'git history: no credentials, ever\nlocal dev:   .env supplies the values\nproduction:  the platform injects real values',
        explain:
          'The code names the secret; the environment supplies it per deployment. The example file documents what to set without leaking anything.',
      },
      predicts: [
        {
          question: 'You committed an API key, then deleted it in the next commit. The key is...',
          options: [
            'safe now',
            'still in git history and must be rotated immediately',
            'encrypted by git',
          ],
          correct: 1,
          why: 'History preserves every commit. The only fix is revoking the key; scrubbing history is damage control, never the cure.',
        },
        {
          question: 'On hotel wifi without HTTPS, your session cookie is...',
          options: [
            'protected by the browser',
            'readable by anyone positioned on the network',
            'encrypted by the cookie flags',
          ],
          correct: 1,
          why: 'Plain HTTP crosses the network as readable text. The Secure cookie flag exists precisely to refuse that journey.',
        },
        {
          question: 'A read-only reporting service should connect to the database as...',
          options: [
            'the admin user, for flexibility',
            'a user that can only SELECT from the tables it reports on',
            'no user',
          ],
          correct: 1,
          why: 'Least privilege caps the blast radius: if the reporting service leaks its credentials, the attacker gets read access to some tables instead of the keys to everything.',
        },
      ],
      tweak: {
        instruction: 'Your new project needs a database URL and a payment key. Write the first three security moves.',
        reveal:
          'Add .env to .gitignore before anything else, commit a .env.example naming both variables, read both via the environment in code. Three boring moves, most famous incidents prevented.',
      },
      recap: [
        'Secrets live in the environment; git history is forever.',
        'HTTPS = encryption + integrity + server authentication.',
        'Rotate keys, grant least privilege, stay boring.',
      ],
    },
  },
]
