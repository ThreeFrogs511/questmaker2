'use effect';
import { useEffect, useRef } from 'react'

const ARROW_PIXELS: [number, number][] = [
  [5,0],[6,0],[5,1],[6,1],[5,2],[6,2],
  [5,3],[6,3],[5,4],[6,4],[5,5],[6,5],[5,6],[6,6],
  [3,7],[4,7],[5,7],[6,7],[7,7],[8,7],
  [4,8],[5,8],[6,8],[7,8],
  [5,9],[6,9],
]

interface ArrowDropProps {
  color?: string
  delay?: number
  trigger?: boolean
}

export default function PixelArrowDrop({ color = '#dc2626', delay = 400, trigger = true }: ArrowDropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!trigger) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, 12, 16)
    let i = 0

    const timeout = setTimeout(() => {
      // draw pixel by pixel
      const drawIv = setInterval(() => {
        if (i >= ARROW_PIXELS.length) {
          clearInterval(drawIv)
          // drop + fade
          let offset = 0
          const slideIv = setInterval(() => {
            ARROW_PIXELS.forEach(([x, y]) => ctx.clearRect(x, y + offset - 1 < 0 ? 0 : offset - 1, 1, 1))
            if (offset > 5) {
              clearInterval(slideIv)
              let alpha = 1
              const fadeIv = setInterval(() => {
                ctx.clearRect(0, 0, 12, 16)
                ctx.globalAlpha = alpha
                ARROW_PIXELS.forEach(([x, y]) => {
                  ctx.fillStyle = color
                  ctx.fillRect(x, y + 5, 1, 1)
                })
                ctx.globalAlpha = 1
                alpha -= 0.25
                if (alpha <= 0) {
                  clearInterval(fadeIv)
                  ctx.clearRect(0, 0, 12, 16)
                }
              }, 35)
              return
            }
            ARROW_PIXELS.forEach(([x, y]) => {
              ctx.fillStyle = color
              ctx.fillRect(x, y + offset, 1, 1)
            })
            offset++
          }, 28)
          return
        }
        const [x, y] = ARROW_PIXELS[i]
        ctx.fillStyle = color
        ctx.fillRect(x, y, 1, 1)
        i++
      }, 14)
    }, delay)

    return () => clearTimeout(timeout)
  })

  return (
    <canvas
      ref={canvasRef}
      width={12}
      height={16}
      style={{ width: 12, height: 16, imageRendering: 'pixelated', display: 'inline-block', verticalAlign: 'middle' }}
    />
  )
}