import { useEffect } from 'react'

export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 sm:flex sm:items-center sm:justify-center sm:px-4" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      <div className="relative w-full sm:max-w-sm surface-floating p-5 sm:p-6 animate-sheet-up sm:animate-scale-in mobile-sheet pb-safe rounded-b-none sm:rounded-2xl">
        {/* Mobile-only drag handle */}
        <div className="sm:hidden -mt-1 mb-4">
          <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto" />
        </div>

        <div className="flex items-start gap-4 mb-5">
          <div className="w-11 h-11 rounded-xl bg-clay-50 border border-clay-200/70 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-clay-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1 pt-0.5 min-w-0">
            <h3 className="font-display text-lg font-semibold tracking-tight text-stone-800 mb-1">
              {title}
            </h3>
            <p className="text-sm text-stone-500 leading-relaxed break-words">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 pt-2 border-t border-stone-200/70 mt-2">
          <button onClick={onCancel} className="btn-secondary w-full sm:w-auto justify-center">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger w-full sm:w-auto justify-center py-3 sm:py-2.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinejoin="round" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}