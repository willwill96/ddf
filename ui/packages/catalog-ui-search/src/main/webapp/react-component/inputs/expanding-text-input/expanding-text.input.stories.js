import React from 'react'

import { storiesOf, action } from '../../storybook'

import ExpandingTextInput from '.'

const stories = storiesOf('ExpandingTextInput', module)

stories.add('basic', ()=> {
    return <ExpandingTextInput onChange={action('onChange')}/>
})