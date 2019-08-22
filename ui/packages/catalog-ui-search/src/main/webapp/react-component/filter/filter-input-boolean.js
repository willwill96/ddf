import React, { useState } from 'react'
import styled from 'styled-components'
import { readableColor, transparentize } from 'polished'

const BooleanSpan = styled.span`
  font-size: ${({ theme }) => theme.minimumFontSize};
  ${({ value, theme }) => (value ? `color: ${theme.primaryColor}` : null)}
  font-weight: bold;
`

const Root = styled.button`
  width: auto;
  padding-left: 10px;
  padding-right: 10px;
  height: 100%;
  text-align: left;
  background: ${({theme}) => transparentize(0.95, readableColor(theme.backgroundContent))}
`

const BooleanInput = props => { 
  const [value, setValue] = useState(true)

  return (
      <Root onClick={() => setValue(!value)}>
        <BooleanSpan value={value}>{value.toString()}</BooleanSpan>
      </Root>
  )
}

export default BooleanInput
