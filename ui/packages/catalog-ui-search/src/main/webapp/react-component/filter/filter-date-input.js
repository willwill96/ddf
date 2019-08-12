import * as React from 'react'
import styled from 'styled-components'
import { readableColor } from 'polished'

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

const CalendarSpan = styled.span`
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.primaryColor};
  color: ${({theme})=> readableColor(readableColor(theme.primaryColor))};
  border: none;
  font-size: ${({ theme }) => theme.largeFontSize};
  width: ${({theme}) => theme.minimumButtonSize};
  height: ${({theme}) => theme.minimumButtonSize};
  padding: 0px;
  text-align: center; 
`

class DateInput extends React.Component {
  render() {
    return (
      <Root>
        <Input type="text" placeholder="YYYY-MM-DD..." />
        <CalendarSpan>
            <span className="glyphicon glyphicon-calendar"></span>
        </CalendarSpan>
      </Root>
    )
  }
}
/*
<div class="if-editing">
    <div class='input-group date'>
        <input type='text' placeholder="{{property.placeholder}}"/>
        <span class="input-group-addon">
            <span class="glyphicon glyphicon-calendar"></span>
        </span>
    </div>
</div>



@{customElementNamespace}input.is-date {
  .input-group {
    margin: 0px;
    padding: 0px;
    border: none;
    height: @minimumButtonSize;
  }

  input {
    height: @minimumButtonSize;
    width: 100%;
  }

  label {
    padding-left: ~'calc(2px + .5*@{minimumFontSize})';
    line-height: @minimumButtonSize;
    margin: 0px;
    white-space: normal;
    word-break: break-all;
    min-height: @minimumButtonSize;
  }

  .input-group > span.input-group-addon {
    border-radius: @border-radius;
    background: @primary-color !important;
    color: contrast(@primary-color) !important;
    border: none;
    font-size: @largeFontSize;
    width: @minimumButtonSize;
    height: @minimumButtonSize;
    padding: 0px;
    text-align: center;
  }
}


*/

export default DateInput
