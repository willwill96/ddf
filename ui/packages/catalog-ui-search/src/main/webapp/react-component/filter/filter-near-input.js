/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
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

const serialize = (value, distance) => {
  let ret = {}

  ret.value = value
  ret.distance = Math.max(1, parseInt(distance) || 0)

  return ret
}

const deserializeValue = value => {
  if (typeof value === 'object') {
    return value.value || ''
  } else {
    return value || ''
  }
}

const deserializeDistance = value => {
  return (value && value.distance) || '2'
}

const NearInput = props => {
  const [value, setValue] = useState(deserializeValue(props.value))
  const [distance, setDistance] = useState(deserializeDistance(props.value))

  useEffect(() => {
    props.onChange(serialize(value, distance))
  }, [value, distance])

  return (
    <Root>
      <Input type="text" value={value} onChange={setValue} />
      <Label>within</Label>
      <Input type="number" value={distance} onChange={setDistance} />
    </Root>
  )
}

export default NearInput
