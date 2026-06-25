import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function QRScanner({ onScan, onClose }) {
  const instanceRef = useRef(null)
  const startedRef = useRef(false)
  const [error, setError] = useState('')
  const [starting, setStarting] = useState(true)
  const [cameras, setCameras] = useState([])
  const [activeCam, setActiveCam] = useState(null)
  const lastScanRef = useRef({ value: null, at: 0 })

  useEffect(() => {
    let cancelled = false

    const onDecode = (decodedText) => {
      const now = Date.now()
      if (lastScanRef.current.value === decodedText && now - lastScanRef.current.at < 1500) return
      lastScanRef.current = { value: decodedText, at: now }
      onScan?.(decodedText)
    }

    const onDecodeFail = () => {
      // ignore per-frame decode failures
    }

    const start = async () => {
      try {
        const region = document.getElementById('qr-scanner-region')
        if (!region) throw new Error('Scanner region element is missing.')

        const html5Qr = new Html5Qrcode('qr-scanner-region', /* verbose */ false)
        instanceRef.current = html5Qr

        // Enumerate cameras. The library requires a real device id.
        let deviceList = []
        try {
          deviceList = await Html5Qrcode.getCameras()
        } catch (err) {
          // Permission denied / no camera — surface a clear message
          throw err
        }

        if (cancelled) return

        if (!deviceList || deviceList.length === 0) {
          throw new Error('No camera detected on this device.')
        }

        // Prefer rear/environment camera
        const target =
          deviceList.find((d) => /back|rear|environment/i.test(d.label)) ||
          deviceList[0]

        setCameras(deviceList)
        setActiveCam(target.id)

        await html5Qr.start(
          target.id,
          { fps: 10, qrbox: { width: 240, height: 240 } },
          onDecode,
          onDecodeFail
        )

        if (cancelled) {
          await html5Qr.stop().catch(() => {})
          await html5Qr.clear().catch(() => {})
          return
        }

        startedRef.current = true
        setStarting(false)
      } catch (e) {
        if (cancelled) return
        const msg = e?.message || String(e)
        setError(humanizeCameraError(msg))
        setStarting(false)
      }
    }

    start()

    return () => {
      cancelled = true
      const inst = instanceRef.current
      if (inst && startedRef.current) {
        inst.stop().then(() => inst.clear()).catch(() => {})
      } else if (inst) {
        try { inst.clear() } catch {}
      }
    }
  }, [onScan])

  // ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const switchCamera = async (id) => {
    const inst = instanceRef.current
    if (!inst) return
    try {
      await inst.stop()
      await inst.clear()
    } catch {}
    setActiveCam(id)
    setStarting(true)
    setError('')
    try {
      await inst.start(
        id,
        { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1 },
        (decoded) => {
          const now = Date.now()
          if (lastScanRef.current.value === decoded && now - lastScanRef.current.at < 1500) return
          lastScanRef.current = { value: decoded, at: now }
          onScan?.(decoded)
        },
        () => {}
      )
    } catch (e) {
      setError(humanizeCameraError(e?.message || String(e)))
    }
    setStarting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/70 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md surface-floating overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <div>
            <p className="label-eyebrow mb-1">QR Scanner</p>
            <h2 className="font-display text-lg font-semibold tracking-tight text-stone-800">
              Look up a part
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-150 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Viewfinder */}
        <div className="relative bg-stone-900 aspect-square overflow-hidden">
          {/* Camera region (html5-qrcode injects the video here) */}
          <div id="qr-scanner-region" className="absolute inset-0 [&_video]:object-cover [&_video]:!w-full [&_video]:!h-full [&_video]:!left-0 [&_video]:!top-0" />

          {/* Viewfinder overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Darken mask around the viewfinder */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <mask id="vf-mask">
                  <rect width="100" height="100" fill="white" />
                  <rect x="25" y="25" width="50" height="50" rx="2" fill="black" />
                </mask>
              </defs>
              <rect width="100" height="100" fill="rgba(15,12,8,0.55)" mask="url(#vf-mask)" />
            </svg>

            {/* Corner ticks */}
            <span className="absolute top-[22%] left-[22%] w-7 h-7 border-t-2 border-l-2 border-amber-400 rounded-tl-md" />
            <span className="absolute top-[22%] right-[22%] w-7 h-7 border-t-2 border-r-2 border-amber-400 rounded-tr-md" />
            <span className="absolute bottom-[22%] left-[22%] w-7 h-7 border-b-2 border-l-2 border-amber-400 rounded-bl-md" />
            <span className="absolute bottom-[22%] right-[22%] w-7 h-7 border-b-2 border-r-2 border-amber-400 rounded-br-md" />

            {/* Animated scan line */}
            <div className="absolute left-[25%] right-[25%] top-1/2 h-0.5 scan-line" />
          </div>

          {/* Loading / error states */}
          {starting && !error && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3 text-stone-200">
                <div className="w-10 h-10 rounded-full border-2 border-stone-700 border-t-amber-400 animate-spin" />
                <span className="text-xs font-mono tracking-wider uppercase">Starting camera</span>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
              <div className="bg-stone-900/90 border border-clay-500/40 rounded-2xl p-5 text-center max-w-xs">
                <div className="w-10 h-10 rounded-full bg-clay-500/15 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-clay-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-stone-100 mb-1">Camera unavailable</p>
                <p className="text-xs text-stone-400 leading-relaxed">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-5 py-4 border-t border-stone-200 bg-stone-100/40">
          <p className="text-xs text-stone-500 text-center leading-relaxed mb-3">
            Point the camera at a part's QR code to look it up instantly.
          </p>
          <div className="flex items-center justify-between gap-3">
            {/* Camera switcher */}
            {cameras.length > 1 ? (
              <select
                value={activeCam || ''}
                onChange={(e) => switchCamera(e.target.value)}
                className="text-xs bg-white border border-stone-200 rounded-lg px-2.5 py-2 text-stone-600 font-mono max-w-[180px] truncate"
              >
                {cameras.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label || 'Camera'}
                  </option>
                ))}
              </select>
            ) : (
              <span />
            )}

            <button onClick={onClose} className="btn-secondary text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function humanizeCameraError(msg) {
  const m = String(msg || '').toLowerCase()
  if (m.includes('permission') || m.includes('denied')) {
    return 'Camera access was blocked. Open the site permissions and allow camera access, then try again.'
  }
  if (m.includes('notfound') || m.includes('no camera') || m.includes('requested device')) {
    return 'No camera was detected on this device.'
  }
  if (m.includes('secure') || m.includes('https')) {
    return 'Camera access requires HTTPS. Use https:// or localhost to scan.'
  }
  return msg || 'Could not start the camera.'
}