import React, { useEffect, useRef } from 'react'
import $ from 'jquery'
import styled from 'styled-components'
import moment from 'moment-timezone'
import { findDOMNode } from 'react-dom'

/* Dependent on the eonasdan-bootstrap-datetimepicker dependency */

const Root = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  margin: auto;
`

function isSameDay(date1, date2) {
  return (
    date1.year() === date2.year() && date1.dayOfYear() === date2.dayOfYear()
  )
}

const DateTimePicker = props => {
  const datePicker = useRef(null)

  useEffect(() => {
    const value = props.value && props.value.isValid() ? props.value : moment()
    const element = findDOMNode(datePicker.current)
    $(element).datetimepicker({
      format: props.format,
      timeZone: props.timeZone,
      keyBinds: null,
      inline: true,
      defaultDate: value,
    })
    $(element).on('dp.change', e => {
      if (isSameDay(e.oldDate, e.date)) {
        props.onChange(e.date)
      } else {
        props.onChange(e.date.startOf('day'))
      }
    })
    props.onChange(value)
  }, [])

  return <Root ref={datePicker} />
}

export default DateTimePicker
