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
  min-width: ${({ theme }) => `calc(24*${theme.minimumFontSize})`};
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
    })
    $(element).on('dp.change', e=> {
      this.props.onChange()
    })
  }

  render() {
    return <Root ref={this.datePicker} />
  }
}

export default DateTimePicker
