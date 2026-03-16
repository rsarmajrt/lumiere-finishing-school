import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Button, Badge, Modal, Input, Select, Card, Confirm, SectionHead, FormRow, ProgressBar, Toast } from '../components/UI'
import { Plus, Pencil, Trash2, Users, Clock, BookOpen } from 'lucide-react'

const COURSE_COLORS = ['#b8924a', '#4a7c59', '#4a6b8a', '#8a4a6b', '#6b4a8a', '#4a8a6b']

function CourseForm({ initial = {}, onSave, onClose, instructors }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    duration: initial.duration || '',
    sessions: initial.sessions || '',
    price: initial.price || '',
    capacity: initial.capacity || '',
    instructor: initial.instructor || instructors[0],
    description: initial.description || '',
    topics: initial.topics?.join(', ') || '',
    color: initial.color || COURSE_COLORS[0],
  })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function handleSave() {
    if (!form.name || !form.price || !form.capacity) return alert('Please fill required fields.')
    onSave({
      ...initial, ...form,
      sessions: Number(form.sessions),
      price: Number(form.price),
      capacity: Number(form.capacity),
      topics: form.topics.split(',').map(t => t.trim()).filter(Boolean),
    })
    onClose()
  }

  return (
    <>
      <Input label="Course Name" value={form.name} onChange={set('name')} placeholder="e.g. Bridal Grooming Masterclass" required />
      <Input label="Description" value={form.description} onChange={set('description')} placeholder="Brief course overview..." rows={2} />
      <FormRow>
        <Input label="Duration" value={form.duration} onChange={set('duration')} placeholder="e.g. 4 Weeks" />
        <Input label="Total Sessions" type="number" value={form.sessions} onChange={set('sessions')} placeholder="12" />
      </FormRow>
      <FormRow>
        <Input label="Fee (₹)" type="number" value={form.price} onChange={set('price')} placeholder="20000" required />
        <Input label="Seat Capacity" type="number" value={form.capacity} onChange={set('capacity')} placeholder="10" required />
      </FormRow>
      <Select label="Lead Instructor" value={form.instructor} onChange={set('instructor')} options={instructors} />
      <Input label="Topics (comma separated)" value={form.topics} onChange={set('topics')} placeholder="Grooming, Etiquette, Confidence, Poise" />
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#7a7570', marginBottom: '8px', fontWeight: 500 }}>Accent Color</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {COURSE_COLORS.map(c => (
            <div key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{
              width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer',
              border: form.color === c ? '3px solid #0f0f0f' : '3px solid transparent',
              transition: 'border 0.15s',
            }} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>{initial.id ? 'Save Changes' : 'Create Course'}</Button>
      </div>
    </>
  )
}

function CourseCard({ course, enrolled, onEdit, onDelete, onView }) {
  const pct = Math.round((enrolled / course.capacity) * 100)
  const [hov, setHov] = useState(false)

  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff', border: '1px solid #e6e2dc', borderRadius: '14px',
        overflow: 'hidden', transition: 'all 0.2s',
        boxShadow: hov ? '0 8px 28px rgba(0,0,0,0.09)' : '0 2px 8px rgba(0,0,0,0.04)',
      }}>
      {/* Top stripe */}
      <div style={{ height: '4px', background: course.color }} />
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h3 className="display" style={{ fontSize: '20px', fontWeight: 400, lineHeight: 1.2 }}>{course.name}</h3>
          <span style={{ fontSize: '11px', background: '#f8f7f5', color: '#7a7570', padding: '3px 10px', borderRadius: '20px', flexShrink: 0, marginLeft: 8 }}>
            {course.duration}
          </span>
        </div>
        <p style={{ fontSize: '12px', color: '#7a7570', marginBottom: '16px', lineHeight: 1.5 }}>{course.description}</p>

        <div className="display" style={{ fontSize: '26px', fontWeight: 300, marginBottom: '4px' }}>
          ₹{course.price.toLocaleString()} <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7a7570' }}>per student</span>
        </div>

        <div style={{ display: 'flex', gap: '16px', margin: '14px 0', fontSize: '12px', color: '#7a7570' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {course.sessions} sessions</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} /> {enrolled}/{course.capacity} students</span>
        </div>

        <ProgressBar value={enrolled} max={course.capacity} color={course.color} />

        {/* Topics */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '14px 0' }}>
          {course.topics.map(t => (
            <span key={t} style={{ background: '#f8f7f5', border: '1px solid #e6e2dc', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', color: '#7a7570' }}>{t}</span>
          ))}
        </div>

        <div style={{ fontSize: '12px', color: '#7a7570', marginBottom: '14px' }}>
          <BookOpen size={11} style={{ display: 'inline', marginRight: 4 }} />{course.instructor}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" size="sm" onClick={onView} style={{ flex: 1 }}><Users size={12} /> Students</Button>
          <Button variant="outline" size="sm" onClick={onEdit}><Pencil size={12} /></Button>
          <Button variant="ghost" size="sm" style={{ color: '#b5290e' }} onClick={onDelete}><Trash2 size={12} /></Button>
        </div>
      </div>
    </div>
  )
}

export default function Courses({ onNavigate }) {
  const { state, dispatch, INSTRUCTORS } = useApp()
  const { courses, students } = state

  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [confirmDel, setConfirmDel] = useState(false)
  const [toast, setToast] = useState(null)
  const [viewStudentsFor, setViewStudentsFor] = useState(null)

  const showToast = msg => setToast(msg)

  function handleAdd(data) {
    dispatch({ type: 'ADD_COURSE', payload: data })
    showToast('Course created successfully')
  }
  function handleEdit(data) {
    dispatch({ type: 'UPDATE_COURSE', payload: data })
    showToast('Course updated')
  }
  function handleDelete() {
    dispatch({ type: 'DELETE_COURSE', payload: selected.id })
    showToast('Course deleted')
  }

  const courseStudents = viewStudentsFor ? students.filter(s => s.courseId === viewStudentsFor.id) : []

  return (
    <div className="fade-in" style={{ padding: '32px' }}>
      <SectionHead
        title="Courses & Curriculum"
        subtitle={`${courses.length} programs · ${students.length} students enrolled`}
        action={<Button onClick={() => setModal('add')}><Plus size={14} /> Add Course</Button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {courses.map(c => (
          <CourseCard
            key={c.id} course={c}
            enrolled={students.filter(s => s.courseId === c.id).length}
            onEdit={() => { setSelected(c); setModal('edit') }}
            onDelete={() => { setSelected(c); setConfirmDel(true) }}
            onView={() => setViewStudentsFor(c)}
          />
        ))}
        {courses.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#7a7570', fontSize: '14px' }}>
            No courses yet. Add your first program to get started.
          </div>
        )}
      </div>

      <Modal open={modal === 'add'} onClose={() => setModal(null)} title="Create New Course" width={560}>
        <CourseForm onSave={handleAdd} onClose={() => setModal(null)} instructors={INSTRUCTORS} />
      </Modal>

      <Modal open={modal === 'edit'} onClose={() => setModal(null)} title="Edit Course" width={560}>
        {selected && <CourseForm initial={selected} onSave={handleEdit} onClose={() => setModal(null)} instructors={INSTRUCTORS} />}
      </Modal>

      {/* Students in course */}
      <Modal open={!!viewStudentsFor} onClose={() => setViewStudentsFor(null)} title={`Students — ${viewStudentsFor?.name}`} width={500}>
        {courseStudents.length === 0 ? (
          <p style={{ fontSize: 13, color: '#7a7570', paddingBottom: 16 }}>No students enrolled in this course yet.</p>
        ) : courseStudents.map(s => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f0ede8' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{s.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{s.firstName} {s.lastName}</div>
              <div style={{ fontSize: 11, color: '#7a7570' }}>{s.email}</div>
            </div>
            <Badge>{s.status}</Badge>
          </div>
        ))}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={() => setViewStudentsFor(null)}>Close</Button>
        </div>
      </Modal>

      <Confirm open={confirmDel} onClose={() => setConfirmDel(false)} onConfirm={handleDelete}
        title="Delete Course" confirmLabel="Delete"
        message={`Delete "${selected?.name}"? All associated data will be removed.`} />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
