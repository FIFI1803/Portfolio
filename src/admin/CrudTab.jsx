import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Btn, Input, Textarea, Select, Toggle, Modal, ConfirmDelete, Empty } from './ui'

/*
  One editor for every list table, driven by a config (see tabs.js):

    table     Supabase table name
    singular  'project' — used in buttons and toasts
    order     { column, ascending } — how rows are listed
    reorder   true → ↑/↓ buttons rewrite sort_order for the whole list
    summary   (item) => { title, sub, muted }
    fields    [{ key, label, type, ... }]

  Field types: text | textarea | tags (array ↔ comma list) | lines (array ↔
  one per line) | select | toggle | date. `nullable` stores '' as null.
*/

const toForm = (fields, item) => {
  const f = {}
  for (const field of fields) {
    const v = item?.[field.key]
    if (field.type === 'tags') f[field.key] = (v || []).join(', ')
    else if (field.type === 'lines') f[field.key] = (v || []).join('\n')
    else if (field.type === 'toggle') f[field.key] = v ?? field.default ?? false
    else f[field.key] = v ?? field.default ?? ''
  }
  return f
}

const toPayload = (fields, form) => {
  const p = {}
  for (const field of fields) {
    const v = form[field.key]
    if (field.type === 'tags') p[field.key] = String(v).split(',').map(s => s.trim()).filter(Boolean)
    else if (field.type === 'lines') p[field.key] = String(v).split('\n').map(s => s.trim()).filter(Boolean)
    else if (field.type === 'toggle') p[field.key] = !!v
    else {
      const t = typeof v === 'string' ? v.trim() : v
      p[field.key] = t === '' && field.nullable ? null : t
    }
  }
  return p
}

const missingRequired = (fields, form) =>
  fields.some(f => f.required && !String(form[f.key] ?? '').trim())

const Field = ({ field, value, onChange }) => {
  const id = `f-${field.key}`
  const common = { id, label: field.label, value, onChange, placeholder: field.placeholder, hint: field.hint }
  switch (field.type) {
    case 'textarea': return <Textarea {...common} rows={field.rows || 4} />
    case 'lines': return <Textarea {...common} rows={field.rows || 6} hint={field.hint || 'One per line'} />
    case 'tags': return <Input {...common} hint={field.hint || 'Comma-separated'} />
    case 'select': return <Select {...common} options={field.options} />
    case 'toggle': return <Toggle id={id} label={field.label} checked={value} onChange={onChange} hint={field.hint} />
    case 'date': return <Input {...common} type="date" required={field.required} />
    default: return <Input {...common} required={field.required} />
  }
}

const CrudTab = ({ config, toast }) => {
  const { table, singular, order = { column: 'sort_order', ascending: true }, reorder = false, summary, fields } = config
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | item
  const [form, setForm] = useState({})
  const [deleting, setDeleting] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data, error } = await supabase.from(table).select('*').order(order.column, { ascending: order.ascending })
    if (error) toast(error.message, 'error')
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    let active = true
    supabase.from(table).select('*').order(order.column, { ascending: order.ascending })
      .then(({ data, error }) => {
        if (!active) return
        if (error) toast(error.message, 'error')
        setItems(data || [])
        setLoading(false)
      })
    return () => { active = false }
  }, [table]) // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd = () => { setForm(toForm(fields, null)); setModal('add') }
  const openEdit = (item) => { setForm(toForm(fields, item)); setModal(item) }
  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }))

  const save = async () => {
    setSaving(true)
    const payload = toPayload(fields, form)
    const result = modal === 'add'
      ? await supabase.from(table).insert(reorder ? { ...payload, sort_order: items.length + 1 } : payload)
      : await supabase.from(table).update(payload).eq('id', modal.id)
    setSaving(false)
    if (result.error) { toast(result.error.message, 'error'); return }
    toast(modal === 'add' ? `${cap(singular)} added` : `${cap(singular)} updated`)
    setModal(null)
    load()
  }

  const del = async () => {
    const { error } = await supabase.from(table).delete().eq('id', deleting.id)
    if (error) toast(error.message, 'error'); else toast(`${cap(singular)} deleted`)
    setDeleting(null)
    load()
  }

  /* Move one row and renumber the whole list so sort_order is always 1..n. */
  const move = async (index, dir) => {
    const next = [...items]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setItems(next)
    const results = await Promise.all(
      next.map((item, i) => supabase.from(table).update({ sort_order: i + 1 }).eq('id', item.id)),
    )
    const failed = results.find(r => r.error)
    if (failed) { toast(failed.error.message, 'error'); load() }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="meta text-ink-2">{items.length} {items.length === 1 ? singular : `${singular}s`}</p>
        <Btn onClick={openAdd}>Add {singular}</Btn>
      </div>

      {loading ? null : items.length === 0 ? (
        <Empty>Nothing here yet. Add the first {singular}.</Empty>
      ) : (
        <ul className="border-t border-rule">
          {items.map((item, i) => {
            const s = summary(item)
            return (
              <li key={item.id} className="flex items-center gap-4 border-b border-rule py-3">
                {reorder && (
                  <div className="flex shrink-0 flex-col gap-1">
                    <Btn variant="icon" onClick={() => move(i, -1)} disabled={i === 0} title="Move up">↑</Btn>
                    <Btn variant="icon" onClick={() => move(i, 1)} disabled={i === items.length - 1} title="Move down">↓</Btn>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-[15px] font-medium ${s.muted ? 'text-ink-2 line-through decoration-rule' : 'text-ink'}`}>{s.title}</p>
                  {s.sub && <p className="meta mt-1 truncate text-ink-2">{s.sub}</p>}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Btn variant="ghost" onClick={() => openEdit(item)}>Edit</Btn>
                  <Btn variant="danger" onClick={() => setDeleting(item)}>Delete</Btn>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {modal && (
        <Modal title={modal === 'add' ? `Add ${singular}` : `Edit ${singular}`} onClose={() => setModal(null)}>
          <form onSubmit={(e) => { e.preventDefault(); save() }} className="flex flex-col gap-5">
            {fields.map(field => (
              <Field key={field.key} field={field} value={form[field.key]} onChange={set(field.key)} />
            ))}
            <div className="mt-2 flex justify-end gap-3">
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" disabled={saving || missingRequired(fields, form)}>{saving ? 'Saving…' : 'Save'}</Btn>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDelete name={summary(deleting).title} onConfirm={del} onCancel={() => setDeleting(null)} />
      )}
    </div>
  )
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export default CrudTab
