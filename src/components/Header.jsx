import { supabase } from '../lib/supabase'
import logo from '../../IMAGES/Cimmerian_Logo_nobg.png'

export default function Header({ session, onLogout }) {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    onLogout()
  }

  return (
    <header className="sticky top-0 z-40 bg-stone-100/80 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand with actual logo */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Cimmerian Crane"
            className="h-9 w-auto select-none"
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
        </div>

        {/* User / Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-stone-150 border border-stone-200">
            <div className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-pulse-soft" />
            <span className="text-xs text-stone-600 font-mono tracking-tight">
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
      </div>
    </header>
  )
}