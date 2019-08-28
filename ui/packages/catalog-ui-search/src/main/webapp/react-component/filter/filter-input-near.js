import * as React from 'react'
import styled from 'styled-components'

const Label = styled.div`
  margin: 0px ${({ theme }) => theme.minimumSpacing};
  display: inline-block;
`

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`

const Input = styled.input`
  width: ${({ theme }) => `calc(${theme.minimumFontSize} * 8)`};
`

function getValue(value, distance) {
  let ret = {}

  ret.value = typeof value === 'string' ? value : ''
  ret.distance = Math.max(1, parseInt(distance) || 0)

  return ret
}

class NearInput extends React.Component {
  constructor(props) {
    super(props)
    let value = ''
    let distance = '2'
    if (typeof props.value === 'object') {
      this.state = getValue(
        props.value.value || value,
        props.value.distance || distance
      )
    } else {
      this.state = getValue(props.value, distance)
    }
    this.props.onChange(this.state)
  }

  onChange = () => {
    const { value, distance } = this.state
    this.props.onChange(getValue(value, distance))
  }

  render() {
    return (
      <Root>
        <Input
          type="text"
          value={this.state.value}
          onChange={e =>
            this.setState({ value: e.target.value }, this.onChange)
          }
        />
        <Label>within</Label>
        <Input
          type="number"
          value={this.state.distance}
          onChange={e =>
            this.setState({ distance: e.target.value }, this.onChange)
          }
        />
      </Root>
    )
  }
}

export default NearInput
