import { createContext, useContext, useReducer } from 'react'

// ── Seed Data ────────────────────────────────────────────────
const INITIAL_STUDENTS = [
  { id: 1, firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@email.com', phone: '+91 98765 43210', courseId: 1, enrolled: '2026-01-15', status: 'Active', paymentStatus: 'Paid', notes: 'Excellent progress in etiquette sessions.', avatar: 'PS' },
  { id: 2, firstName: 'Ananya', lastName: 'Bose', email: 'ananya.bose@email.com', phone: '+91 87654 32109', courseId: 2, enrolled: '2026-02-01', status: 'Active', paymentStatus: 'Overdue', notes: 'Needs follow-up on payment.', avatar: 'AB' },
  { id: 3, firstName: 'Ritika', lastName: 'Nair', email: 'ritika.nair@email.com', phone: '+91 76543 21098', courseId: 3, enrolled: '2026-02-10', status: 'Inactive', paymentStatus: 'Paid', notes: 'On medical leave till March 20.', avatar: 'RN' },
  { id: 4, firstName: 'Meera', lastName: 'Kapoor', email: 'meera.kapoor@email.com', phone: '+91 65432 10987', courseId: 1, enrolled: '2026-03-01', status: 'Active', paymentStatus: 'Paid', notes: 'Very motivated, attends all sessions.', avatar: 'MK' },
  { id: 5, firstName: 'Sanya', lastName: 'Malhotra', email: 'sanya.malhotra@email.com', phone: '+91 54321 09876', courseId: 4, enrolled: '2026-03-05', status: 'Active', paymentStatus: 'Pending', notes: 'Joined the Style & Wardrobe batch.', avatar: 'SM' },
  { id: 6, firstName: 'Divya', lastName: 'Reddy', email: 'divya.reddy@email.com', phone: '+91 44321 98765', courseId: 2, enrolled: '2026-02-20', status: 'Active', paymentStatus: 'Paid', notes: '', avatar: 'DR' },
  { id: 7, firstName: 'Kavya', lastName: 'Menon', email: 'kavya.menon@email.com', phone: '+91 33210 87654', courseId: 3, enrolled: '2026-01-28', status: 'Active', paymentStatus: 'Paid', notes: 'Preparing for corporate interview.', avatar: 'KM' },
]

const INITIAL_COURSES = [
  { id: 1, name: 'Complete Grooming', duration: '3 Months', sessions: 24, price: 35000, capacity: 15, topics: ['Skincare & Makeup', 'Posture & Body Language', 'Style & Wardrobe', 'Table Manners & Etiquette'], instructor: 'Ms. Rekha Devi', description: 'Comprehensive personality transformation program covering all aspects of grooming and social grace.', color: '#b8924a' },
  { id: 2, name: 'Communication Mastery', duration: '6 Weeks', sessions: 12, price: 18000, capacity: 10, topics: ['Public Speaking', 'Voice Modulation', 'Conversation Skills', 'Presentation Techniques'], instructor: 'Mr. Vivek Sharma', description: 'Master the art of confident communication for personal and professional success.', color: '#4a7c59' },
  { id: 3, name: 'Executive Presence', duration: '4 Weeks', sessions: 8, price: 22000, capacity: 8, topics: ['Leadership Persona', 'Business Etiquette', 'Networking Skills', 'Confidence Building'], instructor: 'Mr. Vivek Sharma', description: 'Build the executive presence needed to lead, influence, and inspire in the corporate world.', color: '#4a6b8a' },
  { id: 4, name: 'Style & Wardrobe', duration: '2 Weeks', sessions: 6, price: 12000, capacity: 12, topics: ['Color Analysis', 'Body Type Dressing', 'Occasion Wear', 'Capsule Wardrobe'], instructor: 'Ms. Pooja Mehta', description: 'Develop your signature style with expert guidance on fashion, color, and wardrobe curation.', color: '#8a4a6b' },
]

const INITIAL_APPOINTMENTS = [
  { id: 1, studentId: 1, courseId: 1, topic: 'Makeup & Skincare Session', date: '2026-03-10', time: '10:00', instructor: 'Ms. Rekha Devi', status: 'Confirmed', notes: 'Bring personal skincare products.' },
  { id: 2, studentId: 2, courseId: 2, topic: 'Public Speaking Practice', date: '2026-03-10', time: '12:00', instructor: 'Mr. Vivek Sharma', status: 'Confirmed', notes: 'Prepare a 5-minute speech.' },
  { id: 3, studentId: 4, courseId: 1, topic: 'Posture & Walk Training', date: '2026-03-11', time: '11:00', instructor: 'Ms. Rekha Devi', status: 'Pending', notes: '' },
  { id: 4, studentId: 5, courseId: 4, topic: 'Color Analysis Consultation', date: '2026-03-12', time: '14:00', instructor: 'Ms. Pooja Mehta', status: 'Confirmed', notes: 'Wear neutral clothing.' },
  { id: 5, studentId: 3, courseId: 3, topic: 'Business Etiquette Workshop', date: '2026-03-13', time: '15:00', instructor: 'Mr. Vivek Sharma', status: 'Pending', notes: '' },
  { id: 6, studentId: 6, courseId: 2, topic: 'Voice Modulation Practice', date: '2026-03-14', time: '10:00', instructor: 'Mr. Vivek Sharma', status: 'Confirmed', notes: '' },
  { id: 7, studentId: 7, courseId: 3, topic: 'Leadership Persona Workshop', date: '2026-03-15', time: '13:00', instructor: 'Mr. Vivek Sharma', status: 'Confirmed', notes: '' },
]

const INITIAL_INVOICES = [
  { id: 'INV-001', studentId: 1, courseId: 1, amount: 35000, issued: '2026-01-15', due: '2026-01-20', status: 'Paid', paidOn: '2026-01-19' },
  { id: 'INV-002', studentId: 2, courseId: 2, amount: 18000, issued: '2026-02-01', due: '2026-02-07', status: 'Overdue', paidOn: null },
  { id: 'INV-003', studentId: 3, courseId: 3, amount: 22000, issued: '2026-02-10', due: '2026-02-15', status: 'Paid', paidOn: '2026-02-14' },
  { id: 'INV-004', studentId: 4, courseId: 1, amount: 35000, issued: '2026-03-01', due: '2026-03-07', status: 'Paid', paidOn: '2026-03-05' },
  { id: 'INV-005', studentId: 5, courseId: 4, amount: 12000, issued: '2026-03-05', due: '2026-03-12', status: 'Pending', paidOn: null },
  { id: 'INV-006', studentId: 6, courseId: 2, amount: 18000, issued: '2026-02-20', due: '2026-02-26', status: 'Paid', paidOn: '2026-02-25' },
  { id: 'INV-007', studentId: 7, courseId: 3, amount: 22000, issued: '2026-01-28', due: '2026-02-03', status: 'Paid', paidOn: '2026-02-01' },
]

const INSTRUCTORS = ['Ms. Rekha Devi', 'Mr. Vivek Sharma', 'Ms. Pooja Mehta']

// ── Reducer ──────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_STUDENT':
      return { ...state, students: [...state.students, { ...action.payload, id: Date.now(), avatar: (action.payload.firstName[0] + action.payload.lastName[0]).toUpperCase() }] }
    case 'UPDATE_STUDENT':
      return { ...state, students: state.students.map(s => s.id === action.payload.id ? { ...s, ...action.payload } : s) }
    case 'DELETE_STUDENT':
      return { ...state, students: state.students.filter(s => s.id !== action.payload) }
    case 'ADD_COURSE':
      return { ...state, courses: [...state.courses, { ...action.payload, id: Date.now() }] }
    case 'UPDATE_COURSE':
      return { ...state, courses: state.courses.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) }
    case 'DELETE_COURSE':
      return { ...state, courses: state.courses.filter(c => c.id !== action.payload) }
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, { ...action.payload, id: Date.now() }] }
    case 'UPDATE_APPOINTMENT':
      return { ...state, appointments: state.appointments.map(a => a.id === action.payload.id ? { ...a, ...action.payload } : a) }
    case 'DELETE_APPOINTMENT':
      return { ...state, appointments: state.appointments.filter(a => a.id !== action.payload) }
    case 'ADD_INVOICE':
      return { ...state, invoices: [...state.invoices, { ...action.payload, id: `INV-${String(state.invoices.length + 1).padStart(3,'0')}` }] }
    case 'UPDATE_INVOICE':
      return { ...state, invoices: state.invoices.map(i => i.id === action.payload.id ? { ...i, ...action.payload } : i) }
    case 'MARK_PAID':
      return {
        ...state,
        invoices: state.invoices.map(i => i.id === action.payload ? { ...i, status: 'Paid', paidOn: new Date().toISOString().split('T')[0] } : i),
        students: state.students.map(s => {
          const inv = state.invoices.find(i => i.id === action.payload)
          return inv && s.id === inv.studentId ? { ...s, paymentStatus: 'Paid' } : s
        })
      }
    default:
      return state
  }
}

// ── Context ──────────────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    students: INITIAL_STUDENTS,
    courses: INITIAL_COURSES,
    appointments: INITIAL_APPOINTMENTS,
    invoices: INITIAL_INVOICES,
  })

  return (
    <AppContext.Provider value={{ state, dispatch, INSTRUCTORS }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}

export { INSTRUCTORS }
