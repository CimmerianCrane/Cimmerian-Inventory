const COLUMNS = [
  { key: 'part_name', label: 'Part Name', sortable: true },
  { key: 'part_number', label: 'Part #', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'quantity', label: 'Qty', sortable: true },
  { key: 'min_stock', label: 'Min', sortable: true },
  { key: 'supplier', label: 'Supplier', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'notes', label: 'Notes', sortable: false },
]

function SortIcon({ active, dir }) {
  return (
    <svg
      className={`w-3 h-3 ml-1 inline-block transition-colors ${
        active ? 'text-amber-600' : 'text-stone-300 group-hover:text-stone-500'
      }`}
      viewBox="0 0 12 12"
      fill="currentColor"
    >
      <path d={dir === 'asc' ? 'M6 2L10 7H2L6 2Z' : 'M6 10L2 5H10L6 10Z'} />
    </svg>
  )
}

export default function PartsTable({ parts, sortField, sortDir, onSort, onView, onEdit, onDelete }) {
  if (parts.length === 0) {
    return (
      <div className="surface-card p-16 text-center">
        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-stone-150 border border-stone-200 mb-5">
          <svg className="w-7 h-7 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinejoin="round" />
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500/30 ring-2 ring-stone-100 animate-pulse-soft" />
        </div>
        <h3 className="font-display text-lg font-semibold tracking-tight text-stone-800 mb-1">
          No parts found
        </h3>
        <p className="text-stone-500 text-sm max-w-xs mx-auto leading-relaxed">
          Add your first part to start tracking your inventory, or adjust your search filters.
        </p>
      </div>
    )
  }

  return (
    <div className="surface-card overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-stone-150/60 border-b border-stone-200">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`group table-header-cell ${col.sortable ? '' : 'cursor-default pointer-events-none hover:text-stone-500'}`}
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  {col.label}
                  {col.sortable && <SortIcon active={sortField === col.key} dir={sortDir} />}
                </th>
              ))}
              <th className="table-header-cell cursor-default pointer-events-none text-right hover:text-stone-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => {
              const isLow = part.quantity != null && part.min_stock != null && part.quantity < part.min_stock
              return (
                <tr
                  key={part.id}
                  className={`table-row ${isLow ? 'bg-clay-50/40 hover:bg-clay-50/70' : ''}`}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {isLow && (
                        <span className="w-1.5 h-1.5 rounded-full bg-clay-500 flex-shrink-0" title="Low stock" />
                      )}
                      <span className="text-sm font-medium text-stone-800">{part.part_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-mono text-stone-500">
                    {part.part_number || '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    {part.category ? (
                      <span className="badge-indigo">{part.category}</span>
                    ) : (
                      <span className="text-stone-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {part.quantity != null ? (
                      <span className={`text-sm font-mono font-semibold ${isLow ? 'text-clay-600' : 'text-stone-800'}`}>
                        {part.quantity}
                      </span>
                    ) : (
                      <span className="text-stone-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-mono text-stone-500">
                    {part.min_stock ?? '—'}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-stone-600">
                    {part.supplier || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-mono text-stone-500">
                    {part.location || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-stone-500 max-w-[200px] truncate">
                    {part.notes || '—'}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onView && (
                        <button
                          onClick={() => onView(part)}
                          className="p-2 rounded-lg text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-[color,background-color] duration-150"
                          title="View details & QR"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinejoin="round" />
                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinejoin="round" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(part)}
                        className="p-2 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-[color,background-color] duration-150"
                        title="Edit part"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(part)}
                        className="p-2 rounded-lg text-stone-400 hover:text-clay-500 hover:bg-clay-50 transition-[color,background-color] duration-150"
                        title="Delete part"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-stone-200">
        {parts.map((part) => {
          const isLow = part.quantity != null && part.min_stock != null && part.quantity < part.min_stock
          return (
            <div
              key={part.id}
              className={`p-4 space-y-3 ${isLow ? 'bg-clay-50/40' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {isLow && (
                      <span className="w-1.5 h-1.5 rounded-full bg-clay-500 flex-shrink-0" />
                    )}
                    <h3 className="text-sm font-medium text-stone-800 truncate">{part.part_name}</h3>
                  </div>
                  <span className="text-xs font-mono text-stone-500">{part.part_number || '—'}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {onView && (
                    <button
                      onClick={() => onView(part)}
                      className="p-2 rounded-lg text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="View details & QR"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinejoin="round" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(part)}
                    className="p-2 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(part)}
                    className="p-2 rounded-lg text-stone-400 hover:text-clay-500 hover:bg-clay-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {part.category && <span className="badge-indigo">{part.category}</span>}
                <span className={`badge ${isLow ? 'bg-clay-50 text-clay-600 border-clay-200/70' : 'bg-white'}`}>
                  Qty: <span className={`font-mono font-semibold ${isLow ? 'text-clay-600' : 'text-stone-800'}`}>{part.quantity ?? '—'}</span>
                </span>
                <span className="badge">
                  Min: <span className="font-mono">{part.min_stock ?? '—'}</span>
                </span>
                {part.supplier && <span className="badge">{part.supplier}</span>}
                {part.location && <span className="badge font-mono">{part.location}</span>}
              </div>
              {part.notes && (
                <p className="text-xs text-stone-500 truncate leading-relaxed">{part.notes}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-stone-150/40 border-t border-stone-200 flex items-center justify-between">
        <span className="text-[11px] text-stone-500 font-mono uppercase tracking-wider">
          {parts.length} part{parts.length !== 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-mono">
          <span className="w-1 h-1 rounded-full bg-sage-500" />
          Synced
        </div>
      </div>
    </div>
  )
}