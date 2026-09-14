import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { site as localSite } from '../content'
import { Btn, Input, Textarea } from './ui'

const GROUPS = [
  { title: 'Hero', fields: [
    ['tagline', 'Tagline', 'textarea'],
    ['role', 'Role'], ['company', 'Company'], ['focus', 'Focus'], ['location', 'Based'],
    ['availability', 'Availability line', 'text', 'Shown beside the name. Leave empty to hide.'],
  ]},
  { title: 'About', fields: [
    ['about_statement', 'Statement', 'textarea'],
    ['about_body', 'Story', 'textarea', 'Blank line between paragraphs.', 12],
  ]},
  { title: 'Contact & meta', fields: [
    ['email', 'Email'], ['github', 'GitHub URL'], ['linkedin', 'LinkedIn URL'],
    ['cv_url', 'CV URL', 'text', 'Path to the PDF in /public, e.g. /filip-galach-cv.pdf'],
    ['location_short', 'Short location', 'text', 'Navigation and footer, e.g. Dublin / IE'],
    ['now_updated', '“Right now” updated', 'text', 'e.g. Sep 2026'],
  ]},
]

const KEYS = GROUPS.flatMap(g => g.fields.map(([k]) => k))

const SiteTab = ({ toast }) => {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    supabase.from('site').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      if (!active) return
      const base = Object.fromEntries(KEYS.map(k => [k, data?.[k] ?? localSite[k] ?? '']))
      setForm(base)
    })
    return () => { active = false }
  }, [])

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = Object.fromEntries(KEYS.map(k => [k, String(form[k] ?? '').trim() || null]))
    const { error } = await supabase.from('site').upsert({ id: 1, ...payload, updated_at: new Date().toISOString() })
    setSaving(false)
    if (error) { toast(error.message, 'error'); return }
    toast('Site saved')
  }

  if (!form) return null

  return (
    <form onSubmit={save} className="flex flex-col gap-10">
      {GROUPS.map(g => (
        <fieldset key={g.title} className="flex flex-col gap-5 border-t border-rule pt-5">
          <legend className="meta pr-3 text-ink">{g.title}</legend>
          {g.fields.map(([key, label, type = 'text', hint, rows]) =>
            type === 'textarea'
              ? <Textarea key={key} id={key} label={label} value={form[key]} onChange={set(key)} hint={hint} rows={rows || 3} />
              : <Input key={key} id={key} label={label} value={form[key]} onChange={set(key)} hint={hint} />
          )}
        </fieldset>
      ))}
      <div className="flex justify-end">
        <Btn type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save site'}</Btn>
      </div>
    </form>
  )
}

export default SiteTab
