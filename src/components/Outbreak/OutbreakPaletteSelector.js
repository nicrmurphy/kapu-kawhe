import React from 'react'
import { FormControl, InputLabel, Select } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    color: 'white'
  },
  select: {
    color: 'white',
    '&:before': {
      borderColor: 'red'
    },
    borderBottom: '1px solid white',
    '&:after': {
      borderBottom: '1px solid white'
    }
    // borderColor: 'white',
    // fontSize: 'calc(10px + 2vmin)'
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
function OutbreakPaletteSelector({ palette, setPalette }) {
  const classes = useStyles()
  return (
    <FormControl variant="standard" classes={{ root: classes.root }}>
      <InputLabel htmlFor="palette-select">Palette</InputLabel>
      <Select
        classes={{ root: classes.root }}
        native
        value={palette}
        onChange={e => setPalette(e.target.value)}
        label="Palette"
        inputProps={{
          name: 'palette',
          id: 'palette-select',
          classes: { root: classes.select }
        }}>
        <option value={'warm'}>Warm</option>
        <option value={'cool'}>Cool</option>
        <option value={'neon'}>Neon</option>
        <option value={'go pack go'}>Go Pack Go</option>
      </Select>
    </FormControl>
  )
}

export default OutbreakPaletteSelector
