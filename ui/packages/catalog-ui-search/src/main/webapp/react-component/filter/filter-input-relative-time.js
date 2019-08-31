import React from 'react'
import RelativeTimeInput from '../inputs/relative-time-input'

const serialize = ({ last, unit }) => {
  if (unit === undefined || !parseFloat(last)) {
    return
  }
  const prefix = unit === 'm' || unit === 'h' ? 'PT' : 'P'
  return `RELATIVE(${prefix + last + unit.toUpperCase()})`
}

const deserialize = value => {
  if (typeof value !== 'string') {
    return
  }

  const match = value.match(/RELATIVE\(Z?([A-Z]*)(\d+\.*\d*)(.)\)/)
  if (!match) {
    return
  }

  let [, prefix, last, unit] = match
  last = parseFloat(last)
  unit = unit.toLowerCase()
  if (prefix === 'P' && unit === 'm') {
    //must capitalize months
    unit = unit.toUpperCase()
  }

  return {
    last,
    unit,
  }
}
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
