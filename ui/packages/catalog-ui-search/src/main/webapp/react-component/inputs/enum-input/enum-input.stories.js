import React from 'react'

import { storiesOf, object, action } from '../../storybook'

import EnumInput from '.'

const stories = storiesOf('EnumInput', module)

stories.add('basic', () => {
  const suggestions = object('Suggestions', [
    { label: 'first label', value: 'first value' },
    { label: 'second label', value: 'second value' },
    { label: 'third label', value: 'third value' },
  ])
  return <EnumInput suggestions={suggestions} onChange={action('onChange')} />
})

stories.add('with custom input', () => {
  const suggestions = object('Suggestions', [
    { label: 'first label', value: 'first value' },
    { label: 'second label', value: 'second value' },
    { label: 'third label', value: 'third value' },
  ])
  return (
    <EnumInput
      allowCustom
      suggestions={suggestions}
      onChange={action('onChange')}
    />
  )
})

stories.add('case sensitive', () => {
  const suggestions = object('Suggestions', [
    { label: 'first label', value: 'first value' },
    { label: 'second label', value: 'second value' },
    { label: 'third label', value: 'third value' },
  ])

  return (
    <EnumInput
      matchCase
      suggestions={suggestions}
      onChange={action('onChange')}
    />
  )
})
