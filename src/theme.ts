// Theme state for the sun/moon toggle (light = blue flame, dark = orange flame).
// Pure logic so the toggle button just calls these; the button + flame asset
// swap live in App.tsx (Codex's lane).
//
// Wire-up:
//   const [theme, setTheme] = useState(initTheme())   // applies on mount
//   <button onClick={() => setTheme(toggleTheme(theme))} aria-label="Toggle theme">
//     {theme === 'dark' ? <Sun /> : <Moon />}
//   </button>
// To avoid a flash of the wrong theme, also set data-theme before React renders
// with a tiny inline script in index.html (see initTheme logic).

export type Theme = 'light' | 'dark'

const KEY = 'theme'

export function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // localStorage unavailable; fall through to system preference
  }
  if (typeof window !== 'undefined' && window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function applyTheme(theme: Theme): void {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme)
  }
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // persistence is best-effort
  }
}

export function toggleTheme(current: Theme): Theme {
  const next: Theme = current === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  return next
}

// Resolve + apply the starting theme. Call once on app start.
export function initTheme(): Theme {
  const theme = getInitialTheme()
  applyTheme(theme)
  return theme
}
