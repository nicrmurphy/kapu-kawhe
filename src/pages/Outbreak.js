import React from 'react'
import Logo from '../components/Main/Logo'
import '../App.css'
import OutbreakMap from 'wi-outbreak'

function Outbreak() {
  return (
    <div className="align-center">
      <h1>POSITIVE COVID-19 CASES BY COUNTY</h1>
      <OutbreakMap />
      <h2>Source: <a href="https://www.dhs.wisconsin.gov/outbreaks/index.htm">Wisconsin Department of Health Services</a></h2>
      <Logo className="align-center" size="sm" clickable={true} />
    </div>
  )
}

export default Outbreak
