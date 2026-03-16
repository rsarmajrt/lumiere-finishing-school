import { useState, useRef, useEffect } from 'react'
import { X, ChevronDown, Search, Check } from 'lucide-react'

// ── Button ────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', onClick, type = 'button', disabled, style, className = '' }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    border: 'none', borderRadius: '8px', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: "'DM Sans', sans-serif", fontWeight: 400, letterSpacing: '0.3px',
    transition: 'all 0.18s ease', opacity: disabled ? 0.5 : 1,
  }
  const sizes = {
    sm: { padding: '6px 14px', fontSize: '12px' },
    md: { padding: '9px 20px', fontSize: '13px' },
    lg: { padding: '12px 28px', fontSize: '14px' },
  }
  const variants = {
    primary: { background: '#0f0f0f', color: '#fff' },
    gold: { background: '#b8924a', color: '#fff' },
    outline: { background: 'transparent', color: '#0f0f0f', border: '1px solid #e6e2dc' },
    ghost: { background: 'transparent', color: '#7a7570' },
    danger: { background: '#b5290e', color: '#fff' },
    success: { background: '#1a6b3c', color: '#fff' },
  }
  return (
    <button
      type={type} onClick={onClick} disabled={disabled}
      className={className}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.opacity = '0.82')}
      onMouseLeave={e => !disabled && (e.currentTarget.style.opacity = '1')}
    >
      {children}
    </button>
  )
}

// ── Badge ─────────────────────────────────────────────────────
export function Badge({ children, variant = 'default' }) {
  const variants = {
    Active: { bg: '#e8f4ee', color: '#1a6b3c' },
    Inactive: { bg: '#f5f4f2', color: '#7a7570' },
    Paid: { bg: '#e8f4ee', color: '#1a6b3c' },
    Pending: { bg: '#fdf5e0', color: '#9a6b00' },
    Overdue: { bg: '#fdf0ed', color: '#b5290e' },
    Confirmed: { bg: '#e8f0f8', color: '#1a4d7a' },
    Cancelled: { bg: '#fdf0ed', color: '#b5290e' },
    default: { bg: '#f5f4f2', color: '#7a7570' },
  }
  const v = variants[children] || variants[variant] || variants.default
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
      fontSize: '11px', fontWeight: 500, letterSpacing: '0.3px',
      background: v.bg, color: v.color,
    }}>{children}</span>
  )
}

// ── Input ─────────────────────────────────────────────────────
export function Input({ label, type = 'text', value, onChange, placeholder, required, style, rows }) {
  const [focused, setFocused] = useState(false)
  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: `1px solid ${focused ? '#0f0f0f' : '#e6e2dc'}`,
    borderRadius: '8px', fontSize: '13px',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none', background: focused ? '#fff' : '#f8f7f5',
    color: '#0f0f0f', transition: 'all 0.2s', resize: 'vertical',
  }
  return (
    <div style={{ marginBottom: '16px', ...style }}>
      {label && (
        <label style={{ display: 'block', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#7a7570', marginBottom: '6px', fontWeight: 500 }}>
          {label}{required && <span style={{ color: '#b5290e', marginLeft: 2 }}>*</span>}
        </label>
      )}
      {rows ? (
        <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder}
          style={inputStyle} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
          style={inputStyle} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      )}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────
export function Select({ label, value, onChange, options, required, placeholder = 'Select...' }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#7a7570', marginBottom: '6px', fontWeight: 500 }}>
          {label}{required && <span style={{ color: '#b5290e', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={onChange} required={required}
          style={{
            width: '100%', padding: '10px 36px 10px 14px',
            border: `1px solid ${focused ? '#0f0f0f' : '#e6e2dc'}`,
            borderRadius: '8px', fontSize: '13px',
            fontFamily: "'DM Sans', sans-serif",
            outline: 'none', background: focused ? '#fff' : '#f8f7f5',
            color: value ? '#0f0f0f' : '#7a7570',
            appearance: 'none', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        >
          <option value="">{placeholder}</option>
          {options.map(o => (
            <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
          ))}
        </select>
        <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#7a7570', pointerEvents: 'none' }} />
      </div>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 500 }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)', padding: '20px',
    }} onClick={onClose}>
      <div className="scale-in" style={{
        background: '#fff', borderRadius: '16px', padding: '36px',
        width: `min(${width}px, 100%)`, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 className="display" style={{ fontSize: '26px', fontWeight: 400, lineHeight: 1.2 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a7570', padding: '4px', display: 'flex', marginTop: '4px' }}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Search Bar ────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      background: '#fff', border: '1px solid #e6e2dc',
      borderRadius: '8px', padding: '8px 14px', minWidth: '240px',
    }}>
      <Search size={14} color="#7a7570" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ background: 'none', border: 'none', outline: 'none', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", flex: 1, color: '#0f0f0f' }} />
      {value && <X size={13} color="#7a7570" style={{ cursor: 'pointer' }} onClick={() => onChange('')} />}
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────
export function Card({ children, style, onClick, hover = false }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{
        background: '#fff', border: '1px solid #e6e2dc', borderRadius: '12px',
        padding: '24px', transition: 'all 0.2s',
        boxShadow: hover && hovered ? '0 6px 24px rgba(0,0,0,0.09)' : '0 2px 8px rgba(0,0,0,0.04)',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  )
}

// ── Avatar ────────────────────────────────────────────────────
export function Avatar({ initials, size = 32, bg = '#f0ede8', color = '#0f0f0f' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: size * 0.35,
      fontWeight: 600, letterSpacing: '0.5px', flexShrink: 0,
    }}>{initials}</div>
  )
}

// ── Table ─────────────────────────────────────────────────────
export function Table({ columns, data, onRowClick, emptyMessage = 'No records found.' }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e6e2dc', borderRadius: '12px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={{
                textAlign: 'left', padding: '13px 20px',
                fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase',
                color: '#7a7570', borderBottom: '1px solid #e6e2dc', fontWeight: 500,
                whiteSpace: 'nowrap',
              }}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: '40px 20px', textAlign: 'center', color: '#7a7570', fontSize: '13px' }}>{emptyMessage}</td></tr>
          ) : data.map((row, ri) => (
            <tr key={ri}
              onClick={() => onRowClick?.(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#faf9f7'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              {columns.map((col, ci) => (
                <td key={ci} style={{
                  padding: '13px 20px', fontSize: '13px',
                  borderBottom: ri < data.length - 1 ? '1px solid #f0ede8' : 'none',
                  ...col.style,
                }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Confirm Dialog ────────────────────────────────────────────
export function Confirm({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete', variant = 'danger' }) {
  if (!open) return null
  return (
    <Modal open={open} onClose={onClose} title={title} width={380}>
      <p style={{ fontSize: '14px', color: '#3a3a3a', lineHeight: 1.6, marginBottom: '24px' }}>{message}</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant={variant} onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</Button>
      </div>
    </Modal>
  )
}

// ── Stat Card ─────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon: Icon, accent, trend }) {
  return (
    <Card hover style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7a7570', marginBottom: '10px', fontWeight: 500 }}>{label}</div>
          <div className="display" style={{ fontSize: '38px', fontWeight: 300, color: accent || '#0f0f0f', lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: '12px', color: '#7a7570', marginTop: '8px' }}>{sub}</div>}
        </div>
        {Icon && (
          <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#f8f7f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={18} color="#7a7570" />
          </div>
        )}
      </div>
    </Card>
  )
}

// ── Toast / Notification ──────────────────────────────────────
export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  const colors = { success: '#1a6b3c', error: '#b5290e', info: '#1a4d7a' }
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      background: '#0f0f0f', color: '#fff', borderRadius: '10px',
      padding: '12px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)', animation: 'fadeIn 0.3s ease',
      maxWidth: '320px',
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors[type], flexShrink: 0 }} />
      {message}
      <X size={14} style={{ cursor: 'pointer', marginLeft: 'auto', opacity: 0.6 }} onClick={onClose} />
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────────
export function ProgressBar({ value, max, color = '#b8924a' }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div>
      <div style={{ height: '5px', background: '#f0ede8', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
      </div>
      <div style={{ fontSize: '11px', color: '#7a7570', marginTop: '4px' }}>{value} / {max} seats filled</div>
    </div>
  )
}

// ── Form Row ──────────────────────────────────────────────────
export function FormRow({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>{children}</div>
}

// ── Section Header ────────────────────────────────────────────
export function SectionHead({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '20px' }}>
      <div>
        <h2 className="display" style={{ fontSize: '24px', fontWeight: 400 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: '13px', color: '#7a7570', marginTop: '4px' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────
export function Empty({ message, icon: Icon }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#7a7570' }}>
      {Icon && <Icon size={36} style={{ opacity: 0.3, marginBottom: '12px' }} />}
      <p style={{ fontSize: '14px' }}>{message}</p>
    </div>
  )
}
