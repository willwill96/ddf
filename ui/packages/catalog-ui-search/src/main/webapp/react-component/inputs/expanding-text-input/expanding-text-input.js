import React, { useState, useEffect, useRef } from 'react'
import TextField from '../../text-field'
import styled from 'styled-components'

const Root = styled.div`
  min-width: ${({ theme }) => `calc(10 * ${theme.mediumFontSize})`};
  width: ${({ width, theme }) =>
    `calc(${width}px + 2*${theme.mediumFontSize})`};
  max-width: ${({ theme }) => `calc(45 * ${theme.mediumFontSize})`};
`

const Input = styled(TextField)`
  font-size: ${({ theme }) => theme.mediumFontSize};
  width: 100%;
`

const Ruler = styled.div`
  top: -9999px;
  left: -9999px;
  position: absolute;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.mediumFontSize};
`

function parseValue(value) {
  return (typeof value === 'object' ? value.value : value) || ''
}

const TextInput = props => {
  const [value, setValue] = useState(parseValue(props.value))

  const ref = useRef(null)

  useEffect(() => {
    props.onChange(value)
  }, [value])

  return (
    <Root width={ref.current ? ref.current.offsetWidth : 0}>
      <Input
        value={value}
        placeholder="Use * for wildcard"
        onChange={setValue}
      />
      <Ruler ref={ref}>{value}</Ruler>
    </Root>
  )
}

export default TextInput
