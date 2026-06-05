type IconProps = { size?: number; className?: string }

export function NodeJsIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      {/* Hexagon body */}
      <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#3C873A" />
      {/* N letterform */}
      <path
        d="M10.5 11v10M10.5 11l11 10M21.5 11v10"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function PythonIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      {/* Top snake head (blue) */}
      <path
        d="M16 3C11.6 3 9 5.2 9 8v2.5h7.5V12H7.5C4.5 12 3 14 3 16.5c0 2.4 1.3 5.5 4.5 5.5H9V19c0-2.2 2-3.5 7-3.5 4.3 0 6.5-1.3 6.5-4V8c0-2.8-2.6-5-6.5-5zm-2.5 3.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"
        fill="#3776AB"
      />
      {/* Bottom snake head (yellow) */}
      <path
        d="M16 29c4.4 0 7-2.2 7-5v-2.5h-7.5V20H23c3 0 4.5-2 4.5-4.5 0-2.4-1.3-5.5-4.5-5.5H21v3c0 2.2-2 3.5-7 3.5-4.3 0-6.5 1.3-6.5 4v4c0 2.8 2.6 5 8.5 5zm2.5-3.5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z"
        fill="#FFD43B"
      />
    </svg>
  )
}

export function FlaskIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Flask neck */}
      <line x1="12" y1="4" x2="20" y2="4" />
      <line x1="13" y1="4" x2="13" y2="13" />
      <line x1="19" y1="4" x2="19" y2="13" />
      {/* Flask body */}
      <path d="M13 13L7 25a2 2 0 0 0 1.8 2.8h12.4A2 2 0 0 0 23 25L19 13" />
      {/* Bubbles */}
      <circle cx="13.5" cy="21" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="24" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function DjangoIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="4" fill="#0C4B33" />
      {/* Django "D" wordmark simplified — vertical bar + curve */}
      <rect x="10" y="7" width="3" height="18" rx="1" fill="#44B78B" />
      <path
        d="M13 9h3.5C20 9 22 11.5 22 16s-2 7-5.5 7H13V9z"
        fill="#44B78B"
      />
      <path
        d="M13 11.5h3C18.5 11.5 19.5 13.5 19.5 16s-1 4.5-3.5 4.5H13V11.5z"
        fill="#0C4B33"
      />
    </svg>
  )
}
