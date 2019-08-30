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
import * as React from 'react'
import styled from 'styled-components'
import DateInput from './filter-date-input'
import BooleanInput from './filter-input-boolean'
import NearInput from './filter-input-near'
import BetweenTimeInput from './filter-input-between-time'
import TextInput from './filter-text-input'
import LocationInput from './filter-location-input'
import EnumInput from './filter-enum-input'
import NumberInput from './filter-number-input'
import RelativeTime from './filter-input-relative-time'
import RangeInput from './filter-input-range'

const BaseRoot = styled.div`
  display: inline-block;
  vertical-align: middle;
  line-height: ${({ theme }) => theme.minimumButtonSize};
  min-width: ${({ theme }) => `calc(13 * ${theme.minimumFontSize})`};
  margin: auto;
`
const LocationRoot = styled(BaseRoot)`
  padding: ${({ theme }) =>
    `${theme.minimumSpacing}
      1.5rem 0px calc(${theme.minimumSpacing} + 0.75*${
      theme.minimumButtonSize
    } + ${theme.minimumButtonSize})`};

  min-width: ${({ theme }) => `calc(19*${theme.minimumFontSize})`};
  margin: 0px !important;
  display: block !important;
`

const Roots = {
  LOCATION: LocationRoot,
  GEOMETRY: LocationRoot,
}

const FilterInput = ({ comparator, value, type, suggestions, onChange }) => {
  if (comparator === 'IS EMPTY') return null

  let MyInput
  if (comparator === 'NEAR') {
    MyInput = NearInput
  } else if (type === 'BOOLEAN') {
    MyInput = BooleanInput
  } else if (comparator === 'BETWEEN') {
    MyInput = BetweenTimeInput
  } else if (comparator === 'RELATIVE') {
    MyInput = RelativeTime
  } else if (type === 'DATE') {
    MyInput = DateInput
  } else if (type === 'LOCATION' || type === 'GEOMETRY') {
    MyInput = LocationInput
  } else if (suggestions && suggestions.length > 0) {
    MyInput = EnumInput
    //Need to include other number types in this conditional
  } else if (comparator === 'RANGE') {
    MyInput = RangeInput
  } else if (type === 'INTEGER') {
    MyInput = NumberInput
  } else {
    MyInput = TextInput
  }
  const Root = Roots[type] || BaseRoot

  return (
    <Root>
      <MyInput
        allowCustom
        type={type}
        suggestions={suggestions}
        value={value}
        onChange={value => onChange(value)}
      />
    </Root>
  )
}

export default FilterInput
