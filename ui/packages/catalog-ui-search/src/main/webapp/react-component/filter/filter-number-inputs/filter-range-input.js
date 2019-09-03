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
import RangeInput from '../../../inputs/number-range-input'
import { deserializeRange } from './numberFilterHelper'

const FilterRangeInput = props => {
  const [value, setValue] = useState(deserializeRange(props.value))
  useEffect(
    () => {
      props.onChange(value)
    },
    [value]
  )

  return <RangeInput onChange={range => setValue(range)} {...value} />
}

export default FilterRangeInput
