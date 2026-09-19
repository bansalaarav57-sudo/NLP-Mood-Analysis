import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { predictionService } from '../services/api'
import MoodBadge from '../components/ui/MoodBadge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { MoodSphere } from '../components/three/MoodSphere'

const MOOD_COLORS = {
  Normal: '#10B981', Stress: '#F59E0B', Bipolar: '#A78BFA',
  Suicidal: '#EF4444', Anxiety: '#60A5FA', Depression: '#FB923C',
  'Personality disorder': '#2DD4BF',
}
const MOOD_EMOJI = {
  Normal: '😊', Stress: '😰', Bipolar: '🔄', Suicidal: '🆘',
  Anxiety: '😟', Depression: '😔', 'Personality disorder': '🧩',
}

const card = {
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 16, backdropFilter: 'blur(12px)',
}

export default function Predict() {
  const [text, setText]     = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError]   = useState('')

  const handleSubmit = async () => {
    if (!text.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await predictionService.predict(text)
      setResult(res.data.data)
      window.dispatchEvent(new Event('prediction-added'))
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Please try again.')
    } finally { setLoading(false) }
  }

  const moodColor = result ? MOOD_COLORS[result.predicted_mood] || 'var(--primary)' : null

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Ambient glow behind the result area */}
      {result && (
        <div style={{
          position: 'fixed', top: '30%', right: '10%', width: 400, height: 400,
          borderRadius: '50%', background: `radial-gradient(circle, ${MOOD_COLORS[result.predicted_mood] || '#7C5CFC'}18 0%, transparent 70%)`,
          pointerEvents: 'none', zIndex: 0, transition: 'background 1s',
        }} />
      )}

      <div className="p-7" style={{ maxWidth: 1020, position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
          <p style={{ fontSize: 12, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Analysis</p>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--txt1)', marginBottom: 6 }}>Predict your mood</h1>
          <p style={{ fontSize: 14, color: 'var(--txt3)', lineHeight: 1.7 }}>Write your thoughts — our LSTM model will detect your mental state in seconds.</p>
        </motion.div>

        <div className="grid gap-5" style={{ gridTemplateColumns: result ? '1fr 1fr' : '1fr' }}>
          {/* Input card */}
          <motion.div layout style={{ ...card, padding: 24 }}>
            <label style={{ fontSize: 12, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 12 }}>Your thoughts</label>
            <textarea
              rows={result ? 9 : 8}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Write freely about how you feel, what's been on your mind, or how your day is going..."
              style={{
                width: '100%', padding: '14px 15px', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)', color: 'var(--txt1)',
                fontSize: 14, lineHeight: 1.75, resize: 'none', outline: 'none',
                fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(124,92,252,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,92,252,0.12)' }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
            />
            <div className="flex items-center justify-between mt-4">
              <p style={{ fontSize: 12, color: 'var(--txt3)' }}>
                {text.length} chars · {text.trim().split(/\s+/).filter(Boolean).length} words
              </p>
              <button
                onClick={handleSubmit}
                disabled={loading || !text.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm"
                style={{
                  background: loading || !text.trim() ? 'rgba(124,92,252,0.3)' : 'linear-gradient(135deg, #7C5CFC, #6246EA)',
                  color: '#fff', border: 'none',
                  cursor: loading || !text.trim() ? 'not-allowed' : 'pointer',
                  boxShadow: loading || !text.trim() ? 'none' : '0 0 20px rgba(124,92,252,0.35)',
                  transition: 'all 0.25s', fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => { if (!loading && text.trim()) { e.currentTarget.style.boxShadow = '0 0 32px rgba(124,92,252,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)' }}}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = loading || !text.trim() ? 'none' : '0 0 20px rgba(124,92,252,0.35)'; e.currentTarget.style.transform = 'none' }}
              >
                {loading ? <><LoadingSpinner size={14} /> Analyzing...</> : 'Analyze →'}
              </button>
            </div>
            {error && (
              <div className="mt-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
                {error}
              </div>
            )}
          </motion.div>

          {/* Result card */}
          <AnimatePresence>
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 30, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ ...card, padding: 24 }}
              >
                <p style={{ fontSize: 12, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Result</p>

                {/* 3D mood sphere */}
                <div className="flex justify-center mb-4">
                  <div style={{ filter: `drop-shadow(0 0 30px ${moodColor}55)` }}>
                    <MoodSphere mood={result.predicted_mood} size={160} />
                  </div>
                </div>

                {/* Mood name + badge */}
                <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 26, color: 'var(--txt1)', lineHeight: 1 }}>
                      {MOOD_EMOJI[result.predicted_mood]} {result.predicted_mood}
                    </h2>
                    <p style={{ fontSize: 12, color: 'var(--txt3)', marginTop: 6 }}>
                      Confidence:{' '}
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: moodColor }}>
                        {result.confidence}%
                      </span>
                    </p>
                  </div>
                  <MoodBadge mood={result.predicted_mood} size="lg" />
                </div>

                {/* Confidence bar */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span style={{ fontSize: 12, color: 'var(--txt3)' }}>Score</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: moodColor }}>{result.confidence}%</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 9999, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                      style={{ height: '100%', background: `linear-gradient(90deg, ${moodColor}, ${moodColor}88)`, borderRadius: 9999, boxShadow: `0 0 10px ${moodColor}66` }}
                    />
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: 11, color: 'var(--txt3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Analyzed text</p>
                  <p style={{ fontSize: 13, color: 'var(--txt2)', lineHeight: 1.7 }}>{result.review}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
