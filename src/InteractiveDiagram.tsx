import { useState } from 'react'

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
        {nodes.map((node, i) => (
          <span key={`${node}:${i}`} className="diagram-step">
            <button
              className={`diagram-pill${selected === i ? ' active' : ''}`}
              onClick={() => setSelected(selected === i ? null : i)}
              type="button"
              aria-expanded={selected === i}
              title={hasExplanations ? 'Click for explanation' : undefined}
            >
              {node}
            </button>
            {i < nodes.length - 1 && (
              <i className="diagram-arrow" aria-hidden="true">→</i>
            )}
          </span>
        ))}
      </div>

      {hasExplanations && selected !== null && (
        <div className="diagram-panel" key={selected}>
          <div className="diagram-panel-label">{nodes[selected]}</div>
          <p>{explanations[selected]}</p>
        </div>
      )}
    </div>
  )
}
