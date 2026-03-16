import { useApp } from '../context/AppContext'
import { StatCard, Card } from '../components/UI'
import { Users, BookOpen, TrendingUp, AlertCircle, CalendarDays } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const COLORS = ['#b8924a', '#4a7c59', '#4a6b8a', '#8a4a6b']

const revenueData = [
  { month: 'Oct', revenue: 48000 },
  { month: 'Nov', revenue: 62000 },
  { month: 'Dec', revenue: 55000 },
  { month: 'Jan', revenue: 82000 },
  { month: 'Feb', revenue: 76000 },
  { month: 'Mar', revenue: 94000 },
]

export default function Dashboard({ onNavigate }) {
  const { state } = useApp()
  const { students, courses, appointments, invoices } = state

  const activeStudents = students.filter(s => s.status === 'Active').length
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)
  const pendingAmt = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((s, i) => s + i.amount, 0)
  const overdueCount = invoices.filter(i => i.status === 'Overdue').length

  const today = new Date().toISOString().split('T')[0]
  const todayAppts = appointments.filter(a => a.date === today)
  const upcomingAppts = appointments.filter(a => a.date >= today).slice(0, 5)

  const courseEnrollData = courses.map(c => ({
    name: c.name.split(' ')[0],
    enrolled: students.filter(s => s.courseId === c.id).length,
    capacity: c.capacity,
  }))

  const statusData = [
    { name: 'Active', value: students.filter(s => s.status === 'Active').length },
    { name: 'Inactive', value: students.filter(s => s.status === 'Inactive').length },
  ]

  const activities = [
    { text: `${students[students.length - 1]?.firstName} ${students[students.length - 1]?.lastName} enrolled in ${courses.find(c => c.id === students[students.length - 1]?.courseId)?.name}`, time: '2h ago', dot: '#b8924a' },
    { text: 'Invoice INV-006 marked as paid — ₹18,000', time: 'Yesterday', dot: '#4a7c59' },
    { text: 'New appointment booked: Leadership Persona Workshop', time: 'Yesterday', dot: '#4a6b8a' },
    { text: `Overdue notice: ${overdueCount} invoice(s) pending action`, time: '2 days ago', dot: '#b5290e' },
    { text: 'Course "Complete Grooming" batch March 2026 started', time: '4 days ago', dot: '#b8924a' },
  ]

  return (
    <div className="fade-in" style={{ padding: '32px' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Total Students" value={students.length} sub={`${activeStudents} currently active`} icon={Users} />
        <StatCard label="Active Courses" value={courses.length} sub="Across all programs" icon={BookOpen} />
        <StatCard label="Revenue Collected" value={`₹${(totalRevenue / 1000).toFixed(0)}K`} sub="Current academic year" icon={TrendingUp} accent="#b8924a" />
        <StatCard label="Outstanding Dues" value={`₹${(pendingAmt / 1000).toFixed(0)}K`} sub={`${overdueCount} overdue invoice(s)`} icon={AlertCircle} accent={overdueCount > 0 ? '#b5290e' : undefined} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="display" style={{ fontSize: '18px', fontWeight: 400 }}>Revenue Trend</h3>
            <span style={{ fontSize: '11px', color: '#7a7570', background: '#f8f7f5', padding: '4px 10px', borderRadius: '20px' }}>Last 6 Months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7a7570' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#7a7570' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} />
              <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #e6e2dc', fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#b8924a" strokeWidth={2.5} dot={{ fill: '#b8924a', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="display" style={{ fontSize: '18px', fontWeight: 400, marginBottom: '20px' }}>Student Status</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                {statusData.map((_, i) => <Cell key={i} fill={['#1a6b3c','#e6e2dc'][i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e6e2dc', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
            {statusData.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: ['#1a6b3c','#e6e2dc'][i] }} />
                <span style={{ color: '#7a7570' }}>{d.name}: </span>
                <span style={{ fontWeight: 500 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
        {/* Course Enrollment */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="display" style={{ fontSize: '18px', fontWeight: 400 }}>Course Enrollment</h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={courseEnrollData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7a7570' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#7a7570' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e6e2dc', fontSize: 12 }} />
              <Bar dataKey="enrolled" fill="#b8924a" radius={[4,4,0,0]} name="Enrolled" />
              <Bar dataKey="capacity" fill="#f0ede8" radius={[4,4,0,0]} name="Capacity" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Activity Feed + Upcoming */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="display" style={{ fontSize: '18px', fontWeight: 400 }}>Upcoming Sessions</h3>
            <button onClick={() => onNavigate('schedule')}
              style={{ fontSize: '11px', color: '#b8924a', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.5px' }}>
              View all →
            </button>
          </div>
          {upcomingAppts.length === 0 ? (
            <p style={{ fontSize: 13, color: '#7a7570' }}>No upcoming sessions.</p>
          ) : upcomingAppts.map((a, i) => {
            const student = state.students.find(s => s.id === a.studentId)
            const course = state.courses.find(c => c.id === a.courseId)
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 0', borderBottom: i < upcomingAppts.length - 1 ? '1px solid #f0ede8' : 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '8px', background: '#f8f7f5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <CalendarDays size={14} color="#b8924a" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.topic}</div>
                  <div style={{ fontSize: 11, color: '#7a7570' }}>{student?.firstName} {student?.lastName} · {a.time}</div>
                </div>
                <div style={{ fontSize: 11, color: '#7a7570', flexShrink: 0 }}>{new Date(a.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</div>
              </div>
            )
          })}
        </Card>
      </div>

      {/* Recent Activity */}
      <Card style={{ marginTop: '20px' }}>
        <h3 className="display" style={{ fontSize: '18px', fontWeight: 400, marginBottom: '16px' }}>Recent Activity</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0 32px' }}>
          {activities.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f0ede8' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.dot, marginTop: 6, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>{a.text}</div>
                <div style={{ fontSize: 11, color: '#7a7570', marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
