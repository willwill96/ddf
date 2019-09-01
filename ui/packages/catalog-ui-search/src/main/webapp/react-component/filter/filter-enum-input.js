import React from 'react'
import EnumInput from '../inputs/enum-input'

const deserialize = (value) => {
  return typeof value === 'object' ? value.value : value || ''
}

const FilterEnumInput = ({ matchCase, onChange, suggestions, value }) => {
  return (
    <EnumInput
      allowCustom
      matchCase={matchCase}
      suggestions={suggestions}
      onChange={onChange}
      value={deserialize(value)}
    />
  )
}

export default FilterEnumInput
