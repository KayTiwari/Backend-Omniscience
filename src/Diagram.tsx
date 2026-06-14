// Lightweight declarative SVG diagram engine for the encyclopedia. Two families:
// box diagrams (labeled boxes + arrows) in row/stack/fanout/gather/ring layouts,
// and sequence diagrams (lifelines + ordered messages). Theme-aware via the
// accent palette. No dependencies.

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

export type BoxDiagram = {
  caption?: string
  // row: left to right. stack: top to bottom. fanout: nodes[0] -> the rest.
  // gather: all but last -> last. ring: nodes on a circle.
  layout: 'row' | 'stack' | 'fanout' | 'gather' | 'ring'
  nodes: DiagramNode[]
  edges?: DiagramEdge[]
}

export type SequenceMessage = {
  from: number
  to: number
  label: string
  dashed?: boolean
}

export type SequenceDiagram = {
  caption?: string
  layout: 'sequence'
  actors: { label: string; sub?: string; accent?: DiagramAccent }[]
  messages: SequenceMessage[]
}

export type DiagramSpec = BoxDiagram | SequenceDiagram

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
const PAD = 16

type Placed = DiagramNode & { x: number; y: number }

function place(spec: BoxDiagram): Placed[] {
  const { layout, nodes } = spec
  if (layout === 'row') {
    return nodes.map((n, i) => ({ ...n, x: i * (BOX_W + GAP_X), y: 0 }))
  }
  if (layout === 'stack') {
    return nodes.map((n, i) => ({ ...n, x: 0, y: i * (BOX_H + GAP_Y) }))
  }
  if (layout === 'ring') {
    const r = Math.max(120, nodes.length * 26)
    return nodes.map((n, i) => {
      const angle = -Math.PI / 2 + (i / nodes.length) * Math.PI * 2
      return {
        ...n,
        x: r * Math.cos(angle) - BOX_W / 2,
        y: r * Math.sin(angle) - BOX_H / 2,
      }
    })
  }
  if (layout === 'fanout') {
    const targets = nodes.slice(1)
    const colH = targets.length * BOX_H + (targets.length - 1) * GAP_Y
    const placed: Placed[] = []
    placed.push({ ...nodes[0], x: 0, y: (colH - BOX_H) / 2 })
    targets.forEach((n, j) => placed.push({ ...n, x: BOX_W + GAP_X * 1.4, y: j * (BOX_H + GAP_Y) }))
    return placed
  }
  // gather
  const sources = nodes.slice(0, -1)
  const colH = sources.length * BOX_H + (sources.length - 1) * GAP_Y
  const placed: Placed[] = []
  sources.forEach((n, j) => placed.push({ ...n, x: 0, y: j * (BOX_H + GAP_Y) }))
  placed.push({ ...nodes[nodes.length - 1], x: BOX_W + GAP_X * 1.4, y: (colH - BOX_H) / 2 })
  return placed
}

function inferEdges(spec: BoxDiagram): DiagramEdge[] {
  if (spec.edges) return spec.edges
  const ids = spec.nodes.map((n) => n.id)
  if (spec.layout === 'row' || spec.layout === 'stack') {
    return ids.slice(1).map((to, i) => ({ from: ids[i], to }))
  }
  if (spec.layout === 'fanout') {
    return ids.slice(1).map((to) => ({ from: ids[0], to }))
  }
  if (spec.layout === 'ring') return []
  const last = ids[ids.length - 1]
  return ids.slice(0, -1).map((from) => ({ from, to: last }))
}

function anchor(a: Placed, b: Placed): { x: number; y: number } {
  const ax = a.x + BOX_W / 2
  const ay = a.y + BOX_H / 2
  const bx = b.x + BOX_W / 2
  const by = b.y + BOX_H / 2
  const dx = bx - ax
  const dy = by - ay
  if (Math.abs(dx) * BOX_H >= Math.abs(dy) * BOX_W) {
    return { x: dx >= 0 ? a.x + BOX_W : a.x, y: ay }
  }
  return { x: ax, y: dy >= 0 ? a.y + BOX_H : a.y }
}

function NodeBox({ n }: { n: Placed }) {
  const a = ACCENTS[n.accent ?? 'default']
  return (
    <g transform={`translate(${n.x} ${n.y})`}>
      <rect width={BOX_W} height={BOX_H} rx="9" fill={a.fill} stroke={a.stroke} strokeWidth="1.5" />
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
        <text x={BOX_W / 2} y={BOX_H / 2 + 11} textAnchor="middle" dominantBaseline="middle" className="diagram-node-sub">
          {n.sub}
        </text>
      )}
    </g>
  )
}

function BoxDiagramSvg({ spec }: { spec: BoxDiagram }) {
  const placed = place(spec)
  const byId = new Map(placed.map((p) => [p.id, p]))
  const edges = inferEdges(spec)

  const minX = Math.min(...placed.map((p) => p.x))
  const minY = Math.min(...placed.map((p) => p.y))
  const maxX = Math.max(...placed.map((p) => p.x)) + BOX_W
  const maxY = Math.max(...placed.map((p) => p.y)) + BOX_H
  const w = maxX - minX + PAD * 2
  const h = maxY - minY + PAD * 2
  const ox = PAD - minX
  const oy = PAD - minY

  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={spec.caption ?? 'architecture diagram'}>
      <defs>
        <marker id="diagram-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
        </marker>
      </defs>
      <g transform={`translate(${ox} ${oy})`}>
        {spec.layout === 'ring' && (
          <circle cx="0" cy="0" r={Math.max(120, placed.length * 26)} fill="none" stroke="var(--line)" strokeWidth="1.5" strokeDasharray="4 5" />
        )}
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
                <text x={mx} y={my - 5} textAnchor="middle" className="diagram-edge-label">
                  {e.label}
                </text>
              )}
            </g>
          )
        })}
        {placed.map((n) => (
          <NodeBox key={n.id} n={n} />
        ))}
      </g>
    </svg>
  )
}

const SEQ_W = 140
const SEQ_GAP = 56
const SEQ_TOP = 56
const SEQ_ROW = 46

function SequenceDiagramSvg({ spec }: { spec: SequenceDiagram }) {
  const cols = spec.actors.map((_, i) => i * (SEQ_W + SEQ_GAP) + SEQ_W / 2)
  const w = spec.actors.length * (SEQ_W + SEQ_GAP) - SEQ_GAP + PAD * 2
  const bottom = SEQ_TOP + spec.messages.length * SEQ_ROW + 16
  const h = bottom + PAD

  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={spec.caption ?? 'sequence diagram'}>
      <defs>
        <marker id="seq-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
        </marker>
      </defs>
      <g transform={`translate(${PAD} ${PAD})`}>
        {spec.actors.map((actor, i) => {
          const a = ACCENTS[actor.accent ?? 'compute']
          return (
            <g key={i}>
              <line x1={cols[i]} y1={SEQ_TOP - 8} x2={cols[i]} y2={bottom - PAD} stroke="var(--line)" strokeWidth="1.5" strokeDasharray="4 5" />
              <g transform={`translate(${cols[i] - SEQ_W / 2} 0)`}>
                <rect width={SEQ_W} height={SEQ_TOP - 18} rx="8" fill={a.fill} stroke={a.stroke} strokeWidth="1.5" />
                <text x={SEQ_W / 2} y={(SEQ_TOP - 18) / 2 + 1} textAnchor="middle" dominantBaseline="middle" className="diagram-node-label" fill={a.text}>
                  {actor.label}
                </text>
              </g>
            </g>
          )
        })}
        {spec.messages.map((m, i) => {
          const y = SEQ_TOP + i * SEQ_ROW + SEQ_ROW / 2
          if (m.from === m.to) {
            const x = cols[m.from]
            return (
              <g key={i}>
                <path d={`M ${x} ${y - 8} h 26 v 16 h -26`} fill="none" stroke="var(--muted)" strokeWidth="1.5" markerEnd="url(#seq-arrow)" opacity="0.75" />
                <text x={x + 32} y={y - 2} className="diagram-edge-label">
                  {m.label}
                </text>
              </g>
            )
          }
          const x1 = cols[m.from]
          const x2 = cols[m.to]
          const mid = (x1 + x2) / 2
          return (
            <g key={i}>
              <text x={mid} y={y - 7} textAnchor="middle" className="diagram-edge-label">
                {m.label}
              </text>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke="var(--muted)" strokeWidth="1.5" strokeDasharray={m.dashed ? '5 4' : undefined} markerEnd="url(#seq-arrow)" opacity="0.8" />
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export function Diagram({ spec }: { spec: DiagramSpec }) {
  return (
    <figure className="diagram">
      {spec.layout === 'sequence' ? <SequenceDiagramSvg spec={spec} /> : <BoxDiagramSvg spec={spec} />}
      {spec.caption && <figcaption>{spec.caption}</figcaption>}
    </figure>
  )
}
