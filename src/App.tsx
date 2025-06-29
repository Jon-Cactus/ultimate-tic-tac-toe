import { useState } from 'react';
import { ModeContext } from './context/Context';
import type { Mode } from './context/Context';
import Description from './components/ui/Description';
import LocalGame from './components/LocalGame';
import OnlineLobby from './components/OnlineLobby';
import './App.css';

function Header({ resetMode }: { resetMode: () => void}) {
  // Allow clicking header to go back to homepage
  return (
    <header className="nav-bar">
      <h1 onClick={resetMode} className="header">Ultimate Tic-Tac-Toe</h1>
    </header>
  )
}

export default function App() {
  // Control local/online play
  const [mode, setMode] = useState<Mode>(null);

  const resetMode = () => setMode(null);

  if (mode === null) { // Before selecting mode
    return (
      <>
        <Header resetMode={resetMode} />
        <div className="lobby">
          <button className="btn-base" onClick={() => setMode('local')}>Play Locally</button>
          <button className="btn-base" onClick={() => setMode('online')}>Play Online</button>
        </div>
        <Description />
      </>
    )
  }
  return ( // After selecting mode
    <ModeContext.Provider value={mode}>
      <div className="page">
        <Header resetMode={resetMode} />
        {mode === 'local' ? (<LocalGame />) : (<OnlineLobby />)}
      </div>
    </ModeContext.Provider>
    
  )
}