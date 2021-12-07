import React from 'react'
import { Story } from '@storybook/react'
import CustomGraphComponent, { Props } from '../src/customGraph'

const Template: Story<Props> = (args: Props) => <CustomGraphComponent {...args} />
export const Example = Template.bind({})
Example.storyName = 'example'
Example.args = {}

export default {
  title: 'Chart/Custom graph',
  component: [Example],
  argTypes: {},
}
