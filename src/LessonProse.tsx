import type { ReactNode } from 'react'
import { renderGlossaryText } from './GlossaryText'

// Structured renderer for lesson prose. Course content arrives as plain
// strings (some with the mini-markdown subset: **bold**, 4-space code blocks,
// "- " bullets, blank-line paragraphs). Instead of one flat <p>, this parses
// the text into typed blocks and renders each with appropriate structure:
//   - "**Term.** definition" paragraphs become scannable concept cards
//   - "A -> B -> C" chains become numbered flow steps
//   - long paragraphs are split into short 1-3 sentence chunks
//   - code blocks and bullets keep their shape
// Glossary linking is preserved on every text span.

export type ProseBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'concept'; term: string; text: string }
  | { kind: 'code'; code: string }
  | { kind: 'bullets'; items: string[] }
  | { kind: 'flow'; steps: string[] }

const CONCEPT_LEAD = /^\*\*([^*]{1,60}?)[.:]?\*\*\s*([\s\S]*)$/

function isFlowChain(text: string): boolean {
  return text.length < 420 && text.split(' -> ').length >= 3 && !text.includes('**')
}

export function parseProse(text: string): ProseBlock[] {
  const lines = text.split('\n')
  const blocks: ProseBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (/^ {4}/.test(line)) {
      const code: string[] = []
      while (i < lines.length && (/^ {4}/.test(lines[i]) || lines[i] === '')) {
        if (lines[i] === '' && !/^ {4}/.test(lines[i + 1] || '')) break
        code.push(lines[i].replace(/^ {4}/, ''))
        i++
      }
      blocks.push({ kind: 'code', code: code.join('\n') })
      continue
    }

    if (/^- /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^- /.test(lines[i])) {
        items.push(lines[i].slice(2))
        i++
      }
      blocks.push({ kind: 'bullets', items })
      continue
    }

    if (line.trim() === '') {
      i++
      continue
    }

    const para: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^ {4}/.test(lines[i]) &&
      !/^- /.test(lines[i])
    ) {
      para.push(lines[i].trim())
      i++
    }
    const joined = para.join(' ')

    const concept = joined.match(CONCEPT_LEAD)
    if (concept && concept[2].trim()) {
      blocks.push({ kind: 'concept', term: concept[1], text: concept[2].trim() })
      continue
    }

    if (isFlowChain(joined)) {
      blocks.push({ kind: 'flow', steps: joined.split(' -> ').map((step) => step.trim()) })
      continue
    }

    splitLongParagraph(joined).forEach((chunk) => blocks.push({ kind: 'paragraph', text: chunk }))
  }

  return blocks
}

// Break a long paragraph into 1-3 sentence chunks so the reader gets breathing
// room. Conservative sentence split: end punctuation followed by whitespace and
// an uppercase/quote/paren start, so abbreviations like "e.g." mostly survive.
function splitLongParagraph(text: string): string[] {
  if (text.length <= 320) return [text]

  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z"'(])/)
  if (sentences.length <= 2) return [text]

  const chunks: string[] = []
  let current = ''
  for (const sentence of sentences) {
    if (current && current.length + sentence.length > 280) {
      chunks.push(current)
      current = sentence
    } else {
      current = current ? `${current} ${sentence}` : sentence
    }
  }
  if (current) chunks.push(current)
  return chunks
}

// Inline rendering: **bold** spans plus glossary term linking on everything.
export function renderInline(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  if (parts.length === 1) return renderGlossaryText(text)
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={`b${index}`}>{renderGlossaryText(part)}</strong>
    ) : (
      <span key={`t${index}`}>{renderGlossaryText(part)}</span>
    ),
  )
}

export function renderProse(text: string | undefined): ReactNode {
  if (!text) return null
  const blocks = parseProse(text)
  const out: ReactNode[] = []
  let conceptRun: ProseBlock[] = []

  const flushConcepts = () => {
    if (conceptRun.length === 0) return
    out.push(
      <div className="concept-grid" key={`concepts-${out.length}`}>
        {conceptRun.map((block, index) =>
          block.kind === 'concept' ? (
            <section className="concept-card" key={`${block.term}-${index}`}>
              <h5>{block.term}</h5>
              <p>{renderInline(block.text)}</p>
            </section>
          ) : null,
        )}
      </div>,
    )
    conceptRun = []
  }

  blocks.forEach((block, index) => {
    if (block.kind === 'concept') {
      conceptRun.push(block)
      return
    }
    flushConcepts()

    if (block.kind === 'paragraph') {
      out.push(<p key={index}>{renderInline(block.text)}</p>)
    } else if (block.kind === 'code') {
      out.push(
        <pre className="prose-code" key={index}>
          <code>{block.code}</code>
        </pre>,
      )
    } else if (block.kind === 'bullets') {
      out.push(
        <ul key={index}>
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </ul>,
      )
    } else if (block.kind === 'flow') {
      out.push(
        <ol className="flow-chain" key={index}>
          {block.steps.map((step, stepIndex) => (
            <li key={stepIndex}>{renderGlossaryText(step)}</li>
          ))}
        </ol>,
      )
    }
  })
  flushConcepts()

  return <div className="lesson-prose">{out}</div>
}
