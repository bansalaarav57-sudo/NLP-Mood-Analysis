export default function StatCard({ label, value, sub, subColor }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, padding: 18,
      backdropFilter: 'blur(12px)',
      transition: 'border-color 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,92,252,0.3)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      <p style={{ color: 'var(--txt3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 500 }}>
        {label}
      </p>
      <p style={{ color: 'var(--txt1)', fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 600, lineHeight: 1 }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: 11, marginTop: 7, color: subColor || 'var(--txt3)' }}>{sub}</p>
      )}
    </div>
  )
}
