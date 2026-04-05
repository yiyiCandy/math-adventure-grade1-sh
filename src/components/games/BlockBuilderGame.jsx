import { useState } from 'react'
import Confetti from '../Confetti'

function generateTarget() {
  return Math.floor(Math.random() * 81) + 20 // 20-100
}

const TOTAL_ROUNDS = 6

export default function BlockBuilderGame({ onGoHome }) {
  const [target, setTarget] = useState(() => generateTarget())
  const [tens, setTens] = useState(0)
  const [ones, setOnes] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const currentValue = tens * 10 + ones

  const handleAddTen = () => {
    if (answered) return
    if (currentValue + 10 <= 100) setTens(tens + 1)
  }

  const handleAddOne = () => {
    if (answered) return
    if (currentValue + 1 <= 100) setOnes(ones + 1)
  }

  const handleReset = () => {
    if (answered) return
    setTens(0)
    setOnes(0)
  }

  const handleSubmit = () => {
    const correct = currentValue === target
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
    setTarget(generateTarget())
    setTens(0)
    setOnes(0)
    setAnswered(false)
    setIsCorrect(false)
    setRound(round + 1)
  }

  const handleRestart = () => {
    setTarget(generateTarget())
    setTens(0)
    setOnes(0)
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
        <h2>🧱 方块搭数</h2>
        <p className="game-desc">
          用"十棒"和"一块"搭出目标数字！绿色长条=10，橙色方块=1
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
          <div className="block-builder-area">
            <div className="target-number">
              <span className="label">请搭出数字</span>
              {target}
            </div>

            <div className="blocks-display">
              {tens > 0 && (
                <div className="block-group">
                  <div className="tens-blocks">
                    {Array.from({ length: tens }, (_, i) => (
                      <div key={i} className="block-ten" style={{ animationDelay: `${i * 0.05}s` }} />
                    ))}
                  </div>
                  <span className="block-label">{tens} 个十</span>
                </div>
              )}
              {ones > 0 && (
                <div className="block-group">
                  <div className="ones-blocks">
                    {Array.from({ length: ones }, (_, i) => (
                      <div key={i} className="block-one" style={{ animationDelay: `${i * 0.05}s` }} />
                    ))}
                  </div>
                  <span className="block-label">{ones} 个一</span>
                </div>
              )}
              {tens === 0 && ones === 0 && (
                <div style={{ color: '#ccc', fontSize: 18, padding: 40 }}>
                  点击下方按钮添加方块
                </div>
              )}
            </div>

            <div className="current-count">
              当前数值：<span>{currentValue}</span>
            </div>

            {!answered && (
              <div className="block-controls">
                <button className="block-btn ten" onClick={handleAddTen}>➕ 十棒 (+10)</button>
                <button className="block-btn one" onClick={handleAddOne}>➕ 方块 (+1)</button>
                <button className="block-btn reset" onClick={handleReset}>🔄 清空</button>
                <button className="block-btn submit" onClick={handleSubmit}>✅ 确认</button>
              </div>
            )}
          </div>
        </div>

        {answered && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: isCorrect ? '#4CAF50' : '#F44336', marginBottom: 12 }}>
              {isCorrect
                ? '🎉 完全正确！你搭得太棒了！'
                : `❌ 不对哦，${target} 是 ${Math.floor(target / 10)} 个十和 ${target % 10} 个一`}
            </p>
            <div style={{ background: '#F5F9F0', padding: 16, borderRadius: 16, marginBottom: 16, fontSize: 16 }}>
              <strong>{target}</strong> ＝ <strong>{Math.floor(target / 10)}</strong> 个十 ＋{' '}
              <strong>{target % 10}</strong> 个一
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
