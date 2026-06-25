import { QRCodeSVG } from 'qrcode.react'

export default function QRCodeDisplay({ value, size = 160, caption, className = '' }) {
  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div className="relative bg-white p-3.5 rounded-2xl border border-stone-200 shadow-stone-sm">
        <QRCodeSVG
          value={value || ''}
          size={size}
          bgColor="#FFFFFF"
          fgColor="#2D2820"
          level="M"
          includeMargin={false}
        />
        {/* Subtle inner corner ticks for an instrument feel */}
        <span className="absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 border-amber-500/60 rounded-tl-md" />
        <span className="absolute -top-px -right-px w-2 h-2 border-t-2 border-r-2 border-amber-500/60 rounded-tr-md" />
        <span className="absolute -bottom-px -left-px w-2 h-2 border-b-2 border-l-2 border-amber-500/60 rounded-bl-md" />
        <span className="absolute -bottom-px -right-px w-2 h-2 border-b-2 border-r-2 border-amber-500/60 rounded-br-md" />
      </div>
      {caption && (
        <span className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500 font-mono">
          {caption}
        </span>
      )}
    </div>
  )
}
