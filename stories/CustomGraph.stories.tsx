import React from 'react'
import { Story } from '@storybook/react'
import CustomGraphComponent, { Props } from '../src/CustomGraph'
import dummyMock from './mocks/CustomGraph.mock'

const Template: Story<Props> = (args: Props) => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <CustomGraphComponent {...args} />
  </div>
)
export const Example = Template.bind({})
Example.storyName = 'Custom graph'
Example.args = { graph: dummyMock, nodeWidth: 60, nodeHeight: 40, withDagreLayout: false }

export default {
  title: 'Components/Custom graph',
  component: [Example],
  argTypes: {},
}
