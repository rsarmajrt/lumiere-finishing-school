import { useState } from 'react'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Courses from './pages/Courses'
import Schedule from './pages/Schedule'
import Payments from './pages/Payments'
import Settings from './pages/Settings'

function Layout() {
  const [page, setPage] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  const sidebarWidth = collapsed ? 64 : 220

  const PAGES = {
    dashboard: Dashboard,
    students: Students,
    courses: Courses,
    schedule: Schedule,
    payments: Payments,
    settings: Settings,
  }

  const Page = PAGES[page] || Dashboard

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f7f5' }}>
      <Sidebar
        active={page}
        onNavigate={setPage}
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
      />

      <div style={{
        flex: 1, marginLeft: sidebarWidth,
        transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
      }}>
        <Header page={page} sidebarWidth={sidebarWidth} onMenuToggle={() => setCollapsed(c => !c)} />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Page onNavigate={setPage} />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  )
}
