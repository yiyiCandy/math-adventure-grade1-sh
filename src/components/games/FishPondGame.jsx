import { useState, useCallback } from 'react'
import Confetti from '../Confetti'

// Generate a subtraction problem within 20 with borrowing
function generateProblem() {
  const minuend = Math.floor(Math.random() * 9) + 11 // 11-19
  const onesDigit = minuend % 10
  // subtrahend must be > ones digit to require borrowing
  const subtrahend = Math.floor(Math.random() * (10 - onesDigit)) + onesDigit + 1
  // Clamp subtrahend to max 9
  const sub = Math.min(subtrahend, 9)
  const answer = minuend - sub
  return { minuend, subtrahend: sub, answer }
}

const TOTAL_ROUNDS = 6

export default function FishPondGame({ onGoHome }) {
  const [problem, setProblem] = useState(() => generateProblem())
  const [fishEaten, setFishEaten] = useState([])
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const fishArray = Array.from({ length: problem.minuend }, (_, i) => i)

  const handleFishClick = (index) => {
    if (answered) return
    if (fishEaten.includes(index)) {
      setFishEaten(fishEaten.filter((i) => i !== index))
    } else {
      if (fishEaten.length < problem.subtrahend) {
        setFishEaten([...fishEaten, index])
      }
    }
  }

  const handleSubmit = () => {
    if (fishEaten.length !== problem.subtrahend) return
    const remaining = problem.minuend - fishEaten.length
    const correct = remaining === problem.answer
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
    setProblem(generateProblem())
    setFishEaten([])
    setAnswered(false)
    setIsCorrect(false)
    setRound(round + 1)
  }

  const handleRestart = () => {
    setProblem(generateProblem())
    setFishEaten([])
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
        {showConfetti && <Confetti />}
        <div className="completion-screen">
          <div className="trophy">🏆</div>
          <h2>太棒了！</h2>
          <p className="final-score">
            你答对了 {score} / {TOTAL_ROUNDS} 题
          </p>
          <div className="stars-row">
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i}>{i < stars ? '⭐' : '☆'}</span>
            ))}
          </div>
          <div>
            <button className="restart-btn secondary" onClick={handleRestart}>
              🔄 再玩一次
            </button>
            <button className="restart-btn" onClick={onGoHome}>
              🏠 返回首页
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="game-header">
        <h2>🐟 小鱼退位减法</h2>
        <p className="game-desc">
          点击鱼儿把它们"吃掉"，算出还剩多少条！
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
            盘子里有 <span className="highlight">{problem.minuend}</span> 条 🐟，
            吃掉 <span className="highlight">{problem.subtrahend}</span> 条。
            还剩多少条？
          </div>

          <div className="fish-pond-scene">
            <div className="cat-mascot">🐱</div>
            <div className="fish-container">
              {fishArray.map((_, i) => (
                <span
                  key={i}
                  className={`fish-item ${fishEaten.includes(i) ? 'eaten' : ''}`}
                  onClick={() => handleFishClick(i)}
                >
                  🐟
                </span>
              ))}
            </div>
          </div>

          <div className="fish-equation">
            {problem.minuend} − {problem.subtrahend} ＝{' '}
            <span className="blank">
              {answered ? (
                <span className="answer-filled">{problem.answer}</span>
              ) : fishEaten.length === problem.subtrahend ? (
                <span className="answer-filled">
                  {problem.minuend - fishEaten.length}
                </span>
              ) : (
                '?'
              )}
            </span>
          </div>

          <div style={{ marginTop: 12, fontSize: 14, color: '#888' }}>
            已点击 {fishEaten.length} / {problem.subtrahend} 条鱼
          </div>
        </div>

        {!answered && (
          <button
            className="next-btn"
            onClick={handleSubmit}
            disabled={fishEaten.length !== problem.subtrahend}
            style={{
              opacity: fishEaten.length !== problem.subtrahend ? 0.5 : 1,
            }}
          >
            ✅ 确认答案
          </button>
        )}

        {answered && (
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: isCorrect ? '#4CAF50' : '#F44336',
                marginBottom: 12,
              }}
            >
              {isCorrect ? '🎉 回答正确！太厉害了！' : `❌ 不对哦，正确答案是 ${problem.answer}`}
            </p>
            {/* Show explanation */}
            <div
              style={{
                background: '#F5F9F0',
                padding: 16,
                borderRadius: 16,
                marginBottom: 16,
                fontSize: 16,
              }}
            >
              <strong>分拆减数：</strong>把 {problem.subtrahend} 分成{' '}
              {problem.minuend % 10} 和 {problem.subtrahend - (problem.minuend % 10)}
              <br />
              先算：{problem.minuend} − {problem.minuend % 10} ＝ 10
              <br />
              再算：10 − {problem.subtrahend - (problem.minuend % 10)} ＝{' '}
              {problem.answer}
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
