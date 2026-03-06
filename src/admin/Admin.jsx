import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// ─── Reusable UI ────────────────────────────────────────────────────────────

const Btn = ({ children, onClick, variant = 'primary', type = 'button', disabled }) => {
    const base = 'px-4 py-2 rounded-lg font-dm text-sm font-medium transition-colors disabled:opacity-40'
    const variants = {
        primary:  'bg-ember text-obsidian hover:bg-ember-dim',
        ghost:    'border border-brand-border text-subtle hover:text-heading hover:border-subtle',
        danger:   'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
    }
    return <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>{children}</button>
}

const Input = ({ label, value, onChange, type = 'text', placeholder, required }) => (
    <div className="flex flex-col gap-1.5">
        {label && <label className="text-muted text-xs font-dm uppercase tracking-wider">{label}</label>}
        <input
            type={type} value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} required={required}
            className="px-3 py-2.5 bg-surface border border-brand-border rounded-lg text-heading text-sm font-dm placeholder-muted focus:outline-none focus:border-ember transition-colors"
        />
    </div>
)

const Textarea = ({ label, value, onChange, rows = 3, placeholder }) => (
    <div className="flex flex-col gap-1.5">
        {label && <label className="text-muted text-xs font-dm uppercase tracking-wider">{label}</label>}
        <textarea
            value={value} onChange={e => onChange(e.target.value)}
            rows={rows} placeholder={placeholder}
            className="px-3 py-2.5 bg-surface border border-brand-border rounded-lg text-heading text-sm font-dm placeholder-muted focus:outline-none focus:border-ember transition-colors resize-none"
        />
    </div>
)

const Toggle = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-3 cursor-pointer">
        <div
            onClick={() => onChange(!checked)}
            className={`w-10 h-6 rounded-full transition-colors relative ${checked ? 'bg-ember' : 'bg-surface2'}`}
        >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
        </div>
        <span className="text-subtle text-sm font-dm">{label}</span>
    </label>
)

const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" />
        <div className="relative z-10 w-full max-w-lg bg-void border border-brand-border rounded-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
                <h3 className="font-syne text-lg font-semibold text-heading">{title}</h3>
                <button onClick={onClose} className="text-muted hover:text-heading transition-colors text-xl leading-none">×</button>
            </div>
            {children}
        </div>
    </div>
)

const ConfirmDelete = ({ name, onConfirm, onCancel }) => (
    <Modal title="Confirm Delete" onClose={onCancel}>
        <p className="text-body text-sm font-dm">Delete <span className="text-heading font-medium">"{name}"</span>? This cannot be undone.</p>
        <div className="flex gap-3 justify-end">
            <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
            <Btn variant="danger" onClick={onConfirm}>Delete</Btn>
        </div>
    </Modal>
)

const Toast = ({ msg, type }) => (
    <div className={`fixed bottom-6 right-6 z-[200] px-5 py-3 rounded-xl font-dm text-sm shadow-xl border ${type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-ember/10 border-ember/30 text-ember'}`}>
        {msg}
    </div>
)

// ─── Skills ──────────────────────────────────────────────────────────────────

const emptySkill = { name: '', accent: false, icon_name: '' }

const SkillsTab = ({ toast }) => {
    const [items, setItems] = useState([])
    const [modal, setModal] = useState(null) // null | 'add' | {item}
    const [form, setForm] = useState(emptySkill)
    const [deleting, setDeleting] = useState(null)
    const [saving, setSaving] = useState(false)

    const load = async () => {
        const { data } = await supabase.from('skills').select('*').order('sort_order')
        setItems(data || [])
    }
    useEffect(() => { load() }, [])

    const openAdd = () => { setForm(emptySkill); setModal('add') }
    const openEdit = (item) => { setForm({ name: item.name, accent: item.accent, icon_name: item.icon_name || '' }); setModal(item) }

    const save = async () => {
        setSaving(true)
        if (modal === 'add') {
            const { error } = await supabase.from('skills').insert({ ...form, sort_order: items.length + 1 })
            if (error) { toast(error.message, 'error'); setSaving(false); return }
            toast('Skill added')
        } else {
            const { error } = await supabase.from('skills').update(form).eq('id', modal.id)
            if (error) { toast(error.message, 'error'); setSaving(false); return }
            toast('Skill updated')
        }
        setSaving(false); setModal(null); load()
    }

    const del = async () => {
        await supabase.from('skills').delete().eq('id', deleting.id)
        toast('Skill deleted'); setDeleting(null); load()
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <p className="text-muted text-sm font-dm">{items.length} skills</p>
                <Btn onClick={openAdd}>+ Add Skill</Btn>
            </div>
            <div className="flex flex-col gap-2">
                {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3 bg-surface border border-brand-border rounded-xl">
                        <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-dm border ${item.accent ? 'bg-[rgba(255,92,43,0.1)] text-ember border-[rgba(255,92,43,0.25)]' : 'bg-surface2 text-subtle border-brand-border'}`}>{item.name}</span>
                        </div>
                        <div className="flex gap-2">
                            <Btn variant="ghost" onClick={() => openEdit(item)}>Edit</Btn>
                            <Btn variant="danger" onClick={() => setDeleting(item)}>Delete</Btn>
                        </div>
                    </div>
                ))}
            </div>

            {modal && (
                <Modal title={modal === 'add' ? 'Add Skill' : 'Edit Skill'} onClose={() => setModal(null)}>
                    <div className="flex flex-col gap-4">
                        <Input label="Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. React" required />
                        <div className="flex flex-col gap-1.5">
                            <Input label="Icon slug (simpleicons.org)" value={form.icon_name} onChange={v => setForm(f => ({ ...f, icon_name: v }))} placeholder="e.g. react, typescript, nodedotjs" />
                            {form.icon_name && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg border border-brand-border">
                                    <img src={`https://cdn.simpleicons.org/${form.icon_name}`} alt="" className="w-5 h-5" onError={e => { e.target.style.display = 'none' }} />
                                    <span className="text-muted text-xs font-dm">Preview</span>
                                </div>
                            )}
                            <a href="https://simpleicons.org" target="_blank" rel="noreferrer" className="text-ember/60 text-xs font-dm hover:text-ember transition-colors">Browse icon slugs at simpleicons.org ↗</a>
                        </div>
                        <Toggle label="Accent (ember highlight)" checked={form.accent} onChange={v => setForm(f => ({ ...f, accent: v }))} />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
                        <Btn onClick={save} disabled={saving || !form.name}>{saving ? 'Saving…' : 'Save'}</Btn>
                    </div>
                </Modal>
            )}
            {deleting && <ConfirmDelete name={deleting.name} onConfirm={del} onCancel={() => setDeleting(null)} />}
        </div>
    )
}

// ─── Education ───────────────────────────────────────────────────────────────

const emptyEdu = { title: '', subtitle: '', period: '', type: 'education', icon_url: '', verify_url: '' }

const EducationTab = ({ toast }) => {
    const [items, setItems] = useState([])
    const [modal, setModal] = useState(null)
    const [form, setForm] = useState(emptyEdu)
    const [deleting, setDeleting] = useState(null)
    const [saving, setSaving] = useState(false)

    const load = async () => {
        const { data } = await supabase.from('education').select('*').order('sort_order')
        setItems(data || [])
    }
    useEffect(() => { load() }, [])

    const save = async () => {
        setSaving(true)
        if (modal === 'add') {
            const { error } = await supabase.from('education').insert({ ...form, sort_order: items.length + 1 })
            if (error) { toast(error.message, 'error'); setSaving(false); return }
            toast('Entry added')
        } else {
            const { error } = await supabase.from('education').update(form).eq('id', modal.id)
            if (error) { toast(error.message, 'error'); setSaving(false); return }
            toast('Entry updated')
        }
        setSaving(false); setModal(null); load()
    }

    const del = async () => {
        await supabase.from('education').delete().eq('id', deleting.id)
        toast('Entry deleted'); setDeleting(null); load()
    }

    const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }))

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <p className="text-muted text-sm font-dm">{items.length} entries</p>
                <Btn onClick={() => { setForm(emptyEdu); setModal('add') }}>+ Add Entry</Btn>
            </div>
            <div className="flex flex-col gap-2">
                {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3 bg-surface border border-brand-border rounded-xl">
                        <div>
                            <p className="text-heading text-sm font-dm font-medium">{item.title}</p>
                            <p className="text-muted text-xs font-dm">{item.subtitle} · {item.period}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-syne uppercase tracking-wide text-ember">{item.type}</span>
                            <Btn variant="ghost" onClick={() => { setForm({ title: item.title, subtitle: item.subtitle, period: item.period, type: item.type, icon_url: item.icon_url || '', verify_url: item.verify_url || '' }); setModal(item) }}>Edit</Btn>
                            <Btn variant="danger" onClick={() => setDeleting(item)}>Delete</Btn>
                        </div>
                    </div>
                ))}
            </div>

            {modal && (
                <Modal title={modal === 'add' ? 'Add Entry' : 'Edit Entry'} onClose={() => setModal(null)}>
                    <div className="flex flex-col gap-4">
                        <Input label="Title" value={form.title} onChange={f('title')} placeholder="e.g. BSc Computer Science" required />
                        <Input label="Institution" value={form.subtitle} onChange={f('subtitle')} placeholder="e.g. University Name" required />
                        <Input label="Period" value={form.period} onChange={f('period')} placeholder="e.g. 2021 – 2025" required />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-muted text-xs font-dm uppercase tracking-wider">Type</label>
                            <select value={form.type} onChange={e => f('type')(e.target.value)} className="px-3 py-2.5 bg-surface border border-brand-border rounded-lg text-heading text-sm font-dm focus:outline-none focus:border-ember transition-colors">
                                <option value="education">Education</option>
                                <option value="certification">Certification</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Input label="Icon URL (optional)" value={form.icon_url} onChange={f('icon_url')} placeholder="e.g. https://cdn.simpleicons.org/amazonaws/FF9900" />
                            {form.icon_url && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg border border-brand-border">
                                    <img src={form.icon_url} alt="" className="w-5 h-5 object-contain" onError={e => { e.target.style.display = 'none' }} />
                                    <span className="text-muted text-xs font-dm">Preview</span>
                                </div>
                            )}
                        </div>
                        {form.type === 'certification' && (
                            <Input label="Verification URL (optional)" value={form.verify_url} onChange={f('verify_url')} placeholder="https://aws.amazon.com/verification/..." />
                        )}
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
                        <Btn onClick={save} disabled={saving || !form.title}>{saving ? 'Saving…' : 'Save'}</Btn>
                    </div>
                </Modal>
            )}
            {deleting && <ConfirmDelete name={deleting.title} onConfirm={del} onCancel={() => setDeleting(null)} />}
        </div>
    )
}

// ─── Experience ──────────────────────────────────────────────────────────────

const emptyExp = { role: '', company: '', period: '', location: '', bullets: [''], logo_url: '' }

const ExperienceTab = ({ toast }) => {
    const [items, setItems] = useState([])
    const [modal, setModal] = useState(null)
    const [form, setForm] = useState(emptyExp)
    const [deleting, setDeleting] = useState(null)
    const [saving, setSaving] = useState(false)

    const load = async () => {
        const { data } = await supabase.from('experience').select('*').order('sort_order')
        setItems(data || [])
    }
    useEffect(() => { load() }, [])

    const save = async () => {
        setSaving(true)
        const payload = { ...form, bullets: form.bullets.filter(b => b.trim()) }
        if (modal === 'add') {
            const { error } = await supabase.from('experience').insert({ ...payload, sort_order: items.length + 1 })
            if (error) { toast(error.message, 'error'); setSaving(false); return }
            toast('Experience added')
        } else {
            const { error } = await supabase.from('experience').update(payload).eq('id', modal.id)
            if (error) { toast(error.message, 'error'); setSaving(false); return }
            toast('Experience updated')
        }
        setSaving(false); setModal(null); load()
    }

    const del = async () => {
        await supabase.from('experience').delete().eq('id', deleting.id)
        toast('Experience deleted'); setDeleting(null); load()
    }

    const openEdit = (item) => {
        setForm({ role: item.role, company: item.company, period: item.period, location: item.location, bullets: item.bullets.length ? item.bullets : [''], logo_url: item.logo_url || '' })
        setModal(item)
    }

    const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }))
    const setBullet = (i, v) => setForm(p => { const b = [...p.bullets]; b[i] = v; return { ...p, bullets: b } })
    const addBullet = () => setForm(p => ({ ...p, bullets: [...p.bullets, ''] }))
    const removeBullet = (i) => setForm(p => ({ ...p, bullets: p.bullets.filter((_, j) => j !== i) }))

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <p className="text-muted text-sm font-dm">{items.length} positions</p>
                <Btn onClick={() => { setForm(emptyExp); setModal('add') }}>+ Add Experience</Btn>
            </div>
            <div className="flex flex-col gap-2">
                {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3 bg-surface border border-brand-border rounded-xl">
                        <div>
                            <p className="text-heading text-sm font-dm font-medium">{item.role}</p>
                            <p className="text-muted text-xs font-dm">{item.company} · {item.period}</p>
                        </div>
                        <div className="flex gap-2">
                            <Btn variant="ghost" onClick={() => openEdit(item)}>Edit</Btn>
                            <Btn variant="danger" onClick={() => setDeleting(item)}>Delete</Btn>
                        </div>
                    </div>
                ))}
            </div>

            {modal && (
                <Modal title={modal === 'add' ? 'Add Experience' : 'Edit Experience'} onClose={() => setModal(null)}>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Role" value={form.role} onChange={f('role')} placeholder="e.g. Software Engineer" required />
                            <Input label="Company" value={form.company} onChange={f('company')} placeholder="e.g. SAP" required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Period" value={form.period} onChange={f('period')} placeholder="e.g. Jan 2024 – Present" required />
                            <Input label="Location" value={form.location} onChange={f('location')} placeholder="e.g. Dublin, Ireland" required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Input label="Company Logo URL (optional)" value={form.logo_url} onChange={f('logo_url')} placeholder="e.g. https://cdn.simpleicons.org/sap/0FAAFF" />
                            {form.logo_url && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-surface rounded-lg border border-brand-border">
                                    <img src={form.logo_url} alt="" className="w-6 h-6 object-contain" onError={e => { e.target.style.display = 'none' }} />
                                    <span className="text-muted text-xs font-dm">Preview · Also works with clearbit: https://logo.clearbit.com/company.com</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-muted text-xs font-dm uppercase tracking-wider">Bullet Points</label>
                            {form.bullets.map((b, i) => (
                                <div key={i} className="flex gap-2">
                                    <input
                                        value={b} onChange={e => setBullet(i, e.target.value)}
                                        placeholder={`Bullet ${i + 1}`}
                                        className="flex-1 px-3 py-2 bg-surface border border-brand-border rounded-lg text-heading text-sm font-dm placeholder-muted focus:outline-none focus:border-ember transition-colors"
                                    />
                                    {form.bullets.length > 1 && (
                                        <button onClick={() => removeBullet(i)} className="text-muted hover:text-red-400 transition-colors px-2">×</button>
                                    )}
                                </div>
                            ))}
                            <button onClick={addBullet} className="text-ember text-sm font-dm hover:text-ember-dim transition-colors text-left">+ Add bullet</button>
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
                        <Btn onClick={save} disabled={saving || !form.role}>{saving ? 'Saving…' : 'Save'}</Btn>
                    </div>
                </Modal>
            )}
            {deleting && <ConfirmDelete name={`${deleting.role} @ ${deleting.company}`} onConfirm={del} onCancel={() => setDeleting(null)} />}
        </div>
    )
}

// ─── Projects ─────────────────────────────────────────────────────────────────

const emptyProject = { name: '', description: '', tags: '', image_url: '', link: '#' }

const ProjectsTab = ({ toast }) => {
    const [items, setItems] = useState([])
    const [modal, setModal] = useState(null)
    const [form, setForm] = useState(emptyProject)
    const [deleting, setDeleting] = useState(null)
    const [saving, setSaving] = useState(false)

    const load = async () => {
        const { data } = await supabase.from('projects').select('*').order('sort_order')
        setItems(data || [])
    }
    useEffect(() => { load() }, [])

    const toPayload = (f) => ({ ...f, tags: f.tags.split(',').map(t => t.trim()).filter(Boolean), image_url: f.image_url || null })
    const fromItem = (item) => ({ name: item.name, description: item.description, tags: item.tags.join(', '), image_url: item.image_url || '', link: item.link })

    const save = async () => {
        setSaving(true)
        const payload = toPayload(form)
        if (modal === 'add') {
            const { error } = await supabase.from('projects').insert({ ...payload, sort_order: items.length + 1 })
            if (error) { toast(error.message, 'error'); setSaving(false); return }
            toast('Project added')
        } else {
            const { error } = await supabase.from('projects').update(payload).eq('id', modal.id)
            if (error) { toast(error.message, 'error'); setSaving(false); return }
            toast('Project updated')
        }
        setSaving(false); setModal(null); load()
    }

    const del = async () => {
        await supabase.from('projects').delete().eq('id', deleting.id)
        toast('Project deleted'); setDeleting(null); load()
    }

    const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }))

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <p className="text-muted text-sm font-dm">{items.length} projects</p>
                <Btn onClick={() => { setForm(emptyProject); setModal('add') }}>+ Add Project</Btn>
            </div>
            <div className="flex flex-col gap-2">
                {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3 bg-surface border border-brand-border rounded-xl">
                        <div>
                            <p className="text-heading text-sm font-dm font-medium">{item.name}</p>
                            <p className="text-muted text-xs font-dm">{item.tags.join(', ')}</p>
                        </div>
                        <div className="flex gap-2">
                            <Btn variant="ghost" onClick={() => { setForm(fromItem(item)); setModal(item) }}>Edit</Btn>
                            <Btn variant="danger" onClick={() => setDeleting(item)}>Delete</Btn>
                        </div>
                    </div>
                ))}
            </div>

            {modal && (
                <Modal title={modal === 'add' ? 'Add Project' : 'Edit Project'} onClose={() => setModal(null)}>
                    <div className="flex flex-col gap-4">
                        <Input label="Name" value={form.name} onChange={f('name')} placeholder="Project Name" required />
                        <Textarea label="Description" value={form.description} onChange={f('description')} placeholder="What does this project do?" />
                        <Input label="Tags (comma-separated)" value={form.tags} onChange={f('tags')} placeholder="React, Node.js, PostgreSQL" />
                        <Input label="Image URL (optional)" value={form.image_url} onChange={f('image_url')} placeholder="https://..." />
                        <Input label="Link" value={form.link} onChange={f('link')} placeholder="https://..." />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
                        <Btn onClick={save} disabled={saving || !form.name}>{saving ? 'Saving…' : 'Save'}</Btn>
                    </div>
                </Modal>
            )}
            {deleting && <ConfirmDelete name={deleting.name} onConfirm={del} onCancel={() => setDeleting(null)} />}
        </div>
    )
}

// ─── Login ────────────────────────────────────────────────────────────────────

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const submit = async (e) => {
        e.preventDefault()
        setLoading(true); setError('')
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) { setError(error.message); setLoading(false) }
        else onLogin()
    }

    return (
        <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8">
                    <div className="w-2 h-2 rounded-full bg-ember mb-4" />
                    <h1 className="font-syne text-2xl font-bold text-heading">Admin Panel</h1>
                    <p className="text-muted text-sm font-dm mt-1">Sign in to manage your portfolio</p>
                </div>
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
                    <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
                    {error && <p className="text-red-400 text-sm font-dm">{error}</p>}
                    <button type="submit" disabled={loading} className="mt-2 w-full py-3 bg-ember text-obsidian font-syne font-semibold rounded-xl hover:bg-ember-dim transition-colors disabled:opacity-50">
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    )
}

// ─── Main Admin ───────────────────────────────────────────────────────────────

const TABS = ['Skills', 'Education', 'Experience', 'Projects']

const Admin = () => {
    const [session, setSession] = useState(undefined) // undefined = loading
    const [tab, setTab] = useState('Skills')
    const [toast, setToast] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
        return () => subscription.unsubscribe()
    }, [])

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    if (session === undefined) return (
        <div className="min-h-screen bg-obsidian flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-ember border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (!session) return <Login onLogin={() => {}} />

    return (
        <div className="min-h-screen bg-obsidian text-heading font-dm">
            {/* Header */}
            <div className="border-b border-brand-border px-6 md:px-10 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-ember" />
                    <span className="font-syne font-semibold text-heading">Portfolio Admin</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-muted text-xs font-dm hidden sm:block">{session.user.email}</span>
                    <Btn variant="ghost" onClick={signOut}>Sign out</Btn>
                    <a href="/" className="text-muted text-xs font-dm hover:text-heading transition-colors">← View site</a>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-surface border border-brand-border rounded-xl mb-8 w-fit">
                    {TABS.map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-4 py-2 rounded-lg text-sm font-syne font-medium transition-colors ${tab === t ? 'bg-ember text-obsidian' : 'text-subtle hover:text-heading'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="bg-void border border-brand-border rounded-2xl p-6">
                    <h2 className="font-syne text-xl font-bold text-heading mb-6">{tab}</h2>
                    {tab === 'Skills'     && <SkillsTab     toast={showToast} />}
                    {tab === 'Education'  && <EducationTab  toast={showToast} />}
                    {tab === 'Experience' && <ExperienceTab toast={showToast} />}
                    {tab === 'Projects'   && <ProjectsTab   toast={showToast} />}
                </div>
            </div>

            {toast && <Toast msg={toast.msg} type={toast.type} />}
        </div>
    )
}

export default Admin
