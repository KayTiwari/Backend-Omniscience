import { useState } from 'react'

const PALETTE = [
  '#e84a5f',
  '#f59f00',
  '#2f80ed',
  '#7c3aed',
  '#0f8b8d',
  '#00a878',
  '#ff9700',
  '#19c6ff',
  '#e84a5f',
  '#f59f00',
]

interface Props {
  nodes: string[]
  explanations?: string[]
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
                <span>{node}</span>
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
            {nodes[selected]}
          </div>
          <p>{explanations[selected]}</p>
        </div>
      )}
    </div>
  )
}
