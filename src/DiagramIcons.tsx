import type { ReactNode } from 'react'
import type { DiagramAccent } from './Diagram'
import { resolveGlyph, type GlyphKind } from './glyphResolver'

// Small conceptual line-art glyphs drawn in a 22x22 box so diagram nodes read as
// illustrations instead of plain labeled rectangles. These are generic icons
// (a cylinder for a database, a drum for object storage, a bolt for a cache),
// not vendor logos. Each glyph is stroked in the node's accent color. The logic
// that picks which glyph (or none) lives in ./glyphResolver.

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
  // METHOD path: an arrow advancing along a line.
  route: (
    <>
      <path d="M3 11 H16" />
      <path d="M12 7 L16 11 L12 15" />
      <circle cx="3" cy="11" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  // Header lines: bulleted key rows.
  list: (
    <>
      <circle cx="3" cy="6" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="3" cy="11" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="3" cy="16" r="1.1" fill="currentColor" stroke="none" />
      <path d="M7 6 H19 M7 11 H19 M7 16 H14" />
    </>
  ),
  // Body / JSON payload: a pair of braces.
  braces: (
    <path d="M9 3 C6.5 3 7.5 9 4.5 11 C7.5 13 6.5 19 9 19 M13 3 C15.5 3 14.5 9 17.5 11 C14.5 13 15.5 19 13 19" />
  ),
  // Model: a tiny neural network, inputs converging on an output.
  brain: (
    <>
      <circle cx="4" cy="5" r="1.7" />
      <circle cx="4" cy="11" r="1.7" />
      <circle cx="4" cy="17" r="1.7" />
      <circle cx="17" cy="11" r="2.1" />
      <path d="M5.7 5 L15 10.3 M5.7 11 H14.9 M5.7 17 L15 11.7" />
    </>
  ),
  // Embedding: a vector arrow in a coordinate frame.
  vector: (
    <>
      <path d="M3 19 V3 M3 19 H19" />
      <path d="M3 19 L15 8" />
      <path d="M15 8 L10.3 8.4 M15 8 L14.6 12.7" />
    </>
  ),
  // AI / generate: a four-point sparkle.
  sparkle: <path d="M11 2 L12.7 9.3 L20 11 L12.7 12.7 L11 20 L9.3 12.7 L2 11 L9.3 9.3 Z" />,
  // Loop / repeat: a circular arrow.
  loop: (
    <>
      <path d="M18 11 a7 7 0 1 1 -2.2 -5" />
      <path d="M15.2 2.6 L16.2 6.2 L12.6 6.6" />
    </>
  ),
  // Token: a price-tag.
  tag: (
    <>
      <path d="M11 3 H4 V10 L13 19 L20 12 Z" />
      <circle cx="7.4" cy="6.4" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  // Prompt / message: a speech bubble.
  bubble: <path d="M4 5 H18 V15 H10 L6 19 V15 H4 Z" />,
  // Retrieve / filter / rank: a funnel.
  funnel: <path d="M3 4 H19 L13 11 V18 L9 16 V11 Z" />,
  // Temperature: a thermometer.
  thermometer: (
    <>
      <path d="M9 4 a2 2 0 0 1 4 0 V13.2 a3.6 3.6 0 1 1 -4 0 Z" />
      <circle cx="11" cy="16.5" r="1.7" fill="currentColor" stroke="none" />
    </>
  ),
}

// Returns an SVG <g> of the chosen glyph, stroked in `color`, ready to be
// translated into position by the diagram node renderer. Renders nothing when no
// glyph is appropriate for the node.
export function DiagramGlyph({
  label,
  accent = 'default',
  glyph,
  color,
}: {
  label: string
  accent?: DiagramAccent
  glyph?: GlyphKind | 'none'
  color: string
}) {
  const kind = resolveGlyph(label, accent, glyph)
  if (!kind) return null
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
