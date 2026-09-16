import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import BrainOrb from '../components/three/BrainOrb'

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
})

const features = [
  { icon: '🧠', name: 'LSTM Deep Learning', desc: 'Trained on real mental health datasets, our model detects subtle emotional patterns with high accuracy.' },
  { icon: '📊', name: 'Live Analytics', desc: 'Interactive dashboards reveal mood trends, confidence scores, and weekly patterns over time.' },
  { icon: '🔐', name: 'Privacy-first', desc: 'JWT auth, encrypted storage, zero data sharing. Your mental state is yours alone.' },
  { icon: '⚡', name: 'Instant results', desc: 'Sub-second inference. Write, submit, and see your mood prediction appear in real time.' },
]

const steps = ['Sign up', 'Write freely', 'AI analyzes', 'Mood predicted', 'Track trends']

export default function Landing() {
  return (
    <div className="mesh-bg" style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-10 pt-16 pb-10 flex items-center gap-10">
        <div style={{ flex: '0 0 55%' }}>
          <motion.div {...fade(0)}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs mb-7"
              style={{ border: '1px solid rgba(124,92,252,0.35)', background: 'rgba(124,92,252,0.1)', color: '#A78BFA' }}>
              <span className="live-dot w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)', display: 'inline-block' }} />
              Powered by LSTM Neural Networks
            </div>
          </motion.div>

          <motion.h1 {...fade(0.08)}
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 54, color: 'var(--txt1)', lineHeight: 1.08, marginBottom: 20 }}>
            Understand your<br />
            <span className="gradient-text">mind with AI</span>
          </motion.h1>

          <motion.p {...fade(0.15)}
            style={{ color: 'var(--txt2)', fontSize: 16, lineHeight: 1.75, maxWidth: 440, marginBottom: 36 }}>
            Paste your thoughts, get a mood prediction in seconds. Track your mental health over time with beautiful analytics.
          </motion.p>

          <motion.div {...fade(0.2)} className="flex items-center gap-3">
            <Link to="/signup"
              style={{ padding: '13px 28px', borderRadius: 12, fontWeight: 600, fontSize: 14, color: '#fff', background: 'linear-gradient(135deg, #7C5CFC, #6246EA)', boxShadow: '0 0 28px rgba(124,92,252,0.45)', textDecoration: 'none', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 45px rgba(124,92,252,0.65)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(124,92,252,0.45)'; e.currentTarget.style.transform = 'none' }}
            >Start for free →</Link>
            <Link to="/login"
              style={{ padding: '13px 24px', borderRadius: 12, fontSize: 14, fontWeight: 500, color: 'var(--txt2)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--txt1)'; e.currentTarget.style.borderColor = 'rgba(124,92,252,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--txt2)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
            >Sign in</Link>
          </motion.div>

          {/* Stat pills */}
          <motion.div {...fade(0.28)} className="flex items-center gap-4 mt-10">
            {[['98%', 'Accuracy'], ['< 1s', 'Response'], ['7', 'Mood classes']].map(([v, l]) => (
              <div key={l} className="flex items-center gap-2.5 px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 15, color: 'var(--primary)' }}>{v}</span>
                <span style={{ fontSize: 12, color: 'var(--txt3)' }}>{l}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 3D Brain */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ width: '100%', maxWidth: 440, filter: 'drop-shadow(0 0 60px rgba(124,92,252,0.3))' }}>
            <BrainOrb height={400} />
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-10 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
          <p style={{ fontSize: 12, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Capabilities</p>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 36, color: 'var(--txt1)', lineHeight: 1.2 }}>
            Built for real insight
          </h2>
        </motion.div>

        <div className="grid grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.09 }}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 20px', cursor: 'default', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,92,252,0.4)'; e.currentTarget.style.background = 'rgba(124,92,252,0.06)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ fontSize: 24, marginBottom: 14, width: 44, height: 44, borderRadius: 12, background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {f.icon}
              </div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 14, color: 'var(--txt1)', marginBottom: 8 }}>{f.name}</p>
              <p style={{ fontSize: 13, color: 'var(--txt3)', lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(124,92,252,0.03)' }} className="py-20">
        <div className="max-w-6xl mx-auto px-10">
          <div className="mb-14 text-center">
            <p style={{ fontSize: 12, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Process</p>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 36, color: 'var(--txt1)' }}>How it works</h2>
          </div>
          <div className="flex items-start justify-between gap-4">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-3 flex-1">
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(124,92,252,0.2), rgba(224,64,251,0.1))', border: '1px solid rgba(124,92,252,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(124,92,252,0.2)' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>{i + 1}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--txt2)', fontWeight: 500, textAlign: 'center' }}>{s}</p>
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', width: 60 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-10 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 40, color: 'var(--txt1)', marginBottom: 16, lineHeight: 1.2 }}>
            Ready to understand<br /><span className="gradient-text">your mind?</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--txt2)', marginBottom: 32, lineHeight: 1.7 }}>
            Join thousands who use MoodLens to track and understand their mental health.
          </p>
          <Link to="/signup"
            style={{ display: 'inline-block', padding: '14px 36px', borderRadius: 12, fontWeight: 600, fontSize: 15, color: '#fff', background: 'linear-gradient(135deg, #7C5CFC, #E040FB)', boxShadow: '0 0 40px rgba(124,92,252,0.45)', textDecoration: 'none', transition: 'all 0.25s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 60px rgba(124,92,252,0.65)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 40px rgba(124,92,252,0.45)'; e.currentTarget.style.transform = 'none' }}
          >Get started — it's free</Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 40px' }} className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #7C5CFC, #E040FB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 10 }}>🧠</span>
          </div>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--txt2)' }}>MoodLens<span className="gradient-text">AI</span></span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--txt3)' }}>© 2026 MoodLens AI · Yash Agarwal</p>
      </footer>
    </div>
  )
}
