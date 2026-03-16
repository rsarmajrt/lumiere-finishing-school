import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Button, Badge, Modal, Input, Select, Confirm, SectionHead, FormRow, SearchBar, Toast } from '../components/UI'
import { Plus, Pencil, Trash2, CalendarDays, Clock, User, BookOpen } from 'lucide-react'

function ApptForm({ initial = {}, onSave, onClose, students, courses, instructors }) {
  const [form, setForm] = useState({
    studentId: initial.studentId || '',
    courseId: initial.courseId || '',
    topic: initial.topic || '',
    date: initial.date || new Date().toISOString().split('T')[0],
    time: initial.time || '10:00',
    instructor: initial.instructor || instructors[0],
    status: initial.status || 'Confirmed',
    notes: initial.notes || '',
  })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function handleSave() {
    if (!form.studentId || !form.topic || !form.date) return alert('Please fill required fields.')
    onSave({ ...initial, ...form, studentId: Number(form.studentId), courseId: Number(form.courseId) })
    onClose()
  }

  return (
    <>
      <FormRow>
        <Select label="Student" value={String(form.studentId)} onChange={set('studentId')} required
          options={students.map(s => ({ value: String(s.id), label: `${s.firstName} ${s.lastName}` }))} placeholder="Select student..." />
        <Select label="Course" value={String(form.courseId)} onChange={set('courseId')}
          options={courses.map(c => ({ value: String(c.id), label: c.name }))} placeholder="Select course..." />
      </FormRow>
      <Input label="Session Topic" value={form.topic} onChange={set('topic')} placeholder="e.g. Posture & Walk Training" required />
      <FormRow>
        <Input label="Date" type="date" value={form.date} onChange={set('date')} required />
        <Input label="Time" type="time" value={form.time} onChange={set('time')} />
      </FormRow>
      <FormRow>
        <Select label="Instructor" value={form.instructor} onChange={set('instructor')} options={instructors} />
        <Select label="Status" value={form.status} onChange={set('status')} options={['Confirmed', 'Pending', 'Cancelled']} />
      </FormRow>
      <Input label="Notes" value={form.notes} onChange={set('notes')} placeholder="Any special instructions..." rows={2} />
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>{initial.id ? 'Save Changes' : 'Book Appointment'}</Button>
      </div>
    </>
  )
}

function ApptCard({ appt, student, course, onEdit, onDelete, onStatusChange }) {
  const dateObj = new Date(appt.date + 'T00:00:00')
  const isToday = appt.date === new Date().toISOString().split('T')[0]
  const isPast = appt.date < new Date().toISOString().split('T')[0]

  return (
    <div style={{
      background: '#fff', border: `1px solid ${isToday ? '#b8924a' : '#e6e2dc'}`,
      borderRadius: '12px', padding: '20px 24px',
      display: 'flex', alignItems: 'center', gap: '20px',
      boxShadow: isToday ? '0 0 0 1px rgba(184,146,74,0.3)' : '0 2px 6px rgba(0,0,0,0.04)',
      marginBottom: '10px', transition: 'all 0.2s', opacity: isPast && appt.status === 'Cancelled' ? 0.6 : 1,
    }}>
      {/* Date block */}
      <div style={{ textAlign: 'center', minWidth: '64px', padding: '8px', background: isToday ? '#fdf5e0' : '#f8f7f5', borderRadius: '10px' }}>
        <div className="display" style={{ fontSize: '26px', fontWeight: 300, lineHeight: 1, color: isToday ? '#9a6b00' : '#0f0f0f' }}>
          {dateObj.getDate()}
        </div>
        <div style={{ fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: '#7a7570', marginTop: '2px' }}>
          {dateObj.toLocaleString('en-IN', { month: 'short' })}
        </div>
        {isToday && <div style={{ fontSize: '9px', color: '#9a6b00', fontWeight: 600, letterSpacing: '0.5px', marginTop: 2 }}>TODAY</div>}
      </div>

      <div style={{ width: 1, height: 48, background: '#e6e2dc' }} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{appt.topic}</div>
        <div style={{ fontSize: '12px', color: '#7a7570', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><User size={11} />{student?.firstName} {student?.lastName}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{appt.time}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={11} />{appt.instructor}</span>
        </div>
        {appt.notes && <div style={{ fontSize: '11px', color: '#9a6b00', marginTop: 4, background: '#fdf5e0', padding: '3px 8px', borderRadius: 4, display: 'inline-block' }}>{appt.notes}</div>}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        <Badge>{appt.status}</Badge>
        <div style={{ display: 'flex', gap: '6px' }}>
          {appt.status === 'Pending' && (
            <Button variant="success" size="sm" onClick={() => onStatusChange(appt.id, 'Confirmed')}>Confirm</Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onEdit(appt)}><Pencil size={11} /></Button>
          <Button variant="ghost" size="sm" style={{ color: '#b5290e' }} onClick={() => onDelete(appt)}><Trash2 size={11} /></Button>
        </div>
      </div>
    </div>
  )
}

export default function Schedule() {
  const { state, dispatch, INSTRUCTORS } = useApp()
  const { appointments, students, courses } = state

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('upcoming') // upcoming | today | all
  const [statusFilter, setStatusFilter] = useState('')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [confirmDel, setConfirmDel] = useState(false)
  const [toast, setToast] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  const filtered = appointments
    .filter(a => {
      const q = search.toLowerCase()
      const student = students.find(s => s.id === a.studentId)
      const matchSearch = !q || a.topic.toLowerCase().includes(q) ||
        `${student?.firstName} ${student?.lastName}`.toLowerCase().includes(q)
      const matchStatus = !statusFilter || a.status === statusFilter
      const matchTime = filter === 'today' ? a.date === today :
        filter === 'upcoming' ? a.date >= today : true
      return matchSearch && matchStatus && matchTime
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))

  function handleAdd(data) {
    dispatch({ type: 'ADD_APPOINTMENT', payload: data })
    setToast('Appointment booked')
  }
  function handleEdit(data) {
    dispatch({ type: 'UPDATE_APPOINTMENT', payload: data })
    setToast('Appointment updated')
  }
  function handleDelete() {
    dispatch({ type: 'DELETE_APPOINTMENT', payload: selected.id })
    setToast('Appointment removed')
  }
  function handleStatusChange(id, status) {
    dispatch({ type: 'UPDATE_APPOINTMENT', payload: { id, status } })
    setToast(`Appointment ${status.toLowerCase()}`)
  }

  const todayCount = appointments.filter(a => a.date === today).length
  const upcomingCount = appointments.filter(a => a.date >= today).length

  return (
    <div className="fade-in" style={{ padding: '32px' }}>
      <SectionHead
        title="Schedule"
        subtitle={`${upcomingCount} upcoming · ${todayCount} today`}
        action={<Button onClick={() => { setSelected(null); setModal('add') }}><Plus size={14} /> Book Session</Button>}
      />

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search topic or student..." />

        <div style={{ display: 'flex', background: '#fff', border: '1px solid #e6e2dc', borderRadius: '8px', overflow: 'hidden' }}>
          {[['upcoming', 'Upcoming'], ['today', 'Today'], ['all', 'All']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              style={{
                padding: '8px 16px', fontSize: '12px', border: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                background: filter === val ? '#0f0f0f' : 'transparent',
                color: filter === val ? '#fff' : '#7a7570', transition: 'all 0.15s',
              }}>{label}</button>
          ))}
        </div>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 14px', border: '1px solid #e6e2dc', borderRadius: '8px', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", background: '#fff', cursor: 'pointer' }}>
          <option value="">All Statuses</option>
          <option>Confirmed</option>
          <option>Pending</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* Appointments */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#7a7570', background: '#fff', borderRadius: '12px', border: '1px solid #e6e2dc' }}>
          <CalendarDays size={36} style={{ opacity: 0.25, marginBottom: '12px' }} />
          <p style={{ fontSize: 14 }}>No appointments found.</p>
        </div>
      ) : filtered.map(a => (
        <ApptCard
          key={a.id} appt={a}
          student={students.find(s => s.id === a.studentId)}
          course={courses.find(c => c.id === a.courseId)}
          onEdit={appt => { setSelected(appt); setModal('edit') }}
          onDelete={appt => { setSelected(appt); setConfirmDel(true) }}
          onStatusChange={handleStatusChange}
        />
      ))}

      <Modal open={modal === 'add'} onClose={() => setModal(null)} title="Book New Session" width={540}>
        <ApptForm onSave={handleAdd} onClose={() => setModal(null)} students={students} courses={courses} instructors={INSTRUCTORS} />
      </Modal>

      <Modal open={modal === 'edit'} onClose={() => setModal(null)} title="Edit Appointment" width={540}>
        {selected && <ApptForm initial={selected} onSave={handleEdit} onClose={() => setModal(null)} students={students} courses={courses} instructors={INSTRUCTORS} />}
      </Modal>

      <Confirm open={confirmDel} onClose={() => setConfirmDel(false)} onConfirm={handleDelete}
        title="Cancel Appointment"
        message={`Remove the appointment "${selected?.topic}"? This cannot be undone.`}
        confirmLabel="Remove" />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
