// Dependency-free syntax highlighter for the code editors. Tokenizes JS/TS/Python
// into HTML <span class="tok-*"> so it can be rendered as a backdrop behind a
// transparent textarea (the standard "highlighted textarea" pattern).
//
// Wiring (Codex's editor): stack a <pre aria-hidden> behind the <textarea>; set
// the textarea text color to transparent (keep the caret), and on every change
// set pre.innerHTML = highlight(code, language) and sync scroll. Output is HTML-
// escaped, so it is safe to assign to innerHTML.

const KEYWORDS = new Set([
  // JS / TS
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
  'switch', 'case', 'break', 'continue', 'new', 'class', 'extends', 'super',
  'typeof', 'instanceof', 'of', 'try', 'catch', 'finally', 'throw', 'async',
  'await', 'yield', 'import', 'export', 'from', 'default', 'delete', 'void',
  'interface', 'type', 'enum', 'implements', 'public', 'private', 'protected',
  'readonly', 'as', 'keyof', 'namespace', 'declare', 'abstract', 'static',
  // Python
  'def', 'elif', 'except', 'raise', 'with', 'lambda', 'pass', 'global',
  'nonlocal', 'not', 'and', 'or', 'is', 'in', 'del', 'assert',
])

const LITERALS = new Set([
  'true', 'false', 'null', 'undefined', 'NaN', 'Infinity',
  'None', 'True', 'False', 'self', 'this',
])

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function span(cls: string, text: string): string {
  return '<span class="tok-' + cls + '">' + esc(text) + '</span>'
}

export function highlight(code: string, language: 'js' | 'ts' | 'py' = 'js'): string {
  const comment = language === 'py' ? /#[^\n]*/y : /\/\/[^\n]*|\/\*[\s\S]*?\*\//y
  const string = /`(?:\\.|[^`\\])*`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"/y
  const number = /\b\d[\d_]*(?:\.\d+)?\b/y
  const ident = /[A-Za-z_$][\w$]*/y

  let out = ''
  let i = 0
  const n = code.length

  while (i < n) {
    comment.lastIndex = i
    string.lastIndex = i
    number.lastIndex = i
    ident.lastIndex = i

    let m = comment.exec(code)
    if (m && m.index === i) { out += span('comment', m[0]); i = comment.lastIndex; continue }

    m = string.exec(code)
    if (m && m.index === i) { out += span('string', m[0]); i = string.lastIndex; continue }

    m = number.exec(code)
    if (m && m.index === i) { out += span('number', m[0]); i = number.lastIndex; continue }

    m = ident.exec(code)
    if (m && m.index === i) {
      const word = m[0]
      i = ident.lastIndex
      let cls: string | null = null
      if (KEYWORDS.has(word)) cls = 'keyword'
      else if (LITERALS.has(word)) cls = 'literal'
      else {
        let j = i
        while (j < n && (code[j] === ' ' || code[j] === '\t')) j++
        if (code[j] === '(') cls = 'function'
      }
      out += cls ? span(cls, word) : esc(word)
      continue
    }

    out += esc(code[i])
    i++
  }

  return out
}
