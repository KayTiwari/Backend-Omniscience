// Lightweight declarative SVG diagram engine for the encyclopedia. A diagram is
// a set of labeled boxes plus arrows; a few layouts (row, stack, fanout, split,
// gather) auto-position them so authored entries stay terse. Theme-aware via the
// accent palette below. No dependencies.

export type DiagramAccent =
  | 'default'
  | 'client'
  | 'edge'
  | 'compute'
  | 'primary'
  | 'replica'
  | 'cache'
  | 'queue'
  | 'storage'
  | 'danger'
  | 'success'

export type DiagramNode = {
  id: string
  label: string
  sub?: string
  accent?: DiagramAccent
}

export type DiagramEdge = {
  from: string
  to: string
  label?: string
  dashed?: boolean
}

export type DiagramSpec = {
  caption?: string
  // row: left to right. stack: top to bottom. fanout: nodes[0] -> the rest.
  // gather: all but last -> last. split: first -> the rest in a column (alias of fanout).
  layout: 'row' | 'stack' | 'fanout' | 'gather'
  nodes: DiagramNode[]
  edges?: DiagramEdge[]
}

const ACCENTS: Record<DiagramAccent, { fill: string; stroke: string; text: string }> = {
  default: { fill: 'rgba(120,130,150,0.12)', stroke: 'rgba(120,130,150,0.55)', text: 'var(--ink)' },
  client: { fill: 'rgba(101,113,132,0.14)', stroke: 'rgba(101,113,132,0.6)', text: 'var(--ink)' },
  edge: { fill: 'rgba(25,198,255,0.13)', stroke: 'rgba(25,198,255,0.6)', text: 'var(--ink)' },
  compute: { fill: 'rgba(47,128,237,0.13)', stroke: 'rgba(47,128,237,0.65)', text: 'var(--ink)' },
  primary: { fill: 'rgba(47,128,237,0.16)', stroke: 'rgba(47,128,237,0.85)', text: 'var(--ink)' },
  replica: { fill: 'rgba(0,168,120,0.14)', stroke: 'rgba(0,168,120,0.7)', text: 'var(--ink)' },
  cache: { fill: 'rgba(245,159,0,0.15)', stroke: 'rgba(245,159,0,0.7)', text: 'var(--ink)' },
  queue: { fill: 'rgba(124,58,237,0.14)', stroke: 'rgba(124,58,237,0.65)', text: 'var(--ink)' },
  storage: { fill: 'rgba(13,148,136,0.14)', stroke: 'rgba(13,148,136,0.7)', text: 'var(--ink)' },
  danger: { fill: 'rgba(232,74,95,0.14)', stroke: 'rgba(232,74,95,0.7)', text: 'var(--ink)' },
  success: { fill: 'rgba(0,168,120,0.16)', stroke: 'rgba(0,168,120,0.8)', text: 'var(--ink)' },
}

const BOX_W = 150
const BOX_H = 52
const GAP_X = 64
const GAP_Y = 24
const PAD = 14

type Placed = DiagramNode & { x: number; y: number }

function place(spec: DiagramSpec): Placed[] {
  const { layout, nodes } = spec
  if (layout === 'row') {
    return nodes.map((n, i) => ({ ...n, x: i * (BOX_W + GAP_X), y: 0 }))
  }
  if (layout === 'stack') {
    return nodes.map((n, i) => ({ ...n, x: 0, y: i * (BOX_H + GAP_Y) }))
  }
  // fanout: nodes[0] on the left, rest stacked on the right.
  if (layout === 'fanout') {
    const targets = nodes.slice(1)
    const colH = targets.length * BOX_H + (targets.length - 1) * GAP_Y
    const placed: Placed[] = []
    placed.push({ ...nodes[0], x: 0, y: (colH - BOX_H) / 2 })
    targets.forEach((n, j) => {
      placed.push({ ...n, x: BOX_W + GAP_X * 1.4, y: j * (BOX_H + GAP_Y) })
    })
    return placed
  }
  // gather: all but last stacked on the left, last on the right.
  const sources = nodes.slice(0, -1)
  const colH = sources.length * BOX_H + (sources.length - 1) * GAP_Y
  const placed: Placed[] = []
  sources.forEach((n, j) => placed.push({ ...n, x: 0, y: j * (BOX_H + GAP_Y) }))
  placed.push({ ...nodes[nodes.length - 1], x: BOX_W + GAP_X * 1.4, y: (colH - BOX_H) / 2 })
  return placed
}

function inferEdges(spec: DiagramSpec): DiagramEdge[] {
  if (spec.edges) return spec.edges
  const ids = spec.nodes.map((n) => n.id)
  if (spec.layout === 'row' || spec.layout === 'stack') {
    return ids.slice(1).map((to, i) => ({ from: ids[i], to }))
  }
  if (spec.layout === 'fanout') {
    return ids.slice(1).map((to) => ({ from: ids[0], to }))
  }
  const last = ids[ids.length - 1]
  return ids.slice(0, -1).map((from) => ({ from, to: last }))
}

// Anchor point on a box edge facing the other box.
function anchor(a: Placed, b: Placed): { x: number; y: number } {
  const ax = a.x + BOX_W / 2
  const ay = a.y + BOX_H / 2
  const bx = b.x + BOX_W / 2
  const by = b.y + BOX_H / 2
  const dx = bx - ax
  const dy = by - ay
  // Prefer horizontal exit when boxes are mostly side by side.
  if (Math.abs(dx) * BOX_H >= Math.abs(dy) * BOX_W) {
    return { x: dx >= 0 ? a.x + BOX_W : a.x, y: ay }
  }
  return { x: ax, y: dy >= 0 ? a.y + BOX_H : a.y }
}

export function Diagram({ spec }: { spec: DiagramSpec }) {
  const placed = place(spec)
  const byId = new Map(placed.map((p) => [p.id, p]))
  const edges = inferEdges(spec)

  const maxX = Math.max(...placed.map((p) => p.x)) + BOX_W
  const maxY = Math.max(...placed.map((p) => p.y)) + BOX_H
  const w = maxX + PAD * 2
  const h = maxY + PAD * 2

  return (
    <figure className="diagram">
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={spec.caption ?? 'architecture diagram'}>
        <defs>
          <marker
            id="diagram-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
          </marker>
        </defs>
        <g transform={`translate(${PAD} ${PAD})`}>
          {edges.map((e, i) => {
            const a = byId.get(e.from)
            const b = byId.get(e.to)
            if (!a || !b) return null
            const p1 = anchor(a, b)
            const p2 = anchor(b, a)
            const mx = (p1.x + p2.x) / 2
            const my = (p1.y + p2.y) / 2
            return (
              <g key={`e${i}`}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="var(--muted)"
                  strokeWidth="1.5"
                  strokeDasharray={e.dashed ? '5 4' : undefined}
                  markerEnd="url(#diagram-arrow)"
                  opacity="0.75"
                />
                {e.label && (
                  <text
                    x={mx}
                    y={my - 5}
                    textAnchor="middle"
                    className="diagram-edge-label"
                  >
                    {e.label}
                  </text>
                )}
              </g>
            )
          })}
          {placed.map((n) => {
            const a = ACCENTS[n.accent ?? 'default']
            return (
              <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
                <rect
                  width={BOX_W}
                  height={BOX_H}
                  rx="9"
                  fill={a.fill}
                  stroke={a.stroke}
                  strokeWidth="1.5"
                />
                <text
                  x={BOX_W / 2}
                  y={n.sub ? BOX_H / 2 - 5 : BOX_H / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="diagram-node-label"
                  fill={a.text}
                >
                  {n.label}
                </text>
                {n.sub && (
                  <text
                    x={BOX_W / 2}
                    y={BOX_H / 2 + 11}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="diagram-node-sub"
                  >
                    {n.sub}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </svg>
      {spec.caption && <figcaption>{spec.caption}</figcaption>}
    </figure>
  )
}
