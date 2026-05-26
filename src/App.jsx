import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import html2canvas from 'html2canvas'
import './App.css'

const ITEM_H = 88

/* ─── Floating particles ─── */

function ParticleCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf, w = canvas.width = window.innerWidth, h = canvas.height = window.innerHeight
    const pts = Array.from({ length: 30 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      z: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.1 - 0.02,
      s: Math.random() * 2.5 + 0.8,
      light: Math.random() > 0.5,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of pts) {
        p.x += p.vx * p.z; p.y += p.vy * p.z
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10
        const a = 0.04 + 0.04 * p.z
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s * p.z, 0, Math.PI * 2)
        ctx.fillStyle = p.light ? `rgba(59,130,246,${a})` : `rgba(147,197,253,${a})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    const onR = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    window.addEventListener('resize', onR)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onR) }
  }, [])
  return <canvas ref={canvasRef} className="particle-canvas" />
}

/* ─── Logo ─── */

function Logo({ size = 48, className = '' }) {
  return (
    <img src="/chennaireact.webp" alt="ChennaiReact" width={size} height={size}
      className={`logo-img ${className}`} />
  )
}

/* ─── Icons ─── */

function IconSpin() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
}
function IconDownload() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
}
function IconArrowLeft() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
}
function IconTrophy() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
}



/* ═══════════════════════════════════════════
   Step 1 — Input
   ═══════════════════════════════════════════ */

function InputStep({ onStart }) {
  const [contestName, setContestName] = useState('')
  const [text, setText] = useState('')
  const [duration, setDuration] = useState(5)

  const names = useMemo(() => text.split(',').map(s => s.trim()).filter(Boolean), [text])
  const canStart = names.length >= 2 && contestName.trim().length > 0

  return (
    <motion.div
      className="step-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="brand-row">
        <Logo size={64} className="brand-logo" />
        <div>
          <h1 className="brand-title">Lucky Draw <span className="highlight">Picker</span></h1>
          <p className="brand-subtitle">Pick a winner, make it fair</p>
        </div>
      </div>

      <motion.div
        className="input-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="input-columns">
          <div className="input-col-form">
            <label className="input-label" htmlFor="contest-name">Event Name</label>
            <input id="contest-name" className="text-input" type="text"
              placeholder="Ticket Giveaway"
              value={contestName} onChange={e => setContestName(e.target.value)} autoFocus />

            <label className="input-label" htmlFor="participant-names" style={{ marginTop: 20 }}>Participants</label>
            <textarea id="participant-names" className="text-input textarea"
              placeholder="Nikhil, Surya, Dhanush, Kamlesh"
              value={text} onChange={e => setText(e.target.value)} rows={5} />

            <label className="input-label" htmlFor="spin-duration" style={{ marginTop: 20 }}>
              Spin Duration <span className="duration-badge">{duration}s</span>
            </label>
            <div className="range-row">
              <span className="range-label">5s</span>
              <div className="range-track-wrapper">
                <input id="spin-duration" type="range" min={5} max={25} step={1}
                  value={duration} onChange={e => setDuration(Number(e.target.value))}
                  className="range-input" />
                <div className="range-fill" style={{ width: `${((duration - 5) / 20) * 100}%` }} />
              </div>
              <span className="range-label">25s</span>
            </div>
          </div>

          <div className="input-col-list">
            <div className="list-header">
              <span className="list-header-text">{names.length} participant{names.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="contestant-list">
              {names.length === 0 ? (
                <div className="contestant-list-empty">
                  Names will appear here as you type
                </div>
              ) : (
                <div className="contestant-list-items">
                  {names.map((name, i) => (
                    <div key={`${i}-${name}`} className="contestant-item">
                      <span className="contestant-num">{i + 1}</span>
                      <span className="contestant-name">{name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.button
        className="start-btn"
        onClick={() => canStart && onStart(names, contestName.trim(), duration)}
        disabled={!canStart}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={canStart ? { scale: 1.02 } : {}}
        whileTap={canStart ? { scale: 0.97 } : {}}
      >
        {!contestName.trim()
          ? 'Enter an event name'
          : names.length < 2
            ? 'Add at least 2 participants'
            : `Continue with ${names.length} participant${names.length !== 1 ? 's' : ''}`}
        <span className="btn-shimmer" />
      </motion.button>

      <footer className="app-footer">
        <span className="footer-text">Made with <span className="heart">&#x1F499;</span> by</span>
        <a href="https://chennaireact.in" target="_blank" rel="noopener noreferrer" className="footer-link">ChennaiReact</a>
      </footer>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   Step 2 — Spin
   ═══════════════════════════════════════════ */

function SpinStep({ names, contestName, spinDuration, onBack, onWinner }) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [scrollPx, setScrollPx] = useState(0)
  const [displayItems, setDisplayItems] = useState([])
  const animRef = useRef(null)
  const lastTickRef = useRef(-1)
  const audioRef = useRef(null)
  const winnerRef = useRef(null)

  const getCtx = useCallback(() => {
    if (!audioRef.current) audioRef.current = new (window.AudioContext || window.webkitAudioContext)()
    return audioRef.current
  }, [])

  const playTick = useCallback(() => {
    try {
      const ctx = getCtx(), o = ctx.createOscillator(), g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination)
      o.frequency.value = 600 + Math.random() * 300; o.type = 'sine'
      g.gain.setValueAtTime(0.04, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)
      o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.04)
    } catch {}
  }, [getCtx])

  const playWin = useCallback(() => {
    try {
      const ctx = getCtx()
      ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain()
        o.connect(g); g.connect(ctx.destination)
        o.frequency.value = f; o.type = 'sine'
        const t = ctx.currentTime + i * 0.12
        g.gain.setValueAtTime(0.08, t)
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
        o.start(t); o.stop(t + 0.35)
      })
    } catch {}
  }, [getCtx])

  const handleSpin = useCallback(() => {
    if (isSpinning) return
    setIsSpinning(true)

    const src = [...names]
    const reel = []
    const rounds = Math.ceil((spinDuration * 1000 - 800) / (ITEM_H * 2))
    for (let i = 0; i < Math.max(rounds, 40); i++) {
      for (let j = src.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [src[j], src[k]] = [src[k], src[j]]
      }
      reel.push(...src.map(c => c))
    }

    const wName = names[Math.floor(Math.random() * names.length)]
    winnerRef.current = wName

    const landmark = Math.round((spinDuration * 1000 - 800) / (4.5))
    const wPos = landmark * src.length / ITEM_H + names.indexOf(wName)

    setDisplayItems(reel)
    setScrollPx(0)
    lastTickRef.current = -1

    const target = wPos * ITEM_H
    const duration = spinDuration * 1000
    const t0 = Date.now()
    if (animRef.current) cancelAnimationFrame(animRef.current)

    const run = () => {
      const p = Math.min((Date.now() - t0) / duration, 1)
      const e = 1 - Math.pow(1 - p, 4)
      const px = target * e
      setScrollPx(px)

      const idx = Math.round(px / ITEM_H) % reel.length
      if (idx !== lastTickRef.current) { lastTickRef.current = idx; playTick() }

      if (p < 1) {
        animRef.current = requestAnimationFrame(run)
      } else {
        setScrollPx(target)
        setIsSpinning(false)
        playWin()
        setTimeout(() => onWinner(winnerRef.current), 500)
      }
    }
    animRef.current = requestAnimationFrame(run)
  }, [names, isSpinning, onWinner, playTick, playWin, spinDuration])

  const visibleItems = useMemo(() => {
    if (displayItems.length === 0) return []
    const center = scrollPx / ITEM_H
    const items = []
    const range = 6
    for (let r = -range; r <= range; r++) {
      const idx = Math.round(center) + r
      if (idx < 0 || idx >= displayItems.length) continue
      const off = idx - center
      const absOff = Math.abs(off)
      const opacity = absOff < 0.5 ? 1 : Math.max(0.12, 1 - (absOff - 0.3) * 0.35)
      const scale = absOff < 0.5 ? 1 : Math.max(0.82, 1 - (absOff - 0.3) * 0.06)
      items.push({
        key: idx,
        text: displayItems[idx],
        offPx: off * ITEM_H,
        opacity,
        scale,
        isCenter: Math.abs(off) < 0.45,
      })
    }
    return items
  }, [scrollPx, displayItems])

  return (
    <motion.div
      className="spin-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="spin-header">
        <Logo size={48} className="spin-logo" />
        <div>
          <h2 className="spin-title">{contestName}</h2>
          <p className="spin-subtitle">{names.length} participant{names.length !== 1 ? 's' : ''} &middot; {spinDuration}s spin</p>
        </div>
      </div>

      <motion.div className="reel-wrapper" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="reel-frame">
          <div className="reel-selector" />
          {isSpinning || displayItems.length > 0 ? (
            <div className="reel-scroll-area">
              {visibleItems.map((item) => (
                <div key={item.key} className="reel-item"
                  style={{
                    transform: `translateY(${item.offPx}px) scale(${item.scale})`,
                    opacity: item.opacity
                  }}>
                  <span className={item.isCenter ? 'reel-item-center' : 'reel-item-dim'}>{item.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="reel-static">
              <Logo size={40} className="reel-static-logo" />
              <span>Press below to spin</span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.button
        className={`spin-btn ${isSpinning ? 'spinning' : ''}`}
        onClick={handleSpin} disabled={isSpinning}
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        whileHover={!isSpinning ? { scale: 1.02 } : {}}
        whileTap={!isSpinning ? { scale: 0.97 } : {}}
      >
        {isSpinning ? (
          <span className="spin-btn-loading">
            <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }} style={{ display: 'inline-block' }}><IconSpin /></motion.span>
            Picking...
          </span>
        ) : 'Pick a Winner'}
        <span className="btn-shimmer" />
      </motion.button>

      {!isSpinning && (
        <motion.button className="back-btn" onClick={onBack}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}>
          <IconArrowLeft /> Change participants
        </motion.button>
      )}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   Winner overlay — Confetti pops every 5s
   ═══════════════════════════════════════════ */

function WinnerOverlay({ winner, contestName, onDrawAgain, onNewList }) {
  const cardRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const confettiTimerRef = useRef(null)

  // Dynamic font size based on name length
  const nameFontSize = useMemo(() => {
    const len = winner.length
    if (len <= 8) return 'clamp(2rem, 7vw, 3.6rem)'
    if (len <= 14) return 'clamp(1.6rem, 5.5vw, 2.8rem)'
    if (len <= 20) return 'clamp(1.3rem, 4.5vw, 2.2rem)'
    if (len <= 28) return 'clamp(1.1rem, 3.5vw, 1.8rem)'
    return 'clamp(0.9rem, 2.8vw, 1.5rem)'
  }, [winner])

  // Colorful confetti bursts every 5 seconds
  const fireConfettiBurst = useCallback(() => {
    const colors = ['#2563eb', '#60a5fa', '#fbbf24', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#ffffff']
    // Center burst
    confetti({ particleCount: 180, spread: 160, origin: { y: 0.5 }, colors, startVelocity: 50, gravity: 0.7, ticks: 220 })
    // Side cannons
    const end = Date.now() + 800
    const frame = () => {
      confetti({ particleCount: 4, angle: 55, spread: 65, origin: { x: 0, y: 0.6 }, colors, startVelocity: 30 })
      confetti({ particleCount: 4, angle: 125, spread: 65, origin: { x: 1, y: 0.6 }, colors, startVelocity: 30 })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  useEffect(() => {
    fireConfettiBurst() // initial burst
    confettiTimerRef.current = setInterval(() => {
      fireConfettiBurst()
    }, 5000)
    return () => {
      if (confettiTimerRef.current) clearInterval(confettiTimerRef.current)
    }
  }, [fireConfettiBurst])

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#ffffff', scale: 3, useCORS: true, allowTaint: true, logging: false })
      const link = document.createElement('a')
      link.download = `${(contestName || 'lucky-draw').replace(/\s+/g, '_')}_winner.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) { console.error('Download failed', err) }
    setDownloading(false)
  }, [contestName])

  return (
    <motion.div className="winner-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="winner-card" ref={cardRef}
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      >
        <div className="winner-card-bar" />

        <div className="winner-card-inner">
          <motion.div className="winner-card-top"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Logo size={52} className="winner-logo" />
          </motion.div>

          <motion.div className="winner-trophy-wrap"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 250, damping: 15 }}
          >
            <div className="winner-trophy"><IconTrophy /></div>
          </motion.div>

          <motion.div className="winner-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            WINNER
          </motion.div>

          {contestName && (
            <motion.div className="winner-contest-tag"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {contestName}
            </motion.div>
          )}

          <motion.div className="winner-name"
            style={{ fontSize: nameFontSize }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 160, damping: 14 }}
          >
            {winner}
          </motion.div>

          <div className="winner-card-separator" />

          <motion.div className="winner-card-footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
            <Logo size={20} className="winner-footer-logo" />
            <span className="winner-footer-text">ChennaiReact Community</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="winner-actions"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
        <button className="btn-primary" onClick={onDrawAgain}>Draw Again</button>
        <button className="btn-secondary" onClick={handleDownload} disabled={downloading}>
          <IconDownload /> {downloading ? 'Saving...' : 'Save Image'}
        </button>
        <button className="btn-ghost" onClick={onNewList}>New List</button>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   Main App
   ═══════════════════════════════════════════ */

function App() {
  const [step, setStep] = useState('input')
  const [names, setNames] = useState([])
  const [contestName, setContestName] = useState('')
  const [spinDuration, setSpinDuration] = useState(5)
  const [winner, setWinner] = useState(null)

  const handleStart = useCallback((nameList, contest, dur) => {
    setNames(nameList); setContestName(contest); setSpinDuration(dur); setStep('spin')
  }, [])
  const handleWinner = useCallback((name) => { setWinner(name) }, [])
  const handleDrawAgain = useCallback(() => { setWinner(null) }, [])
  const handleNewList = useCallback(() => { setWinner(null); setStep('input'); setNames([]) }, [])
  const handleBack = useCallback(() => { setStep('input') }, [])

  return (
    <div className="app">
      <div className="bg-dots" />
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <ParticleCanvas />
      <div className="app-content">
        <AnimatePresence mode="wait">
          {step === 'input' && <InputStep key="input" onStart={handleStart} />}
          {step === 'spin' && <SpinStep key="spin" names={names} contestName={contestName} spinDuration={spinDuration} onBack={handleBack} onWinner={handleWinner} />}
        </AnimatePresence>
        <AnimatePresence>
          {winner && <WinnerOverlay winner={winner} contestName={contestName} onDrawAgain={handleDrawAgain} onNewList={handleNewList} />}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App