import type { DiagramAccent } from './Diagram'

// Pure glyph-resolution logic (no JSX), kept separate from the DiagramIcons
// component module so fast-refresh stays happy. Decides which conceptual icon a
// diagram node should show, or none.
//
// An icon only appears when it is actually meaningful: the author set one
// explicitly, or the node label matches a keyword. We never invent an icon from
// the accent color alone for decorative accents (a blue "primary" box should not
// sprout a database cylinder), because a wrong icon is worse than none.

export type GlyphKind =
  | 'database'
  | 'bucket'
  | 'cache'
  | 'queue'
  | 'chip'
  | 'lambda'
  | 'cloud'
  | 'globe'
  | 'shield'
  | 'gauge'
  | 'balancer'
  | 'person'
  | 'check'
  | 'warning'
  | 'doc'
  | 'box'
  | 'route'
  | 'list'
  | 'braces'
  | 'brain'
  | 'vector'
  | 'sparkle'
  | 'loop'
  | 'tag'
  | 'bubble'
  | 'funnel'
  | 'thermometer'

// First match wins, so the most specific patterns come first. The protocol- and
// AI-concept rules are at the top so they beat the broad infra rules below
// (e.g. "tokenize" must not fall through to the auth/shield rule).
const KEYWORDS: [RegExp, GlyphKind][] = [
  [/request line|status line|\bmethod\b|endpoint|\broute\b|\bpath\b|\buri\b|\burl\b/, 'route'],
  [/header|metadata|key.?value|content-type|\bhost\b|\baccept\b/, 'list'],
  [/\bbody\b|payload|\bjson\b|request body|response body|form data/, 'braces'],
  [/\bllm\b|language model|\bmodel\b|predict|inference|neural|next token|generate/, 'brain'],
  [/embed|\bvector\b|coordinate|nearest neighbo|cosine|similarit/, 'vector'],
  [/temperature|\btemp\b|sampling/, 'thermometer'],
  [/\bagent\b|\bai\b|reasoning|think/, 'sparkle'],
  [/\bloop\b|repeat|iterate|\bobserve\b|\bretry\b|\bring\b|append/, 'loop'],
  [/tokenize|\bprefix\b|\bsuffix\b/, 'tag'],
  [/prompt|\bchat\b|conversation|\breply\b|instruction|user turn|assistant|\bturn\b|answer|question/, 'bubble'],
  [/retrieve|\bfilter\b|\brank\b|funnel|top chunk|top \d/, 'funnel'],
  [/lambda|serverless|\bfunction\b|\bfn\b/, 'lambda'],
  [/\bs3\b|bucket|object stor|blob/, 'bucket'],
  [/cloudfront|\bcdn\b/, 'cloud'],
  [/route ?53|\bdns\b|\bregion\b|internet|geo/, 'globe'],
  [/\biam\b|\bauth|\brole\b|secret|\bkms\b|security|login|\btoken\b|cognito|permission|confirmation|gate/, 'shield'],
  [/cloudwatch|monitor|metric|observ|\bgauge\b|dashboard|\bscore\b|\beval\b|grade/, 'gauge'],
  [/cloudtrail|audit|\blog\b|trail/, 'doc'],
  [/load ?balancer|\belb\b|\balb\b|distribute/, 'balancer'],
  [/cache|redis|elasticache|memcach|cached/, 'cache'],
  [/queue|\bsqs\b|\bsns\b|topic|kafka|message|stream|fan-?out/, 'queue'],
  [/\brds\b|aurora|database|postgres|mysql|\bsql\b|\bdb\b|dynamo|replica|primary|standby|writer|reader|storage volume|vector db/, 'database'],
  [/\bec2\b|compute|server|instance|container|\becs\b|\beks\b|fargate|worker|\bvm\b|\bcpu\b|\bpod\b|your code/, 'chip'],
  [/template|config|cloudformation|\bstack\b|document|\bfile\b|\bdoc\b|chunk/, 'doc'],
  [/user|client|browser|customer|person|caller|shopper|buyer/, 'person'],
]

// Only accents that genuinely encode a node *type* get a fallback icon. The
// decorative shades (primary, replica, compute, edge, client, default) are
// intentionally absent: when they don't match a keyword, the node renders with
// no icon rather than a misleading one.
const ACCENT_FALLBACK: Partial<Record<DiagramAccent, GlyphKind>> = {
  cache: 'cache',
  queue: 'queue',
  storage: 'bucket',
  success: 'check',
  danger: 'warning',
}

// Resolves the glyph for a node, or null when none is appropriate. An explicit
// glyph always wins; 'none' suppresses the icon entirely.
export function resolveGlyph(
  label: string,
  accent: DiagramAccent = 'default',
  explicit?: GlyphKind | 'none',
): GlyphKind | null {
  if (explicit === 'none') return null
  if (explicit) return explicit
  const text = label.toLowerCase()
  for (const [re, kind] of KEYWORDS) if (re.test(text)) return kind
  return ACCENT_FALLBACK[accent] ?? null
}
