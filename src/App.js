import React from 'react'
import Main from './routes/Main'
import Outbreak from './routes/Outbreak'
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
