import { useEffect, useRef } from 'react'

const COLS = 22
const ROWS = 40

function isInHeart(col, row) {
  const cx = (COLS - 1) / 2
  const cy = ROWS * 0.50
  const x = (col - cx) / (COLS * 0.24)
  const y = -(row - cy) / (ROWS * 0.27)
  return Math.pow(x * x + y * y - 1, 3) - x * x * y * y * y <= 0
}

// Retro palette – warm, chaotic, no neons
const RETRO_CHAOS = [
  '#c2410c', // burnt orange
  '#b45309', // amber
  '#15803d', // forest green
  '#6d28d9', // violet
  '#be123c', // crimson
  '#92400e', // brown
  '#1e3a5f', // dark navy
  '#d97706', // golden yellow
  '#7c2d12', // dark rust
  '#4c1d95', // deep purple
  '#064e3b', // dark teal
  '#7f1d1d', // dark red
  '#f5f0e8', // parchment (bright contrast)
  '#18181b', // near-black
  '#78350f', // warm brown
  '#1e40af', // royal blue
]

// Heart colors: the 5 category palette, cycling by column
const HEART_PALETTE = ['#b45309', '#15803d', '#6d28d9', '#be123c', '#c2410c']

function randomRetro() {
  return RETRO_CHAOS[Math.floor(Math.random() * RETRO_CHAOS.length)]
}

function heartColor(col) {
  return HEART_PALETTE[col % HEART_PALETTE.length]
}

// Precompute heart mask once
const HEART_MASK = Array.from({ length: COLS * ROWS }, (_, i) =>
  isInHeart(i % COLS, Math.floor(i / COLS))
)

const HEART_COLORS = Array.from({ length: COLS }, (_, col) => heartColor(col))

export function SplashScreen({ onDone }) {
  const canvasRef  = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    const ctx = canvas.getContext('2d')

    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width  = W
    canvas.height = H

    const cellW = W / COLS
    const cellH = H / ROWS

    // Init: heart in palette, rest random retro
    const cells = HEART_MASK.map((heart, i) =>
      heart ? HEART_COLORS[i % COLS] : randomRetro()
    )

    let phase = 0 // 0=chaos 1=emerge 2=heart

    function draw() {
      for (let i = 0; i < COLS * ROWS; i++) {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        ctx.fillStyle = cells[i]
        ctx.fillRect(
          Math.floor(col * cellW),
          Math.floor(row * cellH),
          Math.ceil(cellW) + 1,
          Math.ceil(cellH) + 1
        )
      }
    }

    function tick() {
      for (let i = 0; i < COLS * ROWS; i++) {
        const col   = i % COLS
        const heart = HEART_MASK[i]

        if (phase === 0) {
          // Full chaos – all cells flicker ~3.75 Hz
          if (Math.random() < 0.42) cells[i] = randomRetro()
        } else if (phase === 1) {
          // Emergence – heart migrates toward palette, rest slows
          if (heart) {
            if (Math.random() < 0.18) {
              cells[i] = Math.random() < 0.65 ? HEART_COLORS[col] : randomRetro()
            }
          } else {
            if (Math.random() < 0.10) cells[i] = randomRetro()
          }
        } else if (phase === 2) {
          // Heart locked, background nearly still
          if (heart) {
            cells[i] = HEART_COLORS[col]
          } else {
            if (Math.random() < 0.03) cells[i] = randomRetro()
          }
        }
      }
      draw()
    }

    draw()
    const interval = setInterval(tick, 267) // ~3.75 Hz – WCAG 2.3.1 safe

    // Phase transitions (5s total)
    const t1 = setTimeout(() => { phase = 1 }, 2000)  // 0–2s chaos
    const t2 = setTimeout(() => { phase = 2 }, 3500)  // 2–3.5s emerge
    const t3 = setTimeout(() => {
      clearInterval(interval)
      // Fade out
      wrapper.style.transition = 'opacity 0.5s ease-in'
      requestAnimationFrame(() => { wrapper.style.opacity = '0' })
    }, 4500)                                           // 3.5–4.5s heart visible
    const t4 = setTimeout(() => onDone(), 5100)        // 5s done

    return () => {
      clearInterval(interval)
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4)
    }
  }, [onDone])

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#18181b', opacity: 1 }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
