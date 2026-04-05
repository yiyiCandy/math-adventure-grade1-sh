import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import GamePage from './pages/GamePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:chapterId" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
