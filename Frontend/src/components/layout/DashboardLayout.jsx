import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  return (
    <div className="flex" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 overflow-auto" style={{ position: 'relative' }}>
        <Outlet />
      </main>
    </div>
  )
}
