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
import styled from '../../styles/styled-components'
import { readableColor, transparentize } from 'polished'
import { buttonTypeEnum, Button } from '../button'

const Root = styled<Props, 'div'>('div')`
  background: ${({ theme }) => transparentize(0.6, readableColor(theme.backgroundDropdown))};
  width: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  border-radius: 3px;
  margin-top: ${props => props.theme.minimumSpacing};
  margin-bottom: ${props => props.theme.minimumSpacing};
  margin-right: ${props => props.theme.minimumSpacing};
  margin-left: ${props => props.theme.minimumSpacing};
`

const Text = styled<Props, 'div'>('div')`
  padding-left: ${props => props.theme.minimumSpacing};
  padding-right: ${props => props.theme.minimumSpacing};
  font-size: ${props => props.theme.minimumFontSize};
  font-weight: bold;
  color: ${({ theme }) =>
  readableColor(transparentize(0.6, readableColor(theme.backgroundDropdown)))};
  display: inline-block;
  margin: auto;
`

type Props = {
  onRemove: () => void
  label: string
}

const Token = (props: Props) => {
  return (
    <Root {...props}>
      <Text {...props}>{props.label}</Text>
      <Button icon="fa fa-close"
      buttonType={buttonTypeEnum.neutral}
      onClick={props.onRemove}/>
    </Root>
  )
}
export default Token
