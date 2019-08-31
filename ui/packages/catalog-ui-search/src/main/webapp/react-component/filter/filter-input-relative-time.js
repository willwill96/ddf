import React from 'react'
import { serialize, deserialize } from './serial'
import RelativeTimeInput from '../inputs/relative-time-input'
const FilterRelativeTimeInput = props => {
  const value = deserialize(props.value) || { last: '', unit: '' }
  return (
    <RelativeTimeInput
      last={value.last}
      unit={value.unit}
      onChange={val => props.onChange(serialize(val))}
    />
  )
}

export default FilterRelativeTimeInput
