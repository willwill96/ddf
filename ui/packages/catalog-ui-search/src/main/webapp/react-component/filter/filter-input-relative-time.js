import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import NumberInput from './filter-number-input'
import { Menu, MenuItem } from '../menu'
import Dropdown from '../dropdown'
import { serialize, deserialize } from './serial'
const Label = styled.div`
  font-weight: bolder;
`

const InputContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.minimumSpacing};
`

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
      <Menu value={value.label} onChange={subvalue => setValue(subvalue)}>
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

const RelativeTime = props => {
  const value = deserialize(props.value) || { last: '', unit: '' }
  const [last, setLast] = useState(value.last)
  const [unit, setUnit] = useState(value.unit)

  useEffect(() => {
    props.onChange(serialize(last, unit))
  }, [last, unit])

  return (
    <div>
      <InputContainer>
        <Label>Last</Label>
        <NumberInput value={last} onChange={value => setLast(value)} />
      </InputContainer>
      <InputContainer>
        <Label>Units</Label>
        <UnitsDropdown
          value={unit}
          onChange={value => setUnit(value)}
        />
      </InputContainer>
    </div>
  )
}

export default RelativeTime
