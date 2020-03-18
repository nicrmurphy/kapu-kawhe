import React from 'react'
import coffee from '../coffee.svg'
import { Link } from 'react-router-dom'

function Main() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={coffee} alt="coffee" />
        <h2>KIA ORA!</h2>
        <p className="App-body-text">
          My name is Nic, and I use this site to host web applications and tools
          I develop.
          <br/>
          Enjoy your time looking around!
        </p>
        <h3>Apps in Active Development:</h3>
        {/* <Link className="App-link" to="/wi-outbreak">
          Live Map of COVID-19 Cases in Wisconsin
        </Link> */}
        <a
          className="App-link"
          href={`https://${window.location.host}/wi-outbreak.html`}
          rel="noopener noreferrer">
          Live Map of COVID-19 Cases in Wisconsin
        </a>
        <br/>
        <a
          className="App-link"
          href={`https://finance-simulation.${window.location.host}/`}
          rel="noopener noreferrer">
          The Game of Life Financial Simulation
        </a>
        <br/>
        <br/>
      </header>
    </div>
  )
}

export default Main
