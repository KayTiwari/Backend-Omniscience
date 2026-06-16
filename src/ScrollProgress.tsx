import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        setProgress(scrollable > 0 ? window.scrollY / scrollable : 0)
      })
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      zIndex: 1000,
      background: 'transparent',
      pointerEvents: 'none',
    }}>
      <div style={{
        height: '100%',
        background: 'linear-gradient(90deg, var(--brand-b), var(--brand-c))',
        transform: `scaleX(${progress})`,
        transformOrigin: 'left center',
        willChange: 'transform',
      }} />
    </div>
  )
}
