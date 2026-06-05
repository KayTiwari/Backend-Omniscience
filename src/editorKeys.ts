// Editor key handling for the code textarea: auto-close brackets/quotes, wrap a
// selection, type over a closing char, Tab to indent, and Backspace deleting an
// empty pair. Pure and framework-agnostic so it is unit-testable.
//
// Wire into a React textarea:
//   onKeyDown={(e) => {
//     const ta = e.currentTarget
//     const next = applyEditorKey({ value: ta.value, start: ta.selectionStart, end: ta.selectionEnd }, e.key)
//     if (next) {
//       e.preventDefault()
//       setCode(next.value)
//       requestAnimationFrame(() => ta.setSelectionRange(next.start, next.end))
//     }
//   }}

export type EditorState = { value: string; start: number; end: number }

const PAIRS: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '"': '"',
  "'": "'",
  '`': '`',
}

const QUOTES = new Set(['"', "'", '`'])
const CLOSERS = new Set([')', ']', '}'])

// Returns the next editor state if the key was handled (caller should
// preventDefault), or null to let the default keypress happen.
export function applyEditorKey(s: EditorState, key: string): EditorState | null {
  const { value, start, end } = s

  if (key === 'Tab') {
    const v = value.slice(0, start) + '  ' + value.slice(end)
    return { value: v, start: start + 2, end: start + 2 }
  }

  // Type over an existing closing char / quote instead of inserting a duplicate.
  if (start === end && value[start] === key && (CLOSERS.has(key) || QUOTES.has(key))) {
    return { value, start: start + 1, end: start + 1 }
  }

  // Auto-close, or wrap a selection.
  if (PAIRS[key]) {
    const close = PAIRS[key]
    if (start !== end) {
      const sel = value.slice(start, end)
      const v = value.slice(0, start) + key + sel + close + value.slice(end)
      return { value: v, start: start + 1, end: end + 1 }
    }
    const v = value.slice(0, start) + key + close + value.slice(end)
    return { value: v, start: start + 1, end: start + 1 }
  }

  // Backspace between an empty pair removes both characters.
  if (key === 'Backspace' && start === end && start > 0) {
    const before = value[start - 1]
    const after = value[start]
    if (PAIRS[before] && PAIRS[before] === after) {
      const v = value.slice(0, start - 1) + value.slice(start + 1)
      return { value: v, start: start - 1, end: start - 1 }
    }
  }

  return null
}
