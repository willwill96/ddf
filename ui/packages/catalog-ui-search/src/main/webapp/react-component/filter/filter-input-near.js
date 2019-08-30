import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import TextField from '../text-field'

const Label = styled.div`
  margin: 0px ${({ theme }) => theme.minimumSpacing};
  display: inline-block;
`

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`

const Input = styled(TextField)`
  width: ${({ theme }) => `calc(${theme.minimumFontSize} * 8)`};
`

function getReturnValue(value, distance) {
  let ret = {}

  ret.value = value
  ret.distance = Math.max(1, parseInt(distance) || 0)

  return ret
}

function getStartingValue(value) {
  if (typeof(value) === 'object') {
    return value.value || ''
  } else {
    return value || ''
  }
}

function getStartingDistance(value) {
  return (value && value.distance) || '2'
}

const NearInput = props => {
  const [value, setValue] = useState(getStartingValue(props.value))
  const [distance, setDistance] = useState(getStartingDistance(props.value))

  useEffect(() => {
    props.onChange(getReturnValue(value, distance))
  }, [value, distance])

  return (
    <Root>
      <Input
        type="text"
        value={value}
        onChange={value => {
          setValue(value)
        }}
      />
      <Label>within</Label>
      <Input
        type="number"
        value={distance}
        onChange={value => {
          setDistance(value)
        }}
      />
    </Root>
  )
}

export default NearInput
