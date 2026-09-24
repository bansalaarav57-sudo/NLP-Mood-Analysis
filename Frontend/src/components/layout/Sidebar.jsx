import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaChartPie, FaBrain, FaHistory, FaChartLine, FaUser, FaSignOutAlt } from 'react-icons/fa'

const navItems = [
  { to: '/dashboard', icon: FaChartPie,  label: 'Dashboard' },
  { to: '/predict',   icon: FaBrain,     label: 'Predict'   },
  { to: '/history',   icon: FaHistory,   label: 'History'   },
  { to: '/reports',   icon: FaChartLine, label: 'Reports'   },
  { to: '/profile',   icon: FaUser,      label: 'Profile'   },
]

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate   = useNavigate()

  return (
    <aside style={{
      width: 220, flexShrink: 0, minHeight: '100vh',
      background: 'rgba(13,17,23,0.95)',
      borderRight: '1px solid rgba(124,92,252,0.1)',
      backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, height: '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2.5">
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #7C5CFC, #E040FB)',
            boxShadow: '0 0 14px rgba(124,92,252,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontSize: 13 }}>🧠</span>
          </div>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--txt1)' }}>
            MoodLens<span className="gradient-text">AI</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 pt-4 px-2 flex-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
          >
            <Icon size={14} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-lg text-sm"
          style={{ color: 'var(--txt3)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#F87171' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--txt3)' }}
        >
          <FaSignOutAlt size={13} /> Logout
        </button>
      </div>
    </aside>
  )
}
