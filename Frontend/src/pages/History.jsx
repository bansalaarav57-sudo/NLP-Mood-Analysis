import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { reportService } from '../services/api'
import MoodBadge from '../components/ui/MoodBadge'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const MOODS = ['All', 'Normal', 'Stress', 'Bipolar', 'Suicidal', 'Anxiety', 'Depression', 'Personality disorder']
const PER_PAGE = 8

const card = {
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 16, backdropFilter: 'blur(12px)',
}

export default function History() {
  const [reviews, setReviews]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [moodFilter, setMoodFilter] = useState('All')
  const [page, setPage]             = useState(1)

  const fetchHistory = () => {
    setLoading(true)
    reportService.getHistory()
      .then(r => setReviews(r.data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchHistory()
    window.addEventListener('prediction-added', fetchHistory)
    return () => window.removeEventListener('prediction-added', fetchHistory)
  }, [])

  const filtered = reviews.filter(r =>
    (moodFilter === 'All' || r.predicted_mood === moodFilter) &&
    (search === '' || r.review.toLowerCase().includes(search.toLowerCase()))
  )
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const inputBase = {
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10, color: 'var(--txt1)', fontSize: 13, outline: 'none',
    fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
  }

  return (
    <div className="p-7" style={{ maxWidth: 1020 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <p style={{ fontSize: 12, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Log</p>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--txt1)', marginBottom: 4 }}>History</h1>
        <p style={{ fontSize: 14, color: 'var(--txt3)' }}>All your saved mood analyses.</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        className="flex gap-3 mb-5 flex-wrap">
        <input
          placeholder="Search reviews..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          style={{ ...inputBase, flex: 1, minWidth: 220 }}
          onFocus={e => { e.target.style.borderColor = 'rgba(124,92,252,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,92,252,0.12)' }}
          onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
        />
        <select value={moodFilter} onChange={e => { setMoodFilter(e.target.value); setPage(1) }} style={{ ...inputBase }}>
          {MOODS.map(m => <option key={m}>{m}</option>)}
        </select>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={card}>
        <div className="grid px-5 py-3 text-xs uppercase"
          style={{ gridTemplateColumns: '2.5fr 1fr 1fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--txt3)', letterSpacing: '0.08em' }}>
          <span>Review</span><span>Mood</span><span>Confidence</span><span>Date</span>
        </div>

        {loading ? (
          <div className="py-14 flex justify-center"><LoadingSpinner size={26} /></div>
        ) : paged.length === 0 ? (
          <div className="py-14 text-center" style={{ color: 'var(--txt3)', fontSize: 14 }}>
            {filtered.length === 0 ? 'No entries yet. Go predict your first mood!' : 'No matching reviews.'}
          </div>
        ) : (
          paged.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="grid items-center px-5 py-3"
              style={{ gridTemplateColumns: '2.5fr 1fr 1fr 1fr', borderBottom: i < paged.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: 'var(--txt2)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 16 }}>{r.review}</span>
              <span><MoodBadge mood={r.predicted_mood} /></span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--txt3)' }}>{r.confidence}%</span>
              <span style={{ fontSize: 12, color: 'var(--txt3)' }}>{new Date(r.created_at).toLocaleDateString()}</span>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: '8px 18px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: page === 1 ? 'var(--txt3)' : 'var(--txt2)', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
            ← Previous
          </button>
          <span style={{ fontSize: 13, color: 'var(--txt3)' }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}
            style={{ padding: '8px 18px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: page >= totalPages ? 'var(--txt3)' : 'var(--txt2)', cursor: page >= totalPages ? 'not-allowed' : 'pointer', fontSize: 13, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
