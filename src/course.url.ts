import type { Subject } from './course'
import { HttpIcon } from './TechIcons'

// Flagship module: "What Happens When You Type a URL." One scrollable journey
// along the request path, eight stations from Browser to Render. Every station
// is the DOING-first shape: a cold-open hook, a live artifact, build-then-break,
// interleaved hands-on tasks (real terminal commands), a war story, a receipt.
// This is the reference implementation other lessons should grow toward.

export const urlJourneySubject: Subject = {
  id: 'url-journey',
  title: 'What Happens When You Type a URL',
  subtitle: 'One request, eight stations, three continents, under 200ms.',
  icon: HttpIcon,
  color: '#3fb950',
  stations: [
    { label: 'Browser', problemId: 'url-station-browser' },
    { label: 'DNS', problemId: 'url-station-dns' },
    { label: 'TCP', problemId: 'url-station-tcp' },
    { label: 'TLS', problemId: 'url-station-tls' },
    { label: 'HTTP', problemId: 'url-station-http' },
    { label: 'Server', problemId: 'url-station-server' },
    { label: 'Response', problemId: 'url-station-response' },
    { label: 'Render', problemId: 'url-station-render' },
  ],
  problems: [
    {
      id: 'url-station-browser',
      title: 'Station 1: The Browser',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 8,
      prompt: 'Before a single byte leaves your machine, the browser has already done real work. Name what it does to the URL.',
      checklist: [
        'Break a URL into scheme, host, path, and query.',
        'Explain what the browser checks before any network call.',
        'Run curl -v on a real URL and read the first lines.',
      ],
      interactive: {
        coldOpen:
          'You type google.com and hit Enter. Before you see a pixel, around 14 things happen across 3 continents in under 200ms. Most engineers can name 4. By the end of this module you can name them all, in order.',
        mental:
          'The browser is a dispatcher. It reads the address, checks its own pockets (cache, open connections) first, and only sends a courier out when it has to.',
        diagram: {
          nodes: ['Parse URL', 'Check caches', 'Decide protocol', 'Hand off to network'],
          explanations: [
            'The URL is structured text: scheme (https), host (google.com), optional port, path (/), and query (?q=...). The browser splits it before doing anything else.',
            'Before any network call the browser checks its HSTS list, its own DNS cache, and whether it already has an open connection it can reuse. The fastest request is the one you never send.',
            'https means the browser will need TLS. It also decides HTTP version (often HTTP/2 or HTTP/3) based on what it knows about the host.',
            'Only now, with no usable cache hit, does the browser ask the operating system to find the server and open a connection.',
          ],
        },
        example: {
          code: '# Ask curl to narrate every step it takes:\ncurl -v https://example.com 2>&1 | head -n 12',
          output:
            '*   Trying 93.184.216.34:443...\n* Connected to example.com (93.184.216.34) port 443\n* ALPN: offers h2,http/1.1\n* TLS handshake, TLS 1.3 ...\n* Server certificate: CN=example.com\n> GET / HTTP/2\n> Host: example.com\n> user-agent: curl/8.4.0\n> accept: */*',
          explain:
            'The lines starting with * are curl narrating the journey. The lines starting with > are the request it eventually sends. You can watch every station of this module in those 12 lines.',
        },
        build: {
          simple: 'Browser takes the URL and asks the internet for the page.',
          actually:
            'Browser parses the URL, enforces HTTPS via HSTS, checks its DNS cache and connection pool, picks an HTTP version, and only then reaches for the network.',
          breaks:
            'A stale HSTS entry or a cached connection to a dead server makes the browser fail before any new request leaves. "It works in incognito" is almost always a cache talking.',
        },
        doThisNow: [
          {
            task: 'Run curl with -v against any site and read the lines that start with *. Those are the stations ahead of us.',
            command: 'curl -v https://example.com 2>&1 | head -n 12',
            reveal:
              'You should see Trying <ip>, Connected, an ALPN/TLS line, the certificate, then your GET request. Every later station of this module is one of those lines.',
          },
          {
            task: 'Open DevTools, go to the Network tab, reload any page, and click the very first document request. Find its Timing breakdown.',
            reveal:
              'The Timing tab splits the request into DNS lookup, Initial connection (TCP), SSL (TLS), and Waiting (TTFB). Those are stations 2, 3, 4, and 6 of this module, measured in real milliseconds.',
          },
        ],
        warStory:
          'A team once spent a day debugging a "down" site that was fine for new users. The cause: an HSTS max-age of one year pinned old browsers to a hostname they had since retired. The browser never even tried the new address.',
        receipt: {
          explain: [
            'The four parts of a URL and what each one selects.',
            'Why the fastest request is the one the browser never sends.',
          ],
          command: 'curl -v https://example.com 2>&1 | head -n 12',
          question: 'Once the browser has the hostname, how does it turn that name into a machine it can reach?',
        },
      },
    },
    {
      id: 'url-station-dns',
      title: 'Station 2: DNS',
      type: 'lesson',
      difficulty: 'Warmup',
      minutes: 9,
      prompt: 'Turn google.com into an IP address by hand, walking the resolver chain from root to authoritative.',
      checklist: [
        'Explain why a name must become an IP before anything connects.',
        'Read a dig +trace and name root, TLD, and authoritative servers.',
        'Explain what TTL controls and how it causes stale results.',
      ],
      interactive: {
        coldOpen:
          'A name like google.com means nothing to the network. Routers move packets to numbers, not words. So who turns the word into a number, and how do they do it in milliseconds for a name they have never seen?',
        mental:
          'DNS is the internet phone book, but distributed: no single book holds every number. You ask a chain of librarians, each pointing you closer, and everyone caches the answer on the way back.',
        example: {
          code: '# Watch the full resolver walk, root -> TLD -> authoritative:\ndig google.com +trace +nodnssec | tail -n 8',
          output:
            'com.            172800  IN  NS  a.gtld-servers.net.\n;; Received 1178 bytes from 198.41.0.4#53(a.root-servers.net)\n\ngoogle.com.     172800  IN  NS  ns1.google.com.\n;; Received 664 bytes from 192.5.6.30#53(a.gtld-servers.net)\n\ngoogle.com.     300     IN  A   142.250.80.46\n;; Received 44 bytes from 216.239.32.10#53(ns1.google.com)',
          explain:
            'Three hops: the root server points to the .com servers, the .com servers point to Google name servers, and Google answers with the A record. The 300 is the TTL: cache this answer for 300 seconds.',
        },
        build: {
          simple: 'DNS turns a hostname into an IP address.',
          actually:
            'Your resolver walks a hierarchy: root server -> TLD server (.com) -> authoritative server (Google), caching each answer for its TTL so the next lookup is instant.',
          breaks:
            'TTL is a promise about staleness. Set it to 24h, then migrate servers, and a chunk of the world keeps hitting the old IP for a day. Lower TTL before a migration, raise it after.',
        },
        doThisNow: [
          {
            task: 'Trace a real name from the root down. Read which server answers each hop.',
            command: 'dig google.com +trace | tail -n 12',
            reveal:
              'You will see the query bounce from a root-servers.net, to a gtld-servers.net (the .com registry), to the domain\'s own name servers, which finally return the A record.',
          },
          {
            task: 'Look at just the answer and its TTL. Run it twice in a row and watch the TTL count down.',
            command: 'dig +noall +answer google.com',
            reveal:
              'The second run usually shows a smaller TTL: you hit your resolver\'s cache, and it is counting down the seconds it is allowed to keep the answer.',
          },
        ],
        warStory:
          'In 2019 a bad DNS configuration push took a large chunk of the internet offline for about 27 minutes. The packets were fine. The names just stopped resolving, and nothing downstream could even start.',
        receipt: {
          explain: [
            'The root -> TLD -> authoritative resolver walk.',
            'What TTL controls and why it makes migrations slow to take effect.',
          ],
          command: 'dig google.com +trace',
          question: 'We have an IP now. How do two machines open a reliable connection across the world?',
        },
      },
    },
    {
      id: 'url-station-tcp',
      title: 'Station 3: TCP',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 9,
      prompt: 'Open a reliable byte pipe to a server and explain the three-way handshake before any data flows.',
      checklist: [
        'Describe the SYN, SYN-ACK, ACK handshake.',
        'Explain what TCP guarantees and what it does not.',
        'Measure a real connection setup time.',
      ],
      interactive: {
        coldOpen:
          'You have an IP. You still cannot send data. Two machines that have never spoken must first agree they are both listening, both ready, and both counting from the same place. That agreement costs a full round trip before a single useful byte moves.',
        mental:
          'TCP is a phone call, not a letter. You say hello, they say hello back, you confirm, and only then do you start talking. The handshake is that hello-hello-confirm.',
        example: {
          code: '# Time just the TCP connect, separately from DNS and TLS:\ncurl -w "dns:%{time_namelookup}s  connect:%{time_connect}s  tls:%{time_appconnect}s\\n" -o /dev/null -s https://example.com',
          output: 'dns:0.018s  connect:0.041s  tls:0.092s',
          explain:
            'connect minus dns is the TCP handshake: one round trip to the server. tls minus connect is the TLS handshake on top. On a far-away server those numbers grow with distance, because each is at least one trip across the wire.',
        },
        build: {
          simple: 'TCP sends your data to the server.',
          actually:
            'TCP first does a three-way handshake (SYN, SYN-ACK, ACK) to sync sequence numbers, then guarantees ordered, complete, retransmitted delivery of a byte stream. It promises order and completeness, nothing about meaning or secrecy.',
          breaks:
            'Every handshake is a round trip. A server 150ms away costs 150ms before any request is even sent. This is why connection reuse and keep-alive matter so much, and why CDNs put servers physically near you.',
        },
        doThisNow: [
          {
            task: 'Break a single request into its setup phases and read the timings. Note how connect is bigger than dns.',
            command: 'curl -w "dns:%{time_namelookup}  connect:%{time_connect}  tls:%{time_appconnect}\\n" -o /dev/null -s https://example.com',
            reveal:
              'connect minus dns is one round trip: the TCP handshake. The further the server, the larger that gap, because a round trip cannot beat the speed of light.',
          },
        ],
        warStory:
          'A mobile app felt sluggish only on cellular. The fix was not the server: it was opening a fresh TCP and TLS handshake for every tiny API call. Reusing one connection cut perceived latency in half on high-latency networks.',
        receipt: {
          explain: [
            'The SYN / SYN-ACK / ACK handshake and why it is one round trip.',
            'What TCP guarantees (order, completeness) and what it does not (secrecy).',
          ],
          command: 'curl -w "connect:%{time_connect}\\n" -o /dev/null -s https://example.com',
          question: 'The pipe is open but anyone could read it. How do we make it private and prove the server is real?',
        },
      },
    },
    {
      id: 'url-station-tls',
      title: 'Station 4: TLS',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 9,
      prompt: 'Encrypt the open pipe and prove the server is who it claims to be, using certificates.',
      checklist: [
        'Explain what TLS adds on top of TCP.',
        'Read a real certificate: issuer, subject, expiry.',
        'Explain what an expired or mismatched certificate does to a request.',
      ],
      interactive: {
        coldOpen:
          'The pipe is open, but it runs through dozens of routers you do not control. Anyone on the path can read or rewrite your traffic. TLS is the s in https. It makes the pipe private and, just as important, proves the machine on the other end is the real google.com and not an impostor.',
        mental:
          'TLS is a sealed, tamper-evident envelope with a notarized return address. Encryption seals it; the certificate is the notary vouching for who sent it.',
        example: {
          code: '# Read the certificate the server presents:\necho | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -issuer -subject -dates',
          output:
            'issuer=C=US, O=DigiCert Inc, CN=DigiCert Global G2 TLS RSA SHA256 2020 CA1\nsubject=CN=example.com\nnotBefore=Jan 30 00:00:00 2024 GMT\nnotAfter=Mar  1 23:59:59 2025 GMT',
          explain:
            'issuer is the certificate authority that vouches for the site. subject is who the certificate is for. notAfter is the expiry: past that instant, browsers refuse the connection with a scary full-page warning.',
        },
        build: {
          simple: 'TLS encrypts your traffic.',
          actually:
            'TLS does a handshake that agrees on encryption keys AND verifies the server\'s certificate chains up to a trusted authority and matches the hostname. Privacy plus identity, together.',
          breaks:
            'Certificates expire. When auto-renewal silently fails, the site goes from fine to a full-page security warning at the exact second of expiry, often at 2am. Monitor expiry dates as if they were disk space.',
        },
        doThisNow: [
          {
            task: 'Read a real certificate\'s issuer, subject, and expiry dates. Find the notAfter line.',
            command: 'echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -subject -dates',
            reveal:
              'subject is the hostname the cert is valid for; notAfter is the expiry instant. After that moment, every browser shows a blocking warning, even though the server is otherwise healthy.',
          },
          {
            task: 'See what a browser does with a known-bad certificate. Visit a deliberately broken-cert test site.',
            command: 'curl -v https://expired.badssl.com 2>&1 | grep -i "certificate\\|SSL"',
            reveal:
              'curl refuses with a certificate verification error. A browser shows a full-page red warning. TLS failing identity is treated as seriously as TLS failing encryption.',
          },
        ],
        warStory:
          'A major payment provider once had checkout fail worldwide because a single intermediate certificate expired. Everything else was healthy. The lesson teams take from it: certificate expiry is a calendar event you alert on weeks early.',
        receipt: {
          explain: [
            'The two jobs of TLS: encryption and identity.',
            'Why an expired certificate breaks a perfectly healthy server.',
          ],
          command: 'openssl s_client -connect example.com:443',
          question: 'The pipe is now private and trusted. What exactly do we send through it?',
        },
      },
    },
    {
      id: 'url-station-http',
      title: 'Station 5: The HTTP Request',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 8,
      prompt: 'Write a raw HTTP request by hand: method, path, headers, and understand what each line does.',
      checklist: [
        'Name the parts of a request line: method, path, version.',
        'Explain what the Host header is for.',
        'Send a request and a redirect, and follow the 301.',
      ],
      interactive: {
        coldOpen:
          'Through that private pipe travels plain, readable text. The whole "web" rides on a handful of lines a human can type. Here is the surprising part: visit http://google.com (no s) and the server does not give you the page. It gives you a 301 and sends you somewhere else first. Why?',
        mental:
          'An HTTP request is a tiny memo: a verb (what to do), an address (the path), and a stack of sticky notes (headers). The server reads the memo and writes one back.',
        example: {
          code: '# See the request line, headers, and the redirect response:\ncurl -I http://google.com',
          output:
            'HTTP/1.1 301 Moved Permanently\nLocation: http://www.google.com/\nContent-Type: text/html; charset=UTF-8\nServer: gws\nContent-Length: 219',
          explain:
            'You asked for http://google.com. The server replied 301 Moved Permanently with a Location header. That is the server saying "this lives elsewhere now, go to www.google.com." The browser follows it automatically.',
        },
        build: {
          simple: 'The browser asks the server for a page and gets it.',
          actually:
            'The browser sends a request line (GET / HTTP/2), a required Host header so one IP can serve many sites, and more headers. The first response is often a 301 or 302 redirect, and the browser silently makes a second request to the new location.',
          breaks:
            'Redirect chains add round trips. http -> https -> www -> trailing-slash can be four hops before the real page loads. Each hop is latency, and a loop of redirects is a classic production outage.',
        },
        doThisNow: [
          {
            task: 'Ask for headers only over plain http and read the status code. Predict where it sends you before you read the Location line.',
            command: 'curl -I http://google.com',
            reveal:
              'You get 301 Moved Permanently and a Location header. The server refuses to serve the page directly over http and points you onward. Plain http almost always redirects to https in production.',
          },
          {
            task: 'Now follow the redirects and count how many hops it takes to reach the final page.',
            command: 'curl -sIL http://google.com | grep -i "HTTP/\\|location"',
            reveal:
              '-L makes curl follow the chain. You will see one or more 3xx responses, each with a Location, before a final 200 OK. Every hop is a real network round trip.',
          },
        ],
        warStory:
          'A marketing campaign linked to http://brand.com/promo. Each click hit http -> https -> www -> /promo/, four redirects, on slow phones. Collapsing it to one direct https link measurably lifted conversions.',
        receipt: {
          explain: [
            'The three parts of a request line and why Host is mandatory.',
            'What a 301 means and why http requests usually redirect.',
          ],
          command: 'curl -sIL http://google.com',
          question: 'The request arrives at the server. What runs there, and what does it do before replying?',
        },
      },
    },
    {
      id: 'url-station-server',
      title: 'Station 6: The Server',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 9,
      prompt: 'Trace what the server does between receiving a request and producing a response: route, run, query, build.',
      checklist: [
        'Explain routing: path and method to a handler.',
        'Name what usually dominates server time (the database).',
        'Read the TTFB (time to first byte) of a real request.',
      ],
      interactive: {
        coldOpen:
          'Every station so far was plumbing. This is the one you get paid to write. The request lands on a listening program. In the milliseconds before it replies, it decides which code to run, talks to a database, and assembles an answer. This station is the entire job of a backend engineer.',
        mental:
          'The server is a mailroom. It reads the address on the memo (routing), pulls the right files (database), writes a reply, and hands it back to the courier. Most of the wait is pulling files, not writing.',
        example: {
          code: '# Measure how long the server takes to start replying (TTFB):\ncurl -w "ttfb:%{time_starttransfer}s  total:%{time_total}s\\n" -o /dev/null -s https://example.com',
          output: 'ttfb:0.121s  total:0.123s',
          explain:
            'time_starttransfer is TTFB: the moment the first byte of the response arrives. The gap between TTFB and total is download time. A slow TTFB means the server is thinking (usually waiting on a database), not that the network is slow.',
        },
        build: {
          simple: 'The server gets the request and sends back the page.',
          actually:
            'The server matches the method and path to a handler (routing), runs your code, which usually queries a database or cache, then serializes a response. In most apps the database query is the slowest part of the whole journey so far.',
          breaks:
            'One missing database index turns a 5ms query into a 5s query, and TTFB balloons while every other station stays fast. When a page is slow but DNS, TCP, and TLS are quick, the server (and its database) is the suspect.',
        },
        doThisNow: [
          {
            task: 'Separate server think-time from download time on a real request. Watch which number dominates.',
            command: 'curl -w "ttfb:%{time_starttransfer}  total:%{time_total}\\n" -o /dev/null -s https://example.com',
            reveal:
              'ttfb is how long the server took to start answering. If ttfb is large but total is only slightly larger, the server is the bottleneck, not the network or the payload size.',
          },
          {
            task: 'In DevTools Network tab, reload a real app, sort requests by Time, and open the slowest one. Read its Waiting (TTFB) value.',
            reveal:
              'The slowest request is usually a data call with a long Waiting (TTFB) bar: the server querying a database. That bar is exactly the time_starttransfer you just measured with curl.',
          },
        ],
        warStory:
          'A dashboard got slower every week until pages timed out. No code had changed. A table had simply grown past the point where an unindexed query stayed fast. Adding one index took TTFB from 8 seconds back to 40 milliseconds.',
        receipt: {
          explain: [
            'Routing: how method plus path selects a handler.',
            'Why TTFB is the server\'s thinking time and the database usually owns it.',
          ],
          command: 'curl -w "ttfb:%{time_starttransfer}\\n" -o /dev/null -s https://example.com',
          question: 'The server built an answer. How does it package the result so the browser knows what it got?',
        },
      },
    },
    {
      id: 'url-station-response',
      title: 'Station 7: The Response',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 8,
      prompt: 'Read a full HTTP response: status line, headers, and body, and explain what each header tells the browser.',
      checklist: [
        'Explain the status code families (2xx, 3xx, 4xx, 5xx).',
        'Name what Content-Type and Cache-Control control.',
        'Read a real response\'s headers and body separately.',
      ],
      interactive: {
        coldOpen:
          'The server sends back the same shape of message it received: a status line, headers, then a body. Three numbers in that status line, 200, 404, 500, carry more meaning per character than almost anything else in the stack. One of them is the difference between "your fault" and "my fault."',
        mental:
          'A response is a verdict plus a package. The status code is the verdict (yes, go elsewhere, you erred, I erred); the headers are the shipping label; the body is the contents.',
        example: {
          code: '# Headers and the first line of the body, separated:\ncurl -s -D - https://example.com -o /tmp/body.html | head -n 8 && echo "---BODY---" && head -n 2 /tmp/body.html',
          output:
            'HTTP/2 200\ncontent-type: text/html; charset=UTF-8\ncache-control: max-age=604800\ndate: Tue, 10 Jun 2025 12:00:00 GMT\ncontent-length: 1256\n---BODY---\n<!doctype html>\n<html>',
          explain:
            '200 is the verdict: success. content-type tells the browser this is HTML to render, not a file to download. cache-control: max-age=604800 says "you may reuse this for a week without asking me again."',
        },
        build: {
          simple: 'The server sends back the page.',
          actually:
            'The response is a status code (2xx ok, 3xx go elsewhere, 4xx you erred, 5xx I erred), headers describing the payload and caching rules, and the body itself. The browser reads the headers to decide what to do with the body.',
          breaks:
            'Wrong headers cause silent bugs: a Content-Type of text/plain makes the browser show your HTML as source code; an over-eager Cache-Control pins a broken page in caches worldwide until the max-age expires.',
        },
        doThisNow: [
          {
            task: 'Pull only the response headers and read the status line and Content-Type.',
            command: 'curl -sI https://example.com',
            reveal:
              'The first line is the status (HTTP/2 200). content-type tells the browser how to treat the body. cache-control tells it how long it may reuse the answer without asking again.',
          },
          {
            task: 'Force a 404 and confirm the status family. Predict the code before you read it.',
            command: 'curl -sI https://example.com/this-page-does-not-exist | head -n 1',
            reveal:
              'You get a 404 (a 4xx: the client asked for something that is not there). Compare with a 5xx, which means the server itself failed. The first digit alone tells you whose fault it is.',
          },
        ],
        warStory:
          'An API started returning errors as 200 OK with an "error" field in the body. Monitoring, which watched status codes, saw everything green while customers failed. Status codes are a contract that tools rely on; honor them.',
        receipt: {
          explain: [
            'The four status families and what the first digit signals.',
            'How Content-Type and Cache-Control change what the browser does with the body.',
          ],
          command: 'curl -sI https://example.com',
          question: 'The browser has the HTML and the headers. How does that text become the pixels you see?',
        },
      },
    },
    {
      id: 'url-station-render',
      title: 'Station 8: Render',
      type: 'lesson',
      difficulty: 'Core',
      minutes: 8,
      prompt: 'Trace how the browser turns the response body into pixels, and why one page often means dozens of requests.',
      checklist: [
        'Explain parse to DOM, then CSS, then paint.',
        'Explain why one URL triggers many follow-up requests.',
        'Count the real number of requests one page makes.',
      ],
      interactive: {
        coldOpen:
          'You typed one URL. The Network tab shows 80 requests. The first response was just HTML, and HTML is a shopping list: it references CSS, JavaScript, images, fonts, each its own trip back through DNS, TCP, TLS, and HTTP. The journey you just learned does not happen once per page. It happens dozens of times.',
        mental:
          'The HTML is a recipe, not the meal. The browser reads it top to bottom, and every link and script tag is another ingredient it has to go fetch before the dish is plated.',
        example: {
          code: '# Count how many requests one real page makes.\n# (Run in the browser console on any site:)\nperformance.getEntriesByType("resource").length',
          output: '63',
          explain:
            'One URL, 63 resource requests. Each stylesheet, script, image, and font repeats the stations you just learned. This is why connection reuse, caching, and CDNs matter: you are not paying the journey once, you are paying it dozens of times.',
        },
        build: {
          simple: 'The browser shows the page it got back.',
          actually:
            'The browser parses HTML into a DOM tree, fetches and applies CSS to build a render tree, runs JavaScript that can change both, then lays out and paints pixels. Render-blocking CSS and scripts pause painting until they arrive.',
          breaks:
            'A single large render-blocking script at the top of the page can freeze the screen on a blank white page until it downloads and runs, even though the HTML arrived instantly. What blocks the paint matters more than total bytes.',
        },
        doThisNow: [
          {
            task: 'Open the browser console on any real site and count its actual resource requests. Guess the number first.',
            command: 'performance.getEntriesByType("resource").length',
            reveal:
              'Most real pages return dozens, often over 50. Each one repeated DNS, TCP, TLS, and HTTP. Now the value of caching and keep-alive is concrete: they let those repeats skip stations.',
          },
          {
            task: 'In DevTools, reload with the Network tab open and watch the waterfall. Find the request that blocks first paint.',
            reveal:
              'The waterfall shows requests stacking in time. CSS and synchronous scripts in the <head> hold up the first paint: the page stays blank until they finish, even when the HTML came back in milliseconds.',
          },
        ],
        warStory:
          'A news site felt slow despite a fast server. The HTML returned in 90ms, but a third-party analytics script in the head blocked rendering for two seconds. Moving one script tag to async gave users a visible page almost instantly.',
        receipt: {
          explain: [
            'The parse -> DOM -> CSS -> paint pipeline.',
            'Why one URL becomes dozens of requests, each repeating the whole journey.',
          ],
          command: 'performance.getEntriesByType("resource").length',
          question: 'You can now narrate all eight stations. Which one would you check first when a page is slow, and why?',
        },
      },
    },
  ],
}
