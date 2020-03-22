import React, { useState, useEffect } from 'react'
import Logo from '../components/Main/Logo'
import '../App.css'
import OutbreakMap from 'wi-outbreak'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Container,
  Typography,
  Link
} from '@material-ui/core'

function Outbreak() {
  const [data, setData] = useState(null)
  const [fetchData, setFetchData] = useState(true)
  const [infoText, setInfoText] = useState(
    'Fetching data from Wisconsin DHS...'
  )
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
    <div id="Outbreak-wrapper" className="align-center">
      <Typography className="Outbreak-text" variant="h4">
        POSITIVE COVID-19 CASES BY COUNTY
      </Typography>
      <OutbreakMap data={data} className="align-center" />
      <h2 className="Outbreak-text">{infoText}</h2>
      <Container maxWidth="xs">
        <TableContainer id="outbreak-table-container" component={Paper}>
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
        <Link href="https://www.dhs.wisconsin.gov/outbreaks/index.htm">
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
