import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts'
import { reportService } from '../services/api'
import StatCard from '../components/ui/StatCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const MOOD_COLORS = {
  Normal: '#10B981', Stress: '#F59E0B', Bipolar: '#A78BFA',
  Suicidal: '#EF4444', Anxiety: '#60A5FA', Depression: '#FB923C', Personality: '#2DD4BF',
}

const demoSummary = {
  total_reviews: 28, average_confidence: 92.4, most_common_mood: 'Normal',
  mood_distribution: [
    { mood: 'Normal', count: 16 }, { mood: 'Stress', count: 5 },
    { mood: 'Bipolar', count: 4 }, { mood: 'Suicidal', count: 3 },
  ],
  confidence_trend: [
    { week: 'W1', avg: 85.2 }, { week: 'W2', avg: 88.4 },
    { week: 'W3', avg: 90.1 }, { week: 'W4', avg: 92.4 },
  ],
}

const card = {
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 16, padding: '20px 22px', backdropFilter: 'blur(12px)',
}

const TS = {
  contentStyle: { background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12 },
  labelStyle: { color: 'var(--txt2)' },
}

export default function Reports() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reportService.getSummary()
      .then(r => setData(r.data))
      .catch(() => setData(demoSummary))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center items-center" style={{ minHeight: '100vh' }}><LoadingSpinner size={28} /></div>

  const d = data || demoSummary

  return (
    <div className="p-7" style={{ maxWidth: 1020 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <p style={{ fontSize: 12, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Analytics</p>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--txt1)', marginBottom: 4 }}>Reports</h1>
        <p style={{ fontSize: 14, color: 'var(--txt3)' }}>Your mental health trends visualized.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Total Reviews"    value={d.total_reviews}            sub="All time" />
        <StatCard label="Avg Confidence"   value={`${d.average_confidence}%`} sub="Across all entries" subColor="var(--success)" />
        <StatCard label="Most Common Mood" value={d.most_common_mood}         sub="Last 30 days" />
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Pie */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={card}>
          <p style={{ fontSize: 12, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>Mood distribution</p>
          <div className="flex items-center gap-6 justify-center">
            <PieChart width={130} height={130}>
              <Pie data={d.mood_distribution} cx={65} cy={65} innerRadius={36} outerRadius={58} dataKey="count" paddingAngle={4}>
                {d.mood_distribution.map(e => <Cell key={e.mood} fill={MOOD_COLORS[e.mood] || '#7C5CFC'} />)}
              </Pie>
              <Tooltip {...TS} />
            </PieChart>
            <div className="flex flex-col gap-2.5">
              {d.mood_distribution.map(e => (
                <div key={e.mood} className="flex items-center gap-2" style={{ fontSize: 12, color: 'var(--txt2)' }}>
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: MOOD_COLORS[e.mood] || '#7C5CFC' }} />
                  {e.mood}
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--txt3)', marginLeft: 'auto', paddingLeft: 10 }}>
                    {e.count} ({Math.round((e.count / d.total_reviews) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={card}>
          <p style={{ fontSize: 12, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>Mood frequency</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={d.mood_distribution} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
              <XAxis dataKey="mood" tick={{ fontSize: 10, fill: 'var(--txt3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--txt3)' }} axisLine={false} tickLine={false} />
              <Tooltip {...TS} />
              <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                {d.mood_distribution.map(e => <Cell key={e.mood} fill={MOOD_COLORS[e.mood] || '#7C5CFC'} fillOpacity={0.9} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Area trend */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={card}>
        <p style={{ fontSize: 12, color: 'var(--txt3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>Confidence over time</p>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={d.confidence_trend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="15%" stopColor="#7C5CFC" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--txt3)' }} axisLine={false} tickLine={false} />
            <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: 'var(--txt3)' }} axisLine={false} tickLine={false} />
            <Tooltip {...TS} formatter={v => [`${v}%`, 'Avg confidence']} />
            <Area type="monotone" dataKey="avg" stroke="#7C5CFC" strokeWidth={2.5} fill="url(#rg)" dot={{ fill: '#7C5CFC', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#7C5CFC', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
