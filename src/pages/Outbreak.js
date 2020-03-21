import React, { useState, useEffect } from 'react'
import Logo from '../components/Main/Logo'
import '../App.css'
import OutbreakMap from 'wi-outbreak'

function Outbreak() {
  const [data, setData] = useState({})
  const [fetchData, setFetchData] = useState(true)
  const [infoText, setInfoText] = useState('Fetching data from Wisconsin DHS...')
  const url = 'https://cors-anywhere.herokuapp.com/https://bit.ly/3a5VWXQ'
  
  useEffect(() => {

    async function execFetch() {
      try {
        let res = await fetch(url)
        res = await res.json()
        const data = res.features.map(county => county.attributes)
        // console.log(data)
        setFetchData(false)
        setData(data)
        setInfoText('')
      } catch (err) {
        console.log(err)
        setInfoText('Error fetching data')
      }
    }
    
    if (fetchData) {
      execFetch()
    }
    return () => {}
  }, [fetchData]) 
  return (
    <div className="align-center">
      <h1>POSITIVE COVID-19 CASES BY COUNTY</h1>
      <OutbreakMap data={data} />
      <h2>{infoText}</h2>
      <h2>Source: <a href="https://www.dhs.wisconsin.gov/outbreaks/index.htm">Wisconsin Department of Health Services</a></h2>
      <Logo className="align-center" size="sm" clickable={true} />
    </div>
  )
}

export default Outbreak
