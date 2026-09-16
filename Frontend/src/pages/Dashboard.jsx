import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { dashboardService } from '../services/api'
import StatCard from '../components/ui/StatCard'
import MoodBadge from '../components/ui/MoodBadge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ParticleField from '../components/three/ParticleField'

const MOOD_COLORS = {
  Normal: '#10B981', Stress: '#F59E0B', Bipolar: '#A78BFA',
  Suicidal: '#EF4444', Anxiety: '#60A5FA', Depression: '#FB923C',
  'Personality disorder': '#2DD4BF',
}

const demoData = {
  user_name: 'Yash',
  total_reviews: 28,
  latest_mood: 'Normal',
  average_confidence: 92.4,
  most_frequent_mood: 'Normal',
  mood_distribution: [
    { mood: 'Normal', count: 16 },
    { mood: 'Stress', count: 5 },
    { mood: 'Bipolar', count: 4 },
    { mood: 'Suicidal', count: 3 },
  ],
  trend: [
    { day: 'Mon', confidence: 88.2 },
    { day: 'Tue', confidence: 90.1 },
    { day: 'Wed', confidence: 87.5 },
    { day: 'Thu', confidence: 93.4 },
    { day: 'Fri', confidence: 91.8 },
    { day: 'Sat', confidence: 94.2 },
    { day: 'Today', confidence: 94.2 },
  ],
  recent_reviews: [
    { id: 1, text: 'I felt calm and focused at work today...', mood: 'Normal',   confidence: 94.2, date: 'Today'  },
    { id: 2, text: "Been overwhelmed with deadlines...",        mood: 'Stress',   confidence: 87.6, date: 'Jun 26' },
    { id: 3, text: 'Woke up feeling really good, went for a run...', mood: 'Normal', confidence: 96.1, date: 'Jun 25' },
    { id: 4, text: "Couldn't sleep, thoughts racing all night...", mood: 'Bipolar', confidence: 79.4, date: 'Jun 24' },
    { id: 5, text: 'Had a great conversation with friends today...', mood: 'Normal', confidence: 91.3, date: 'Jun 23' },
  ],
}

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay } })

const card = {
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 16, padding: '18px 20px', backdropFilter: 'blur(10px)',
}

const TooltipStyle = {
  contentStyle: { background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12 },
  labelStyle: { color: 'var(--txt2)' },
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.getSummary()
      .then(r => setData(r.data))
      .catch(() => setData(demoData))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}><LoadingSpinner size={30} /></div>
  )

  const d = data || demoData
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 3D particle background — top banner area */}
      <ParticleField height={260} />

      <div className="p-7" style={{ maxWidth: 1020, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div {...fade(0)} className="flex items-center justify-between mb-7">
          <div>
            <p style={{ fontSize: 12, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Overview</p>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--txt1)' }}>
              Hello, {user?.name || d.user_name} 👋
            </h1>
            <p style={{ fontSize: 12, color: 'var(--txt3)', marginTop: 3 }}>{today}</p>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #7C5CFC, #E040FB)', boxShadow: '0 0 20px rgba(124,92,252,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 15, color: '#fff' }}>
            {(user?.name || 'Y').charAt(0).toUpperCase()}
          </div>
        </motion.div>

        {/* Stat cards */}
        <motion.div {...fade(0.07)} className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Total Reviews',   value: d.total_reviews,            sub: 'All time',          subColor: undefined },
            { label: 'Latest Mood',     value: d.latest_mood,              sub: '2 hours ago',       subColor: 'var(--success)' },
            { label: 'Avg Confidence',  value: `${d.average_confidence}%`, sub: '↑ 1.2% this week',  subColor: 'var(--success)' },
            { label: 'Most Frequent',   value: d.most_frequent_mood,       sub: 'Last 30 days',      subColor: undefined },
          ].map(c => <StatCard key={c.label} {...c} />)}
        </motion.div>

        {/* Charts row */}
        <motion.div {...fade(0.13)} className="grid gap-4 mb-5" style={{ gridTemplateColumns: '1fr 1.6fr' }}>
          {/* Pie */}
          <div style={card}>
            <p style={{ fontSize: 12, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Mood distribution</p>
            <div className="flex items-center gap-5">
              <PieChart width={110} height={110}>
                <Pie data={d.mood_distribution} cx={55} cy={55} innerRadius={30} outerRadius={50} dataKey="count" paddingAngle={4}>
                  {d.mood_distribution.map(e => (
                    <Cell key={e.mood} fill={MOOD_COLORS[e.mood] || 'var(--primary)'} />
                  ))}
                </Pie>
              </PieChart>
              <div className="flex flex-col gap-2.5">
                {d.mood_distribution.map(e => (
                  <div key={e.mood} className="flex items-center gap-2" style={{ fontSize: 12, color: 'var(--txt2)' }}>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: MOOD_COLORS[e.mood] || 'var(--primary)' }} />
                    {e.mood}
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--txt3)', marginLeft: 'auto', paddingLeft: 8 }}>
                      {Math.round((e.count / d.total_reviews) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Area */}
          <div style={card}>
            <p style={{ fontSize: 12, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Confidence trend — 7 days</p>
            <ResponsiveContainer width="100%" height={110}>
              <AreaChart data={d.trend} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="15%" stopColor="#7C5CFC" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--txt3)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: 'var(--txt3)' }} axisLine={false} tickLine={false} />
                <Tooltip {...TooltipStyle} formatter={v => [`${v}%`, 'Confidence']} />
                <Area type="monotone" dataKey="confidence" stroke="#7C5CFC" strokeWidth={2} fill="url(#cg)" dot={false} activeDot={{ r: 4, fill: '#7C5CFC', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent reviews table */}
        <motion.div {...fade(0.19)} style={card}>
          <p style={{ fontSize: 12, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Recent reviews</p>
          <div className="grid text-xs pb-2.5 mb-1"
            style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', color: 'var(--txt3)', borderBottom: '1px solid rgba(255,255,255,0.06)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <span>Review</span><span>Mood</span><span>Confidence</span><span>Date</span>
          </div>
          {d.recent_reviews.map((r, i) => (
            <div key={r.id || i} className="grid items-center py-3"
              style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', borderBottom: i < d.recent_reviews.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <span style={{ color: 'var(--txt2)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 16 }}>{r.text}</span>
              <span><MoodBadge mood={r.mood} /></span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--txt3)', fontSize: 12 }}>{r.confidence}%</span>
              <span style={{ color: 'var(--txt3)', fontSize: 12 }}>{r.date}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
