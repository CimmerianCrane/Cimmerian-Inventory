import { useState, useEffect, useRef } from 'react'

const EMPTY_PART = {
  part_name: '',
  part_number: '',
  category: '',
  quantity: 0,
  min_stock: 0,
  supplier: '',
  location: '',
  notes: '',
}

export default function PartModal({ part, onClose, onSave, categories }) {
  const [form, setForm] = useState(EMPTY_PART)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const nameRef = useRef(null)

  useEffect(() => {
    if (part) {
      setForm({
        part_name: part.part_name || '',
        part_number: part.part_number || '',
        category: part.category || '',
        quantity: part.quantity ?? 0,
        min_stock: part.min_stock ?? 0,
        supplier: part.supplier || '',
        location: part.location || '',
        notes: part.notes || '',
      })
    }
    setTimeout(() => nameRef.current?.focus(), 100)
  }, [part])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'min_stock' ? (value === '' ? '' : Number(value)) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.part_name.trim()) {
      setError('Part name is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave(form)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save part.')
      setSaving(false)
    }
  }

  const isEdit = !!part

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg surface-floating max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
          <div>
            <p className="label-eyebrow mb-1">{isEdit ? 'Edit Part' : 'New Part'}</p>
            <h2 className="font-display text-xl font-semibold tracking-tight text-stone-800">
              {isEdit ? form.part_name || 'Edit details' : 'Add a new part'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-150 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label-eyebrow block mb-2">
                Part Name <span className="text-clay-500">*</span>
              </label>
              <input
                ref={nameRef}
                type="text"
                name="part_name"
                value={form.part_name}
                onChange={handleChange}
                placeholder="e.g. Hydraulic Pump Assembly"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label-eyebrow block mb-2">
                Part Number
              </label>
              <input
                type="text"
                name="part_number"
                value={form.part_number}
                onChange={handleChange}
                placeholder="e.g. HP-2024-A"
                className="input-field font-mono"
              />
            </div>
            <div>
              <label className="label-eyebrow block mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="input-field appearance-none pr-9 cursor-pointer"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div>
              <label className="label-eyebrow block mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                min="0"
                className="input-field font-mono"
              />
            </div>
            <div>
              <label className="label-eyebrow block mb-2">
                Min Stock
              </label>
              <input
                type="number"
                name="min_stock"
                value={form.min_stock}
                onChange={handleChange}
                min="0"
                className="input-field font-mono"
              />
            </div>
            <div>
              <label className="label-eyebrow block mb-2">
                Supplier
              </label>
              <input
                type="text"
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                placeholder="e.g. CraneParts Direct"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-eyebrow block mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Bay 3, Shelf A"
                className="input-field font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label-eyebrow block mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Additional notes..."
                className="input-field resize-none leading-relaxed"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-clay-50 border border-clay-200/70 rounded-xl px-4 py-3 text-sm text-clay-700 animate-slide-down">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-accent">
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isEdit ? 'Save Changes' : 'Add Part'}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}