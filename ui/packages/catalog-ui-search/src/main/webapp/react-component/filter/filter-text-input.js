import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

const Input = styled.input`
  min-width: ${({ theme }) => `calc(10 * ${theme.mediumFontSize})`};
  width: ${({ width, theme }) =>
    `calc(${width}px + 2*${theme.mediumFontSize})`};
  font-size: ${({ theme }) => theme.mediumFontSize};
  max-width: ${({ theme }) => `calc(50 * ${theme.mediumFontSize})`};
`

const Ruler = styled.div`
  visibility: hidden;
  top: -9999px;
  left: -9999px;
  position: absolute;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.mediumFontSize};
`

const TextInput = props => {
  const [value, setValue] = useState(
    (typeof props.value === 'object' ? props.value.value : props.value) || ''
  )

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
        onChange={e => setValue(e.target.value)}
      />
      <Ruler ref={ref}>{value.split(' ').join('\xA0')}</Ruler>
    </React.Fragment>
  )
}

export default TextInput
