import * as React from 'react'
import styled from 'styled-components'
import { Button, buttonTypeEnum } from '../presentation/button'
import Dropdown from '../dropdown'
import DateTimePicker from './calendar'
import DateComponent from '../container/input-wrappers/date'

const Root = styled.div`
  margin: 0px;
  padding: 0px;
  border: none;
  height: ${({ theme }) => theme.minimumButtonSize};
`

const Input = styled.input`
  height: ${({ theme }) => theme.minimumButtonSize};
  width: 100%;
`

const CalendarButton = styled(Button)`
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.primaryColor};
  border: none;
  font-size: ${({ theme }) => theme.largeFontSize};
  width: ${({ theme }) => theme.minimumButtonSize};
  height: ${({ theme }) => theme.minimumButtonSize};
  padding: 0px;
  text-align: center;
`

class DateInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: ''
    }
  }
  render() {
    return (
      <Root>
        <Dropdown
          anchor={
            <div>
              <Input onChange={(e) => this.setState({value: e.target.value})} value={this.state.value} type="text" placeholder="YYYY-MM-DD..." />
              <CalendarButton
                buttonType={buttonTypeEnum.primary}
                icon="glyphicon glyphicon-calendar"
              />
            </div>
          }
        >
          <DateTimePicker value={this.state.value} onChange={(e) => this.setState({value: e.date})}/>
        </Dropdown>
      </Root>
    )
  }
}

export default DateInput
