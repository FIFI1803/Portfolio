import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Btn, Input, Toast } from './ui'
import CrudTab from './CrudTab'
import SiteTab from './SiteTab'
import MessagesTab from './MessagesTab'
import * as tabs from './tabs'

const TABS = [
  ['Site', null],
  ['Projects', tabs.projects],
  ['Experience', tabs.experience],
  ['Education', tabs.education],
  ['Skills', tabs.skills],
  ['Now', tabs.now],
  ['Notes', tabs.notes],
  ['Messages', null],
]

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-gutter text-ink">
      <form onSubmit={submit} className="w-full max-w-sm">
        <p className="display text-[17px]">FG<span className="text-accent">.</span></p>
        <h1 className="mt-6 text-[22px] font-medium tracking-[-0.02em]">Admin</h1>
        <div className="mt-8 flex flex-col gap-4">
          <Input id="email" label="Email" type="email" value={email} onChange={setEmail} required />
          <Input id="password" label="Password" type="password" value={password} onChange={setPassword} required />
          {error && <p role="alert" className="text-[13px] text-accent">{error}</p>}
          <Btn type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Btn>
        </div>
      </form>
    </main>
  )
}

const Admin = () => {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [tab, setTab] = useState('Site')
  const [toast, setToast] = useState(null)
  const [unread, setUnread] = useState(0)

  const loadUnread = async () => {
    const { count } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('read', false)
    setUnread(count || 0)
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

  if (session === undefined) return <div className="min-h-screen bg-paper" />
  if (!session) return <Login />

  const config = TABS.find(([name]) => name === tab)?.[1]

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-rule px-gutter">
        <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between">
          <a href="/" className="display text-[17px]">FG<span className="text-accent">.</span></a>
          <div className="flex items-center gap-5">
            <span className="meta hidden text-ink-2 sm:block">{session.user.email}</span>
            <a href="/" className="meta text-ink-2 hover:text-ink">View site</a>
            <Btn variant="ghost" onClick={() => supabase.auth.signOut()}>Sign out</Btn>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-gutter py-8 md:py-12">
        <nav aria-label="Admin sections" className="-mx-gutter overflow-x-auto px-gutter">
          <ul className="flex min-w-max border-b border-rule">
            {TABS.map(([name]) => (
              <li key={name}>
                <button type="button" onClick={() => setTab(name)} aria-current={tab === name ? 'page' : undefined}
                        className={`meta -mb-px flex items-center gap-2 border-b-2 px-3 py-3 ${tab === name ? 'border-ink text-ink' : 'border-transparent text-ink-2 hover:text-ink'}`}>
                  {name}
                  {name === 'Messages' && unread > 0 && (
                    <span className="bg-accent px-1.5 py-0.5 text-[10px] text-paper">{unread > 9 ? '9+' : unread}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <section className="mt-8 md:mt-10" aria-label={tab}>
          <h2 className="display mb-8 text-[clamp(2rem,4vw,3rem)]">{tab}</h2>
          {tab === 'Site' && <SiteTab toast={showToast} />}
          {tab === 'Messages' && <MessagesTab toast={showToast} onRead={loadUnread} />}
          {tab !== 'Site' && tab !== 'Messages' && <CrudTab key={tab} config={config} toast={showToast} />}
        </section>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  )
}

export default Admin
