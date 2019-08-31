import React from 'react'
import EnumInput from '../inputs/enum-input'

const deserialize = (value) => {
  return typeof value === 'object' ? value.value : value || ''
}

const FilterEnumInput = ({ suggestions, value, onChange }) => {
  return (
    <EnumInput
      allowCustom
      suggestions={suggestions}
      onChange={onChange}
      value={deserialize(value)}
    />
  )
}

export default FilterEnumInput
