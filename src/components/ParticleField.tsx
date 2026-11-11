import { useEffect, useRef } from 'react'

/**
 * Full-viewport canvas particle field: slow drifting dots, connecting lines
 * between near neighbours, and a gentle repulsion around the mouse.
 *
 * - Canvas backing store is sized to devicePixelRatio (capped) for crisp lines.
 * - Particle count scales with viewport area and is re-balanced on resize.
 * - Movement is delta-time based so it feels identical at 60Hz and 120Hz.
 * - prefers-reduced-motion: renders a single static frame, no rAF loop,
 *   no mouse interaction. Reacts live if the setting changes.
 * - Everything (rAF, listeners, observers) is torn down on unmount.
 */

// ---- Motion / look constants ------------------------------------------------
const MAX_DPR = 2
const AREA_PER_PARTICLE = 14_000 // px^2 of viewport per particle
const MIN_PARTICLES = 28
const MAX_PARTICLES = 120
const LINK_DISTANCE = 130 // px, scaled down on narrow screens
const LINK_DISTANCE_MOBILE = 95
const MOBILE_BREAKPOINT = 640
const DRIFT_SPEED = 0.018 // px per ms (~1px/frame at 60fps max)
const RADIUS_MIN = 0.8
const RADIUS_MAX = 2
const MOUSE_RADIUS = 150
const MOUSE_FORCE = 0.0009 // acceleration toward "away" per ms at the centre
const VELOCITY_RECOVERY = 0.0025 // how fast velocity eases back to its drift, per ms
const MAX_FRAME_DT = 50 // clamp dt after tab switches so nothing teleports

const DOT_COLOR = 'rgba(165, 180, 252, 0.75)' // indigo-300
const LINE_RGB = '129, 140, 248' // indigo-400
const LINE_MAX_ALPHA = 0.28
const MOUSE_LINE_MAX_ALPHA = 0.4

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  /** base drift velocity the particle relaxes back to after mouse pushes */
  bvx: number
  bvy: number
  r: number
}

function createParticle(w: number, h: number): Particle {
  const angle = Math.random() * Math.PI * 2
  const speed = DRIFT_SPEED * (0.3 + Math.random() * 0.7)
  const vx = Math.cos(angle) * speed
  const vy = Math.sin(angle) * speed
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx,
    vy,
    bvx: vx,
    bvy: vy,
    r: RADIUS_MIN + Math.random() * (RADIUS_MAX - RADIUS_MIN),
  }
}

function targetCount(w: number, h: number) {
  return Math.round(
    Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, (w * h) / AREA_PER_PARTICLE)),
  )
}

interface ParticleFieldProps {
  className?: string
}

export default function ParticleField({ className = '' }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let width = 0
    let height = 0
    let linkDistance = LINK_DISTANCE
    let particles: Particle[] = []
    let rafId = 0
    let lastTime = 0
    const mouse = { x: 0, y: 0, active: false }

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      const prevW = width
      const prevH = height
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      linkDistance = width < MOBILE_BREAKPOINT ? LINK_DISTANCE_MOBILE : LINK_DISTANCE

      // Keep existing particles (rescaled into the new bounds) so a resize
      // doesn't visibly "reshuffle" the field; only add/remove the difference.
      if (prevW > 0 && prevH > 0) {
        const sx = width / prevW
        const sy = height / prevH
        for (const p of particles) {
          p.x *= sx
          p.y *= sy
        }
      }
      const count = targetCount(width, height)
      if (particles.length > count) particles.length = count
      while (particles.length < count) particles.push(createParticle(width, height))

      // Size change clears the canvas; repaint immediately (matters for the
      // static reduced-motion frame, harmless when animating).
      draw()
    }

    function step(dt: number) {
      const mouseR2 = MOUSE_RADIUS * MOUSE_RADIUS
      const recovery = Math.min(1, VELOCITY_RECOVERY * dt)
      for (const p of particles) {
        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < mouseR2 && d2 > 0.01) {
            const d = Math.sqrt(d2)
            const falloff = 1 - d / MOUSE_RADIUS // 1 at cursor, 0 at edge
            const a = MOUSE_FORCE * falloff * falloff * dt
            p.vx += (dx / d) * a
            p.vy += (dy / d) * a
          }
        }
        // Ease velocity back to the particle's own drift: pushes decay smoothly.
        p.vx += (p.bvx - p.vx) * recovery
        p.vy += (p.bvy - p.vy) * recovery

        p.x += p.vx * dt
        p.y += p.vy * dt

        // Wrap around edges (with margin so dots never pop at the border).
        const m = 10
        if (p.x < -m) p.x = width + m
        else if (p.x > width + m) p.x = -m
        if (p.y < -m) p.y = height + m
        else if (p.y > height + m) p.y = -m
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height)
      const linkR2 = linkDistance * linkDistance
      const n = particles.length

      ctx!.lineWidth = 1
      for (let i = 0; i < n; i++) {
        const a = particles[i]
        for (let j = i + 1; j < n; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < linkR2) {
            const alpha = (1 - Math.sqrt(d2) / linkDistance) * LINE_MAX_ALPHA
            ctx!.strokeStyle = `rgba(${LINE_RGB}, ${alpha.toFixed(3)})`
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
      }

      if (mouse.active) {
        const mouseR2 = MOUSE_RADIUS * MOUSE_RADIUS
        for (const p of particles) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < mouseR2) {
            const alpha = (1 - Math.sqrt(d2) / MOUSE_RADIUS) * MOUSE_LINE_MAX_ALPHA
            ctx!.strokeStyle = `rgba(${LINE_RGB}, ${alpha.toFixed(3)})`
            ctx!.beginPath()
            ctx!.moveTo(p.x, p.y)
            ctx!.lineTo(mouse.x, mouse.y)
            ctx!.stroke()
          }
        }
      }

      ctx!.fillStyle = DOT_COLOR
      ctx!.beginPath()
      for (const p of particles) {
        ctx!.moveTo(p.x + p.r, p.y)
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      }
      ctx!.fill()
    }

    function frame(time: number) {
      const dt = lastTime ? Math.min(time - lastTime, MAX_FRAME_DT) : 16
      lastTime = time
      step(dt)
      draw()
      rafId = requestAnimationFrame(frame)
    }

    function start() {
      if (rafId || motionQuery.matches) return
      lastTime = 0
      rafId = requestAnimationFrame(frame)
    }

    function stop() {
      cancelAnimationFrame(rafId)
      rafId = 0
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== 'mouse' || motionQuery.matches) return
      const rect = canvas!.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }

    function onPointerLeave() {
      mouse.active = false
    }

    function onMotionPreferenceChange() {
      if (motionQuery.matches) {
        stop()
        mouse.active = false
        draw() // freeze on a clean static frame
      } else {
        start()
      }
    }

    function onVisibilityChange() {
      if (document.hidden) stop()
      else start()
    }

    resize()
    start()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('blur', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibilityChange)
    motionQuery.addEventListener('change', onMotionPreferenceChange)

    return () => {
      stop()
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('blur', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      motionQuery.removeEventListener('change', onMotionPreferenceChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 h-full w-full ${className}`}
    />
  )
}
