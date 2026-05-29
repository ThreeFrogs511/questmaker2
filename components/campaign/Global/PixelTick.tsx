"use client";
import { useEffect, useRef } from 'react'

const TICK_PIXELS: [number, number][] = [
  [0,6],[1,7],[2,8],
  [3,7],[4,6],[5,5],[6,4],[7,3],[8,2],[9,1]
]

interface TickProps {
  color?: string
  delay?: number
  trigger?: boolean
}

export default function PixelTick({ color = '#4ade80', delay = 400, trigger = true }: TickProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!trigger) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, 12, 12)
    let i = 0

    const timeout = setTimeout(() => {
      const iv = setInterval(() => {
        if (i >= TICK_PIXELS.length) { clearInterval(iv); return }
        const [x, y] = TICK_PIXELS[i]
        ctx.fillStyle = color
        ctx.fillRect(x, y, 2, 2)
        i++
      }, 30)
    }, delay)
    
    return () => clearTimeout(timeout)
  })

  return (
    <canvas
      ref={canvasRef}
      width={12}
      height={12}
      style={{ width: 12, height: 12, imageRendering: 'pixelated', display: 'inline-block', verticalAlign: 'middle' }}
    />
  )
}