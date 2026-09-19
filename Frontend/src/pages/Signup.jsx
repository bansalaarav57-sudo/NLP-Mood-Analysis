import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import FloatingCrystal from '../components/three/FloatingCrystal'

export default function Signup() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const password = watch('password')

  const onSubmit = async (data) => {
    setLoading(true); setError('')
    try {
      const res = await authService.signup({ name: data.name, email: data.email, password: data.password })
      login(res.data.user, res.data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not create account. Try again.')
    } finally { setLoading(false) }
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10, color: 'var(--txt1)', fontSize: 14, outline: 'none',
    fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
  }
  const focusH = (hasErr) => ({
    onFocus: e => { e.target.style.borderColor = 'rgba(124,92,252,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,92,252,0.15)'; e.target.style.background = 'rgba(124,92,252,0.06)' },
    onBlur:  e => { e.target.style.borderColor = hasErr ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.04)' },
  })

  const Field = ({ label, name, type = 'text', placeholder, rules }) => (
    <div className="mb-3.5">
      <label style={{ fontSize: 12, color: 'var(--txt3)', display: 'block', marginBottom: 6, fontWeight: 500 }}>{label}</label>
      <input type={type} placeholder={placeholder} {...register(name, rules)}
        style={{ ...inputStyle, borderColor: errors[name] ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)' }}
        {...focusH(errors[name])} />
      {errors[name] && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors[name].message}</p>}
    </div>
  )

  return (
    <div className="mesh-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,64,251,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 60, width: '100%', maxWidth: 900, position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ flex: '0 0 400px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 28 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #7C5CFC, #E040FB)', boxShadow: '0 0 14px rgba(124,92,252,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 13 }}>🧠</span>
            </div>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--txt1)' }}>
              MoodLens<span className="gradient-text">AI</span>
            </span>
          </Link>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 28, backdropFilter: 'blur(20px)' }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 18, color: 'var(--txt1)', marginBottom: 4 }}>Create account</h3>
            <p style={{ fontSize: 13, color: 'var(--txt3)', marginBottom: 22 }}>Start tracking your mental health today</p>

            {error && (
              <div className="mb-4 px-3.5 py-2.5 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Field label="Full name"    name="name"     placeholder="Your name"     rules={{ required: 'Name is required' }} />
              <Field label="Email"        name="email"    type="email" placeholder="you@example.com" rules={{ required: 'Email is required' }} />
              <Field label="Password"     name="password" type="password" placeholder="Min 6 characters" rules={{ required: true, minLength: { value: 6, message: 'At least 6 characters' } }} />
              <div className="mb-5">
                <label style={{ fontSize: 12, color: 'var(--txt3)', display: 'block', marginBottom: 6, fontWeight: 500 }}>Confirm password</label>
                <input type="password" placeholder="••••••••" {...register('confirm', { validate: v => v === password || 'Passwords do not match' })}
                  style={{ ...inputStyle, borderColor: errors.confirm ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)' }}
                  {...focusH(errors.confirm)} />
                {errors.confirm && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>{errors.confirm.message}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: loading ? 'rgba(124,92,252,0.4)' : 'linear-gradient(135deg, #7C5CFC, #6246EA)', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 0 24px rgba(124,92,252,0.4)', transition: 'all 0.25s', fontFamily: 'Inter, sans-serif' }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 0 36px rgba(124,92,252,0.6)'; e.currentTarget.style.transform = 'translateY(-1px)' }}}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = loading ? 'none' : '0 0 24px rgba(124,92,252,0.4)'; e.currentTarget.style.transform = 'none' }}
              >
                {loading ? <><LoadingSpinner size={15} /> Creating...</> : 'Create account →'}
              </button>
            </form>

            <p style={{ fontSize: 13, color: 'var(--txt3)', marginTop: 18, textAlign: 'center' }}>
              Already signed up?{' '}<Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign in</Link>
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="flex-1 hidden lg:flex flex-col items-center gap-6">
          <FloatingCrystal size={260} />
          <div className="text-center">
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 24, color: 'var(--txt1)', marginBottom: 8 }}>
              Know your mind
            </h2>
            <p style={{ fontSize: 14, color: 'var(--txt3)', lineHeight: 1.7 }}>
              AI-powered mood detection<br />in seconds.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
