import React, { useEffect, useState } from 'react'
import { Menu, MenuItem } from '../../menu'
import Dropdown from '../../dropdown'

const suggestions = [
  { label: 'Minutes', value: 'm' },
  { label: 'Hours', value: 'h' },
  { label: 'Days', value: 'd' },
  { label: 'Months', value: 'M' },
  { label: 'Years', value: 'y' },
]

const UnitsDropdown = props => {
  const [value, setValue] = useState(
    suggestions.find(suggestion => suggestion.value === props.value) ||
      suggestions[0]
  )

  useEffect(() => {
    props.onChange(value.value)
  }, [value.value])

  return (
    <Dropdown label={value.label}>
      <Menu value={value.label} onChange={setValue}>
        {suggestions.map(suggestion => {
          return (
            <MenuItem key={suggestion.value} value={suggestion}>
              {suggestion.label}
            </MenuItem>
          )
        })}
      </Menu>
    </Dropdown>
  )
}

export default UnitsDropdown
