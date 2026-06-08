import type { ReactNode } from 'react'
import { glossaryId, glossaryMatchers, type GlossaryTerm } from './glossary'

function isWordChar(value: string | undefined) {
  return value !== undefined && /[a-zA-Z0-9]/.test(value)
}

function glossaryLabel(entry: GlossaryTerm) {
  const synonyms = entry.synonyms?.slice(0, 3).join(', ')
  return synonyms ? `${entry.term}: ${entry.definition} Synonyms: ${synonyms}.` : `${entry.term}: ${entry.definition}`
}

// eslint-disable-next-line react-refresh/only-export-components -- helper colocated with the component; Codex may move it to a .ts file
export function renderGlossaryText(text: string): ReactNode {
  if (!text) return text
  const lower = text.toLowerCase()
  const nodes: ReactNode[] = []
  let cursor = 0

  while (cursor < text.length) {
    const match = glossaryMatchers.find(({ label }) => {
      const lowerLabel = label.toLowerCase()
      if (!lower.startsWith(lowerLabel, cursor)) return false
      const before = text[cursor - 1]
      const after = text[cursor + label.length]
      return !isWordChar(before) && !isWordChar(after)
    })

    if (!match) {
      const next = glossaryMatchers
        .map(({ label }) => {
          const idx = lower.indexOf(label.toLowerCase(), cursor + 1)
          return idx === -1 ? Number.POSITIVE_INFINITY : idx
        })
        .reduce((min, idx) => Math.min(min, idx), Number.POSITIVE_INFINITY)
      const end = Number.isFinite(next) ? next : text.length
      nodes.push(text.slice(cursor, end))
      cursor = end
      continue
    }

    const label = text.slice(cursor, cursor + match.label.length)
    const targetId = glossaryId(match.entry.term)
    const goToGlossary = () => {
      window.dispatchEvent(
        new CustomEvent('backend-omniscience:open-glossary', {
          detail: { id: targetId },
        }),
      )
    }
    nodes.push(
      <dfn
        key={`${cursor}:${match.entry.term}`}
        className="glossary-term"
        role="link"
        tabIndex={0}
        aria-label={glossaryLabel(match.entry)}
        data-definition={match.entry.definition}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          goToGlossary()
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return
          event.preventDefault()
          event.stopPropagation()
          goToGlossary()
        }}
      >
        {label}
      </dfn>,
    )
    cursor += match.label.length
  }

  return nodes.length === 1 ? nodes[0] : nodes
}

export function GlossaryText({ children }: { children: string }) {
  return <>{renderGlossaryText(children)}</>
}
