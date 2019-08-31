import React from 'react'
import Dropdown from '../../dropdown'
import { Menu, MenuItem } from '../../menu'
import TextField from '../../text-field'
import { matchesFilter } from '../../../component/select/filterHelper'
import styled from 'styled-components'

const TextWrapper = styled.div`
  padding: ${({ theme }) => theme.minimumSpacing};
`

const EnumMenuItem = props => (
  <MenuItem {...props} style={{ paddingLeft: '1.5rem' }} />
)

class EnumInput extends React.Component {
  constructor(props) {
    super(props)
    let value = props.value
    let label = props.value
    let selected = props.suggestions.find(
      suggestion => value === suggestion.value
    )

    if (selected) {
      value = selected.value
      label = selected.label
    } else if (!props.allowCustom) {
      value = suggestions[0].value
      label = suggestions[0].label
    }

    const input = ''
    this.state = { value, label, input }
    props.onChange(value)
  }

  render() {
    return (
      <Dropdown label={this.state.label}>
        <TextWrapper>
          <TextField
            autoFocus
            value={this.state.input}
            placeholder={'Type to Filter'}
            onChange={input => this.setState({ input })}
          />
        </TextWrapper>
        <Menu
          value={this.state.value}
          onChange={this.onChange}
        >
          {this.props.allowCustom && !this.inputMatchesSuggestions() && (
            <EnumMenuItem value={this.state.input}>
              {this.state.input} (custom)
            </EnumMenuItem>
          )}
          {this.getFilteredSuggestions().map(suggestion => {
            return (
              <EnumMenuItem key={suggestion.value} value={suggestion.value}>
                {suggestion.label}
              </EnumMenuItem>
            )
          })}
        </Menu>
      </Dropdown>
    )
  }

  onChange = value => {
    this.props.onChange(value)

    const selected = this.props.suggestions.find(
      suggestion => suggestion.value === value
    )
    const label = selected ? selected.label : value
    this.setState({ value, label })
  }

  getFilteredSuggestions = () => {
    return this.props.suggestions.filter(suggestion =>
      matchesFilter(this.state.input, suggestion.label, this.props.matchCase)
    )
  }

  inputMatchesSuggestions = () => {
    const { input } = this.state
    const { suggestions } = this.props
    if (this.props.matchCase) {
      return suggestions.find(({ label }) => label === input)
    }
    return suggestions.find(
      ({ label }) => label.toLowerCase() === input.toLowerCase()
    )
  }
}

export default EnumInput
