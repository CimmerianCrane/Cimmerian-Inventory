import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import PartsTable from '../components/PartsTable'
import PartModal from '../components/PartModal'
import ConfirmDialog from '../components/ConfirmDialog'

const CATEGORIES = [
  'All Categories',
  'Hydraulics',
  'Electrical',
  'Structural',
  'Mechanical',
  'Wear Parts',
  'Fasteners',
  'Filters',
  'Lubricants',
  'Safety',
  'Other',
]

export default function Dashboard({ session, onLogout }) {
  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [sortField, setSortField] = useState('part_name')
  const [sortDir, setSortDir] = useState('asc')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPart, setEditingPart] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [categories, setCategories] = useState(CATEGORIES)

  const fetchParts = useCallback(async () => {
    const { data, error } = await supabase
      .from('parts')
      .select('*')
      .order(sortField, { ascending: sortDir === 'asc' })

    if (error) {
      console.error('Error fetching parts:', error)
      return
    }

    setParts(data || [])

    const uniqueCats = [...new Set((data || []).map(p => p.category).filter(Boolean))].sort()
    setCategories(['All Categories', ...uniqueCats])
  }, [sortField, sortDir])

  useEffect(() => {
    fetchParts()
  }, [fetchParts])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const handleSave = async (partData) => {
    if (editingPart) {
      const { error } = await supabase
        .from('parts')
        .update(partData)
        .eq('id', editingPart.id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('parts')
        .insert([partData])
      if (error) throw error
    }
    await fetchParts()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const { error } = await supabase
      .from('parts')
      .delete()
      .eq('id', deleteTarget.id)
    if (error) {
      console.error('Delete error:', error)
      return
    }
    setDeleteTarget(null)
    await fetchParts()
  }

  const openAdd = () => {
    setEditingPart(null)
    setModalOpen(true)
  }

  const openEdit = (part) => {
    setEditingPart(part)
    setModalOpen(true)
  }

  const filteredParts = parts.filter((part) => {
    const matchesSearch =
      search === '' ||
      part.part_name?.toLowerCase().includes(search.toLowerCase()) ||
      part.part_number?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      categoryFilter === 'All Categories' || part.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const lowStockCount = filteredParts.filter(
    (p) => p.quantity != null && p.min_stock != null && p.quantity < p.min_stock
  ).length

  const totalParts = filteredParts.length
  const categoriesCount = new Set(parts.map(p => p.category).filter(Boolean)).size

  return (
    <div className="min-h-screen">
      <Header session={session} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Page heading */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <span className="label-eyebrow">Operations Dashboard</span>
            <span className="h-px flex-1 bg-stone-200 max-w-[100px]" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tighter text-stone-800 leading-[1.05]">
            Parts Inventory
          </h1>
          <p className="text-stone-500 text-sm mt-3 max-w-xl leading-relaxed">
            Track stock levels, manage reorder thresholds, and keep your parts catalogue organized.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <StatCard
            label="Total Parts"
            value={totalParts}
            accent="amber"
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinejoin="round" />
              </svg>
            }
          />
          <StatCard
            label="Categories"
            value={categoriesCount}
            accent="indigo"
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 6h16M4 12h16M4 18h7" strokeLinecap="round" />
              </svg>
            }
          />
          <StatCard
            label="Low Stock"
            value={lowStockCount}
            accent="clay"
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by part name or number..."
              className="input-field pl-10 pr-10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-150 rounded-md transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative w-full sm:w-56">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field appearance-none pr-9 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Add Part */}
          <button onClick={openAdd} className="btn-accent whitespace-nowrap">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Add Part
          </button>
        </div>

        {/* Result count line */}
        <div className="flex items-center justify-between mb-3 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <p className="text-xs text-stone-500 font-mono">
            {filteredParts.length === parts.length
              ? `Showing all ${parts.length} part${parts.length !== 1 ? 's' : ''}`
              : `${filteredParts.length} of ${parts.length} parts`}
          </p>
          {(search || categoryFilter !== 'All Categories') && (
            <button
              onClick={() => { setSearch(''); setCategoryFilter('All Categories') }}
              className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <PartsTable
            parts={filteredParts}
            sortField={sortField}
            sortDir={sortDir}
            onSort={handleSort}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        </div>
      </main>

      {/* Modals */}
      {modalOpen && (
        <PartModal
          part={editingPart}
          onClose={() => { setModalOpen(false); setEditingPart(null) }}
          onSave={handleSave}
          categories={categories.filter(c => c !== 'All Categories')}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Part"
          message={`Are you sure you want to delete "${deleteTarget.part_name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="grain-overlay" />
    </div>
  )
}

function StatCard({ label, value, accent, icon }) {
  const accents = {
    amber:  { dot: 'bg-amber-500', text: 'text-amber-700', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    indigo: { dot: 'bg-indigo-500', text: 'text-indigo-700', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
    clay:   { dot: 'bg-clay-500', text: 'text-clay-600', iconBg: 'bg-clay-50', iconColor: 'text-clay-500' },
  }
  const a = accents[accent]

  return (
    <div className="surface-card p-5 group hover:shadow-stone-md transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${a.iconBg} flex items-center justify-center`}>
          <svg className={`w-5 h-5 ${a.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            {icon}
          </svg>
        </div>
        <div className={`w-1.5 h-1.5 rounded-full ${a.dot} opacity-60`} />
      </div>
      <p className={`text-4xl font-display font-semibold tracking-tighter ${a.text} leading-none`}>
        {value}
      </p>
      <p className="label-eyebrow mt-3">{label}</p>
    </div>
  )
}