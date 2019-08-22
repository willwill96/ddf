import React, {useEffect, useRef} from 'react'
import $ from 'jquery'
import styled from 'styled-components'
const moment = require('moment-timezone')
import { findDOMNode } from 'react-dom'


const Root = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  margin: auto;
`

const DateTimePicker = (props) => {
  const datePicker = useRef(null)
  
  useEffect(()=>{
    const value = props.value === '' ? moment() : props.value
    const element = findDOMNode(datePicker.current)
    $(element).datetimepicker({
      format: props.format,
      timeZone: props.timeZone,
      keyBinds: null,
      inline: true,
      defaultDate: value,
    })
    $(element).on('dp.change', e => {
      props.onChange(e)
    })    
  }, [])

  return <Root ref={datePicker} />
}

export default DateTimePicker
