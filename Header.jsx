import { Bell, Menu } from 'lucide-react'
import { useApp } from '../context/AppContext'

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  students: 'Students',
  courses: 'Courses',
  schedule: 'Schedule',
  payments: 'Payments',
  settings: 'Settings',
}

export default function Header({ page, sidebarWidth, onMenuToggle }) {
  const { state } = useApp()
  const overdueCount = state.invoices.filter(i => i.status === 'Overdue').length

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header style={{
      height: '64px', background: '#fff', borderBottom: '1px solid #e6e2dc',
      padding: '0 32px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 0 #e6e2dc',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={onMenuToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a7570', display: 'flex', padding: 4 }}>
          <Menu size={18} />
        </button>
        <h1 className="display" style={{ fontSize: '22px', fontWeight: 400, letterSpacing: '0.3px' }}>
          {PAGE_TITLES[page] || page}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ fontSize: '12px', color: '#7a7570', display: 'none' }} className="date-label">{today}</div>
        
        {/* Notifications */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={17} color="#7a7570" />
          {overdueCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              background: '#b5290e', color: '#fff', borderRadius: '50%',
              width: 14, height: 14, fontSize: 9, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 600,
            }}>{overdueCount}</span>
          )}
        </div>

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: '#0f0f0f', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px',
          }}>AD</div>
          <div style={{ display: 'none' }}>
            <div style={{ fontSize: '13px', fontWeight: 500 }}>Admin</div>
            <div style={{ fontSize: '11px', color: '#7a7570' }}>Principal</div>
          </div>
        </div>
      </div>
    </header>
  )
}
