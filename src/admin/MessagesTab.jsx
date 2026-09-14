import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Btn, ConfirmDelete, Empty } from './ui'

const fmt = (ts) =>
  new Date(ts).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const MessagesTab = ({ toast, onRead }) => {
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [filter, setFilter] = useState('all') // 'all' | 'unread'

  const load = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => {
    let active = true
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (active) setItems(data || []) })
    return () => { active = false }
  }, [])

  const open = async (item) => {
    setSelected(item)
    if (item.read) return
    await supabase.from('contact_messages').update({ read: true }).eq('id', item.id)
    setItems(prev => prev.map(m => m.id === item.id ? { ...m, read: true } : m))
    setSelected({ ...item, read: true })
    onRead?.()
  }

  const del = async () => {
    await supabase.from('contact_messages').delete().eq('id', deleting.id)
    toast('Message deleted')
    if (selected?.id === deleting.id) setSelected(null)
    setDeleting(null)
    load()
  }

  const unread = items.filter(m => !m.read).length
  const visible = filter === 'unread' ? items.filter(m => !m.read) : items

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="meta text-ink-2">
          {items.length} message{items.length !== 1 ? 's' : ''}{unread > 0 && ` · ${unread} unread`}
        </p>
        <div className="flex border border-rule">
          {['all', 'unread'].map(f => (
            <button key={f} type="button" onClick={() => setFilter(f)}
                    className={`meta px-3 py-1.5 ${filter === f ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <Empty>{filter === 'unread' ? 'No unread messages.' : 'No messages yet.'}</Empty>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <ul className="border-t border-rule">
            {visible.map(item => (
              <li key={item.id} className="border-b border-rule">
                <button type="button" onClick={() => open(item)}
                        className={`w-full px-3 py-3 text-left ${selected?.id === item.id ? 'bg-paper-2' : 'hover:bg-paper-2'}`}>
                  <p className={`flex items-center gap-2 truncate text-[14px] ${item.read ? 'text-ink-2' : 'font-medium text-ink'}`}>
                    {!item.read && <span className="h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />}
                    {item.name}
                  </p>
                  <p className="mt-1 truncate text-[13px] text-ink-2">{item.subject || item.message}</p>
                  <p className="meta mt-1 text-ink-2">{fmt(item.created_at)}</p>
                </button>
              </li>
            ))}
          </ul>

          {selected ? (
            <article className="border border-rule p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[17px] font-medium text-ink">{selected.subject || `Message from ${selected.name}`}</h3>
                  <p className="meta mt-1 text-ink-2">{fmt(selected.created_at)}</p>
                </div>
                <Btn variant="danger" onClick={() => setDeleting(selected)}>Delete</Btn>
              </div>

              <dl className="mt-6 grid gap-4 border-t border-rule pt-4 sm:grid-cols-2">
                <div><dt className="meta text-ink-2">From</dt><dd className="mt-1 text-[15px] text-ink">{selected.name}</dd></div>
                <div><dt className="meta text-ink-2">Email</dt><dd className="mt-1 truncate text-[15px] text-ink"><a href={`mailto:${selected.email}`} className="link decoration-rule hover:decoration-ink">{selected.email}</a></dd></div>
                {selected.company && <div><dt className="meta text-ink-2">Company</dt><dd className="mt-1 text-[15px] text-ink">{selected.company}</dd></div>}
                {selected.budget && <div><dt className="meta text-ink-2">Budget</dt><dd className="mt-1 text-[15px] text-ink">{selected.budget}</dd></div>}
              </dl>

              <p className="mt-6 whitespace-pre-wrap text-[15px] leading-[1.6] text-ink">{selected.message}</p>

              <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Your message')}`}
                 className="mt-8 inline-block bg-ink px-4 py-2.5 text-[13px] font-medium text-paper hover:bg-accent">
                Reply by email
              </a>
            </article>
          ) : (
            <Empty>Select a message to read it.</Empty>
          )}
        </div>
      )}

      {deleting && <ConfirmDelete name={`message from ${deleting.name}`} onConfirm={del} onCancel={() => setDeleting(null)} />}
    </div>
  )
}

export default MessagesTab
