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
  width: ${({ theme }) => `calc(24 * ${theme.minimumFontSize})`};
`

const Input = styled.input`
  height: ${({ theme }) => theme.minimumButtonSize};
  width: ${({ theme }) => `calc(100% - ${theme.minimumButtonSize})`};
`

const CalendarButton = styled(Button)`
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.largeFontSize};
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

function formatDate(date) {
  return moment(date)
    .tz(getTimeZone())
    .format(getDateFormat())
}

const DateInput = withListenTo(
  class DateInput extends React.Component {
    constructor(props) {
      super(props)
      this.state = this.propsToState(props)
      props.onChange(this.getValue(this.state.value))
    }

    propsToState({ value }) {
      if (
        (typeof value === 'string' && value !== '') ||
        value instanceof Date
      ) {
        const date = moment.tz(moment(value), getTimeZone())
        if (date.isValid()) {
          return {
            value: date,
            input: formatDate(date),
          }
        }
      }
      return {
        value: '',
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

    componentWillReceiveProps(props) {
      this.setState(this.propsToState(props))
    }

    render() {
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
                  placeholder={this.props.placeholder || getDateFormat()}
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
              onChange={this.updateDateFromPicker}
              format={getDateFormat()}
              timeZone={getTimeZone()}
            />
          </Dropdown>
        </Root>
      )
    }

    getValue = value => {
      return value === '' ? '' : value.toISOString()
    }

    onChange = () => {
      this.props.onChange(this.getValue(this.state.value))
    }

    updateFormat = () => {
      this.setState({
        input: this.state.value === '' ? '' : formatDate(this.state.value),
      })
    }

    updateDateFromPicker = date => {
      this.setState(
        {
          value: date,
          input: formatDate(date),
        },
        this.onChange
      )
    }

    attemptUpdate = () => {
      if (moment(this.state.input).isValid()) {
        this.setState(
          {
            value: moment.tz(moment(this.state.input), getTimeZone()),
            input: formatDate(moment(this.state.input)),
          },
          this.onChange
        )
      } else if (this.state.input === '') {
        this.setState(
          {
            value: '',
          },
          this.onChange
        )
      } else {
        this.updateFormat()
      }
    }
  }
)

export default DateInput
