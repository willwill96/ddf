import * as React from 'react'
import $ from 'jquery'
import user from '../../component/singletons/user-instance'
import styled from 'styled-components'
require('eonasdan-bootstrap-datetimepicker')
import { findDOMNode } from 'react-dom'

function getDateFormat() {
  return user
    .get('user')
    .get('preferences')
    .get('dateTimeFormat')['datetimefmt']
}

function getTimeZone() {
  return user
    .get('user')
    .get('preferences')
    .get('timeZone')
}
const Root = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  margin: auto;
`


class DateTimePicker extends React.Component {
  datePicker = React.createRef()
  componentDidMount() {
    const element = findDOMNode(this.datePicker.current)
    $(element).datetimepicker({
      format: getDateFormat(),
      timeZone: getTimeZone(),
      keyBinds: null,
      inline: true,
      defaultDate: this.props.value,
    })
    $(element).on('dp.change', e => {
      this.props.onChange(e)
    })
  }

  

  toggleCalendar = () => {
    const element = findDOMNode(this.datePicker.current)
    $(element).data("DateTimePicker").toggle()
    $(element).data("DateTimePicker").destroy()

  }

  render() {
    return <Root onBlur={this.toggleCalendar} ref={this.datePicker} />
  }
}
export default DateTimePicker
