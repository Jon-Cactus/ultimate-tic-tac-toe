import { useState } from 'react';
import { ModeContext } from './context/Context';
import type { Mode } from './context/Context';
import LocalGame from './components/LocalGame';
import OnlineLobby from './components/OnlineLobby';
import './App.css';

function Header() {
  return (
    <header className="nav-bar">
      <h1>Ultimate Tic-Tac-Toe</h1>
    </header>
  )
}

export default function App() {
  // Control local/online play
  const [mode, setMode] = useState<Mode>(null);

  if (mode === null) {
    return (
      <>
        <Header />
        <div className="game-selector">
          <button className="btn-base" onClick={() => setMode('local')}>Play Locally</button>
          <button className="btn-base" onClick={() => setMode('online')}>Play Online</button>
        </div>
      </>
    )
  }
  return (
    <ModeContext.Provider value={mode}>
      <div className="page">
        <Header />
        {mode === 'local' ? (<LocalGame />) : (<OnlineLobby />)}
      </div>
    </ModeContext.Provider>
    
  )
}