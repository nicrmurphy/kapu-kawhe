import React from 'react'
import Main from './pages/Main'
import Outbreak from './pages/Outbreak'
import './App.css'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/wi-outbreak">
          <Outbreak />
        </Route>
        <Route path="/">
          <Redirect to="/" />
          <Main />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
