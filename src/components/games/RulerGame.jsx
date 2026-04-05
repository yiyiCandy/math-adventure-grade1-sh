import { useState, useRef } from 'react'
import Confetti from '../Confetti'

const OBJECTS = [
  { emoji: '✏️', name: '铅笔', minLen: 5, maxLen: 15 },
  { emoji: '🖍️', name: '蜡笔', minLen: 4, maxLen: 10 },
  { emoji: '📎', name: '回形针', minLen: 2, maxLen: 5 },
  { emoji: '🔑', name: '钥匙', minLen: 3, maxLen: 7 },
  { emoji: '🥢', name: '筷子', minLen: 10, maxLen: 20 },
  { emoji: '🖊️', name: '钢笔', minLen: 6, maxLen: 14 },
  { emoji: '📏', name: '小尺子', minLen: 8, maxLen: 16 },
  { emoji: '🍭', name: '棒棒糖棍', minLen: 5, maxLen: 12 },
]

function generateMeasurement() {
  const obj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)]
  const length = Math.floor(Math.random() * (obj.maxLen - obj.minLen + 1)) + obj.minLen
  return { ...obj, length }
}

const TOTAL_ROUNDS = 6
const RULER_MAX_CM = 20
const RULER_WIDTH_PX = 480

export default function RulerGame({ onGoHome }) {
  const [measurement, setMeasurement] = useState(() => generateMeasurement())
  const [userAnswer, setUserAnswer] = useState('')
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const pxPerCm = RULER_WIDTH_PX / RULER_MAX_CM
  const objectWidthPx = measurement.length * pxPerCm

  const handleSubmit = () => {
    const val = parseInt(userAnswer, 10)
    const correct = val === measurement.length
    setIsCorrect(correct)
    setAnswered(true)
    if (correct) {
      setScore(score + 1)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }
  }

  const handleNext = () => {
    if (round >= TOTAL_ROUNDS) {
      setShowResult(true)
      return
    }
    setMeasurement(generateMeasurement())
    setUserAnswer('')
    setAnswered(false)
    setIsCorrect(false)
    setRound(round + 1)
  }

  const handleRestart = () => {
    setMeasurement(generateMeasurement())
    setUserAnswer('')
    setAnswered(false)
    setIsCorrect(false)
    setRound(1)
    setScore(0)
    setShowResult(false)
  }

  if (showResult) {
    const stars = score >= 5 ? 3 : score >= 3 ? 2 : score >= 1 ? 1 : 0
    return (
      <div className="game-content">
        <div className="completion-screen">
          <div className="trophy">🏆</div>
          <h2>太棒了！</h2>
          <p className="final-score">你答对了 {score} / {TOTAL_ROUNDS} 题</p>
          <div className="stars-row">
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i}>{i < stars ? '⭐' : '☆'}</span>
            ))}
          </div>
          <div>
            <button className="restart-btn secondary" onClick={handleRestart}>🔄 再玩一次</button>
            <button className="restart-btn" onClick={onGoHome}>🏠 返回首页</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="game-header">
        <h2>📏 尺子量一量</h2>
        <p className="game-desc">
          看看尺子上的刻度，量一量这个物品有多少厘米？
        </p>
      </div>

      <div className="game-content">
        <div className="score-bar">
          <div className="score-item">
            <span className="label">第</span>
            <span className="value">{round}</span>
            <span className="label">/ {TOTAL_ROUNDS} 题</span>
          </div>
          <div className="score-item">
            <span className="label">得分</span>
            <span className="value stars">{'⭐'.repeat(score)}</span>
          </div>
        </div>

        <div className="question-area">
          <div className="ruler-game-area">
            <div className="question-text">
              量一量这个 <span className="highlight">{measurement.name}</span> 有多长？
            </div>

            <div className="measurement-scene">
              <div className="object-to-measure">
                <span style={{ fontSize: 56 }}>{measurement.emoji}</span>
                <span className="object-label">{measurement.name}</span>
              </div>

              {/* Ruler */}
              <div className="ruler-visual" style={{ maxWidth: RULER_WIDTH_PX + 20 }}>
                {/* Object bar showing length */}
                <div
                  className="ruler-object-bar"
                  style={{ width: objectWidthPx }}
                />
                {/* Cm marks */}
                {Array.from({ length: RULER_MAX_CM + 1 }, (_, i) => (
                  <div
                    key={i}
                    className="ruler-cm-mark"
                    style={{ left: i * pxPerCm }}
                  >
                    <div className="tick" />
                    {i % 2 === 0 && <span className="cm-label">{i}</span>}
                  </div>
                ))}
                {/* Half cm marks */}
                {Array.from({ length: RULER_MAX_CM }, (_, i) => (
                  <div
                    key={`h${i}`}
                    className="ruler-cm-mark"
                    style={{ left: (i + 0.5) * pxPerCm }}
                  >
                    <div className="tick half" />
                  </div>
                ))}
              </div>
            </div>

            {!answered && (
              <div className="ruler-answer">
                <span>这个{measurement.name}有</span>
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="?"
                  min="0"
                  max="20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && userAnswer) handleSubmit()
                  }}
                />
                <span>厘米</span>
                <button
                  className="next-btn"
                  onClick={handleSubmit}
                  disabled={!userAnswer}
                  style={{ opacity: userAnswer ? 1 : 0.5, marginTop: 0 }}
                >
                  ✅ 确认
                </button>
              </div>
            )}
          </div>
        </div>

        {answered && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: isCorrect ? '#4CAF50' : '#F44336', marginBottom: 12 }}>
              {isCorrect
                ? '🎉 测量正确！你真细心！'
                : `❌ 不对哦，这个${measurement.name}是 ${measurement.length} 厘米`}
            </p>
            <div style={{ background: '#F5F9F0', padding: 16, borderRadius: 16, marginBottom: 16, fontSize: 16 }}>
              仔细看尺子上的红色条，从 <strong>0</strong> 到 <strong>{measurement.length}</strong>，
              所以长度是 <strong>{measurement.length} 厘米</strong>
            </div>
            <button className="next-btn" onClick={handleNext}>
              {round >= TOTAL_ROUNDS ? '🏆 查看成绩' : '➡️ 下一题'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
