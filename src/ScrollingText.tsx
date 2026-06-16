import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'

// Pixels per second the text crawls on hover. Constant speed regardless of how
// far it has to travel, so long and short titles feel the same.
const SPEED = 45

type ScrollingTextProps = {
  text: string
  // Render as the element the surrounding CSS already styles (a bold subject
  // title is a <strong>, a lesson name is a <span>).
  as?: 'span' | 'strong'
  className?: string
}

// Truncates with an ellipsis at rest. On hover, only if the text actually
// overflows, it slides left by exactly the hidden amount to reveal the end,
// then slides back when you leave. Because it is a measured transition (not a
// blind keyframe loop), it never jumps or animates titles that already fit.
export function ScrollingText({ text, as = 'span', className = '' }: ScrollingTextProps) {
  const elRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLSpanElement | null>(null)
  const [overflow, setOverflow] = useState(0)

  function measure() {
    const el = elRef.current
    const content = contentRef.current
    if (el && content) setOverflow(Math.max(0, content.scrollWidth - el.clientWidth))
  }

  useLayoutEffect(() => {
    const el = elRef.current
    const content = contentRef.current
    if (!el) return
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    if (content) observer.observe(content)
    return () => observer.disconnect()
    // Re-measure when the text changes.
  }, [text])

  const setRef = (el: HTMLElement | null) => {
    elRef.current = el
  }

  const cls = `scrolling-text${overflow ? ' is-overflowing' : ''}${className ? ` ${className}` : ''}`
  const style: CSSProperties | undefined = overflow
    ? ({
        '--scroll-distance': `-${overflow}px`,
        '--scroll-duration': `${(overflow / SPEED).toFixed(2)}s`,
      } as CSSProperties)
    : undefined
  // Re-measure on hover so late-loading fonts or width changes are caught.
  const onMouseEnter = () => measure()

  const content = (
    <>
      <span className="scrolling-text__static">{text}</span>
      <span ref={contentRef} className="scrolling-text__moving" aria-hidden="true">
        {text}
      </span>
    </>
  )

  if (as === 'strong') {
    return (
      <strong ref={setRef} className={cls} style={style} onMouseEnter={onMouseEnter}>
        {content}
      </strong>
    )
  }
  return (
    <span ref={setRef} className={cls} style={style} onMouseEnter={onMouseEnter}>
      {content}
    </span>
  )
}
