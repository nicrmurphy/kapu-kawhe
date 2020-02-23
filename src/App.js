import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>
          Welcome to Kapu-Kawhe!
        </h2>
        <p>
          This site is currently under construction and will be used to host web applications and tools.
        </p>
        <p>Apps in Active Development:</p>
        <a
          className="App-link"
          href={`https://finance-simulation.${window.location.host}/`}
          rel="noopener noreferrer"
        >
          The Game of Life Financial Simulation
        </a>
      </header>
    </div>
  );
}

export default App;
