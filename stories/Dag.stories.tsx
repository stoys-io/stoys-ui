import React from 'react'
import { Story } from '@storybook/react'

import { Dag } from '../src/dag'
import Dagg from '../src/dag/Dagg'
import data from './mocks/dag_inlined.json'
import data2 from './mocks/dag_inlined2.json'

const Template: Story<any> = args => <Dag {...args} />

export const DagExample = Template.bind({})
DagExample.args = { data }
DagExample.storyName = 'example 1'

export const DagExample1a = Template.bind({})
DagExample1a.args = { data: data2, enableGrouping: true }
DagExample1a.storyName = 'example 1 grouping'

export const DagExample2 = Template.bind({})
DagExample2.args = { data: null }
DagExample2.storyName = 'example 2'

const Template2: Story<any> = args => <Dagg {...args} />
export const DagExample3 = Template2.bind({})
DagExample3.args = { data }
DagExample3.storyName = 'example 3'

export default {
  title: 'Chart/DAG',
  component: DagExample,
  argTypes: {
    data: {
      type: { required: false },
    },
  },
}
