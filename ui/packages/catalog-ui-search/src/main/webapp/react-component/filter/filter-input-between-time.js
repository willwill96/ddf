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
import DateInput from './filter-date-input'
const moment = require('moment')

const Label = styled.span`
  font-weight: bolder;
`

const Root = styled.div`
  display: flex;
  flex-direction: column;
`

const InputContainer = styled.div`
  margin-bottom: ${({theme})=> theme.mediumSpacing};
`

const getValue = (from, to) => {
  const fromMoment = moment(from, moment.ISO_8601)
  const toMoment = moment(to, moment.ISO_8601)
  if (!fromMoment.isValid() || !toMoment.isValid()) {
    return ''
  } else if (fromMoment.isAfter(toMoment)) {
    return `${to}/${from}`
  }
  return `${from}/${to}`
}

const parseValue = value => {
  if (value.includes('/')) {
    const dates = value.split('/')
    const from = dates[0]
    const to = dates[1]
    return {
      from,
      to,
    }
  }
  return {
    from: '',
    to: '',
  }
}

const BetweenTime = props => {
  const value = parseValue(props.value)
  const [from, setFrom] = useState(value.from)
  const [to, setTo] = useState(value.to)

  useEffect(() => {
    props.onChange(getValue(from, to))
  }, [from, to])

  return (
    <Root>
      <InputContainer>
        <Label>From</Label>
        <DateInput
          placeholder="Limit search to after this time."
          value={from}
          onChange={value => setFrom(value)}
        />
      </InputContainer>
      <InputContainer>
        <Label>To</Label>
        <DateInput
          placeholder="Limit search to before this time."
          value={to}
          onChange={value => setTo(value)}
        />
      </InputContainer>
    </Root>
  )
}

export default BetweenTime
