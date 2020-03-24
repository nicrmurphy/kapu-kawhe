import React from 'react'
import Logo from '../components/Main/Logo'
import { Link } from 'react-router-dom'

function Main() {
  return (
    <div className="App">
      <header className="App-header">
        <Logo size="lg" text="kia ora!" />
        <p className="App-body-text">
          My name is Nic, and I use this site to host web applications and tools
          I develop.
          <br />
          Enjoy your time looking around!
        </p>
        <h3>Apps in Active Development:</h3>
        <Link className="App-link" to="/wi-outbreak">
          Live Map of COVID-19 Cases in Wisconsin
        </Link>
        <br />
        <a
          className="App-link"
          href={`https://finance-simulation.${window.location.host}/`}
          rel="noopener noreferrer">
          The Game of Life Financial Simulation
        </a>
        <br />
        <br />
      </header>
    </div>
  )
}

export default Main
