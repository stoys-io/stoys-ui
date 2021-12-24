import React from 'react'
import { Story } from '@storybook/react'

import ProfilerSummaryComponent from '../src/profilerSummary'

const Template: Story<any> = args => <ProfilerSummaryComponent {...args} />

export const ProfilerSummary = Template.bind({})
ProfilerSummary.args = {
  title: 'Title',
  type: 'string',
  data: ['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'b', 'd', 'e', 'f'],
}
ProfilerSummary.storyName = 'string'

export default {
  title: 'Component/ProfilerSummary',
  component: [ProfilerSummary],
}
