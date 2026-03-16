import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Button, Badge, Modal, Input, Select, Card, StatCard, Confirm, SectionHead, FormRow, SearchBar, Table, Toast } from '../components/UI'
import { Plus, Download, Send, Check, TrendingUp, AlertCircle, Clock, IndianRupee } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

function InvoiceForm({ initial = {}, onSave, onClose, students, courses }) {
  const [form, setForm] = useState({
    studentId: initial.studentId || '',
    courseId: initial.courseId || '',
    amount: initial.amount || '',
    issued: initial.issued || new Date().toISOString().split('T')[0],
    due: initial.due || '',
    status: initial.status || 'Pending',
  })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  // Auto-fill amount when course selected
  function handleCourseChange(e) {
    const cId = Number(e.target.value)
    const course = courses.find(c => c.id === cId)
    setForm(f => ({ ...f, courseId: String(cId), amount: course?.price || f.amount }))
  }

  function handleSave() {
    if (!form.studentId || !form.courseId || !form.amount) return alert('Please fill required fields.')
    onSave({ ...initial, ...form, studentId: Number(form.studentId), courseId: Number(form.courseId), amount: Number(form.amount) })
    onClose()
  }

  return (
    <>
      <FormRow>
        <Select label="Student" value={String(form.studentId)} onChange={set('studentId')} required
          options={students.map(s => ({ value: String(s.id), label: `${s.firstName} ${s.lastName}` }))} placeholder="Select student..." />
        <Select label="Course" value={String(form.courseId)} onChange={handleCourseChange}
          options={courses.map(c => ({ value: String(c.id), label: c.name }))} placeholder="Select course..." />
      </FormRow>
      <FormRow>
        <Input label="Amount (₹)" type="number" value={form.amount} onChange={set('amount')} placeholder="35000" required />
        <Select label="Status" value={form.status} onChange={set('status')} options={['Pending', 'Paid', 'Overdue']} />
      </FormRow>
      <FormRow>
        <Input label="Issue Date" type="date" value={form.issued} onChange={set('issued')} />
        <Input label="Due Date" type="date" value={form.due} onChange={set('due')} />
      </FormRow>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>{initial.id ? 'Save Changes' : 'Generate Invoice'}</Button>
      </div>
    </>
  )
}

function InvoiceDetail({ invoice, student, course, onClose, onMarkPaid }) {
  return (
    <>
      <div style={{ background: '#f8f7f5', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7a7570', marginBottom: '4px' }}>Invoice</div>
            <div className="display" style={{ fontSize: '22px', fontWeight: 400 }}>{invoice.id}</div>
          </div>
          <Badge>{invoice.status}</Badge>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {[
          ['Student', `${student?.firstName} ${student?.lastName}`],
          ['Course', course?.name],
          ['Amount', `₹${invoice.amount?.toLocaleString()}`],
          ['Issued', invoice.issued],
          ['Due Date', invoice.due],
          ['Paid On', invoice.paidOn || '—'],
        ].map(([label, val]) => (
          <div key={label} style={{ background: '#f8f7f5', borderRadius: '8px', padding: '12px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: '#7a7570', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '13px', fontWeight: 500 }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <Button variant="outline" onClick={onClose}><Download size={13} /> Download PDF</Button>
        {invoice.status !== 'Paid' && (
          <Button variant="success" onClick={() => { onMarkPaid(invoice.id); onClose() }}>
            <Check size={13} /> Mark as Paid
          </Button>
        )}
      </div>
    </>
  )
}

export default function Payments() {
  const { state, dispatch } = useApp()
  const { invoices, students, courses } = state

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState(null)

  const filtered = invoices.filter(inv => {
    const student = students.find(s => s.id === inv.studentId)
    const q = search.toLowerCase()
    const matchSearch = !q || inv.id.toLowerCase().includes(q) ||
      `${student?.firstName} ${student?.lastName}`.toLowerCase().includes(q)
    const matchStatus = !statusFilter || inv.status === statusFilter
    return matchSearch && matchStatus
  }).sort((a, b) => b.issued?.localeCompare(a.issued))

  // Stats
  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)
  const totalPending = invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amount, 0)
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0)
  const paidCount = invoices.filter(i => i.status === 'Paid').length

  const pieData = [
    { name: 'Paid', value: totalPaid },
    { name: 'Pending', value: totalPending },
    { name: 'Overdue', value: totalOverdue },
  ].filter(d => d.value > 0)

  const PIE_COLORS = ['#1a6b3c', '#b8924a', '#b5290e']

  function handleAdd(data) {
    dispatch({ type: 'ADD_INVOICE', payload: data })
    setToast('Invoice generated')
  }
  function handleMarkPaid(id) {
    dispatch({ type: 'MARK_PAID', payload: id })
    setToast('Invoice marked as paid')
  }

  const cols = [
    { header: 'Invoice #', key: 'id', style: { fontWeight: 600, fontSize: 12, color: '#7a7570' } },
    {
      header: 'Student', render: inv => {
        const s = students.find(st => st.id === inv.studentId)
        return s ? `${s.firstName} ${s.lastName}` : '—'
      }
    },
    { header: 'Course', render: inv => courses.find(c => c.id === inv.courseId)?.name || '—', style: { fontSize: 12, color: '#7a7570' } },
    {
      header: 'Amount',
      render: inv => <span className="display" style={{ fontSize: 16 }}>₹{inv.amount?.toLocaleString()}</span>
    },
    { header: 'Issued', render: inv => inv.issued, style: { fontSize: 12, color: '#7a7570' } },
    { header: 'Due', render: inv => inv.due || '—', style: { fontSize: 12, color: '#7a7570' } },
    { header: 'Status', render: inv => <Badge>{inv.status}</Badge> },
    {
      header: 'Actions',
      render: inv => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button variant="outline" size="sm" onClick={e => { e.stopPropagation(); setSelected(inv); setModal('view') }}>
            View
          </Button>
          {inv.status !== 'Paid' && (
            <Button variant="success" size="sm" onClick={e => { e.stopPropagation(); handleMarkPaid(inv.id) }}>
              <Check size={11} /> Paid
            </Button>
          )}
          {inv.status !== 'Paid' && (
            <Button variant="outline" size="sm" onClick={e => e.stopPropagation()} style={{ color: '#1a4d7a', borderColor: '#1a4d7a' }}>
              <Send size={11} />
            </Button>
          )}
        </div>
      )
    },
  ]

  return (
    <div className="fade-in" style={{ padding: '32px' }}>
      <SectionHead
        title="Payments & Invoices"
        subtitle="Track fees, generate invoices, and manage dues"
        action={<Button onClick={() => setModal('add')}><Plus size={14} /> Generate Invoice</Button>}
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total Collected" value={`₹${(totalPaid/1000).toFixed(0)}K`} sub={`${paidCount} invoices paid`} icon={TrendingUp} accent="#b8924a" />
        <StatCard label="Pending" value={`₹${(totalPending/1000).toFixed(0)}K`} sub={`${invoices.filter(i=>i.status==='Pending').length} invoice(s)`} icon={Clock} />
        <StatCard label="Overdue" value={`₹${(totalOverdue/1000).toFixed(0)}K`} sub="Immediate action needed" icon={AlertCircle} accent={totalOverdue > 0 ? '#b5290e' : undefined} />
        <StatCard label="Total Invoiced" value={`₹${((totalPaid+totalPending+totalOverdue)/1000).toFixed(0)}K`} sub="All time" icon={IndianRupee} />
      </div>

      {/* Chart + Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '24px' }}>
        <Card>
          <h3 className="display" style={{ fontSize: '18px', fontWeight: 400, marginBottom: '16px' }}>Revenue Split</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={v => [`₹${v.toLocaleString()}`, '']} contentStyle={{ borderRadius: 8, border: '1px solid #e6e2dc', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
            {pieData.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i] }} />
                  <span style={{ color: '#7a7570' }}>{d.name}</span>
                </span>
                <span style={{ fontWeight: 500 }}>₹{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Overdue Alert */}
        <Card style={{ background: totalOverdue > 0 ? '#fdf0ed' : '#e8f4ee', border: `1px solid ${totalOverdue > 0 ? '#f0d0ca' : '#c0ddc8'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <AlertCircle size={20} color={totalOverdue > 0 ? '#b5290e' : '#1a6b3c'} />
            <h3 className="display" style={{ fontSize: '18px', fontWeight: 400, color: totalOverdue > 0 ? '#b5290e' : '#1a6b3c' }}>
              {totalOverdue > 0 ? 'Overdue Invoices Require Attention' : 'All Payments Up to Date'}
            </h3>
          </div>
          {invoices.filter(i => i.status === 'Overdue').map(inv => {
            const student = students.find(s => s.id === inv.studentId)
            return (
              <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{student?.firstName} {student?.lastName}</div>
                  <div style={{ fontSize: 11, color: '#7a7570' }}>{inv.id} · Due: {inv.due}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="display" style={{ fontSize: 16 }}>₹{inv.amount.toLocaleString()}</span>
                  <Button variant="danger" size="sm" onClick={() => handleMarkPaid(inv.id)}><Check size={11} /> Mark Paid</Button>
                </div>
              </div>
            )
          })}
          {totalOverdue === 0 && <p style={{ fontSize: 13, color: '#1a6b3c' }}>No outstanding dues. Great job!</p>}
        </Card>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search invoice or student..." />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 14px', border: '1px solid #e6e2dc', borderRadius: '8px', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", background: '#fff', cursor: 'pointer' }}>
          <option value="">All Statuses</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Overdue</option>
        </select>
      </div>

      <Table
        columns={cols}
        data={filtered}
        onRowClick={inv => { setSelected(inv); setModal('view') }}
        emptyMessage="No invoices match your filters."
      />

      <Modal open={modal === 'add'} onClose={() => setModal(null)} title="Generate Invoice" width={520}>
        <InvoiceForm onSave={handleAdd} onClose={() => setModal(null)} students={students} courses={courses} />
      </Modal>

      <Modal open={modal === 'view'} onClose={() => setModal(null)} title="Invoice Details" width={480}>
        {selected && (
          <InvoiceDetail
            invoice={selected}
            student={students.find(s => s.id === selected.studentId)}
            course={courses.find(c => c.id === selected.courseId)}
            onClose={() => setModal(null)}
            onMarkPaid={handleMarkPaid}
          />
        )}
      </Modal>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
