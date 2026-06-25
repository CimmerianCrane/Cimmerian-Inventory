import { useState } from 'react'
import { supabase } from '../lib/supabase'
import logo from '../../IMAGES/Cimmerian_Logo_nobg.png'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    onLogin(data.session)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden pt-safe pb-safe">
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft radial washes */}
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] bg-amber-500/8 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[520px] h-[520px] bg-indigo-500/8 rounded-full blur-[140px]" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `linear-gradient(rgba(140, 126, 100, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(140, 126, 100, 0.08) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          }}
        />
      </div>

      <div className="w-full max-w-[420px] relative z-10 animate-slide-up">
        {/* Brand block */}
        <div className="text-center mb-7 sm:mb-10">
          <div className="inline-block mb-5 sm:mb-8">
            <img
              src={logo}
              alt="Cimmerian Crane"
              className="h-28 sm:h-40 w-auto mx-auto select-none"
              draggable="false"
            />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tighter text-stone-800 leading-none">
            Cimmerian Crane
          </h1>
          <div className="mt-3 inline-flex items-center gap-2">
            <span className="h-px w-6 bg-stone-300" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500 font-mono">
              Parts Inventory
            </span>
            <span className="h-px w-6 bg-stone-300" />
          </div>
        </div>

        {/* Login card */}
        <div className="surface-elevated p-6 sm:p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="mb-6 sm:mb-7">
            <h2 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-stone-800">
              Sign In
            </h2>
            <p className="mt-1 text-xs text-stone-500 font-mono tracking-wider">
              Authorized personnel only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-eyebrow block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@cimmerian.com"
                required
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                className="input-field py-3 sm:py-2.5"
              />
            </div>
            <div>
              <label className="label-eyebrow block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                autoComplete="current-password"
                className="input-field py-3 sm:py-2.5"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-clay-50 border border-clay-200/70 rounded-xl px-4 py-3 text-sm text-clay-700 animate-slide-down">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="break-words">{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 sm:py-3 mt-2 text-base sm:text-sm">
              {loading ? (
                <div className="w-4 h-4 border-2 border-stone-50/30 border-t-stone-50 rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-[11px] text-stone-500 font-mono tracking-wider">
            Cimmerian Crane Services © {new Date().getFullYear()}
          </p>
        </div>
      </div>

      <div className="grain-overlay" />
    </div>
  )
}