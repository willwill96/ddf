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
import React, { useEffect } from 'react'
import styled from 'styled-components'
import Dropdown from '../dropdown'
import { Menu, MenuItem } from '../menu'

import {
  geometryComparators,
  dateComparators,
  stringComparators,
  numberComparators,
  booleanComparators,
} from '../../component/filter/comparators'

const Root = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-right: ${({ theme }) => theme.minimumSpacing};
  height: ${({ theme }) => theme.minimumButtonSize};
  line-height: ${({ theme }) => theme.minimumButtonSize};
  *:focus {
    outline: none;
  }
`

const AnchorRoot = styled.div`
  padding: 0 ${({ theme }) => theme.minimumSpacing};
`

const AnchorSpan = styled.span`
  display: inline-block;
`

const Anchor = props => (
  <AnchorRoot {...props}>
    <AnchorSpan>
      {props.comparator}
      &nbsp;
    </AnchorSpan>
    <AnchorSpan className="fa fa-caret-down" />
  </AnchorRoot>
)

const typeToComparators = {
  STRING: stringComparators,
  DATE: dateComparators,
  LONG: numberComparators,
  DOUBLE: numberComparators,
  FLOAT: numberComparators,
  INTEGER: numberComparators,
  SHORT: numberComparators,
  LOCATION: geometryComparators,
  GEOMETRY: geometryComparators,
  BOOLEAN: booleanComparators,
}

const ComparatorMenu = styled(Menu)`
  max-height: 50vh;
`

function getComparators(attribute, type) {
  let comparators = typeToComparators[type]
  if (attribute === 'anyGeo' || attribute === 'anyText') {
    comparators = comparators.filter(comparator => comparator !== 'IS EMPTY')
  }
  return comparators
}

const ComparatorMenuItem = props => (
  <MenuItem {...props} style={{ paddingLeft: '1.5rem' }} />
)

const FilterComparator = ({
  attribute,
  comparator,
  editing,
  onChange,
  type,
}) => {
  useEffect(() => {
    const comparators = getComparators(attribute, type)
    if (!comparators.includes(comparator)) {
      onChange(comparators[0])
    }
  }, [attribute])

  if (!editing) {
    return <Root>{comparator}</Root>
  }
  const comparators = getComparators(attribute, type)
  return (
    <Root>
      <Dropdown anchor={<Anchor comparator={comparator} />}>
        <ComparatorMenu value={comparator} onChange={onChange}>
          {comparators.map(comparator => (
            <ComparatorMenuItem
              value={comparator}
              key={comparator}
              title={comparator}
            />
          ))}
        </ComparatorMenu>
      </Dropdown>
    </Root>
  )
}

export default FilterComparator
