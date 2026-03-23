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
          Local Area Guide
        </div>
      </div>
    </header>
  )
}
