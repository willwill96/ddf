import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import UnitsDropdown from './units-dropdown'
import TextField from '../../text-field'

const Label = styled.div`
  font-weight: bolder;
`

const InputContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.minimumSpacing};
`

const LastInput = styled(TextField)`
  width: ${({ theme }) => `calc(8*${theme.mediumSpacing})`};
`

const RelativeTime = props => {
  const [last, setLast] = useState(props.last || '')
  const [unit, setUnit] = useState(props.unit || '')

  useEffect(() => {
    props.onChange({ last, unit })
  }, [last, unit])

  return (
    <div>
      <InputContainer>
        <Label>Last</Label>
        <LastInput type="number" value={last} onChange={setLast} />
      </InputContainer>
      <InputContainer>
        <Label>Units</Label>
        <UnitsDropdown value={unit} onChange={setUnit} />
      </InputContainer>
    </div>
  )
}

export default RelativeTime
