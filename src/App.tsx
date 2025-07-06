import { useState } from 'react';
import { ModeContext } from './context/Context';
import type { Mode } from './context/Context';
import Description from './components/ui/Description';
import LocalGame from './components/LocalGame';
import OnlineLobby from './components/OnlineLobby';
import './App.css';

function Header({ resetMode }: { resetMode: () => void}) {
  // Allow clicking header return to homepage
  return (
    <header className="nav-bar">
      <h1 onClick={resetMode} className="header">Ultimate Tic-Tac-Toe</h1>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        Made by Jonathan Spence | <a href="https://github.com/Jon-Cactus" className="link">GitHub</a>
      </p>
    </footer>
  )
}

export default function App() {
  // Control local/online play
  const [mode, setMode] = useState<Mode>(null);

  const resetMode = () => setMode(null);

  if (mode === null) { // Before selecting mode
    return (
      <div className="wrapper">
        <Header resetMode={resetMode} />
        <div className="content">
          <div className="lobby">
            <button className="btn-base" onClick={() => setMode('local')}>Play Locally</button>
            <button className="btn-base" onClick={() => setMode('online')}>Play Online</button>
          </div>
          <Description />
        </div>
        <Footer />
      </div>
    )
  }
  return ( // After selecting mode
    <ModeContext.Provider value={mode}>
      <div className="wrapper">
        <div className="content">
          <Header resetMode={resetMode} />
          {mode === 'local' ? (<LocalGame />) : (<OnlineLobby />)}
        </div>
        <Footer />
      </div>
    </ModeContext.Provider>
    
  )
}