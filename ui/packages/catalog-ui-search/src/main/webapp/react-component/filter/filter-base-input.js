import * as React from 'react'
import styled from 'styled-components'

import BooleanInput from './filter-input-boolean'
import NearInput from './filter-input-near'
import DateInput from './filter-date-input'

const Root = styled.div`
  width: 100%;
  display: block;
  white-space: nowrap;
  line-height: ${({ theme }) => theme.minimumButtonSize}
  position: relative;
`

const InputWrapper = styled.div`
  display: block;
  position: absolute;
  z-index: 1;
`

class BaseInput extends React.Component {
  updateIsValid = () => {}

  render() {
    return (
      <Root>
        <InputWrapper>
          <DateInput />
        </InputWrapper>
      </Root>
    )
  }
}

export default BaseInput
