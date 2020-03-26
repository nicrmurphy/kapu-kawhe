import { format, isAfter } from 'date-fns'
import React, { useState, useEffect } from 'react'
import Logo from '../components/Main/Logo'
import '../App.css'
import { apiLocation, dbRoute } from '../env'
import OutbreakMetaTags from '../components/Outbreak/OutbreakMetaTags'
import OutbreakDatePicker from '../components/Outbreak/OutbreakDatePicker'
import OutbreakMap from 'wi-outbreak'
import OutbreakLineChart from '../components/Outbreak/OutbreakLineChart'
import OutbreakTable from '../components/Outbreak/OutbreakTable'
import { execFetch, fetchDHS, fetchJSON } from '../util/OutbreakUtil'
import { Paper, Link, Grid } from '@material-ui/core'

function Outbreak() {
  const [data, setData] = useState(null)
  const [cachedData, setCachedData] = useState({})
  const [infoText, setInfoText] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [renderChart, setRenderChart] = useState(false)
  const [chartLabels, setChartLabels] = useState([])
  
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  useEffect(() => { // TODO: throttle listener
    window.addEventListener('resize', () => {
      setScreenWidth(window.innerWidth)
    })
    return () => {
      window.removeEventListener('resize')
    }
  }, [])

  const sumArr = (sum, val) => sum + val
  const totalCases =
    data && data.length > 0 ? data.map(c => c.POSITIVE).reduce(sumArr) : ''
  const totalDeaths =
    data && data.length > 0 ? data.map(c => c.DEATHS).reduce(sumArr) : ''

  useEffect(() => {
    async function fetchInitial() {
      const url = `${apiLocation}${dbRoute}/dates?state=wi`
      const chartLabels = await fetchJSON(url)
      setChartLabels(chartLabels)

      const data = await execFetch()
      const cachedData = {}
      for (const doc of data) {
        // add to cache
        if (!cachedData[doc.DATE]) {
          cachedData[doc.DATE] = [doc]
        } else {
          cachedData[doc.DATE].push(doc)
        }
      }
      const today = format(new Date(), 'M/d/yyyy')
      if (!cachedData[today]) {
        cachedData[today] = await fetchDHS()
      }

      setCachedData(cachedData)
      setData(cachedData[today])
      setInfoText(`as of ${cachedData[today][0].DATE} ~2:00pm CST`)
      setRenderChart(true)
    }
    fetchInitial()
    return () => {}
  }, [])

  async function accessCache(date) {
    let data
    if (cachedData[date]) {
      data = cachedData[date]
    } else {
      data = await execFetch(date)
      setCachedData(cachedData => {
        return { ...cachedData, [date]: data }
      })
    }
    setData(data)
    if (data.length > 0) {
      setInfoText(`as of ${data[0].DATE} ~2:00pm CST`)
    } else {
      setInfoText(`No data available for ${date}`)
    }
  }

  const handleDateChange = date => {
    setSelectedDate(date)

    if (date && date.toString() !== 'Invalid Date') {
      const selectedDate = format(date, 'M/d/yyyy')
      if (isAfter(date, new Date()) || isAfter(new Date('2/5/2020'), date)) {
        setData([])
        setInfoText(`as of ${selectedDate} ~2:00pm CST`)
      } else {
        accessCache(selectedDate)
      }
    }
  }

  return (
    <div className="Outbreak-background">
      <div className="Outbreak align-center">
        <OutbreakMetaTags />
        <h1 className="Outbreak-title">POSITIVE COVID-19 CASES</h1>
        <OutbreakDatePicker
          handleDateChange={handleDateChange}
          selectedDate={selectedDate}
        />
        <Grid container alignItems="flex-start">
          <Grid item xs={12} md={7}>
            <div className="align-center">
              <div className="Outbreak-map-container">
                <OutbreakMap data={data ? data : []} />
              </div>
              {renderChart && screenWidth >= 960 && (
                <Paper
                  style={{
                    height: '75vh',
                    maxHeight: '120vmin',
                    padding: '.5em',
                    margin: '.5em'
                  }}>
                  <OutbreakLineChart labels={chartLabels} data={cachedData} />
                </Paper>
              )}
            </div>
          </Grid>
          <Grid item xs={12} md={5}>
            <div className="align-center">
              <h1 className="Outbreak-title Outbreak-total">{totalCases}</h1>
              {infoText && <h2 className="Outbreak-text">{infoText}</h2>}
              <OutbreakTable data={data} totals={[totalCases, totalDeaths]} />
              {renderChart && screenWidth < 960 && (
                <Paper
                  style={{
                    height: '90vh',
                    maxHeight: '120vmin',
                    padding: '.5em',
                    margin: '.5em'
                  }}>
                  <OutbreakLineChart labels={chartLabels} data={cachedData} />
                </Paper>
              )}
            </div>
          </Grid>
        </Grid>
        <h2 className="Outbreak-text">
          Source:{' '}
          <Link
            className="Outbreak-link"
            color="initial"
            href="https://www.dhs.wisconsin.gov/outbreaks/index.htm">
            Wisconsin Department of Health Services
          </Link>
        </h2>
        <div className="Outbreak-logo-wrapper">
          <Logo className="align-center" size="sm" clickable={true} />
        </div>
      </div>
    </div>
  )
}

export default Outbreak
