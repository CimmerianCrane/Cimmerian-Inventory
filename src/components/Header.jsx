import { useState } from 'react'
import { supabase } from '../lib/supabase'
import logo from '../../IMAGES/Cimmerian_Logo_nobg.png'

export default function Header({ session, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    setMenuOpen(false)
    await supabase.auth.signOut()
    onLogout()
  }

  return (
    <header className="sticky top-0 z-40 bg-stone-100/80 backdrop-blur-md border-b border-stone-200/80 pt-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand with actual logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <img
            src={logo}
            alt="Cimmerian Crane"
            className="h-8 sm:h-9 w-auto select-none flex-shrink-0"
            draggable="false"
          />
          <div className="hidden sm:flex items-center gap-2 pl-3 ml-1 border-l border-stone-200">
            <span className="font-display font-semibold text-stone-800 text-sm tracking-tight">
              Cimmerian Crane
            </span>
            <span className="text-stone-300 text-xs">/</span>
            <span className="text-stone-500 text-[11px] font-mono tracking-[0.1em] uppercase">
              Inventory
            </span>
          </div>
          {/* Mobile-only compact brand */}
          <span className="sm:hidden font-display font-semibold text-stone-800 text-sm tracking-tight truncate">
            Cimmerian
          </span>
        </div>

        {/* User / Logout — desktop inline */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-stone-150 border border-stone-200">
            <div className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-pulse-soft" />
            <span className="text-xs text-stone-600 font-mono tracking-tight truncate max-w-[180px]">
              {session?.user?.email}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="btn-ghost text-xs"
          >
            Sign Out
          </button>
        </div>

        {/* Mobile — avatar icon with menu */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="touch-target w-10 h-10 rounded-full bg-stone-800 text-stone-50 flex items-center justify-center font-display font-semibold text-sm hover:bg-stone-900 active:bg-stone-700 transition-colors"
            aria-label="Account menu"
            aria-expanded={menuOpen}
          >
            {(session?.user?.email?.[0] || '?').toUpperCase()}
          </button>

          {menuOpen && (
            <>
              <button
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              />
              <div className="absolute right-0 top-full mt-2 w-64 surface-floating p-2 animate-slide-down origin-top-right z-50">
                <div className="px-3 py-2.5 border-b border-stone-200/70 mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400 font-mono">
                    Signed in as
                  </p>
                  <p className="text-sm text-stone-700 font-medium truncate mt-0.5">
                    {session?.user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-clay-600 hover:bg-clay-50 hover:text-clay-700 transition-colors text-left"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}