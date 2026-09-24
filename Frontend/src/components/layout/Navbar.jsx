import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'rgba(6,8,18,0.7)',
        borderBottom: '1px solid rgba(124,92,252,0.1)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}
      className="flex items-center justify-between px-10 py-4"
    >
      <div className="flex items-center gap-2.5">
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'linear-gradient(135deg, #7C5CFC, #E040FB)',
          boxShadow: '0 0 16px rgba(124,92,252,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 13 }}>🧠</span>
        </div>
        <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--txt1)', letterSpacing: '-0.01em' }}>
          MoodLens<span className="gradient-text">AI</span>
        </span>
      </div>

      <div className="flex items-center gap-8">
        {['Features','How it works','About'].map((label, i) => (
          <a key={i} href={`#${label.toLowerCase().replace(' ','-')}`}
            style={{ color: 'var(--txt3)', fontSize: 13, fontWeight: 500, transition: 'color 0.2s', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = 'var(--txt1)'}
            onMouseLeave={e => e.target.style.color = 'var(--txt3)'}
          >{label}</a>
        ))}
      </div>

      <div className="flex items-center gap-2.5">
        <Link to="/login"
          style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'var(--txt2)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,92,252,0.5)'; e.currentTarget.style.color = 'var(--txt1)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--txt2)' }}
        >Log in</Link>
        <Link to="/signup"
          style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #7C5CFC, #6246EA)', boxShadow: '0 0 20px rgba(124,92,252,0.35)', textDecoration: 'none', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 30px rgba(124,92,252,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(124,92,252,0.35)'; e.currentTarget.style.transform = 'none' }}
        >Get started →</Link>
      </div>
    </motion.nav>
  )
}
