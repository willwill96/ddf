import React from 'react'
import styled from 'styled-components'
import { Button, buttonTypeEnum } from '../../presentation/button'
import Dropdown from '../../dropdown'
import DateTimePicker from './datepicker'
import withListenTo from '../../backbone-container'
import TextField from '../../text-field'
import { getDateFormat, getTimeZone, formatDate } from './dateHelper'
import user from '../../../component/singletons/user-instance'
import moment from 'moment-timezone'

const Input = styled(TextField)`
  display: inline-block;
  height: ${({ theme }) => theme.minimumButtonSize};
  width: ${({ theme }) => `calc(24 * ${theme.minimumFontSize})`};
`

const CalendarButton = styled(Button)`
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.largeFontSize};
  height: ${({ theme }) =>
    `calc(${theme.minimumButtonSize} + ${theme.borderRadius})`};
`

const Anchor = styled.div`
  display: flex;
  flex-direction: row;
`

const DateInput = withListenTo(
  class DateInput extends React.Component {
    constructor(props) {
      super(props)
      this.state = this.propsToState(props)
      props.onChange(this.getValue())
    }

    propsToState(props) {
      let value = ''
      let input = ''

      const date = moment(props.value || '')
      if (date.isValid()) {
        value = date
        input = formatDate(date)
      }

      return { value, input }
    }

    componentDidMount() {
      this.props.listenTo(
        user.getPreferences(),
        'change:timeZone change:dateTimeFormat',
        this.updateInput
      )
    }

    render() {
      return (
        <Dropdown
          anchor={
            <Anchor>
              <Input
                onBlur={this.attemptUpdate}
                onChange={input => this.setState({ input })}
                value={this.state.input}
                type="text"
                placeholder={this.props.placeholder || getDateFormat()}
                onClick={e => e.stopPropagation()}
              />
              <CalendarButton
                buttonType={buttonTypeEnum.primary}
                icon="fa fa-calendar"
              />
            </Anchor>
          }
        >
          <DateTimePicker
            value={this.state.value}
            onChange={this.updateDateFromPicker}
            format={getDateFormat()}
            timeZone={getTimeZone()}
          />
        </Dropdown>
      )
    }

    getValue = () => {
      const { value } = this.state
      return value === '' ? '' : value.toISOString()
    }

    onChange = () => {
      this.props.onChange(this.getValue())
    }

    updateInput = () => {
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
      const date = moment(this.state.input)
      if (date.isValid()) {
        this.setState(
          {
            value: moment.tz(date, getTimeZone()),
            input: formatDate(date),
          },
          this.onChange
        )
      } else if (this.state.input === '') {
        this.setState({ value: '' }, this.onChange)
      } else {
        this.updateInput()
      }
    }
  }
)

export default DateInput
