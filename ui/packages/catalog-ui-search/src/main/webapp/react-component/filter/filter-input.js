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
import * as React from 'react'
import styled from 'styled-components'
import DateInput from './filter-date-input'
import BooleanInput from './filter-input-boolean'
import NearInput from './filter-input-near'
import BetweenTimeInput from './filter-input-between-time'
import TextInput from './filter-text-input'
import LocationInput from './filter-location-input'

const BaseRoot = styled.div`
  display: inline-block;
  vertical-align: middle;
  height: ${({ theme }) => theme.minimumButtonSize};
  line-height: ${({ theme }) => theme.minimumButtonSize};
  min-width: ${({ theme }) => `calc(13 * ${theme.minimumFontSize})`};
`
const LocationRoot = styled(BaseRoot)`
  padding: ${({ theme }) =>
    `${theme.minimumSpacing}
      1.5rem 0px calc(${theme.minimumSpacing} + 0.75*${theme.minimumButtonSize} + ${theme.minimumButtonSize})`};

  min-width: ${({ theme }) => `calc(19*${theme.minimumFontSize})`};
  margin: 0px !important;
  display: block !important;
  height: auto;
`

const DateRoot = styled(BaseRoot)`
  height: auto;
`

const EmptyRoot = styled(BaseRoot)`
  display: none;
`

const Roots = {
  LOCATION: LocationRoot,
  GEOMETRY: LocationRoot,
  DATE: DateRoot,
  EMPTY: EmptyRoot,
}

class FilterInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...this.propsToState(props) }
  }

  propsToState = ({ editing, comparator, attribute, value }) => {
    return { editing, comparator, attribute, value }
  }

  componentWillReceiveProps = props => {
    this.setState(this.propsToState(props))
  }

  render() {
    let MyInput
    if (this.state.comparator === 'NEAR') {
      MyInput = NearInput
    } else if (this.props.type === 'BOOLEAN') {
      MyInput = BooleanInput
    } else if (this.state.comparator === 'BETWEEN') {
      MyInput = BetweenTimeInput
    } else if (this.props.type === 'DATE') {
      MyInput = DateInput
    } else if (this.props.type === 'LOCATION') {
      MyInput = LocationInput
    } else {
      MyInput = TextInput
    }

    const Root =
      Roots[this.state.comparator === 'IS EMPTY' ? 'EMPTY' : this.props.type] ||
      BaseRoot
    return (
      <Root>
        <MyInput value={this.state.value} onChange={this.onChange} />
      </Root>
    )
  }
  onChange = (value) => {
    this.props.onChange(value)
  }
}

export default FilterInput
