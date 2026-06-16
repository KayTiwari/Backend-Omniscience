import { useState } from 'react'
import { renderProse } from './LessonProse'

// A cohesive blue ramp instead of a generic rainbow, so a diagram reads as one
// intentional system rather than a pile of unrelated colors.
const PALETTE = [
  '#2f80ed',
  '#1f6fe0',
  '#3b82f6',
  '#2563eb',
  '#1d4ed8',
  '#4f93f7',
  '#1e63d6',
  '#3576e8',
  '#2f80ed',
  '#2563eb',
]

interface Props {
  nodes: string[]
  explanations?: string[]
}

function formatNodeLabel(label: string) {
  return label
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => {
      if (/^[A-Z0-9/]+$/.test(word)) return word
      if (word.length <= 2 && word !== 'at') return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export function InteractiveDiagram({ nodes, explanations }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const hasExplanations = explanations && explanations.length === nodes.length

  return (
    <div className="interactive-diagram">
      <div className="diagram-row">
        {nodes.map((node, i) => {
          const color = PALETTE[i % PALETTE.length]
          const isActive = selected === i
          return (
            <span key={`${node}:${i}`} className="diagram-step">
              <button
                className={`diagram-pill${isActive ? ' active' : ''}`}
                onClick={() => setSelected(isActive ? null : i)}
                type="button"
                aria-expanded={isActive}
                style={isActive
                  ? { background: color, borderColor: color, color: '#fff', boxShadow: `0 8px 20px ${color}40` }
                  : { background: `${color}18`, borderColor: `${color}40`, color }
                }
              >
                <span className="diagram-index">{i + 1}</span>
                <span>{formatNodeLabel(node)}</span>
              </button>
            </span>
          )
        })}
      </div>

      {hasExplanations && selected !== null && (
        <div
          className="diagram-panel"
          key={selected}
          style={{ borderColor: `${PALETTE[selected % PALETTE.length]}40` }}
        >
          <div
            className="diagram-panel-label"
            style={{ background: PALETTE[selected % PALETTE.length] }}
          >
            {formatNodeLabel(nodes[selected])}
          </div>
          {renderProse(explanations[selected])}
        </div>
      )}
    </div>
  )
}
