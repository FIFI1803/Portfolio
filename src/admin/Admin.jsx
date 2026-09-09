import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// ─── Reusable UI ────────────────────────────────────────────────────────────

const Btn = ({ children, onClick, variant = 'primary', type = 'button', disabled }) => {
    const base = 'px-4 py-2 rounded-lg font-sans text-sm font-medium transition-colors disabled:opacity-40'
    const variants = {
        primary:  'bg-noir-ink text-noir hover:bg-noir-ink-2',
        ghost:    'border border-noir-rule text-noir-ink-2 hover:text-noir-ink hover:border-noir-ink-2',
        danger:   'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
    }
    return <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>{children}</button>
}

const Input = ({ label, value, onChange, type = 'text', placeholder, required }) => (
    <div className="flex flex-col gap-1.5">
        {label && <label className="text-noir-ink-3 text-xs font-sans uppercase tracking-wider">{label}</label>}
        <input
            type={type} value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} required={required}
            className="px-3 py-2.5 bg-noir-2 border border-noir-rule rounded-lg text-noir-ink text-sm font-sans placeholder-noir-ink-3 focus:outline-none focus:border-noir-ink transition-colors"
        />
    </div>
)

const Textarea = ({ label, value, onChange, rows = 3, placeholder }) => (
    <div className="flex flex-col gap-1.5">
        {label && <label className="text-noir-ink-3 text-xs font-sans uppercase tracking-wider">{label}</label>}
        <textarea
            value={value} onChange={e => onChange(e.target.value)}
            rows={rows} placeholder={placeholder}
            className="px-3 py-2.5 bg-noir-2 border border-noir-rule rounded-lg text-noir-ink text-sm font-sans placeholder-noir-ink-3 focus:outline-none focus:border-noir-ink transition-colors resize-none"
        />
    </div>
)

const Toggle = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-3 cursor-pointer">
        <div
            onClick={() => onChange(!checked)}
            className={`w-10 h-6 rounded-full transition-colors relative ${checked ? 'bg-noir-ink' : 'bg-noir-2'}`}
        >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
        </div>
        <span className="text-noir-ink-2 text-sm font-sans">{label}</span>
    </label>
)

const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="absolute inset-0 bg-noir/80 backdrop-blur-sm" />
        <div className="relative z-10 w-full max-w-lg bg-noir border border-noir-rule rounded-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-noir-ink">{title}</h3>
                <button onClick={onClose} className="text-noir-ink-3 hover:text-noir-ink transition-colors text-xl leading-none">×</button>
            </div>
            {children}
        </div>
    </div>
)

const ConfirmDelete = ({ name, onConfirm, onCancel }) => (
    <Modal title="Confirm Delete" onClose={onCancel}>
        <p className="text-noir-ink-2 text-sm font-sans">Delete <span className="text-noir-ink font-medium">"{name}"</span>? This cannot be undone.</p>
        <div className="flex gap-3 justify-end">
            <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
            <Btn variant="danger" onClick={onConfirm}>Delete</Btn>
        </div>
    </Modal>
)

const Toast = ({ msg, type }) => (
    <div className={`fixed bottom-6 right-6 z-[200] px-5 py-3 rounded-xl font-sans text-sm shadow-xl border ${type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-noir-ink/10 border-noir-ink/30 text-noir-ink'}`}>
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
    useEffect(() => {
        let active = true
        supabase.from('skills').select('*').order('sort_order')
            .then(({ data }) => { if (active) setItems(data || []) })
        return () => { active = false }
    }, [])

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
                <p className="text-noir-ink-3 text-sm font-sans">{items.length} skills</p>
                <Btn onClick={openAdd}>+ Add Skill</Btn>
            </div>
            <div className="flex flex-col gap-2">
                {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3 bg-noir-2 border border-noir-rule rounded-xl">
                        <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-sans border ${item.accent ? 'bg-noir-ink/10 text-noir-ink border-noir-ink/25' : 'bg-noir-2 text-noir-ink-2 border-noir-rule'}`}>{item.name}</span>
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
                                <div className="flex items-center gap-2 px-3 py-2 bg-noir-2 rounded-lg border border-noir-rule">
                                    <img src={`https://cdn.simpleicons.org/${form.icon_name}`} alt="" className="w-5 h-5" onError={e => { e.target.style.display = 'none' }} />
                                    <span className="text-noir-ink-3 text-xs font-sans">Preview</span>
                                </div>
                            )}
                            <a href="https://simpleicons.org" target="_blank" rel="noreferrer" className="text-noir-ink/60 text-xs font-sans hover:text-noir-ink transition-colors">Browse icon slugs at simpleicons.org ↗</a>
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
    useEffect(() => {
        let active = true
        supabase.from('education').select('*').order('sort_order')
            .then(({ data }) => { if (active) setItems(data || []) })
        return () => { active = false }
    }, [])

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
                <p className="text-noir-ink-3 text-sm font-sans">{items.length} entries</p>
                <Btn onClick={() => { setForm(emptyEdu); setModal('add') }}>+ Add Entry</Btn>
            </div>
            <div className="flex flex-col gap-2">
                {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3 bg-noir-2 border border-noir-rule rounded-xl">
                        <div>
                            <p className="text-noir-ink text-sm font-sans font-medium">{item.title}</p>
                            <p className="text-noir-ink-3 text-xs font-sans">{item.subtitle} · {item.period}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-display uppercase tracking-wide text-noir-ink">{item.type}</span>
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
                            <label className="text-noir-ink-3 text-xs font-sans uppercase tracking-wider">Type</label>
                            <select value={form.type} onChange={e => f('type')(e.target.value)} className="px-3 py-2.5 bg-noir-2 border border-noir-rule rounded-lg text-noir-ink text-sm font-sans focus:outline-none focus:border-noir-ink transition-colors">
                                <option value="education">Education</option>
                                <option value="certification">Certification</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Input label="Icon URL (optional)" value={form.icon_url} onChange={f('icon_url')} placeholder="e.g. https://cdn.simpleicons.org/amazonaws/FF9900" />
                            {form.icon_url && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-noir-2 rounded-lg border border-noir-rule">
                                    <img src={form.icon_url} alt="" className="w-5 h-5 object-contain" onError={e => { e.target.style.display = 'none' }} />
                                    <span className="text-noir-ink-3 text-xs font-sans">Preview</span>
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
    useEffect(() => {
        let active = true
        supabase.from('experience').select('*').order('sort_order')
            .then(({ data }) => { if (active) setItems(data || []) })
        return () => { active = false }
    }, [])

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
                <p className="text-noir-ink-3 text-sm font-sans">{items.length} positions</p>
                <Btn onClick={() => { setForm(emptyExp); setModal('add') }}>+ Add Experience</Btn>
            </div>
            <div className="flex flex-col gap-2">
                {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3 bg-noir-2 border border-noir-rule rounded-xl">
                        <div>
                            <p className="text-noir-ink text-sm font-sans font-medium">{item.role}</p>
                            <p className="text-noir-ink-3 text-xs font-sans">{item.company} · {item.period}</p>
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
                                <div className="flex items-center gap-2 px-3 py-2 bg-noir-2 rounded-lg border border-noir-rule">
                                    <img src={form.logo_url} alt="" className="w-6 h-6 object-contain" onError={e => { e.target.style.display = 'none' }} />
                                    <span className="text-noir-ink-3 text-xs font-sans">Preview · Also works with clearbit: https://logo.clearbit.com/company.com</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-noir-ink-3 text-xs font-sans uppercase tracking-wider">Bullet Points</label>
                            {form.bullets.map((b, i) => (
                                <div key={i} className="flex gap-2">
                                    <input
                                        value={b} onChange={e => setBullet(i, e.target.value)}
                                        placeholder={`Bullet ${i + 1}`}
                                        className="flex-1 px-3 py-2 bg-noir-2 border border-noir-rule rounded-lg text-noir-ink text-sm font-sans placeholder-noir-ink-3 focus:outline-none focus:border-noir-ink transition-colors"
                                    />
                                    {form.bullets.length > 1 && (
                                        <button onClick={() => removeBullet(i)} className="text-noir-ink-3 hover:text-red-400 transition-colors px-2">×</button>
                                    )}
                                </div>
                            ))}
                            <button onClick={addBullet} className="text-noir-ink text-sm font-sans hover:text-noir-ink-2 transition-colors text-left">+ Add bullet</button>
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
    useEffect(() => {
        let active = true
        supabase.from('projects').select('*').order('sort_order')
            .then(({ data }) => { if (active) setItems(data || []) })
        return () => { active = false }
    }, [])

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
                <p className="text-noir-ink-3 text-sm font-sans">{items.length} projects</p>
                <Btn onClick={() => { setForm(emptyProject); setModal('add') }}>+ Add Project</Btn>
            </div>
            <div className="flex flex-col gap-2">
                {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3 bg-noir-2 border border-noir-rule rounded-xl">
                        <div>
                            <p className="text-noir-ink text-sm font-sans font-medium">{item.name}</p>
                            <p className="text-noir-ink-3 text-xs font-sans">{item.tags.join(', ')}</p>
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

// ─── Messages ─────────────────────────────────────────────────────────────────

const MessagesTab = ({ toast, onRead }) => {
    const [items, setItems] = useState([])
    const [selected, setSelected] = useState(null)
    const [deleting, setDeleting] = useState(null)
    const [filter, setFilter] = useState('all') // 'all' | 'unread'

    const load = async () => {
        const { data } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false })
        setItems(data || [])
    }
    useEffect(() => {
        let active = true
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
            .then(({ data }) => { if (active) setItems(data || []) })
        return () => { active = false }
    }, [])

    const markRead = async (item) => {
        if (item.read) return
        await supabase.from('contact_messages').update({ read: true }).eq('id', item.id)
        setItems(prev => prev.map(m => m.id === item.id ? { ...m, read: true } : m))
        if (selected?.id === item.id) setSelected({ ...item, read: true })
        onRead?.()
    }

    const open = (item) => {
        setSelected(item)
        markRead(item)
    }

    const del = async () => {
        await supabase.from('contact_messages').delete().eq('id', deleting.id)
        toast('Message deleted')
        if (selected?.id === deleting.id) setSelected(null)
        setDeleting(null)
        load()
    }

    const fmt = (ts) => new Date(ts).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

    const unreadCount = items.filter(m => !m.read).length
    const visible = filter === 'unread' ? items.filter(m => !m.read) : items

    return (
        <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <p className="text-noir-ink-3 text-sm font-sans">{items.length} message{items.length !== 1 ? 's' : ''}</p>
                    {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-noir-ink/15 text-noir-ink text-xs font-display font-semibold">
                            {unreadCount} unread
                        </span>
                    )}
                </div>
                <div className="flex gap-1 p-1 bg-noir-2 border border-noir-rule rounded-lg">
                    {['all', 'unread'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded-md text-xs font-display font-medium transition-colors capitalize ${filter === f ? 'bg-noir-ink text-noir' : 'text-noir-ink-2 hover:text-noir-ink'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {visible.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-noir-2 border border-noir-rule flex items-center justify-center">
                        <svg className="w-5 h-5 text-noir-ink-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-noir-ink-3 text-sm font-sans">{filter === 'unread' ? 'No unread messages' : 'No messages yet'}</p>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* List */}
                    <div className="flex flex-col gap-1.5 lg:w-72 shrink-0">
                        {visible.map(item => (
                            <button
                                key={item.id}
                                onClick={() => open(item)}
                                className={`text-left px-4 py-3 rounded-xl border transition-colors ${
                                    selected?.id === item.id
                                        ? 'bg-noir-ink/10 border-noir-ink/30'
                                        : 'bg-noir-2 border-noir-rule hover:border-noir-ink-2'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <span className={`text-sm font-sans truncate ${item.read ? 'text-noir-ink-2' : 'text-noir-ink font-medium'}`}>
                                        {item.name}
                                    </span>
                                    {!item.read && <span className="w-2 h-2 rounded-full bg-noir-ink shrink-0 mt-1.5" />}
                                </div>
                                <p className="text-noir-ink-3 text-xs font-sans truncate">{item.subject || item.message}</p>
                                <p className="text-noir-ink-3/60 text-[11px] font-sans mt-1">{fmt(item.created_at)}</p>
                            </button>
                        ))}
                    </div>

                    {/* Detail pane */}
                    {selected ? (
                        <div className="flex-1 bg-noir-2 border border-noir-rule rounded-xl p-5 flex flex-col gap-4 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-display text-lg font-semibold text-noir-ink">{selected.subject || '(No subject)'}</h3>
                                    <p className="text-noir-ink-3 text-xs font-sans mt-1">{fmt(selected.created_at)}</p>
                                </div>
                                <Btn variant="danger" onClick={() => setDeleting(selected)}>Delete</Btn>
                            </div>

                            {/* Sender info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-noir-2 rounded-xl border border-noir-rule text-sm font-sans">
                                <div>
                                    <span className="text-noir-ink-3 text-xs uppercase tracking-wider">From</span>
                                    <p className="text-noir-ink mt-0.5">{selected.name}</p>
                                </div>
                                <div>
                                    <span className="text-noir-ink-3 text-xs uppercase tracking-wider">Email</span>
                                    <a href={`mailto:${selected.email}`} className="text-noir-ink block mt-0.5 hover:text-noir-ink-2 transition-colors truncate">{selected.email}</a>
                                </div>
                                {selected.company && (
                                    <div>
                                        <span className="text-noir-ink-3 text-xs uppercase tracking-wider">Company</span>
                                        <p className="text-noir-ink mt-0.5">{selected.company}</p>
                                    </div>
                                )}
                                {selected.budget && (
                                    <div>
                                        <span className="text-noir-ink-3 text-xs uppercase tracking-wider">Budget</span>
                                        <p className="text-noir-ink mt-0.5">{selected.budget}</p>
                                    </div>
                                )}
                            </div>

                            {/* Message body */}
                            <div className="flex-1">
                                <span className="text-noir-ink-3 text-xs uppercase tracking-wider font-sans">Message</span>
                                <p className="text-noir-ink-2 text-sm font-sans mt-2 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                            </div>

                            <a
                                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Your message')}`}
                                className="self-start px-5 py-2.5 bg-noir-ink text-noir font-display font-semibold rounded-full hover:bg-noir-ink-2 transition-colors text-sm"
                            >
                                Reply via email →
                            </a>
                        </div>
                    ) : (
                        <div className="flex-1 bg-noir-2 border border-noir-rule rounded-xl flex items-center justify-center py-16 text-noir-ink-3 text-sm font-sans">
                            Select a message to read
                        </div>
                    )}
                </div>
            )}

            {deleting && <ConfirmDelete name={`message from ${deleting.name}`} onConfirm={del} onCancel={() => setDeleting(null)} />}
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
        <div className="min-h-screen bg-noir flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8">
                    <div className="w-2 h-2 rounded-full bg-noir-ink mb-4" />
                    <h1 className="font-display text-2xl font-bold text-noir-ink">Admin Panel</h1>
                    <p className="text-noir-ink-3 text-sm font-sans mt-1">Sign in to manage your portfolio</p>
                </div>
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
                    <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
                    {error && <p className="text-red-400 text-sm font-sans">{error}</p>}
                    <button type="submit" disabled={loading} className="mt-2 w-full py-3 bg-noir-ink text-noir font-display font-semibold rounded-xl hover:bg-noir-ink-2 transition-colors disabled:opacity-50">
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    )
}

// ─── Main Admin ───────────────────────────────────────────────────────────────

const TABS = ['Skills', 'Education', 'Experience', 'Projects', 'Messages']

const Admin = () => {
    const [session, setSession] = useState(undefined) // undefined = loading
    const [tab, setTab] = useState('Skills')
    const [toast, setToast] = useState(null)
    const [unreadCount, setUnreadCount] = useState(0)

    const loadUnread = async () => {
        const { count } = await supabase
            .from('contact_messages')
            .select('*', { count: 'exact', head: true })
            .eq('read', false)
        setUnreadCount(count || 0)
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); if (session) loadUnread() })
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => { setSession(s); if (s) loadUnread() })
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
        <div className="min-h-screen bg-noir flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-noir-ink border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (!session) return <Login onLogin={() => {}} />

    return (
        <div className="min-h-screen bg-noir text-noir-ink font-sans">
            {/* Header */}
            <div className="border-b border-noir-rule px-6 md:px-10 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-noir-ink" />
                    <span className="font-display font-semibold text-noir-ink">Portfolio Admin</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-noir-ink-3 text-xs font-sans hidden sm:block">{session.user.email}</span>
                    <Btn variant="ghost" onClick={signOut}>Sign out</Btn>
                    <a href="/" className="text-noir-ink-3 text-xs font-sans hover:text-noir-ink transition-colors">← View site</a>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
                {/* Tabs */}
                <div className="flex flex-wrap gap-1 p-1 bg-noir-2 border border-noir-rule rounded-xl mb-8 w-fit">
                    {TABS.map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`relative px-4 py-2 rounded-lg text-sm font-display font-medium transition-colors ${tab === t ? 'bg-noir-ink text-noir' : 'text-noir-ink-2 hover:text-noir-ink'}`}
                        >
                            {t}
                            {t === 'Messages' && unreadCount > 0 && (
                                <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${tab === t ? 'bg-noir text-noir-ink' : 'bg-noir-ink text-noir'}`}>
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="bg-noir border border-noir-rule rounded-2xl p-6">
                    <h2 className="font-display text-xl font-bold text-noir-ink mb-6">{tab}</h2>
                    {tab === 'Skills'     && <SkillsTab     toast={showToast} />}
                    {tab === 'Education'  && <EducationTab  toast={showToast} />}
                    {tab === 'Experience' && <ExperienceTab toast={showToast} />}
                    {tab === 'Projects'   && <ProjectsTab   toast={showToast} />}
                    {tab === 'Messages'   && <MessagesTab   toast={showToast} onRead={loadUnread} />}
                </div>
            </div>

            {toast && <Toast msg={toast.msg} type={toast.type} />}
        </div>
    )
}

export default Admin
