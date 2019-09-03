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
import BooleanInput from './filter-boolean-input'
import LocationInput from './filter-location-input'
import { NumberInput, RangeInput } from './filter-number-inputs'
import {
  DateInput,
  RelativeTimeInput,
  BetweenTimeInput,
} from './filter-date-inputs'
import { TextInput, NearInput, EnumInput } from './filter-text-inputs'

export const determineInput = (comparator, type, suggestions) => {
  switch (comparator) {
    case 'IS EMPTY':
      return null
    case 'NEAR':
      return NearInput
    case 'BETWEEN':
      return BetweenTimeInput
    case 'RELATIVE':
      return RelativeTimeInput
    case 'RANGE':
      return RangeInput
  }

  switch (type) {
    case 'BOOLEAN':
      return BooleanInput
    case 'DATE':
      return DateInput
    case 'LOCATION':
    case 'GEOMETRY':
      return LocationInput
    case 'LONG':
    case 'DOUBLE':
    case 'FLOAT':
    case 'INTEGER':
    case 'SHORT':
      return NumberInput
  }

  if (suggestions && suggestions.length > 0) {
    return EnumInput
  }
  return TextInput
}
