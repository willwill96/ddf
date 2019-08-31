import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { readableColor, transparentize } from 'polished'

const BooleanSpan = styled.span`
  font-size: ${({ theme }) => theme.minimumFontSize};
  ${({ value, theme }) => (value ? `color: ${theme.primaryColor}` : null)}
  font-weight: bolder;
`

const Root = styled.button`
  padding: 0 10px;
  background: ${({ theme }) =>
    transparentize(0.95, readableColor(theme.backgroundContent))};
`

const BooleanInput = props => {
  const [value, setValue] = useState(props.value === true)

  useEffect(() => {
    props.onChange(value)
  }, [value])

  return (
    <Root onClick={() => setValue(!value)}>
      <BooleanSpan value={value}>{value.toString()}</BooleanSpan>
    </Root>
  )
}

export default BooleanInput
