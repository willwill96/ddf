import React, { useState, useEffect, useRef } from 'react'
import TextField from '../text-field'
import styled from 'styled-components'

const Input = styled(TextField)`
  min-width: ${({ theme }) => `calc(10 * ${theme.mediumFontSize})`};
  width: ${({ width, theme }) =>
    `calc(${width}px + 2*${theme.mediumFontSize})`};
  font-size: inherit;
  max-width: ${({ theme }) => `calc(45 * ${theme.mediumFontSize})`};
`

const Ruler = styled.div`
  top: -9999px;
  left: -9999px;
  position: absolute;
  white-space: nowrap;
  font-size: inherit;
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
    <React.Fragment>
      <Input
        value={value}
        width={ref.current ? ref.current.offsetWidth : 0}
        placeholder="Use * for wildcard"
        type={props.type}
        onChange={setValue}
      />
      <Ruler ref={ref}>{value}</Ruler>
    </React.Fragment>
  )
}

export default TextInput
