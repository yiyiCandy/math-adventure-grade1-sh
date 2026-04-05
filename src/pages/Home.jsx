import { useNavigate } from 'react-router-dom'

const chapters = [
  {
    id: 1,
    title: '20以内数的加减法（二）',
    subtitle: '退位减法',
    description: '小猫咪要吃鱼啦！帮它算一算盘子里还剩多少条鱼？学会用"分拆减数"的方法巧妙计算！',
    emoji: '🐟',
    gameTag: '🐱 小鱼减法',
    color: '#8BC34A',
    gradient: 'linear-gradient(135deg, #8BC34A, #689F38)',
  },
  {
    id: 2,
    title: '100以内的数',
    subtitle: '数数与计数',
    description: '用小棒和方块来搭建数！一捆小棒是10，学会十个十个地数，认识100以内的数。',
    emoji: '🧱',
    gameTag: '🏗️ 方块搭数',
    color: '#4CAF50',
    gradient: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
  },
  {
    id: 3,
    title: '时间的初步认识',
    subtitle: '整时与半时',
    description: '钟面上的短针叫"时针"，长针叫"分针"。学会看钟表，知道几点钟和几点半！',
    emoji: '🕐',
    gameTag: '⏰ 认识时钟',
    color: '#009688',
    gradient: 'linear-gradient(135deg, #009688, #00695C)',
  },
  {
    id: 4,
    title: '100以内数的加减法（一）',
    subtitle: '不进位加法与不退位减法',
    description: '小松鼠采松果！用小棒来算一算，23 + 4 等于多少？先算个位，再算十位！',
    emoji: '🐿️',
    gameTag: '🌰 松鼠算数',
    color: '#2196F3',
    gradient: 'linear-gradient(135deg, #2196F3, #1565C0)',
  },
  {
    id: 5,
    title: '长度的比较与测量',
    subtitle: '用尺子量一量',
    description: '谁的绳子长？用尺子量一量就知道！学会用厘米来测量物体的长度。',
    emoji: '📏',
    gameTag: '📐 尺子量一量',
    color: '#FF9800',
    gradient: 'linear-gradient(135deg, #FF9800, #E65100)',
  },
  {
    id: 6,
    title: '数学广场 — 找规律',
    subtitle: '串珠子找规律',
    description: '小朋友们在串珠子，红色、蓝色…你发现排列的规律了吗？帮空白的珠子涂上正确的颜色！',
    emoji: '📿',
    gameTag: '🔮 串珠规律',
    color: '#E91E63',
    gradient: 'linear-gradient(135deg, #E91E63, #AD1457)',
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="app-container">
      <nav className="nav-bar">
        <div className="logo">
          <span className="emoji">📐</span>
          <span>数学乐园</span>
        </div>
      </nav>

      <main className="home-page">
        <section className="home-hero">
          <h1>数学乐园</h1>
          <p className="subtitle">一年级下册 · 互动数学学习</p>
          <div className="book-badge">
            📖 上海教育出版社 · 义务教育教科书（五·四学制）
          </div>
        </section>

        <div className="chapters-grid">
          {chapters.map((ch) => (
            <div
              key={ch.id}
              className="chapter-card"
              onClick={() => navigate(`/game/${ch.id}`)}
              id={`chapter-card-${ch.id}`}
            >
              <div className="chapter-card-header" style={{ background: ch.gradient }}>
                <div className="chapter-number">{ch.id}</div>
                <h3>{ch.title}</h3>
              </div>
              <div className="chapter-card-body">
                <p>{ch.description}</p>
                <div className="game-tag">{ch.gameTag}</div>
                <div className="play-hint">
                  <span>👆</span>
                  <span>点击开始游戏</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
