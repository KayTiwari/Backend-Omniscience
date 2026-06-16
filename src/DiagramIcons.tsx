import type { ReactNode } from 'react'
import type { DiagramAccent } from './Diagram'

// Small conceptual line-art glyphs drawn in a 22x22 box so diagram nodes read as
// illustrations instead of plain labeled rectangles. These are generic icons
// (a cylinder for a database, a drum for object storage, a bolt for a cache),
// not vendor logos. Each glyph is stroked in the node's accent color.

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

const KEYWORDS: [RegExp, GlyphKind][] = [
  [/lambda|serverless|\bfunction\b|\bfn\b/, 'lambda'],
  [/\bs3\b|bucket|object stor|blob/, 'bucket'],
  [/cloudfront|\bcdn\b/, 'cloud'],
  [/route ?53|\bdns\b|\bregion\b|internet|geo/, 'globe'],
  [/\biam\b|auth|\brole\b|secret|\bkms\b|security|login|token|cognito|permission/, 'shield'],
  [/cloudwatch|monitor|metric|observ|\bgauge\b|dashboard/, 'gauge'],
  [/cloudtrail|audit|\blog\b|trail/, 'doc'],
  [/load ?balancer|\belb\b|\balb\b|distribute/, 'balancer'],
  [/cache|redis|elasticache|memcach/, 'cache'],
  [/queue|\bsqs\b|\bsns\b|topic|kafka|message|stream|fan-?out/, 'queue'],
  [/\brds\b|aurora|database|postgres|mysql|\bsql\b|\bdb\b|dynamo|replica|primary|standby|writer|reader|storage volume/, 'database'],
  [/\bec2\b|compute|server|instance|container|\becs\b|\beks\b|fargate|worker|\bvm\b|\bcpu\b|\bpod\b|node|task|your code|app\b/, 'chip'],
  [/template|config|cloudformation|\bstack\b|document|\bfile\b|\bdoc\b/, 'doc'],
  [/user|client|browser|customer|person|caller|shopper|buyer/, 'person'],
]

const ACCENT_FALLBACK: Partial<Record<DiagramAccent, GlyphKind>> = {
  primary: 'database',
  replica: 'database',
  cache: 'cache',
  queue: 'queue',
  storage: 'bucket',
  edge: 'cloud',
  compute: 'chip',
  client: 'person',
  success: 'check',
  danger: 'warning',
}

function glyphKind(label: string, accent: DiagramAccent = 'default'): GlyphKind {
  const text = label.toLowerCase()
  for (const [re, kind] of KEYWORDS) if (re.test(text)) return kind
  return ACCENT_FALLBACK[accent] ?? 'box'
}

// Each glyph is drawn within roughly 0..22 on both axes; the caller positions it.
const GLYPHS: Record<GlyphKind, ReactNode> = {
  database: (
    <>
      <ellipse cx="11" cy="5" rx="8" ry="3" />
      <path d="M3 5 V17 a8 3 0 0 0 16 0 V5" />
      <path d="M3 11 a8 3 0 0 0 16 0" />
    </>
  ),
  bucket: (
    <>
      <ellipse cx="11" cy="5" rx="7" ry="2.4" />
      <path d="M4 5 L6 18 a5 1.6 0 0 0 10 0 L18 5" />
    </>
  ),
  cache: <path d="M12 2 L5 12 H10 L9.5 20 L17 9 H11.5 Z" />,
  queue: (
    <>
      <rect x="3" y="4" width="16" height="3.4" rx="1" />
      <rect x="3" y="9.3" width="16" height="3.4" rx="1" />
      <rect x="3" y="14.6" width="16" height="3.4" rx="1" />
    </>
  ),
  chip: (
    <>
      <rect x="5.5" y="5.5" width="11" height="11" rx="1.5" />
      <path d="M9 5.5 V2 M13 5.5 V2 M9 16.5 V20 M13 16.5 V20 M5.5 9 H2 M5.5 13 H2 M16.5 9 H20 M16.5 13 H20" />
    </>
  ),
  lambda: <path d="M5 19 L11 6 M11 6 L9 3 M10.6 10.5 L16 19" />,
  cloud: <path d="M7 17 a4 4 0 0 1 -1 -8 a5 5 0 0 1 9.6 -1 a3.6 3.6 0 0 1 0.4 9 Z" />,
  globe: (
    <>
      <circle cx="11" cy="11" r="8.4" />
      <ellipse cx="11" cy="11" rx="3.4" ry="8.4" />
      <path d="M3 8 H19 M3 14 H19" />
    </>
  ),
  shield: <path d="M11 2 L18 5 V10.5 C18 15.5 11 19.5 11 19.5 C11 19.5 4 15.5 4 10.5 V5 Z" />,
  gauge: (
    <>
      <path d="M3 16 a8 8 0 0 1 16 0" />
      <path d="M11 16 L15.5 10.5" />
      <circle cx="11" cy="16" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  balancer: (
    <>
      <circle cx="4" cy="11" r="2.2" />
      <path d="M6.2 11 H10 M10 11 L16 5 M10 11 H16 M10 11 L16 17" />
      <circle cx="17.5" cy="5" r="2" />
      <circle cx="17.5" cy="11" r="2" />
      <circle cx="17.5" cy="17" r="2" />
    </>
  ),
  person: (
    <>
      <circle cx="11" cy="7" r="3.2" />
      <path d="M4 19 a7 7 0 0 1 14 0" />
    </>
  ),
  check: (
    <>
      <circle cx="11" cy="11" r="8.4" />
      <path d="M7 11 L10 14 L15.5 8" />
    </>
  ),
  warning: (
    <>
      <path d="M11 3 L20 19 H2 Z" />
      <path d="M11 9 V13.5" />
      <circle cx="11" cy="16.4" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3 H13 L17.5 7.5 V20 H6 Z" />
      <path d="M13 3 V7.5 H17.5" />
      <path d="M8.5 12 H15 M8.5 15.5 H15" />
    </>
  ),
  box: <rect x="4" y="4" width="14" height="14" rx="2" />,
}

// Returns an SVG <g> of the chosen glyph, stroked in `color`, ready to be
// translated into position by the diagram node renderer.
export function DiagramGlyph({
  label,
  accent = 'default',
  color,
}: {
  label: string
  accent?: DiagramAccent
  color: string
}) {
  const kind = glyphKind(label, accent)
  return (
    <g
      color={color}
      stroke={color}
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {GLYPHS[kind]}
    </g>
  )
}
