import { useParams, useNavigate } from 'react-router-dom'
import FishPondGame from '../components/games/FishPondGame'
import BlockBuilderGame from '../components/games/BlockBuilderGame'
import ClockGame from '../components/games/ClockGame'
import AcornGame from '../components/games/AcornGame'
import RulerGame from '../components/games/RulerGame'
import PatternGame from '../components/games/PatternGame'

const chapterMeta = {
  1: { title: '20以内数的加减法', color: '#8BC34A', gradient: 'linear-gradient(135deg, #8BC34A, #689F38)' },
  2: { title: '100以内的数', color: '#4CAF50', gradient: 'linear-gradient(135deg, #4CAF50, #2E7D32)' },
  3: { title: '时间的初步认识', color: '#009688', gradient: 'linear-gradient(135deg, #009688, #00695C)' },
  4: { title: '100以内数的加减法', color: '#2196F3', gradient: 'linear-gradient(135deg, #2196F3, #1565C0)' },
  5: { title: '长度的比较与测量', color: '#FF9800', gradient: 'linear-gradient(135deg, #FF9800, #E65100)' },
  6: { title: '数学广场 — 找规律', color: '#E91E63', gradient: 'linear-gradient(135deg, #E91E63, #AD1457)' },
}

const gameComponents = {
  1: FishPondGame,
  2: BlockBuilderGame,
  3: ClockGame,
  4: AcornGame,
  5: RulerGame,
  6: PatternGame,
}

export default function GamePage() {
  const { chapterId } = useParams()
  const navigate = useNavigate()
  const id = parseInt(chapterId)
  const meta = chapterMeta[id]
  const GameComponent = gameComponents[id]

  if (!meta || !GameComponent) {
    return (
      <div className="app-container">
        <nav className="nav-bar">
          <button className="nav-back-btn" onClick={() => navigate('/')}>
            ← 返回首页
          </button>
          <div className="logo">
            <span className="emoji">📐</span>
            <span>数学乐园</span>
          </div>
        </nav>
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2>游戏未找到</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <nav className="nav-bar" style={{ background: meta.gradient }}>
        <button className="nav-back-btn" onClick={() => navigate('/')}>
          ← 返回首页
        </button>
        <div className="logo" onClick={() => navigate('/')}>
          <span className="emoji">📐</span>
          <span>数学乐园</span>
        </div>
      </nav>
      <div className="game-page">
        <GameComponent onGoHome={() => navigate('/')} />
      </div>
    </div>
  )
}
