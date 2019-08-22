import * as React from 'react'
import styled from 'styled-components'
import { Button, buttonTypeEnum } from '../presentation/button'
import Dropdown from '../dropdown'
import DateTimePicker from './calendar'
import user from '../../component/singletons/user-instance'
import withListenTo from '../backbone-container'

const moment = require('moment-timezone')

const Root = styled.div`
  height: ${({ theme }) => theme.minimumButtonSize};
`

const Input = styled.input`
  height: ${({ theme }) => theme.minimumButtonSize};
  width: ${({ theme }) => `calc(24*${theme.minimumFontSize})`};
`

const CalendarButton = styled(Button)`
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.primaryColor};
  border: none;
  font-size: ${({ theme }) => theme.largeFontSize};
  width: ${({ theme }) => theme.minimumButtonSize};
  height: ${({ theme }) => theme.minimumButtonSize};
  text-align: center;
  float: right;
`

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

function isSameDay(date1, date2) {
  return (
    date1 instanceof moment &&
    date2 instanceof moment &&
    date1.year() === date2.year() &&
    date1.dayOfYear() === date2.dayOfYear()
  )
}

function formatDate(date) {
  return moment(date)
    .tz(getTimeZone())
    .format(getDateFormat())
}

const DateInput = withListenTo(
  class DateInput extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        value: props.value || '',
        input: '',
      }
    }

    componentDidMount() {
      this.props.listenTo(
        user.getPreferences(),
        'change:timeZone change:dateTimeFormat',
        this.updateFormat
      )
    }

    render() {
      // State sent to parent should be ISO 8601 with Time Zone +00:00

      return (
        <Root>
          <Dropdown
            anchor={
              <div>
                <Input
                  onBlur={this.attemptUpdate}
                  onChange={e => this.setState({ input: e.target.value })}
                  value={this.state.input}
                  type="text"
                  placeholder={getDateFormat()}
                  onClick={e => e.stopPropagation()}
                />
                <CalendarButton
                  buttonType={buttonTypeEnum.primary}
                  icon="fa fa-calendar"
                />
              </div>
            }
          >
            <DateTimePicker
              value={this.state.value}
              onChange={this.updateDate}
              format={getDateFormat()}
              timeZone={getTimeZone()}
            />
          </Dropdown>
        </Root>
      )
    }

    onChange = () => {
      this.props.onChange(this.state.value === '' ? '' : this.state.value.toISOString())
    }

    updateFormat = () => {
      this.setState({ input: formatDate(this.state.value) })
    }

    updateDate = e => {
      const newDate = isSameDay(this.state.value, e.date)
        ? e.date
        : e.date.startOf('day')
      this.setState({
        value: newDate,
        input: formatDate(newDate),
      })
    }

    attemptUpdate = () => {
      if (moment(this.state.input).isValid()) {
        this.setState({
          value: moment.tz(moment(this.state.input), getTimeZone()),
          input: formatDate(moment(this.state.input)),
        })
      } else if (this.state.input === ''){
        this.setState({
          value: '',
        })
      } else {
        this.setState({
          input: formatDate(this.state.value),
        })
      }
    }
  }
)

export default DateInput
