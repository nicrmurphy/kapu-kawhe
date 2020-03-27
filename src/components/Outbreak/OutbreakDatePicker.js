import 'date-fns'
import React from 'react'
import { addDays } from 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import { IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'

const useStyles = makeStyles({
  root: {
    width: window.innerWidth < 480 ? '9.5em' : '14em',
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

function OutbreakDatePicker({ handleDateChange, selectedDate }) {
  const classes = useStyles()
  return (
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
  )
}

export default OutbreakDatePicker
