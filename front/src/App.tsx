import React from 'react';
import logo from './logo.svg';
import NeonButton from './components/NeonButton';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <NeonButton>PLAY PONG</NeonButton>
      </header>
    </div>
  );
}

export default App;
