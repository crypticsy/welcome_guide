import lorLogo from '../assets/logo.png'

export default function Header() {
  return (
    <header
      style={{
        height: 'var(--nav-h)',
        flexShrink: 0,
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 200,
      }}
    >
      {/* LOR logo */}
      <a
        href="https://www.laingorourke.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          textDecoration: 'none',
        }}
      >
        <img
          src={lorLogo}
          alt="Laing O'Rourke"
          style={{
            height: 38,
            width: 'auto',
            display: 'block',
          }}
        />
      </a>

      {/* Divider */}
      <span style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />

      {/* Page title */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            color: '#ffffff',
            lineHeight: 1.1,
            letterSpacing: '-0.1px',
          }}
        >
          Halifax<span style={{ color: 'var(--lor-yellow)' }}>.</span>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 9.5,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.4px',
            marginTop: 1,
          }}
        >
          Welcome Guide
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Advanced Works badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 12px',
          borderRadius: 99,
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--lor-yellow)',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(9px, 2.5vw, 11px)',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.7)',
            whiteSpace: 'nowrap',
            letterSpacing: '0.3px',
          }}
        >
          Advanced Works
        </span>
      </div>
    </header>
  )
}
