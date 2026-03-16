import { useState } from 'react'
import { LayoutDashboard, Users, BookOpen, CalendarDays, CreditCard, ChevronLeft, ChevronRight, GraduationCap, Settings, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'students', label: 'Students', Icon: Users },
  { id: 'courses', label: 'Courses', Icon: BookOpen },
  { id: 'schedule', label: 'Schedule', Icon: CalendarDays },
  { id: 'payments', label: 'Payments', Icon: CreditCard },
]

const BOTTOM_ITEMS = [
  { id: 'settings', label: 'Settings', Icon: Settings },
]

export default function Sidebar({ active, onNavigate, collapsed, onToggle }) {
  return (
    <aside style={{
      width: collapsed ? 64 : 220, minHeight: '100vh',
      background: '#0f0f0f', color: '#fff',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 200,
      transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
      boxShadow: '2px 0 20px rgba(0,0,0,0.15)',
    }}>
      {/* Brand */}
      <div style={{ padding: collapsed ? '24px 0' : '28px 22px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        {collapsed ? (
          <div style={{ textAlign: 'center' }}>
            <GraduationCap size={22} color="#b8924a" />
          </div>
        ) : (
          <>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '21px', fontWeight: 300, letterSpacing: '2px', whiteSpace: 'nowrap' }}>Lumière</div>
            <div style={{ fontSize: '9px', letterSpacing: '4px', color: '#b8924a', marginTop: '3px', whiteSpace: 'nowrap' }}>FINISHING SCHOOL</div>
          </>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button key={id} onClick={() => onNavigate(id)}
              title={collapsed ? label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                width: '100%', padding: collapsed ? '11px 0' : '11px 22px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: isActive ? 'rgba(184,146,74,0.15)' : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                border: 'none', cursor: 'pointer',
                borderLeft: `2px solid ${isActive ? '#b8924a' : 'transparent'}`,
                fontSize: '13px', fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                letterSpacing: '0.4px', whiteSpace: 'nowrap', overflow: 'hidden',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent' } }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              {!collapsed && label}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '8px 0' }}>
        {BOTTOM_ITEMS.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => onNavigate(id)}
            title={collapsed ? label : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              width: '100%', padding: collapsed ? '10px 0' : '10px 22px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: 'transparent', color: 'rgba(255,255,255,0.4)',
              border: 'none', cursor: 'pointer',
              fontSize: '13px', fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
              whiteSpace: 'nowrap', overflow: 'hidden', transition: 'color 0.18s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <Icon size={15} style={{ flexShrink: 0 }} />
            {!collapsed && label}
          </button>
        ))}

        {/* Toggle */}
        <button onClick={onToggle}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            width: '100%', padding: collapsed ? '10px 0' : '10px 22px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            background: 'transparent', color: 'rgba(255,255,255,0.3)',
            border: 'none', cursor: 'pointer',
            fontSize: '11px', fontFamily: "'DM Sans', sans-serif",
            whiteSpace: 'nowrap', overflow: 'hidden', transition: 'color 0.18s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
        >
          {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  )
}
