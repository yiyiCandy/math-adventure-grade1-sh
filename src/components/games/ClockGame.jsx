import { useState, useMemo } from 'react'
import Confetti from '../Confetti'

// Generate a time question (whole hour or half hour)
function generateTimeQuestion() {
  const isHalf = Math.random() > 0.5
  const hour = Math.floor(Math.random() * 12) + 1 // 1-12
  return {
    hour,
    minute: isHalf ? 30 : 0,
    display: isHalf ? `${hour}时半` : `${hour}时`,
  }
}

const TOTAL_ROUNDS = 6

// Calculate clock hand angles
function getHourAngle(hour, minute) {
  return ((hour % 12) / 12) * 360 + (minute / 60) * 30
}
function getMinuteAngle(minute) {
  return (minute / 60) * 360
}

// Clock number positions
const clockNumbers = Array.from({ length: 12 }, (_, i) => {
  const num = i + 1
  const angle = (num / 12) * 360 - 90
  const rad = (angle * Math.PI) / 180
  const radius = 108
  return {
    num,
    x: 140 + Math.cos(rad) * radius - 15,
    y: 140 + Math.sin(rad) * radius - 15,
  }
})

export default function ClockGame({ onGoHome }) {
  const [question, setQuestion] = useState(() => generateTimeQuestion())
  const [userHour, setUserHour] = useState(12)
  const [userMinute, setUserMinute] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const hourAngle = getHourAngle(userHour, userMinute)
  const minuteAngle = getMinuteAngle(userMinute)

  const handleHourPlus = () => {
    if (answered) return
    setUserHour(userHour >= 12 ? 1 : userHour + 1)
  }
  const handleHourMinus = () => {
    if (answered) return
    setUserHour(userHour <= 1 ? 12 : userHour - 1)
  }
  const handleMinuteToggle = () => {
    if (answered) return
    setUserMinute(userMinute === 0 ? 30 : 0)
  }

  const handleSubmit = () => {
    const correct = userHour === question.hour && userMinute === question.minute
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
    setQuestion(generateTimeQuestion())
    setUserHour(12)
    setUserMinute(0)
    setAnswered(false)
    setIsCorrect(false)
    setRound(round + 1)
  }

  const handleRestart = () => {
    setQuestion(generateTimeQuestion())
    setUserHour(12)
    setUserMinute(0)
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
        <h2>⏰ 认识时钟</h2>
        <p className="game-desc">
          调整时针和分针，拨出正确的时间！短针是时针，长针是分针。
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
          <div className="question-text">
            请拨出 <span className="highlight">{question.display}</span>
          </div>

          <div className="clock-game-area">
            <div className="clock-container">
              <div className="clock-face">
                {/* Tick marks */}
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className={`clock-tick ${i % 1 === 0 ? 'major' : ''}`}
                    style={{
                      transform: `translateX(-1px) rotate(${i * 30}deg)`,
                      transformOrigin: 'center 130px',
                      left: '50%',
                    }}
                  />
                ))}
                {/* Numbers */}
                {clockNumbers.map((n) => (
                  <div
                    key={n.num}
                    className="clock-number"
                    style={{ left: n.x, top: n.y }}
                  >
                    {n.num}
                  </div>
                ))}
                {/* Hour hand */}
                <div
                  className="clock-hand hour"
                  style={{ transform: `rotate(${hourAngle}deg)` }}
                />
                {/* Minute hand */}
                <div
                  className="clock-hand minute"
                  style={{ transform: `rotate(${minuteAngle}deg)` }}
                />
                {/* Center dot */}
                <div className="clock-center" />
              </div>
            </div>

            <div className="clock-time-display">
              {userHour}:{userMinute === 0 ? '00' : '30'}
            </div>

            {!answered && (
              <div className="clock-controls">
                <button className="clock-btn" onClick={handleHourMinus}>⏪ 时针 −1</button>
                <button className="clock-btn" onClick={handleHourPlus}>时针 +1 ⏩</button>
                <button className="clock-btn" onClick={handleMinuteToggle}>
                  🔄 {userMinute === 0 ? '整时 → 半时' : '半时 → 整时'}
                </button>
                <button className="next-btn" onClick={handleSubmit}>✅ 确认</button>
              </div>
            )}
          </div>
        </div>

        {answered && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: isCorrect ? '#4CAF50' : '#F44336', marginBottom: 12 }}>
              {isCorrect
                ? '🎉 时间拨对了！你真棒！'
                : `❌ 不对哦，正确的是 ${question.display}（${question.hour}:${question.minute === 0 ? '00' : '30'}）`}
            </p>
            <div style={{ background: '#F5F9F0', padding: 16, borderRadius: 16, marginBottom: 16, fontSize: 16 }}>
              {question.minute === 0 ? (
                <>
                  <strong>整时：</strong>分针指向 <strong>12</strong>，时针指向 <strong>{question.hour}</strong>
                </>
              ) : (
                <>
                  <strong>半时：</strong>分针指向 <strong>6</strong>，时针在 <strong>{question.hour}</strong> 和{' '}
                  <strong>{question.hour === 12 ? 1 : question.hour + 1}</strong> 之间
                </>
              )}
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
