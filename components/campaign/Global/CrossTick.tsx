import { useEffect, useRef } from 'react'

const CROSS_PIXELS: [number, number][] = [
  [0,0],[2,2],[4,4],[6,6],[8,8],[10,10],
  [10,0],[8,2],[6,4],[4,6],[2,8],[0,10]
]

interface CrossProps {
  color?: string
  delay?: number
  trigger?: boolean
}

export default function PixelCross({ color = '#dc2626', delay = 400, trigger = true }: CrossProps) {
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
        if (i >= CROSS_PIXELS.length) { clearInterval(iv); return }
        const [x, y] = CROSS_PIXELS[i]
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