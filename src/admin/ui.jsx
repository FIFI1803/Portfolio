/* Admin UI primitives. Same tokens as the site: paper, ink, 1px rules, no radius. */

export const Btn = ({ children, onClick, variant = 'primary', type = 'button', disabled, title }) => {
  const base = 'px-3.5 py-2 text-[13px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-ink text-paper hover:bg-accent',
    ghost: 'border border-rule text-ink hover:border-ink',
    danger: 'border border-rule text-ink-2 hover:border-accent hover:text-accent',
    icon: 'border border-rule px-2.5 text-ink-2 hover:border-ink hover:text-ink',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} title={title} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  )
}

export const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="meta text-ink-2">{children}</label>
)

const FIELD =
  'w-full border border-rule bg-paper px-3 py-2.5 text-[15px] text-ink placeholder:text-ink-2/60 focus:border-ink focus-visible:outline-none'

export const Input = ({ id, label, value, onChange, type = 'text', placeholder, required, hint }) => (
  <div className="flex flex-col gap-1.5">
    {label && <Label htmlFor={id}>{label}</Label>}
    <input
      id={id} type={type} value={value ?? ''} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} required={required} className={FIELD}
    />
    {hint && <p className="text-[12px] text-ink-2">{hint}</p>}
  </div>
)

export const Textarea = ({ id, label, value, onChange, rows = 4, placeholder, hint, mono }) => (
  <div className="flex flex-col gap-1.5">
    {label && <Label htmlFor={id}>{label}</Label>}
    <textarea
      id={id} value={value ?? ''} onChange={e => onChange(e.target.value)}
      rows={rows} placeholder={placeholder}
      className={`${FIELD} resize-y leading-[1.5] ${mono ? 'font-mono text-[13px]' : ''}`}
    />
    {hint && <p className="text-[12px] text-ink-2">{hint}</p>}
  </div>
)

export const Select = ({ id, label, value, onChange, options }) => (
  <div className="flex flex-col gap-1.5">
    {label && <Label htmlFor={id}>{label}</Label>}
    <select id={id} value={value ?? ''} onChange={e => onChange(e.target.value)} className={FIELD}>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  </div>
)

export const Toggle = ({ id, label, checked, onChange, hint }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="flex cursor-pointer items-center gap-3">
      <input id={id} type="checkbox" checked={!!checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
      <span aria-hidden="true" className={`relative h-5 w-9 border transition-colors ${checked ? 'border-ink bg-ink' : 'border-rule bg-paper'}`}>
        <span className={`absolute top-[3px] h-3 w-3 transition-transform ${checked ? 'translate-x-[19px] bg-paper' : 'translate-x-[3px] bg-ink-2'}`} />
      </span>
      <span className="text-[14px] text-ink">{label}</span>
    </label>
    {hint && <p className="text-[12px] text-ink-2">{hint}</p>}
  </div>
)

export const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 md:p-10" onClick={onClose}>
    <div role="dialog" aria-modal="true" aria-label={title}
         className="w-full max-w-xl border border-rule bg-paper p-6 md:p-8" onClick={e => e.stopPropagation()}>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-[18px] font-medium tracking-[-0.01em] text-ink">{title}</h3>
        <button type="button" onClick={onClose} aria-label="Close" className="meta text-ink-2 hover:text-ink">Close</button>
      </div>
      {children}
    </div>
  </div>
)

export const ConfirmDelete = ({ name, onConfirm, onCancel }) => (
  <Modal title="Delete" onClose={onCancel}>
    <p className="text-[15px] text-ink">Delete <span className="font-medium">“{name}”</span>? This can’t be undone.</p>
    <div className="mt-6 flex justify-end gap-3">
      <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
      <Btn onClick={onConfirm}>Delete</Btn>
    </div>
  </Modal>
)

export const Toast = ({ msg, type }) => (
  <div role="status" className={`fixed bottom-5 right-5 z-[60] border px-4 py-3 text-[13px] ${type === 'error' ? 'border-accent bg-paper text-accent' : 'border-ink bg-ink text-paper'}`}>
    {msg}
  </div>
)

export const Empty = ({ children }) => (
  <p className="border border-dashed border-rule px-4 py-10 text-center text-[14px] text-ink-2">{children}</p>
)
