type P = { size?: number; className?: string }

/* ── Brand logos ─────────────────────────────────────────────────────────── */

export function TypeScriptIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="4" fill="#3178C6" />
      <text x="16" y="23" textAnchor="middle" fill="#ffffff"
        fontSize="13" fontWeight="700" fontFamily="ui-sans-serif,system-ui,sans-serif">
        TS
      </text>
    </svg>
  )
}

export function JavaScriptIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="4" fill="#F7DF1E" />
      <text x="16" y="23" textAnchor="middle" fill="#222"
        fontSize="13" fontWeight="700" fontFamily="ui-sans-serif,system-ui,sans-serif">
        JS
      </text>
    </svg>
  )
}

export function NodeJsIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#3C873A" />
      <path d="M10.5 11v10M10.5 11l11 10M21.5 11v10"
        stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function PythonIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M16 3C11.6 3 9 5.2 9 8v2.5h7.5V12H7.5C4.5 12 3 15 3 16.5c0 2.4 1.3 5.5 4.5 5.5H9V19c0-2.2 2-3.5 7-3.5 4.3 0 6.5-1.3 6.5-4V8c0-3-2.6-5-6.5-5zm-2.5 3.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" fill="#3776AB" />
      <path d="M16 29c4.4 0 7-2.2 7-5v-2.5h-7.5V20H25c3 0 4.5-2 4.5-4.5 0-2.4-1.3-5.5-4.5-5.5H23v3c0 2.2-2 3.5-7 3.5-4.3 0-6.5 1.3-6.5 4v4c0 2.8 2.6 5 8.5 5zm2.5-3.5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z" fill="#FFD43B" />
    </svg>
  )
}

export function FlaskIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="4" x2="20" y2="4" />
      <line x1="13" y1="4" x2="13" y2="13" />
      <line x1="19" y1="4" x2="19" y2="13" />
      <path d="M13 13L7 25a2 2 0 0 0 1.8 2.8h12.4A2 2 0 0 0 23 25L19 13" />
      <circle cx="13.5" cy="21" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="24" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function DjangoIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="4" fill="#0C4B33" />
      <rect x="10" y="7" width="3" height="18" rx="1" fill="#44B78B" />
      <path d="M13 9h3.5C20 9 22 11.5 22 16s-2 7-5.5 7H13V9z" fill="#44B78B" />
      <path d="M13 11.5h3C18.5 11.5 19.5 13.5 19.5 16s-1 4.5-3.5 4.5H13V11.5z" fill="#0C4B33" />
    </svg>
  )
}

export function PostgreSQLIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      {/* Elephant head simplified */}
      <ellipse cx="16" cy="14" rx="9" ry="9" fill="#336791" />
      {/* Ear */}
      <ellipse cx="25" cy="11" rx="4" ry="5" fill="#336791" />
      <ellipse cx="25" cy="11" rx="2.5" ry="3.5" fill="#5a9ac8" />
      {/* Trunk */}
      <path d="M7 18 Q4 22 6 27 Q7 29 8 27 Q7 24 9 21" fill="#336791" />
      {/* Eye */}
      <circle cx="21" cy="12" r="1.5" fill="white" />
      <circle cx="21.5" cy="12" r="0.7" fill="#1a3a55" />
      {/* Tusk */}
      <path d="M12 22 Q10 26 13 27" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/* ── Conceptual subject icons ─────────────────────────────────────────────── */

export function HttpIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="12" />
      <path d="M4 16h24M16 4c-3 3-5 7-5 12s2 9 5 12M16 4c3 3 5 7 5 12s-2 9-5 12" />
    </svg>
  )
}

export function TerminalIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="26" height="22" rx="3" />
      <path d="M8 12l5 4-5 4" />
      <line x1="15" y1="20" x2="24" y2="20" />
    </svg>
  )
}

export function ApiIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Left endpoint */}
      <rect x="2" y="12" width="8" height="8" rx="2" />
      {/* Right endpoint */}
      <rect x="22" y="12" width="8" height="8" rx="2" />
      {/* Arrows both ways */}
      <path d="M10 14h6l-2-2M10 18h6l-2 2" />
      <path d="M22 14h-6l2-2M22 18h-6l2 2" />
    </svg>
  )
}

export function PadlockIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="15" width="20" height="14" rx="2" fill="currentColor" fillOpacity="0.12" stroke="currentColor" />
      <path d="M10 15v-4a6 6 0 0 1 12 0v4" />
      <circle cx="16" cy="22" r="2" fill="currentColor" />
      <line x1="16" y1="24" x2="16" y2="26" />
    </svg>
  )
}

export function ArchitectureIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="4" width="12" height="7" rx="2" />
      <rect x="3" y="21" width="10" height="7" rx="2" />
      <rect x="19" y="21" width="10" height="7" rx="2" />
      <line x1="16" y1="11" x2="16" y2="17" />
      <line x1="16" y1="17" x2="8" y2="21" />
      <line x1="16" y1="17" x2="24" y2="21" />
    </svg>
  )
}

export function DevOpsIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Infinity / CI-CD loop */}
      <path d="M8 16c0-4 3-7 7-7s5 3 5 7-2 7-5 7" />
      <path d="M24 16c0 4-3 7-7 7s-5-3-5-7 2-7 5-7" />
      {/* Arrow tips */}
      <path d="M11 9l-3 0 0 3" />
      <path d="M21 23l3 0 0-3" />
    </svg>
  )
}

export function LightningIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M18 3L6 18h10l-2 11L28 14H18L18 3z"
        fill="currentColor" fillOpacity="0.85" stroke="currentColor" strokeWidth="1.5"
        strokeLinejoin="round" />
    </svg>
  )
}

export function ServerClusterIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="24" height="6" rx="2" />
      <rect x="4" y="13" width="24" height="6" rx="2" />
      <rect x="4" y="21" width="24" height="6" rx="2" />
      <circle cx="8.5" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="16" r="1" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="24" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function TrophyIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 4h12v10a6 6 0 0 1-12 0V4z" />
      <path d="M6 5H4a2 2 0 0 0 0 4l2 3" />
      <path d="M26 5h2a2 2 0 0 1 0 4l-2 3" />
      <line x1="16" y1="20" x2="16" y2="25" />
      <rect x="10" y="25" width="12" height="3" rx="1" />
    </svg>
  )
}

export function BinaryTreeIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="16" cy="6" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
      <circle cx="8" cy="17" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
      <circle cx="24" cy="17" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
      <circle cx="4" cy="27" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
      <circle cx="12" cy="27" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
      <line x1="14" y1="8" x2="10" y2="14" />
      <line x1="18" y1="8" x2="22" y2="14" />
      <line x1="6" y1="19" x2="5" y2="24" />
      <line x1="10" y1="19" x2="11" y2="24" />
    </svg>
  )
}

export function WrenchIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 4a6 6 0 0 0-6 7.8L5 24.8a2 2 0 0 0 2.8 2.8L20.2 14A6 6 0 1 0 24 4z" />
      <circle cx="24" cy="8" r="2" fill="currentColor" />
    </svg>
  )
}

export function DistributedIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="16" cy="6" r="3.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" />
      <circle cx="5" cy="24" r="3.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" />
      <circle cx="27" cy="24" r="3.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" />
      <line x1="13" y1="8" x2="8" y2="21" />
      <line x1="19" y1="8" x2="24" y2="21" />
      <line x1="8.5" y1="24" x2="23.5" y2="24" />
    </svg>
  )
}

export function ObservabilityIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Bar chart */}
      <rect x="4" y="20" width="5" height="8" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
      <rect x="11" y="14" width="5" height="14" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
      <rect x="18" y="8" width="5" height="20" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
      {/* Eye */}
      <path d="M14 5c-5 0-9 4-9 4s4 4 9 4 9-4 9-4-4-4-9-4z" />
      <circle cx="14" cy="9" r="2" fill="currentColor" />
    </svg>
  )
}

export function CloudStorageIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 22a6 6 0 0 1-1-11.9 8 8 0 1 1 16 0A6 6 0 0 1 24 22" />
      <line x1="16" y1="16" x2="16" y2="28" />
      <path d="M12 24l4 4 4-4" />
    </svg>
  )
}

export function CSharpIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="3" y="3" width="26" height="26" rx="6" fill="#512BD4" />
      <text
        x="16"
        y="21.5"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        fill="#ffffff"
      >
        C#
      </text>
    </svg>
  )
}

export function CacheIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="16" cy="7" rx="10" ry="4" />
      <path d="M6 7v9c0 2.2 4.5 4 10 4s10-1.8 10-4V7" />
      <path d="M6 16v9c0 2.2 4.5 4 10 4s10-1.8 10-4v-9" opacity="0.4" />
      <path d="M18 12l-5 7h4l-2 6 6-8h-4l1-5z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function QueueIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="7" height="10" rx="1.5" />
      <rect x="13" y="11" width="7" height="10" rx="1.5" opacity="0.7" />
      <rect x="23" y="11" width="6" height="10" rx="1.5" opacity="0.4" />
      <path d="M10 26h12" />
      <path d="M19 23l3 3-3 3" />
    </svg>
  )
}

export function TestTubeIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3h8" />
      <path d="M14 3v10l-6.5 11a4 4 0 0 0 3.4 6h10.2a4 4 0 0 0 3.4-6L18 13V3" />
      <path d="M11 20h10" />
      <path d="M13.5 25l2 2 4-4" />
    </svg>
  )
}

export function BookIcon({ size = 16, className }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 5a2 2 0 0 1 2-2h18v24H8a2 2 0 0 0-2 2V5z" />
      <path d="M6 27a2 2 0 0 1 2-2h18" />
      <path d="M11 9h10" />
      <path d="M11 14h7" />
    </svg>
  )
}
