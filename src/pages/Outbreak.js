import React, { useState, useEffect } from 'react'
import Logo from '../components/Main/Logo'
import '../App.css'
import OutbreakMap from 'wi-outbreak'
import { corsOrigin, serverPort as port, dbRoute } from '../env'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Container,
  Link
} from '@material-ui/core'

function Outbreak() {
  const [data, setData] = useState(null)
  const [fetchData, setFetchData] = useState(true)
  const [infoText, setInfoText] = useState(
    'Fetching data from Wisconsin DHS...'
  )
  // const url = 'https://cors-anywhere.herokuapp.com/https://bit.ly/3a5VWXQ'
  const url = `${corsOrigin}:${port}${dbRoute}?state=wi&date=3/22/2020`

  useEffect(() => {
    async function execFetch() {
      try {
        let res = await fetch(url)
        const data = await res.json()
        // const data = res.features.map(county => county.attributes)
        // const data = await getOutbreakData('wi', '3/21/2020')
        console.log(res)
        setFetchData(false)
        setData(data)
        setInfoText(`As of ${data[0].DATE} ~2:00pm CST`)
      } catch (err) {
        console.log(err)
        setInfoText('Error fetching data')
      }
    }

    if (fetchData) {
      execFetch()
    }
    return () => {}
  }, [fetchData, url])
  return (
    <div className="Outbreak align-center">
      <h1 className="Outbreak-text">
        POSITIVE COVID-19 CASES BY COUNTY
      </h1>
      <OutbreakMap data={data} className="align-center" />
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
        <Link className="Outbreak-link" color="initial" href="https://www.dhs.wisconsin.gov/outbreaks/index.htm">
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
