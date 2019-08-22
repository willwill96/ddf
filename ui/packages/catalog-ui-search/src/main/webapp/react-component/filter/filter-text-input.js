import * as React from 'react'

const TextInput = ({ type, onChange, placeholder }) => {
  return (
    <input
      placeholder={placeholder}
      type={type}
      onChange={e => onChange(e.target.value)}
    />
  )
}

export default TextInput
