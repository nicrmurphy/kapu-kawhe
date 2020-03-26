import React from 'react'
import * as MUI from '@material-ui/core'

function OutbreakTable({ data, totals:[totalCases, totalDeaths] }) {
  return (
    <MUI.Container maxWidth="xs">
      <MUI.TableContainer className="Outbreak-table-container" component={MUI.Paper}>
        <MUI.Table id="outbreak-table" size="small">
          <MUI.TableHead>
            <MUI.TableRow>
              <MUI.TableCell>
                <strong>County</strong>
              </MUI.TableCell>
              <MUI.TableCell>
                <strong>Cases</strong>
              </MUI.TableCell>
              <MUI.TableCell>
                <strong>Deaths</strong>
              </MUI.TableCell>
            </MUI.TableRow>
          </MUI.TableHead>
          <MUI.TableBody>
            {data &&
              data.map(county => (
                <MUI.TableRow key={county.GEOID}>
                  <MUI.TableCell align="left">
                    {county.NAME}
                    {county.CMNTY_SPRD && '*'}
                  </MUI.TableCell>
                  <MUI.TableCell align="right">{county.POSITIVE}</MUI.TableCell>
                  <MUI.TableCell align="right">
                    {county.DEATHS ? county.DEATHS : ''}
                  </MUI.TableCell>
                </MUI.TableRow>
              ))}
            {data && data.length > 0 && (
              <MUI.TableRow key={'total-row'}>
                <MUI.TableCell align="left">
                  <strong>Total</strong>
                </MUI.TableCell>
                <MUI.TableCell align="right">
                  <strong>{totalCases}</strong>
                </MUI.TableCell>
                <MUI.TableCell align="right">
                  <strong>{totalDeaths}</strong>
                </MUI.TableCell>
              </MUI.TableRow>
            )}
          </MUI.TableBody>
        </MUI.Table>
      </MUI.TableContainer>
    </MUI.Container>
  )
}

export default OutbreakTable
