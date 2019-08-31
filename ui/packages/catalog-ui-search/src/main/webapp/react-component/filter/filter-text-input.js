import React from 'react'
import ExpandingTextInput from '../inputs/expanding-text-input'

const deserialize = value => {
  return (typeof value === 'object' ? value.value : value) || ''
}

const TextInput = ({ value, onChange }) => {
  return <ExpandingTextInput value={deserialize(value)} onChange={onChange} />
}

export default TextInput
