import * as React from 'react'
import styled from 'styled-components'

const Label = styled.span`
  padding: 0px ${({ theme }) => theme.minimumSpacing};
  display: inline-block;
`

const Root = styled.div`
  > * {
    display: inline-block;
    vertical-align: top;
  }
  min-width: ${({ theme }) => `calc(20*${theme.minimumFontSize})`};
`

const Input = styled.input`
  display: inline-block;
  width: 35%
`


class NearInput extends React.Component {
  render() {
    return (
      <Root>
        <Input type="text" />
        <Label>within</Label>
        <Input type="number" />
      </Root>
    )
  }
}

export default NearInput
