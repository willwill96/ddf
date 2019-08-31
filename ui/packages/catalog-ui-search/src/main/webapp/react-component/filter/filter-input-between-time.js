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
import React from 'react'
import BetweenTimeInput from '../inputs/between-time-input'
import moment from 'moment'

const serialize = ({ from, to }) => {
  const fromMoment = moment(from, moment.ISO_8601)
  const toMoment = moment(to, moment.ISO_8601)
  if (!fromMoment.isValid() || !toMoment.isValid()) {
    return ''
  } else if (fromMoment.isAfter(toMoment)) {
    return `${to}/${from}`
  }
  return `${from}/${to}`
}

const deserialize = value => {
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

const FilterBetweenTime = props => {
  const value = deserialize(props.value || '')
  return (
    <BetweenTimeInput
      from={value.from}
      to={value.to}
      onChange={val => props.onChange(serialize(val))}
    />
  )
}

export default FilterBetweenTime
