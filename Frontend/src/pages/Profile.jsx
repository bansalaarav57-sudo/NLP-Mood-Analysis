import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import FloatingCrystal from '../components/three/FloatingCrystal'

export default function Profile() {
  const { user } = useAuth()
  const u = user || { name: 'Yash Agarwal', email: 'yash@example.com', created_at: '2026-01-15' }
  const initials = u.name.split(' ').map(n => n[0]).join('').toUpperCase()
  const joined   = u.created_at ? new Date(u.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2026'

  const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, backdropFilter: 'blur(12px)' }

  return (
    <div className="p-7" style={{ maxWidth: 1020, position: 'relative' }}>
      {/* Ambient */}
      <div style={{ position: 'absolute', top: 80, right: 60, pointerEvents: 'none', zIndex: 0 }}>
        <FloatingCrystal size={200} />
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-7" style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: 12, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Account</p>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--txt1)' }}>Profile</h1>
      </motion.div>

      <div style={{ maxWidth: 500, position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }} style={{ ...card, padding: 28 }}>
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #7C5CFC, #E040FB)', boxShadow: '0 0 24px rgba(124,92,252,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 20, color: '#fff', flexShrink: 0 }}>
              {initials}
            </div>
            <div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 17, color: 'var(--txt1)', marginBottom: 3 }}>{u.name}</p>
              <p style={{ fontSize: 13, color: 'var(--txt3)' }}>Member since {joined}</p>
            </div>
          </div>

          {/* Info rows */}
          {[
            { label: 'Full name',     value: u.name  },
            { label: 'Email',         value: u.email },
            { label: 'Member since',  value: joined  },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 13, color: 'var(--txt3)' }}>{label}</span>
              <span style={{ fontSize: 14, color: 'var(--txt2)', fontWeight: 500 }}>{value}</span>
            </div>
          ))}

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: 'Reviews',       value: '28'     },
              { label: 'Avg Confidence', value: '92.4%' },
              { label: 'Latest Mood',   value: 'Normal' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3.5 text-center" style={{ background: 'rgba(124,92,252,0.06)', border: '1px solid rgba(124,92,252,0.15)' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 16, color: 'var(--primary)', marginBottom: 3 }}>{value}</p>
                <p style={{ fontSize: 11, color: 'var(--txt3)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'var(--primary-bg)', color: 'var(--primary)', border: '1px solid rgba(124,92,252,0.2)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,92,252,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--primary-bg)'}
            >Change password</button>
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(239,68,68,0.06)', color: '#F87171', border: '1px solid rgba(239,68,68,0.18)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
            >Delete account</button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
