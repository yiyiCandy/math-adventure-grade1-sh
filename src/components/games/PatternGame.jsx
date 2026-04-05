import { useState, useMemo } from 'react'
import Confetti from '../Confetti'

const BEAD_COLORS = ['red', 'blue', 'orange', 'green', 'purple']
const COLOR_LABELS = {
  red: '红色',
  blue: '蓝色',
  orange: '橙色',
  green: '绿色',
  purple: '紫色',
}

// Generate a repeating pattern then blank out some beads
function generatePattern() {
  // Pick 2-3 colors for the pattern unit
  const unitLen = Math.random() > 0.5 ? 2 : 3
  const available = [...BEAD_COLORS].sort(() => Math.random() - 0.5)
  const unit = available.slice(0, unitLen)

  // Repeat unit to fill ~12 beads
  const repeatCount = unitLen === 2 ? 6 : 4
  const fullPattern = []
  for (let i = 0; i < repeatCount; i++) {
    fullPattern.push(...unit)
  }

  // Blank out the last `unitLen` beads (and maybe 1-2 in the middle)
  const totalLen = fullPattern.length
  const blanks = new Set()
  // Always blank out the last unit
  for (let i = totalLen - unitLen; i < totalLen; i++) {
    blanks.add(i)
  }
  // Optionally blank out one in the middle
  if (Math.random() > 0.4) {
    const midIdx = Math.floor(totalLen / 2) + Math.floor(Math.random() * unitLen)
    if (midIdx < totalLen - unitLen) blanks.add(midIdx)
  }

  const beads = fullPattern.map((color, i) => ({
    color,
    isBlank: blanks.has(i),
    index: i,
  }))

  return { beads, unit, blanks: [...blanks] }
}

const TOTAL_ROUNDS = 5

export default function PatternGame({ onGoHome }) {
  const [pattern, setPattern] = useState(() => generatePattern())
  const [userColors, setUserColors] = useState({}) // { beadIndex: color }
  const [selectedBlank, setSelectedBlank] = useState(null) // which blank is selected
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const blankIndices = pattern.blanks

  const handleBlankClick = (index) => {
    if (answered) return
    setSelectedBlank(index)
  }

  const handleColorPick = (color) => {
    if (selectedBlank === null || answered) return
    setUserColors({ ...userColors, [selectedBlank]: color })
    // Auto move to next uncolored blank
    const nextBlank = blankIndices.find(
      (bi) => bi !== selectedBlank && !userColors[bi]
    )
    setSelectedBlank(nextBlank !== undefined ? nextBlank : null)
  }

  const allFilled = blankIndices.every((bi) => userColors[bi])

  const handleSubmit = () => {
    if (!allFilled) return
    const correct = blankIndices.every(
      (bi) => userColors[bi] === pattern.beads[bi].color
    )
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
    setPattern(generatePattern())
    setUserColors({})
    setSelectedBlank(null)
    setAnswered(false)
    setIsCorrect(false)
    setRound(round + 1)
  }

  const handleRestart = () => {
    setPattern(generatePattern())
    setUserColors({})
    setSelectedBlank(null)
    setAnswered(false)
    setIsCorrect(false)
    setRound(1)
    setScore(0)
    setShowResult(false)
  }

  if (showResult) {
    const stars = score >= 4 ? 3 : score >= 2 ? 2 : score >= 1 ? 1 : 0
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
        <h2>📿 串珠找规律</h2>
        <p className="game-desc">
          发现珠子的排列规律，给空白的珠子涂上正确的颜色！
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
          <div className="pattern-game-area">
            <div className="question-text">
              发现规律，给空白的珠子涂色！
            </div>

            <div className="pattern-hint">
              💡 规律单元：{pattern.unit.map((c) => COLOR_LABELS[c]).join(' → ')} → 不断重复
            </div>

            <div className="bead-string">
              {pattern.beads.map((bead, i) => {
                const isBlank = bead.isBlank
                const filledColor = userColors[i]
                const showCorrect = answered && isBlank

                if (isBlank) {
                  const displayColor = showCorrect ? bead.color : filledColor
                  const isWrong =
                    showCorrect && filledColor && filledColor !== bead.color

                  return (
                    <span key={i}>
                      {i > 0 && <span className="bead-thread" />}
                      <div
                        className={`bead ${displayColor || 'blank'} ${selectedBlank === i ? 'selected' : ''}`}
                        onClick={() => handleBlankClick(i)}
                        style={
                          isWrong
                            ? { border: '3px solid red', boxShadow: '0 0 8px rgba(244,67,54,0.4)' }
                            : {}
                        }
                      >
                        {!displayColor && '?'}
                      </div>
                    </span>
                  )
                }

                return (
                  <span key={i}>
                    {i > 0 && <span className="bead-thread" />}
                    <div className={`bead ${bead.color}`} />
                  </span>
                )
              })}
            </div>

            {!answered && (
              <>
                <div style={{ fontSize: 14, color: '#888', marginTop: 8 }}>
                  {selectedBlank !== null
                    ? `选择一个颜色给第 ${selectedBlank + 1} 颗珠子涂色`
                    : '👆 先点击一颗空白珠子，再选颜色'}
                </div>
                <div className="color-palette">
                  {BEAD_COLORS.map((color) => (
                    <div
                      key={color}
                      className={`color-option bead ${color} ${selectedBlank !== null ? '' : ''}`}
                      onClick={() => handleColorPick(color)}
                      title={COLOR_LABELS[color]}
                      style={{
                        opacity: selectedBlank !== null ? 1 : 0.4,
                        cursor: selectedBlank !== null ? 'pointer' : 'default',
                      }}
                    />
                  ))}
                </div>

                <button
                  className="next-btn"
                  onClick={handleSubmit}
                  disabled={!allFilled}
                  style={{ opacity: allFilled ? 1 : 0.5 }}
                >
                  ✅ 确认答案
                </button>
              </>
            )}
          </div>
        </div>

        {answered && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: isCorrect ? '#4CAF50' : '#F44336', marginBottom: 12 }}>
              {isCorrect
                ? '🎉 完全正确！你找到规律了！'
                : '❌ 有些珠子颜色不对哦，看看正确的排列吧！'}
            </p>
            <div style={{ background: '#F5F9F0', padding: 16, borderRadius: 16, marginBottom: 16, fontSize: 16 }}>
              规律是：{pattern.unit.map((c) => COLOR_LABELS[c]).join(' → ')} 不断重复
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
