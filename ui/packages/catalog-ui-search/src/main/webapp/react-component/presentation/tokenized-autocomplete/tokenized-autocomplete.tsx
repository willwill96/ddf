/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/

import styled from 'styled-components'
import * as React from 'react'
import Token from './token'
import { readableColor, transparentize } from 'polished'

const filterHelper = require('../../../component/select/filterHelper')
const { Menu, MenuItem } = require('../../menu')

type State = {
  input: string
  value: Array<string>
  inputFocused: boolean
}

type Props = {
  value: Array<string>
  suggestions?: Array<string>
  onChange?: (newValue: Array<string>) => void
}

const Root = styled.div`
  position: relative;
`

const InputArea = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  background: ${props =>
    transparentize(0.9, readableColor(props.theme.backgroundContent))};
  overflow: auto;
`

const Input = styled.input`
  border: none;
  box-shadow: none;
  outline: none;
  background-color: transparent;
  :active,
  :focus {
    border: none;
    box-shadow: none;
    outline: none;
    background-color: transparent;
  }
  padding: 0 0 0 0;
`

const InputWrapper = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  margin-right: ${props => props.theme.minimumSpacing};
  margin-left: ${props => props.theme.minimumSpacing};
  display: block;
`

const DropdownWrapper = styled.div`
  position: absolute;
  z-index: 1000;
  background-color: ${props => props.theme.backgroundDropdown};
  margin-top: ${props => props.theme.minimumSpacing};
  border: 2px solid ${props => props.theme.primaryColor};
  max-height: 20vh;
  overflow: auto;
  width: 100%;
`

class TokenizedAutoComplete extends React.Component<Props, State> {
  inputRef = React.createRef<HTMLInputElement>()
  dropdownRef = React.createRef<HTMLDivElement>()
  rootRef = React.createRef<HTMLDivElement>()

  constructor(props: Props) {
    super(props)
    this.state = {
      input: '',
      value: props.value.filter(val => val !== ''),
      inputFocused: false,
    }
  }

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClick)
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClick)
  }

  render = () => {
    const onKeyDown = this.areSuggestions() ? undefined : this.keyDown
    return (
      <Root ref={this.rootRef as any}>
        <InputArea>
          {this.state.value.map(val => {
            return (
              <Token
                onRemove={() => this.removeValue(val)}
                key={val}
                label={val}
              />
            )
          })}
          <InputWrapper>
            <Input
              value={this.state.input}
              placeholder={'Enter * for wildcard'}
              onChange={e => this.onInputChange(e.target.value)}
              onKeyDown={onKeyDown}
              ref={this.inputRef as any}
            />
          </InputWrapper>
        </InputArea>
        {this.areSuggestions() && this.state.inputFocused ? (
          <DropdownWrapper ref={this.dropdownRef as any}>
            <Menu onChange={this.onDropdownChange}>
              {this.getFilteredSuggestions().map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </DropdownWrapper>
        ) : null}
      </Root>
    )
  }

  handleClick = (e: any) => {
    if (this.rootRef.current && this.rootRef.current.contains(e.target)) {
      this.setState({ inputFocused: true })
    } else {
      this.setState({ inputFocused: false })
    }
  }

  areSuggestions = () =>
    this.props.suggestions && this.props.suggestions.length !== 0

  keyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.addValue(this.state.input)
    }
  }

  getFilteredSuggestions = () => {
    let suggestions = this.props.suggestions || []

    suggestions = suggestions.filter(suggestion =>
      filterHelper.matchesFilter(this.state.input, suggestion, false)
    )
    if (!suggestions.includes(this.state.input) && this.state.input !== '') {
      suggestions = [this.state.input].concat(suggestions)
    }
    return suggestions
  }

  onDropdownChange = (option: any) => {
    this.addValue(option)
  }

  onInputChange = (input: any) => {
    this.setState({ input })
  }

  focusInput = () => {
    if (this.inputRef.current) {
      this.inputRef.current.focus()
      this.inputRef.current.scrollIntoView(false)
      this.setState({ inputFocused: true })
    }
  }

  addValue = (value: string) => {
    let newState = {}
    if (value === '') return
    if (!this.state.value.includes(value)) {
      const newValue = this.state.value.concat([value])
      newState = { input: '', value: newValue }
    }
    this.setState(newState, this.onChange)
  }

  removeValue = (valueToRemove: string) => {
    this.setState(
      {
        value: this.state.value.filter(val => val !== valueToRemove),
      },
      this.onChange
    )
  }

  onChange = () => {
    this.notifyChanges()
    this.focusInput()
  }

  notifyChanges = () => {
    if (this.props.onChange) {
      this.props.onChange(this.state.value)
    }
  }
}
export default TokenizedAutoComplete
