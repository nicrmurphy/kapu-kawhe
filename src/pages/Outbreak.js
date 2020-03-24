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

  const sumArr = (sum, val) => sum + val
  const totalCases =
    data && data.length > 0 ? data.map(c => c.POSITIVE).reduce(sumArr) : ''
  const totalDeaths =
    data && data.length > 0 ? data.map(c => c.DEATHS).reduce(sumArr) : ''

  useEffect(() => {
    async function fetchInitial() {
      const date = format(new Date(), 'M/d/yyyy')
      const data = await execFetch(date)
      setCachedData({ [date]: data })
      setData(data)
      setInfoText(`as of ${data.length > 0 ? data[0].DATE : date} ~2:00pm CST`)
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
    },
    helperText: {
      display: 'none'
    }
  })

  const classes = useStyles()

  return (
    <div className="Outbreak align-center">
      <MetaTags>
        {/* Primary Meta Tags */}
        <title>WI Covid-19 Outbreak</title>
        <meta name="title" content="WI Covid-19 Outbreak" />
        <meta
          name="description"
          content="Visualized Covid-19 outbreak in Wisconsin"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.PUBLIC_URL} />
        <meta property="og:title" content="WI Covid-19 Outbreak" />
        <meta
          property="og:description"
          content="Visualized Covid-19 outbreak in Wisconsin"
        />
        <meta
          property="og:image"
          content={`${process.env.PUBLIC_URL}/outbreak.png`}
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={process.env.PUBLIC_URL} />
        <meta property="twitter:title" content="WI Covid-19 Outbreak" />
        <meta
          property="twitter:description"
          content="Visualized Covid-19 outbreak in Wisconsin"
        />
        <meta
          property="twitter:image"
          content={`${process.env.PUBLIC_URL}/outbreak.png`}
        />
      </MetaTags>
      <h1 className="Outbreak-title">POSITIVE COVID-19 CASES</h1>
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
            FormHelperTextProps={{ classes: { root: classes.helperText } }}
            disableToolbar
            variant="outlined"
            format="MM/dd/yyyy"
            margin="none"
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
      <h1 className="Outbreak-title Outbreak-total">{totalCases}</h1>
      {infoText && <h2 className="Outbreak-text">{infoText}</h2>}
      <Container maxWidth="xs">
        <TableContainer className="Outbreak-table-container" component={Paper}>
          <Table id="outbreak-table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>County</strong>
                </TableCell>
                <TableCell>
                  <strong>Cases</strong>
                </TableCell>
                <TableCell>
                  <strong>Deaths</strong>
                </TableCell>
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
              {data && data.length > 0 && (
                <TableRow key={'total-row'}>
                  <TableCell align="left">
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{totalCases}</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{totalDeaths}</strong>
                  </TableCell>
                </TableRow>
              )}
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
