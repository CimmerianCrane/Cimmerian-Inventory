import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-5 animate-fade-in">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-stone-200" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-500 animate-spin" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
              Initializing
            </span>
            <span className="text-xs font-display tracking-tight text-stone-700">
              Cimmerian Crane
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (!session) return <Login onLogin={setSession} />

  return <Dashboard session={session} onLogout={() => setSession(null)} />
}