import React from 'react'
import { Story } from '@storybook/react'
import NodeExpand, { Props } from '../src/nodeExpand'

const Template: Story<Props> = (args: Props) => <NodeExpand {...args} />
export const Example = Template.bind({})
Example.storyName = 'example'
Example.args = {}

export default {
  title: 'Chart/Custom svg',
  component: [Example],
  argTypes: {},
}
