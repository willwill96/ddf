import React from 'react'

import { storiesOf, action } from '../../storybook'

import DateInput from '.'

const stories = storiesOf('DateInput', module)

stories.add('basic', () => {
  return <DateInput onChange={action('onChange')} />
})
