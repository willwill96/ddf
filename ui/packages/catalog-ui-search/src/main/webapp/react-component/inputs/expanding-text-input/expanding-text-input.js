import React, { useState, useEffect, useRef } from 'react'
import TextField from '../../text-field'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Root = styled.div`
  min-width: ${({ theme }) => `calc(10 * ${theme.mediumFontSize})`};
  width: ${({ width, theme }) =>
    `calc(${width}px + 4*${theme.mediumFontSize})`};
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

const TextInput = props => {
  const [value, setValue] = useState(props.value)

  const ref = useRef(null)

  useEffect(() => {
    props.onChange(value)
  }, [value])

  return (
    <Root width={ref.current ? ref.current.offsetWidth : 0}>
      <Input
        value={value}
        placeholder={props.placeholder}
        onChange={setValue}
      />
      <Ruler ref={ref}>{value}</Ruler>
    </Root>
  )
}

TextInput.propTypes = {
  /** The current selected value. */
  value: PropTypes.string,

  /** Value change handler. */
  onChange: PropTypes.func.isRequired,
}

export default TextInput
