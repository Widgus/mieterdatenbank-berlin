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

const CHAOS_COLORS = [
  '#ff0055', '#ff4400', '#ff9900', '#ffee00', '#aaff00',
  '#00ffaa', '#00eeff', '#0088ff', '#6600ff', '#ee00ff',
  '#ff0099', '#00ff66', '#ff6600', '#ff00cc', '#00ccff',
  '#ccff00', '#ff3300', '#3300ff', '#00ff33', '#ff0033',
]

function randomChaos() {
  return CHAOS_COLORS[Math.floor(Math.random() * CHAOS_COLORS.length)]
}

function rainbowColor(col) {
  const hue = Math.round((col / COLS) * 300)
  return `hsl(${hue},90%,60%)`
}

// Precompute on module load
const HEART_MASK = Array.from({ length: COLS * ROWS }, (_, i) =>
  isInHeart(i % COLS, Math.floor(i / COLS))
)

const RAINBOW_COLORS = Array.from({ length: COLS }, (_, col) => rainbowColor(col))

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

    // Init cell colors
    const cells = HEART_MASK.map((heart, i) =>
      heart ? RAINBOW_COLORS[i % COLS] : randomChaos()
    )

    let phase = 0

    function draw() {
      for (let i = 0; i < COLS * ROWS; i++) {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        ctx.fillStyle = cells[i]
        ctx.fillRect(Math.floor(col * cellW), Math.floor(row * cellH), Math.ceil(cellW) + 1, Math.ceil(cellH) + 1)
      }
    }

    function tick() {
      for (let i = 0; i < COLS * ROWS; i++) {
        const col   = i % COLS
        const heart = HEART_MASK[i]

        if (phase === 0) {
          // Chaos: all cells flicker ~3.75 Hz, 40% chance per tick
          if (Math.random() < 0.40) cells[i] = randomChaos()
        } else if (phase === 1) {
          // Emergence: heart cells migrate toward rainbow, rest slow down
          if (heart) {
            if (Math.random() < 0.20) {
              cells[i] = Math.random() < 0.60 ? RAINBOW_COLORS[col] : randomChaos()
            }
          } else {
            if (Math.random() < 0.12) cells[i] = randomChaos()
          }
        } else if (phase === 2) {
          // Heart locked to rainbow, background almost still
          if (heart) {
            cells[i] = RAINBOW_COLORS[col]
          } else {
            if (Math.random() < 0.04) cells[i] = randomChaos()
          }
        }
      }
      draw()
    }

    draw()
    const interval = setInterval(tick, 267) // ~3.75 Hz – within WCAG 2.3.1

    const t1 = setTimeout(() => { phase = 1 }, 1000)
    const t2 = setTimeout(() => { phase = 2 }, 2000)
    const t3 = setTimeout(() => {
      clearInterval(interval)
      // Pulse the heart then fade out
      wrapper.style.transition = 'opacity 0.45s ease-in'
      requestAnimationFrame(() => { wrapper.style.opacity = '0' })
    }, 2300)
    const t4 = setTimeout(() => onDone(), 2750)

    return () => {
      clearInterval(interval)
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4)
    }
  }, [onDone])

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', opacity: 1 }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}
