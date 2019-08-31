import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import TextField from '../text-field'

const Input = styled(TextField)`
  width: ${({ theme }) => `calc(8*${theme.mediumSpacing})`};
`

const NumberInput = props => {
  const [value, setValue] = useState(props.value || '')

  useEffect(() => {
    props.onChange(value)
  }, [value])

  return (
    <Input
      type="number"
      value={value}
      onChange={setValue}
    />
  )
}

export default NumberInput
