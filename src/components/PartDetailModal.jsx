import { useEffect } from 'react'
import QRCodeDisplay from './QRCodeDisplay'

export default function PartDetailModal({ part, onClose, onEdit, onPrint, onDelete }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!part) return null

  const isLow =
    part.quantity != null && part.min_stock != null && part.quantity < part.min_stock

  const fields = [
    { label: 'Category', value: part.category, mono: false },
    { label: 'Supplier', value: part.supplier, mono: false },
    { label: 'Location', value: part.location, mono: true },
    { label: 'Quantity', value: part.quantity, mono: true },
    { label: 'Min Stock', value: part.min_stock, mono: true },
  ]

  return (
    <div className="fixed inset-0 z-50 sm:flex sm:items-center sm:justify-center sm:px-4 sm:py-6" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal / Bottom Sheet */}
      <div className="relative w-full sm:max-w-2xl surface-floating max-h-[92vh] sm:max-h-[90vh] overflow-y-auto scroll-smooth-momentum animate-sheet-up sm:animate-scale-in mobile-sheet pb-safe">
        {/* Mobile-only drag handle */}
        <div className="sm:hidden sticky top-0 z-10 bg-white pt-2 pb-1">
          <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto" />
        </div>

        {/* Header */}
        <div className="sticky sm:relative top-8 sm:top-auto z-10 sm:z-auto bg-white flex items-start justify-between gap-4 px-5 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-5 border-b border-stone-200">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <span className="label-eyebrow">Part Details</span>
              {isLow && (
                <span className="badge-clay text-[10px]">Low Stock</span>
              )}
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tighter text-stone-800 leading-tight truncate">
              {part.part_name || 'Unnamed Part'}
            </h2>
            {part.part_number && (
              <p className="mt-1 text-sm font-mono text-stone-500 tracking-wide truncate">
                {part.part_number}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="touch-target -mr-2 p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-150 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body: stacked on mobile, two-column on desktop */}
        <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-6 sm:grid sm:grid-cols-[auto_1fr] sm:gap-7 sm:space-y-0">
          {/* QR column */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <div className="surface-card p-4 bg-stone-100/40">
              <QRCodeDisplay
                value={part.part_number || part.id}
                size={140}
                caption="Scan for lookup"
                className="sm:[&_svg]:!w-[168px] sm:[&_svg]:!h-[168px]"
              />
            </div>
            <div className="text-[10px] text-stone-400 font-mono tracking-wider text-center sm:text-left max-w-[180px] leading-relaxed">
              Encodes part number · scannable from dashboard
            </div>
          </div>

          {/* Details column */}
          <div className="space-y-5 min-w-0">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {fields.map((f) => (
                <div key={f.label} className="min-w-0">
                  <p className="label-eyebrow mb-1.5">{f.label}</p>
                  <p className={`text-sm text-stone-800 truncate ${f.mono ? 'font-mono' : 'font-medium'}`}>
                    {f.value ?? '—'}
                  </p>
                </div>
              ))}
            </div>

            {part.notes && (
              <div className="pt-4 border-t border-stone-200/70">
                <p className="label-eyebrow mb-2">Notes</p>
                <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap break-words">
                  {part.notes}
                </p>
              </div>
            )}

            {/* Stock indicator strip */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
              isLow
                ? 'bg-clay-50 border-clay-200/70'
                : 'bg-sage-50 border-sage-200/70'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isLow ? 'bg-clay-500' : 'bg-sage-500'} animate-pulse-soft`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${isLow ? 'text-clay-700' : 'text-sage-700'}`}>
                  {isLow ? 'Below reorder threshold' : 'Stock level healthy'}
                </p>
                <p className="text-[11px] text-stone-500 font-mono">
                  {part.quantity ?? '—'} on hand · min {part.min_stock ?? '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 z-10 bg-stone-100/95 backdrop-blur-md border-t border-stone-200 px-5 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-3">
          <button
            onClick={() => onDelete?.(part)}
            className="touch-target inline-flex items-center gap-2 px-3 py-2 text-clay-600 hover:text-clay-700 hover:bg-clay-50 active:bg-clay-100 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Delete</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button onClick={onClose} className="btn-secondary hidden sm:inline-flex">
              Close
            </button>
            <button
              onClick={() => onEdit?.(part)}
              className="btn-secondary flex-1 sm:flex-none justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinejoin="round" />
              </svg>
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button onClick={() => onPrint?.(part)} className="btn-accent flex-[1.4] sm:flex-none justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" strokeLinejoin="round" />
              </svg>
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
