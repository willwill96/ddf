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
import { deserializeRange, NumberInput } from './numberFilterHelper'
import styled from 'styled-components'

const Input = styled(NumberInput)`
  width: ${({ theme }) => `calc(4*${theme.mediumSpacing})`};
`

const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Label = styled.div`
  padding: 0 ${({ theme }) => theme.minimumSpacing};
  font-weight: bolder;
`

const serialize = (lower, upper) => ({ lower, upper })

const FilterRangeInput = props => {
  const [value, setValue] = useState(deserializeRange(props.value))
  useEffect(() => {
    props.onChange(value)
  }, [value])

  return (
    <Root>
      <Input
        isInteger={props.isInteger}
        value={value.lower}
        onChange={lower => setValue(serialize(lower, value.upper))}
      />
      <Label>TO</Label>
      <Input
        value={value.upper}
        onChange={upper => setValue(serialize(value.lower, upper))}
      />
    </Root>
  )
}

export default FilterRangeInput
