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
import React from 'react'
import styled from 'styled-components'
import { determineInput } from './filterHelper'

const BaseRoot = styled.div`
  display: inline-block;
  vertical-align: middle;
  line-height: ${({ theme }) => theme.minimumButtonSize};
  min-width: ${({ theme }) => `calc(13 * ${theme.minimumFontSize})`};
  margin: auto;
`
const LocationRoot = styled(BaseRoot)`
  padding: ${({ theme }) =>
    `${theme.minimumSpacing}
      1.5rem 0px calc(${theme.minimumSpacing} + 0.75*${theme.minimumButtonSize} + ${theme.minimumButtonSize})`};

  min-width: ${({ theme }) => `calc(19*${theme.minimumFontSize})`};
  margin: 0px !important;
  display: block !important;
`

const Roots = {
  LOCATION: LocationRoot,
  GEOMETRY: LocationRoot,
}

const FilterInput = ({ comparator, value, type, suggestions, onChange }) => {
  const Root = Roots[type] || BaseRoot
  const Input = determineInput(comparator, type, suggestions)
  return (
    <Root>
      <Input
        matchCase={['MATCHCASE', '='].includes(comparator)}
        type={type}
        suggestions={suggestions}
        value={value}
        onChange={onChange}
      />
    </Root>
  )
}

export default FilterInput
