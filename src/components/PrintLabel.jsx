import { QRCodeSVG } from 'qrcode.react'
import logo from '../../IMAGES/Cimmerian_Logo_nobg.png'

/**
 * Print-friendly part label. Renders inline; visibility is controlled
 * by the parent via the `active` prop. Uses a portrait layout that
 * works for both letter paper and 3"x2" thermal label stock.
 */
export default function PrintLabel({ part, active = false }) {
  if (!part) return null

  const qrPayload = part.part_number || part.id || ''
  const stockFlag =
    part.quantity != null && part.min_stock != null && part.quantity < part.min_stock

  return (
    <div
      className={`print-label ${active ? 'is-active' : ''}`}
      aria-hidden={!active}
    >
      <div className="label-card">
        {/* Punch hole */}
        <div className="punch">
          <span />
        </div>

        {/* Header */}
        <div className="label-header">
          <img src={logo} alt="Cimmerian" className="label-logo" />
          <div className="label-header-text">
            <span className="label-brand">Cimmerian Crane</span>
            <span className="label-eyebrow">Parts Inventory · Tag</span>
          </div>
          {stockFlag && (
            <span className="label-flag">Low Stock</span>
          )}
        </div>

        {/* Divider with stitches */}
        <div className="label-stitch" />

        {/* Body: QR on top, text stacked below */}
        <div className="label-qr-block">
          <QRCodeSVG
            value={qrPayload}
            size={130}
            bgColor="#FFFFFF"
            fgColor="#1A1714"
            level="M"
            includeMargin={false}
          />
        </div>

        <div className="label-text">
          <p className="label-eyebrow">Part Name</p>
          <h2 className="label-name">{part.part_name || '—'}</h2>

          <p className="label-eyebrow label-eyebrow-spaced">Part Number</p>
          <p className="label-number">{part.part_number || '—'}</p>

          <div className="label-meta">
            {part.category && (
              <div>
                <p className="label-eyebrow">Category</p>
                <p className="label-meta-val">{part.category}</p>
              </div>
            )}
            {part.location && (
              <div>
                <p className="label-eyebrow">Location</p>
                <p className="label-meta-val">{part.location}</p>
              </div>
            )}
            {part.supplier && (
              <div>
                <p className="label-eyebrow">Supplier</p>
                <p className="label-meta-val">{part.supplier}</p>
              </div>
            )}
            {part.quantity != null && (
              <div>
                <p className="label-eyebrow">Qty</p>
                <p className="label-meta-val">{part.quantity}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="label-stitch" />
        <div className="label-footer">
          <span>Printed {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}</span>
          <span className="font-mono">#{part.id?.slice(0, 8) || '—'}</span>
        </div>
      </div>
    </div>
  )
}
