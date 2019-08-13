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

class BaseInput extends React.Component {
  updateIsValid = () => {}

  render() {
    return (
      <Root>
        <NearInput />
      </Root>
    )
  }
}

export default BaseInput
