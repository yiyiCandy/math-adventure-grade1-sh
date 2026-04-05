import { useEffect, useState } from 'react'

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8A80', '#B388FF', '#82B1FF', '#FFAB40']

export default function Confetti({ duration = 3000 }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    const newPieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      duration: 2 + Math.random() * 2,
    }))
    setPieces(newPieces)

    const timer = setTimeout(() => setPieces([]), duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (pieces.length === 0) return null

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            top: '-10px',
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
