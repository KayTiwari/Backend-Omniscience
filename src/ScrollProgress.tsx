import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setPct(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '8px',
      zIndex: 1000,
      background: 'color-mix(in srgb, var(--brand-a) 14%, transparent)',
      boxShadow: '0 1px 0 color-mix(in srgb, var(--brand-a) 18%, transparent)',
      pointerEvents: 'none',
    }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: 'linear-gradient(90deg, var(--brand-a), var(--brand-b), var(--brand-c))',
        boxShadow: '0 0 16px color-mix(in srgb, var(--brand-b) 55%, transparent)',
        transition: 'width 80ms linear',
      }} />
    </div>
  )
}
