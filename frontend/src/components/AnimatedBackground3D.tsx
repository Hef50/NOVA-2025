import { useEffect, useRef } from 'react'

export default function AnimatedBackground3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class TravelElement {
      x: number
      y: number
      z: number
      vx: number
      vy: number
      vz: number
      color: string
      size: number
      rotation: number
      trail: Array<{ x: number; y: number; z: number; opacity: number }>
      trailLength: number

      constructor() {
        // Start from random edge
        const edge = Math.floor(Math.random() * 4)
        switch (edge) {
          case 0: // top
            this.x = Math.random() * canvas.width
            this.y = -100
            break
          case 1: // right
            this.x = canvas.width + 100
            this.y = Math.random() * canvas.height
            break
          case 2: // bottom
            this.x = Math.random() * canvas.width
            this.y = canvas.height + 100
            break
          default: // left
            this.x = -100
            this.y = Math.random() * canvas.height
        }

        this.z = Math.random() * 500 + 500

        // Random destination on opposite side
        const destX = Math.random() * canvas.width
        const destY = Math.random() * canvas.height
        
        // Slight speed variation: 1.6 to 1.9 (was 1.5 to 2.0)
        const speed = 1.6 + Math.random() * 0.3
        
        this.vx = (destX - this.x) / 200 * speed
        this.vy = (destY - this.y) / 200 * speed
        this.vz = (-1 - Math.random() * 2) * 0.5
        
        // Calculate rotation based on velocity direction
        this.rotation = Math.atan2(this.vy, this.vx)
        
        const colors = ['#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#10b981']
        this.color = colors[Math.floor(Math.random() * colors.length)]
        
        this.size = 25 + Math.random() * 35
        this.trail = []
        this.trailLength = 20
      }

      update() {
        this.trail.unshift({ x: this.x, y: this.y, z: this.z, opacity: 1 })
        
        if (this.trail.length > this.trailLength) {
          this.trail.pop()
        }

        this.trail.forEach((point, index) => {
          point.opacity = 1 - (index / this.trailLength)
        })

        this.x += this.vx
        this.y += this.vy
        this.z += this.vz

        // Update rotation to face direction of movement
        this.rotation = Math.atan2(this.vy, this.vx)

        // Only remove if completely off screen (with margin)
        const margin = 200
        if (
          this.x < -margin ||
          this.x > canvas.width + margin ||
          this.y < -margin ||
          this.y > canvas.height + margin ||
          this.z < 50
        ) {
          return true
        }
        return false
      }

      drawPlane() {
        if (!ctx) return
        
        const scale = 1000 / (1000 + this.z)
        
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.scale(scale, scale)
        
        // Fuselage (main body)
        const gradient = ctx.createLinearGradient(-this.size * 0.6, 0, this.size * 0.8, 0)
        gradient.addColorStop(0, this.adjustColor(this.color, 0.7))
        gradient.addColorStop(0.5, this.color)
        gradient.addColorStop(1, this.adjustColor(this.color, 1.2))
        
        ctx.fillStyle = gradient
        ctx.strokeStyle = this.adjustColor(this.color, 0.6)
        ctx.lineWidth = 2
        
        // Main fuselage
        ctx.beginPath()
        ctx.ellipse(0, 0, this.size * 0.8, this.size * 0.15, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        
        // Nose cone
        ctx.beginPath()
        ctx.moveTo(this.size * 0.8, 0)
        ctx.lineTo(this.size * 1.1, -this.size * 0.05)
        ctx.lineTo(this.size * 1.1, this.size * 0.05)
        ctx.closePath()
        ctx.fillStyle = this.adjustColor(this.color, 1.3)
        ctx.fill()
        ctx.stroke()
        
        // Main wings
        ctx.fillStyle = this.adjustColor(this.color, 0.9)
        ctx.beginPath()
        ctx.moveTo(-this.size * 0.2, 0)
        ctx.lineTo(-this.size * 0.4, -this.size * 0.7)
        ctx.lineTo(this.size * 0.1, -this.size * 0.25)
        ctx.lineTo(this.size * 0.2, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        
        ctx.beginPath()
        ctx.moveTo(-this.size * 0.2, 0)
        ctx.lineTo(-this.size * 0.4, this.size * 0.7)
        ctx.lineTo(this.size * 0.1, this.size * 0.25)
        ctx.lineTo(this.size * 0.2, 0)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        
        // Tail fin (vertical stabilizer)
        ctx.beginPath()
        ctx.moveTo(-this.size * 0.7, 0)
        ctx.lineTo(-this.size * 0.9, -this.size * 0.4)
        ctx.lineTo(-this.size * 0.6, -this.size * 0.1)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        
        // Horizontal stabilizers
        ctx.beginPath()
        ctx.moveTo(-this.size * 0.7, 0)
        ctx.lineTo(-this.size * 0.85, -this.size * 0.25)
        ctx.lineTo(-this.size * 0.65, -this.size * 0.08)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        
        ctx.beginPath()
        ctx.moveTo(-this.size * 0.7, 0)
        ctx.lineTo(-this.size * 0.85, this.size * 0.25)
        ctx.lineTo(-this.size * 0.65, this.size * 0.08)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        
        // Cockpit windows
        ctx.fillStyle = this.adjustColor(this.color, 1.6)
        ctx.beginPath()
        ctx.arc(this.size * 0.5, 0, this.size * 0.08, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
      }

      adjustColor(color: string, factor: number): string {
        const hex = color.replace('#', '')
        const r = Math.min(255, Math.floor(parseInt(hex.substr(0, 2), 16) * factor))
        const g = Math.min(255, Math.floor(parseInt(hex.substr(2, 2), 16) * factor))
        const b = Math.min(255, Math.floor(parseInt(hex.substr(4, 2), 16) * factor))
        return `rgb(${r}, ${g}, ${b})`
      }

      draw() {
        if (!ctx) return

        const scale = 1000 / (1000 + this.z)
        const baseOpacity = 0.6 + (scale * 0.4)

        // Draw trail
        for (let i = 0; i < this.trail.length - 1; i++) {
          const point = this.trail[i]
          const nextPoint = this.trail[i + 1]
          const trailScale = 1000 / (1000 + point.z)
          
          ctx.globalAlpha = point.opacity * 0.3 * baseOpacity
          ctx.strokeStyle = this.color
          ctx.lineWidth = this.size * 0.25 * trailScale * point.opacity
          ctx.lineCap = 'round'
          
          ctx.beginPath()
          ctx.moveTo(point.x, point.y)
          ctx.lineTo(nextPoint.x, nextPoint.y)
          ctx.stroke()
        }

        ctx.globalAlpha = baseOpacity
        this.drawPlane()
        ctx.globalAlpha = 1
      }
    }

    let elements: TravelElement[] = []

    // Halved from 15 to 8
    for (let i = 0; i < 8; i++) {
      elements.push(new TravelElement())
    }

    let lastSpawn = Date.now()

    function animate() {
      if (!ctx || !canvas) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Halved max from 25 to 13
      if (Date.now() - lastSpawn > 2000 && elements.length < 13) {
        elements.push(new TravelElement())
        lastSpawn = Date.now()
      }

      elements.sort((a, b) => b.z - a.z)

      elements = elements.filter(element => {
        const shouldRemove = element.update()
        if (!shouldRemove) {
          element.draw()
        }
        return !shouldRemove
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  )
}