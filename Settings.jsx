import { useState } from 'react'
import { Card, Input, Button, Select, SectionHead, FormRow, Toast } from '../components/UI'
import { useApp } from '../context/AppContext'
import { School, Bell, CreditCard, Users, Shield } from 'lucide-react'

function Section({ title, icon: Icon, children }) {
  return (
    <Card style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f0ede8' }}>
        <div style={{ width: 36, height: 36, borderRadius: '8px', background: '#f8f7f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color="#7a7570" />
        </div>
        <h3 className="display" style={{ fontSize: '18px', fontWeight: 400 }}>{title}</h3>
      </div>
      {children}
    </Card>
  )
}

export default function Settings() {
  const { INSTRUCTORS } = useApp()
  const [toast, setToast] = useState(null)

  const [school, setSchool] = useState({
    name: 'Lumière Finishing School',
    tagline: 'Transforming Personalities, Defining Elegance',
    email: 'admin@lumiere.edu.in',
    phone: '+91 99999 00000',
    address: 'Guwahati, Assam, India',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  })

  const [notif, setNotif] = useState({
    paymentReminders: true,
    appointmentReminders: true,
    enrollmentAlerts: true,
  })

  const [admin, setAdmin] = useState({
    name: 'Admin',
    email: 'admin@lumiere.edu.in',
    role: 'Principal',
  })

  function save(msg) {
    setToast(msg || 'Settings saved')
  }

  return (
    <div className="fade-in" style={{ padding: '32px', maxWidth: '800px' }}>
      <SectionHead title="Settings" subtitle="Manage your school profile and preferences" />

      {/* School Info */}
      <Section title="School Information" icon={School}>
        <FormRow>
          <Input label="School Name" value={school.name} onChange={e => setSchool(s => ({ ...s, name: e.target.value }))} />
          <Input label="Tagline" value={school.tagline} onChange={e => setSchool(s => ({ ...s, tagline: e.target.value }))} />
        </FormRow>
        <FormRow>
          <Input label="Contact Email" type="email" value={school.email} onChange={e => setSchool(s => ({ ...s, email: e.target.value }))} />
          <Input label="Phone Number" value={school.phone} onChange={e => setSchool(s => ({ ...s, phone: e.target.value }))} />
        </FormRow>
        <Input label="Address" value={school.address} onChange={e => setSchool(s => ({ ...s, address: e.target.value }))} />
        <FormRow>
          <Select label="Currency" value={school.currency} onChange={e => setSchool(s => ({ ...s, currency: e.target.value }))}
            options={[{ value: 'INR', label: '₹ INR — Indian Rupee' }, { value: 'USD', label: '$ USD' }]} />
          <Select label="Timezone" value={school.timezone} onChange={e => setSchool(s => ({ ...s, timezone: e.target.value }))}
            options={[{ value: 'Asia/Kolkata', label: 'IST (Asia/Kolkata)' }, { value: 'UTC', label: 'UTC' }]} />
        </FormRow>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => save('School info saved')}>Save Changes</Button>
        </div>
      </Section>

      {/* Admin Profile */}
      <Section title="Admin Profile" icon={Shield}>
        <FormRow>
          <Input label="Full Name" value={admin.name} onChange={e => setAdmin(a => ({ ...a, name: e.target.value }))} />
          <Input label="Role" value={admin.role} onChange={e => setAdmin(a => ({ ...a, role: e.target.value }))} />
        </FormRow>
        <Input label="Email Address" type="email" value={admin.email} onChange={e => setAdmin(a => ({ ...a, email: e.target.value }))} />
        <Input label="New Password" type="password" placeholder="Leave blank to keep current" />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => save('Profile updated')}>Update Profile</Button>
        </div>
      </Section>

      {/* Instructors */}
      <Section title="Instructors" icon={Users}>
        <div style={{ marginBottom: '16px' }}>
          {INSTRUCTORS.map((ins, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0ede8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>
                  {ins.split(' ').slice(-1)[0][0]}{ins.split(' ').slice(-2, -1)[0]?.[0] || ''}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{ins}</div>
                  <div style={{ fontSize: 11, color: '#7a7570' }}>Instructor</div>
                </div>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm">+ Add Instructor</Button>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        {[
          ['paymentReminders', 'Payment due reminders (3 days before due date)'],
          ['appointmentReminders', 'Appointment reminders (24 hours before session)'],
          ['enrollmentAlerts', 'New enrollment alerts'],
        ].map(([key, label]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0ede8' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
              <div style={{ fontSize: 11, color: '#7a7570', marginTop: 2 }}>Email notification</div>
            </div>
            <div
              onClick={() => setNotif(n => ({ ...n, [key]: !n[key] }))}
              style={{
                width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                background: notif[key] ? '#0f0f0f' : '#e6e2dc',
                position: 'relative', transition: 'background 0.2s',
              }}>
              <div style={{
                position: 'absolute', top: 3, left: notif[key] ? 23 : 3,
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button onClick={() => save('Notification preferences saved')}>Save Preferences</Button>
        </div>
      </Section>

      {/* Payment Settings */}
      <Section title="Payment Settings" icon={CreditCard}>
        <FormRow>
          <Input label="Late Fee (%)" placeholder="5" />
          <Input label="Grace Period (days)" placeholder="7" />
        </FormRow>
        <Select label="Default Payment Mode"
          value="Full"
          onChange={() => {}}
          options={[{ value: 'Full', label: 'Full Payment' }, { value: 'Installments', label: 'Installments' }]}
        />
        <Input label="UPI ID / Bank Details" placeholder="school@upi or IFSC + Account" />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => save('Payment settings saved')}>Save Settings</Button>
        </div>
      </Section>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
