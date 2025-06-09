import {useState} from 'react';
import LocalGame from './components/Game';
import './App.css';

type Mode = 'local' | 'online' | null;

function Header() {
  return (
    <header className="nav-bar">
      <h1>Ultimate Tic-Tac-Toe</h1>
    </header>
  )
  //<button className="nav-item"></button>
  //<button className="nav-item"></button>
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
    <div className="page">
      <Header />
      {mode === 'local' ? (<LocalGame />) : (<OnlineLobby />)}
    </div>
  )
}