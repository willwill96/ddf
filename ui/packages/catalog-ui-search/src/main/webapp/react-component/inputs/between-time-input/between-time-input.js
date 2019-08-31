import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import DateInput from '../date-input'

const Label = styled.span`
  font-weight: bolder;
`

const Root = styled.div`
  display: flex;
  flex-direction: column;
`

const InputContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.mediumSpacing};
`

const BetweenTime = props => {
  const [from, setFrom] = useState(props.from)
  const [to, setTo] = useState(props.to)

  useEffect(() => {
    props.onChange({ from, to })
  }, [from, to])

  return (
    <Root>
      <InputContainer>
        <Label>From</Label>
        <DateInput
          placeholder="Limit search to after this time."
          value={from}
          onChange={setFrom}
        />
      </InputContainer>
      <InputContainer>
        <Label>To</Label>
        <DateInput
          placeholder="Limit search to before this time."
          value={to}
          onChange={setTo}
        />
      </InputContainer>
    </Root>
  )
}

export default BetweenTime
