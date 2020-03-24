import 'date-fns'
import { format, isAfter, addDays } from 'date-fns'
import React, { useState, useEffect } from 'react'
import MetaTags from 'react-meta-tags'
import Logo from '../components/Main/Logo'
import '../App.css'
import OutbreakMap from 'wi-outbreak'
import { apiLocation, dbRoute } from '../env'
import DateFnsUtils from '@date-io/date-fns'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Container,
  Link,
  IconButton
} from '@material-ui/core'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import { makeStyles } from '@material-ui/core/styles'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'

async function execFetch(date) {
  const url = `${apiLocation}${dbRoute}?state=wi&date=${date}`
  const today = format(new Date(), 'M/d/yyyy')
  try {
    let res = await fetch(url)
    let data = await res.json()

    if (data.length === 0 && date === today) {
      data = await fetchDHS()
    }
    return data
  } catch (err) {
    console.log(err)
  }
}

async function fetchDHS() {
  const url = 'https://cors-anywhere.herokuapp.com/https://bit.ly/3a5VWXQ'
  try {
    let res = await fetch(url)
    res = await res.json()
    return res.features.map(county => county.attributes)
  } catch (err) {
    console.log(err)
  }
}

function Outbreak() {
  const [data, setData] = useState(null)
  const [cachedData, setCachedData] = useState({})
  const [infoText, setInfoText] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    async function fetchInitial() {
      const date = format(new Date(), 'M/d/yyyy')
      const data = await execFetch(date)
      setCachedData({ [date]: data })
      setData(data)
      setInfoText(`As of ${date} ~2:00pm CST`)
    }
    fetchInitial()
    return () => {}
  }, [])

  async function accessCache(date) {
    let data
    if (cachedData[date]) {
      // console.log('oh, i already has that:', cachedData[date])
      data = cachedData[date]
    } else {
      // console.log('lemme fetch that for u bc this is all i has:', cachedData)
      data = await execFetch(date)
      // console.log('i fetched some data for u:', data)
      setCachedData(cachedData => {
        return { ...cachedData, [date]: data }
      })
    }
    setData(data)
    if (data.length > 0) {
      setInfoText(`As of ${date} ~2:00pm CST`)
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
        setInfoText(`As of ${selectedDate} ~2:00pm CST`)
      } else {
        accessCache(selectedDate)
      }
    }
  }

  const useStyles = makeStyles({
    root: {
      width: '12em',
      marginTop: 0
    },
    input: {
      color: 'white',
      borderColor: 'white',
      fontSize: 'calc(10px + 2vmin)'
    },
    underline: {
      borderBottom: '1px solid white',
      '&:after': {
        borderBottom: '1px solid white'
      }
    }
  })

  const classes = useStyles()

  return (
    <div className="Outbreak align-center">
      <MetaTags>
        {/* Primary Meta Tags */}
        <title>WI Covid-19 Outbreak</title>
        <meta name="title" content="WI Covid-19 Outbreak" />
        <meta name="description" content="Visualized Covid-19 outbreak in Wisconsin" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kapu-kawhe.com/wi-outbreak" />
        <meta property="og:title" content="WI Covid-19 Outbreak" />
        <meta property="og:description" content="Visualized Covid-19 outbreak in Wisconsin" />
        <meta property="og:image" content="/coffee256.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://kapu-kawhe.com/wi-outbreak" />
        <meta property="twitter:title" content="WI Covid-19 Outbreak" />
        <meta
          property="twitter:description"
          content="Visualized Covid-19 outbreak in Wisconsin"
        />
        <meta property="twitter:image" content="/coffee256.png" />
      </MetaTags>
      <h1 className="Outbreak-title">POSITIVE COVID-19 CASES BY COUNTY</h1>
      <div className="Outbreak-date-picker-wrapper">
        <IconButton
          aria-label="Previous"
          onClick={() => handleDateChange(addDays(selectedDate, -1))}>
          <NavigateBeforeIcon />
        </IconButton>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            classes={{ root: classes.root }}
            InputProps={{
              classes: { root: classes.input, underline: classes.underline }
            }}
            disableToolbar
            variant="outlined"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date'
            }}
          />
        </MuiPickersUtilsProvider>
        <IconButton
          aria-label="Next"
          onClick={() => handleDateChange(addDays(selectedDate, 1))}>
          <NavigateNextIcon />
        </IconButton>
      </div>
      <OutbreakMap data={data ? data : []} className="align-center" />
      {infoText && <h2 className="Outbreak-text">{infoText}</h2>}
      <Container maxWidth="xs">
        <TableContainer className="Outbreak-table-container" component={Paper}>
          <Table id="outbreak-table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>County</TableCell>
                <TableCell>Cases</TableCell>
                <TableCell>Deaths</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map(county => (
                  <TableRow key={county.GEOID}>
                    <TableCell align="left">
                      {county.NAME}
                      {county.CMNTY_SPRD && '*'}
                    </TableCell>
                    <TableCell align="right">{county.POSITIVE}</TableCell>
                    <TableCell align="right">
                      {county.DEATHS ? county.DEATHS : ''}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
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
  )
}

export default Outbreak
