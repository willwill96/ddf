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

import TextField from '../../../text-field'
import React, { useEffect, useState } from 'react'

export const deserializeRange = value => {
  if (typeof value === 'object') {
    return value
  }
  if (!isNaN(value)) {
    return { lower: value, upper: value }
  }
  return { lower: '', upper: '' }
}

const computeValue = (value, isInteger, fallback) => {
  if (value === '') return ''

  const intRegex = /^-?\d*$/
  const floatRegex = /^-?\d*(\.\d*)?$/

  if (isInteger) {
    return value.match(intRegex) ? value : fallback
  } else {
    return value.match(floatRegex) ? value : fallback
  }
}

export const NumberInput = props => {
  const [value, setValue] = useState(isNaN(props.value) ? '' : props.value)
  useEffect(() => {
    if (props.isInteger) {
      props.onChange(parseInt(value) || '')
    } else {
      props.onChange(parseFloat(value) || '')
    }
  }, [value])
  return (
    <TextField
      value={value}
      onChange={newVal => {
        setValue(computeValue(newVal, props.isInteger, value))
      }}
      className={props.className}
    />
  )
}
