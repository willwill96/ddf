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
import TextField from '../../text-field'
import PropTypes from 'prop-types'

const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Label = styled.div`
  padding: 0 ${({ theme }) => theme.minimumSpacing};
  font-weight: bolder;
`

const NumberInput = styled(TextField)`
  width: ${({ theme }) => `calc(8*${theme.mediumSpacing})`};
`
const serialize = (lower, upper) => ({ lower, upper })

const RangeInput = ({ lower, upper, onChange }) => {
  return (
    <Root>
      <NumberInput
        type="number"
        value={lower}
        onChange={value => onChange(serialize(value, upper))}
      />
      <Label>TO</Label>
      <NumberInput
        type="number"
        value={upper}
        onChange={value => onChange(serialize(lower, value))}
      />
    </Root>
  )
}

RangeInput.propTypes = {
  /** The lower bound for the range. */
  lower: PropTypes.number,

  /** The upper bound for the range. */
  upper: PropTypes.number,

  /** Value change handler. */
  onChange: PropTypes.func.isRequired,
}

export default RangeInput
