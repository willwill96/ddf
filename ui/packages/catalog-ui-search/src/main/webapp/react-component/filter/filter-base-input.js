import * as React from 'react'
import styled from 'styled-components'

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

const Input = styled.input`
  width: 100%;
  height: ${({ theme }) => theme.minimumButtonSize};
`

class BaseInput extends React.Component {
  updateIsValid = () => {}

  render() {
    return (
      <Root>
        <InputWrapper>
          <Input />
        </InputWrapper>
      </Root>
    )
  }
}

export default BaseInput
