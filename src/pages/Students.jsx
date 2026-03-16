import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Button, Badge, Modal, Input, Select, SearchBar, Table, Avatar, Confirm, SectionHead, FormRow, Toast } from '../components/UI'
import { UserPlus, Pencil, Trash2, Eye, Phone, Mail, BookOpen } from 'lucide-react'

function StudentForm({ initial = {}, onSave, onClose, courses }) {
  const [form, setForm] = useState({
    firstName: initial.firstName || '',
    lastName: initial.lastName || '',
    email: initial.email || '',
    phone: initial.phone || '',
    courseId: initial.courseId || '',
    status: initial.status || 'Active',
    paymentStatus: initial.paymentStatus || 'Pending',
    notes: initial.notes || '',
  })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function handleSave() {
    if (!form.firstName || !form.lastName || !form.email || !form.courseId) return alert('Please fill required fields.')
    onSave({ ...initial, ...form, courseId: Number(form.courseId) })
    onClose()
  }

  return (
    <>
      <FormRow>
        <Input label="First Name" value={form.firstName} onChange={set('firstName')} placeholder="Priya" required />
        <Input label="Last Name" value={form.lastName} onChange={set('lastName')} placeholder="Sharma" required />
      </FormRow>
      <FormRow>
        <Input label="Email Address" type="email" value={form.email} onChange={set('email')} placeholder="priya@email.com" required />
        <Input label="Phone Number" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
      </FormRow>
      <FormRow>
        <Select label="Course" value={String(form.courseId)} onChange={set('courseId')} required
          options={courses.map(c => ({ value: String(c.id), label: c.name }))} placeholder="Select course..." />
        <Select label="Status" value={form.status} onChange={set('status')}
          options={['Active', 'Inactive']} />
      </FormRow>
      <Select label="Payment Status" value={form.paymentStatus} onChange={set('paymentStatus')}
        options={['Paid', 'Pending', 'Overdue']} />
      <Input label="Notes" value={form.notes} onChange={set('notes')} placeholder="Additional notes..." rows={3} />
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>{initial.id ? 'Save Changes' : 'Enroll Student'}</Button>
      </div>
    </>
  )
}

function StudentDetail({ student, course, onClose, onEdit, onDelete }) {
  return (
    <>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
        <Avatar initials={student.avatar} size={56} bg="#f0ede8" />
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 500 }}>{student.firstName} {student.lastName}</h3>
          <p style={{ fontSize: '13px', color: '#7a7570' }}>{course?.name}</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Badge>{student.status}</Badge>
          <Badge>{student.paymentStatus}</Badge>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
        {[
          { icon: Mail, label: 'Email', val: student.email },
          { icon: Phone, label: 'Phone', val: student.phone },
          { icon: BookOpen, label: 'Course', val: course?.name },
          { icon: BookOpen, label: 'Enrolled', val: new Date(student.enrolled).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
        ].map(({ icon: Icon, label, val }) => (
          <div key={label} style={{ background: '#f8f7f5', borderRadius: '8px', padding: '12px 14px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: '#7a7570', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '13px', fontWeight: 400, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon size={13} color="#7a7570" />{val}
            </div>
          </div>
        ))}
      </div>

      {student.notes && (
        <div style={{ background: '#fdf5e0', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#9a6b00', marginBottom: '4px' }}>Notes</div>
          <div style={{ fontSize: '13px', color: '#3a3a3a' }}>{student.notes}</div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <Button variant="outline" size="sm" onClick={onDelete} style={{ color: '#b5290e', borderColor: '#b5290e' }}>
          <Trash2 size={13} /> Delete
        </Button>
        <Button size="sm" onClick={onEdit}><Pencil size={13} /> Edit</Button>
      </div>
    </>
  )
}

export default function Students() {
  const { state, dispatch } = useApp()
  const { students, courses } = state

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [modal, setModal] = useState(null) // null | 'add' | 'edit' | 'view'
  const [selected, setSelected] = useState(null)
  const [confirmDel, setConfirmDel] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const filtered = students.filter(s => {
    const q = search.toLowerCase()
    const matches = !q || `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(q)
    const statMatch = !statusFilter || s.status === statusFilter
    const courseMatch = !courseFilter || s.courseId === Number(courseFilter)
    return matches && statMatch && courseMatch
  })

  function handleAdd(data) {
    dispatch({ type: 'ADD_STUDENT', payload: { ...data, enrolled: new Date().toISOString().split('T')[0] } })
    showToast('Student enrolled successfully')
  }
  function handleEdit(data) {
    dispatch({ type: 'UPDATE_STUDENT', payload: data })
    showToast('Student updated')
  }
  function handleDelete() {
    dispatch({ type: 'DELETE_STUDENT', payload: selected.id })
    setModal(null); setSelected(null)
    showToast('Student removed')
  }

  const cols = [
    {
      header: 'Student', key: 'name',
      render: s => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Avatar initials={s.avatar} size={32} />
          <div>
            <div style={{ fontWeight: 500, fontSize: 13 }}>{s.firstName} {s.lastName}</div>
            <div style={{ fontSize: 11, color: '#7a7570' }}>{s.email}</div>
          </div>
        </div>
      )
    },
    { header: 'Course', render: s => courses.find(c => c.id === s.courseId)?.name || '—' },
    { header: 'Enrolled', render: s => new Date(s.enrolled).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }), style: { color: '#7a7570', fontSize: 12 } },
    { header: 'Status', render: s => <Badge>{s.status}</Badge> },
    { header: 'Payment', render: s => <Badge>{s.paymentStatus}</Badge> },
    {
      header: 'Actions', render: s => (
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button variant="outline" size="sm" onClick={e => { e.stopPropagation(); setSelected(s); setModal('view') }}><Eye size={12} /></Button>
          <Button variant="outline" size="sm" onClick={e => { e.stopPropagation(); setSelected(s); setModal('edit') }}><Pencil size={12} /></Button>
          <Button variant="ghost" size="sm" style={{ color: '#b5290e' }} onClick={e => { e.stopPropagation(); setSelected(s); setConfirmDel(true) }}><Trash2 size={12} /></Button>
        </div>
      )
    },
  ]

  return (
    <div className="fade-in" style={{ padding: '32px' }}>
      <SectionHead
        title="Students"
        subtitle={`${students.length} total · ${students.filter(s => s.status === 'Active').length} active`}
        action={<Button onClick={() => setModal('add')}><UserPlus size={14} /> Enroll Student</Button>}
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 14px', border: '1px solid #e6e2dc', borderRadius: '8px', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", background: '#fff', color: '#0f0f0f', cursor: 'pointer' }}>
          <option value="">All Statuses</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)}
          style={{ padding: '8px 14px', border: '1px solid #e6e2dc', borderRadius: '8px', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", background: '#fff', color: '#0f0f0f', cursor: 'pointer' }}>
          <option value="">All Courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {(search || statusFilter || courseFilter) && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter(''); setCourseFilter('') }}>Clear filters</Button>
        )}
      </div>

      <Table
        columns={cols}
        data={filtered}
        onRowClick={s => { setSelected(s); setModal('view') }}
        emptyMessage="No students match your filters."
      />

      {/* Modals */}
      <Modal open={modal === 'add'} onClose={() => setModal(null)} title="Enroll New Student" width={540}>
        <StudentForm onSave={handleAdd} onClose={() => setModal(null)} courses={courses} />
      </Modal>

      <Modal open={modal === 'edit'} onClose={() => setModal(null)} title="Edit Student" width={540}>
        {selected && <StudentForm initial={selected} onSave={handleEdit} onClose={() => setModal(null)} courses={courses} />}
      </Modal>

      <Modal open={modal === 'view'} onClose={() => setModal(null)} title="Student Profile" width={500}>
        {selected && (
          <StudentDetail
            student={selected}
            course={courses.find(c => c.id === selected.courseId)}
            onClose={() => setModal(null)}
            onEdit={() => setModal('edit')}
            onDelete={() => { setModal(null); setConfirmDel(true) }}
          />
        )}
      </Modal>

      <Confirm
        open={confirmDel} onClose={() => setConfirmDel(false)}
        onConfirm={handleDelete}
        title="Remove Student"
        message={`Are you sure you want to remove ${selected?.firstName} ${selected?.lastName}? This action cannot be undone.`}
        confirmLabel="Remove"
      />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
