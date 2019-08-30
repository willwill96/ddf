import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import NumberInput from './filter-number-input'

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`

const Label = styled.div`
  padding: 0 ${({ theme }) => theme.minimumSpacing};
  font-weight: bolder;
  margin: auto;
`

const MyNumberInput = styled(NumberInput)`
  width: ${({ theme }) => `calc(8*${theme.minimumFontSize})`};
`

function isIntegerType(type) {
  switch (type) {
    case 'INTEGER':
    case 'LONG':
    case 'SHORT':
      return true
    default:
      return false
  }
}

class RangeInput extends React.Component {
  constructor(props) {
    super(props)
    const { lower = 0, upper = 0 } = this.getStartingValue() || {}
    this.state = { lower, upper }
  }

  getStartingValue = () => {
    const { value, type } = this.props
    if (typeof value === 'object') {
      return value
    }

    if (isIntegerType(type)) {
      return { lower: parseInt(value) || 0, upper: parseInt(value) || 0 }
    }

    return { lower: parseFloat(value) || 0, upper: parseFloat(value) || 0 }
  }

  render() {
    return (
      <Root>
        <MyNumberInput value={this.state.lower} onChange={this.updateLower} />
        <Label>TO</Label>
        <MyNumberInput value={this.state.upper} onChange={this.updateUpper} />
      </Root>
    )
  }

  getValue = () => {
    const { lower, upper } = this.state
    if (isIntegerType(this.props.type)) {
      return { lower: parseInt(lower) || 0, upper: parseInt(upper) || 0 }
    }
    return { lower: parseFloat(lower) || 0, upper: parseFloat(upper) || 0 }
  }

  onChange = () => {
    this.props.onChange(this.getValue())
  }

  updateLower = lower => {
    this.setState({ lower }, this.onChange)
  }

  updateUpper = upper => {
    this.setState({ upper }, this.onChange)
  }
}

export default RangeInput
