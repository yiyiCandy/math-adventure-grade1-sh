import { useState } from 'react'
import Confetti from '../Confetti'

// Generate addition/subtraction within 100 without regrouping
function generateProblem() {
  const isAdd = Math.random() > 0.4
  if (isAdd) {
    const tens = Math.floor(Math.random() * 8 + 1) * 10 // 10,20,...,80
    const onesA = Math.floor(Math.random() * 5) // 0-4
    const onesB = Math.floor(Math.random() * (9 - onesA)) + 1 // ensure no carry and > 0
    const a = tens + onesA
    const b = onesB
    return { a, b, op: '+', answer: a + b }
  } else {
    const tens = Math.floor(Math.random() * 8 + 2) * 10 // 20,30,...,90
    const onesA = Math.floor(Math.random() * 7) + 2 // 2-8
    const onesB = Math.floor(Math.random() * onesA) + 1 // ensure no borrow
    const a = tens + onesA
    const b = onesB
    return { a, b, op: '−', answer: a - b }
  }
}

function generateOptions(answer) {
  const opts = new Set([answer])
  while (opts.size < 4) {
    const offset = Math.floor(Math.random() * 20) - 10
    const val = answer + offset
    if (val > 0 && val <= 100 && val !== answer) opts.add(val)
  }
  return [...opts].sort(() => Math.random() - 0.5)
}

const TOTAL_ROUNDS = 6

export default function AcornGame({ onGoHome }) {
  const [problem, setProblem] = useState(() => generateProblem())
  const [options, setOptions] = useState(() => generateOptions(problem.answer))
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleSelect = (val) => {
    if (answered) return
    setSelected(val)
    const correct = val === problem.answer
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
    const newProblem = generateProblem()
    setProblem(newProblem)
    setOptions(generateOptions(newProblem.answer))
    setSelected(null)
    setAnswered(false)
    setRound(round + 1)
  }

  const handleRestart = () => {
    const newProblem = generateProblem()
    setProblem(newProblem)
    setOptions(generateOptions(newProblem.answer))
    setSelected(null)
    setAnswered(false)
    setRound(1)
    setScore(0)
    setShowResult(false)
  }

  // Visual: tens as bundles of sticks, ones as individual sticks
  const aTens = Math.floor(problem.a / 10)
  const aOnes = problem.a % 10
  const bOnes = problem.b

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
        <h2>🐿️ 松鼠采松果</h2>
        <p className="game-desc">
          帮小松鼠算一算！100以内的不进位加法和不退位减法。
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
          <div className="acorn-game-area">
            {/* Scene with squirrels */}
            <div className="acorn-scene">
              <div className="acorn-groups">
                <div className="acorn-group">
                  <div className="acorn-group-label">🐿️ {problem.a}个</div>
                  <div className="acorn-items">
                    {Array.from({ length: Math.min(problem.a, 15) }, (_, i) => (
                      <span key={i} className="acorn-item">🌰</span>
                    ))}
                    {problem.a > 15 && <span style={{ fontSize: 14 }}>...共{problem.a}个</span>}
                  </div>
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, alignSelf: 'center' }}>
                  {problem.op}
                </div>
                <div className="acorn-group">
                  <div className="acorn-group-label">🐿️ {problem.b}个</div>
                  <div className="acorn-items">
                    {Array.from({ length: problem.b }, (_, i) => (
                      <span key={i} className="acorn-item">🌰</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sticks visualization */}
            <div style={{ fontSize: 14, color: '#888', textAlign: 'center' }}>
              用小棒想一想：
            </div>
            <div className="sticks-display">
              {Array.from({ length: aTens }, (_, i) => (
                <div key={i} className="stick-bundle">
                  <div className="sticks">
                    {Array.from({ length: 10 }, (_, j) => (
                      <div key={j} className="stick" />
                    ))}
                  </div>
                  <span className="bundle-label">10</span>
                </div>
              ))}
              {aOnes > 0 && (
                <div className="stick-bundle">
                  <div className="sticks">
                    {Array.from({ length: aOnes }, (_, j) => (
                      <div key={j} className="stick" style={{ background: 'linear-gradient(180deg, #FFB74D, #FF9800)' }} />
                    ))}
                  </div>
                  <span className="bundle-label">{aOnes}</span>
                </div>
              )}
            </div>

            {/* Equation & choices */}
            <div className="question-text" style={{ marginBottom: 16 }}>
              {problem.a} {problem.op} {problem.b} ＝ ？
            </div>

            <div className="answer-grid">
              {options.map((opt) => (
                <button
                  key={opt}
                  className={`answer-btn ${answered && opt === problem.answer ? 'correct' : ''} ${answered && opt === selected && opt !== problem.answer ? 'wrong' : ''}`}
                  onClick={() => handleSelect(opt)}
                  disabled={answered}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {answered && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: selected === problem.answer ? '#4CAF50' : '#F44336', marginBottom: 12 }}>
              {selected === problem.answer
                ? '🎉 回答正确！小松鼠谢谢你！'
                : `❌ 不对哦，正确答案是 ${problem.answer}`}
            </p>
            <div style={{ background: '#F5F9F0', padding: 16, borderRadius: 16, marginBottom: 16, fontSize: 16 }}>
              {problem.op === '+' ? (
                <>
                  先算个位：{aOnes} + {bOnes} ＝ {aOnes + bOnes}
                  <br />
                  再算十位：{aTens * 10} + {aOnes + bOnes} ＝ {problem.answer}
                </>
              ) : (
                <>
                  先算个位：{aOnes} − {bOnes} ＝ {aOnes - bOnes}
                  <br />
                  十位不变：{aTens * 10} + {aOnes - bOnes} ＝ {problem.answer}
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
