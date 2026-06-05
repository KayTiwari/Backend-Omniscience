// Minimal, dependency-free Markdown -> HTML for tutorial bodies. Handles the
// subset the tutorials use: paragraphs, **bold**, 4-space indented code blocks,
// and "- " bullet lists. Output is HTML-escaped, safe for dangerouslySetInnerHTML.

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inline(s: string): string {
  return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

export function renderMarkdown(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Indented code block (4 spaces).
    if (/^ {4}/.test(line)) {
      const code: string[] = []
      while (i < lines.length && (/^ {4}/.test(lines[i]) || lines[i] === '')) {
        if (lines[i] === '' && !/^ {4}/.test(lines[i + 1] || '')) break
        code.push(lines[i].replace(/^ {4}/, ''))
        i++
      }
      out.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>')
      continue
    }

    // Bullet list.
    if (/^- /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^- /.test(lines[i])) {
        items.push('<li>' + inline(lines[i].slice(2)) + '</li>')
        i++
      }
      out.push('<ul>' + items.join('') + '</ul>')
      continue
    }

    // Blank line.
    if (line.trim() === '') {
      i++
      continue
    }

    // Paragraph: gather consecutive non-blank, non-code, non-bullet lines.
    const para: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^ {4}/.test(lines[i]) &&
      !/^- /.test(lines[i])
    ) {
      para.push(lines[i])
      i++
    }
    out.push('<p>' + inline(para.join(' ')) + '</p>')
  }

  return out.join('\n')
}
