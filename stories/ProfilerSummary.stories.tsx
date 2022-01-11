import React from 'react'
import { Story } from '@storybook/react'

import ProfilerSummaryComponent from '../src/profilerSummary'
import { dateData, numberData, stringData } from './mocks/profilerSummary.mock'

const Template: Story<any> = args => (
  <div style={{ margin: '10px', padding: 0, border: '1px solid #000', width: '150px' }}>
    <ProfilerSummaryComponent {...args} />
  </div>
)

export const StringProfilerSummary = Template.bind({})
StringProfilerSummary.args = {
  data: stringData,
  config: {
    height: 80,
  },
}
StringProfilerSummary.storyName = 'string'

export const DateProfilerSummary = Template.bind({})
DateProfilerSummary.args = {
  data: dateData,
  config: {
    height: 200,
  },
}
DateProfilerSummary.storyName = 'date'

export const NumberProfilerSummary = Template.bind({})
NumberProfilerSummary.args = {
  data: numberData,
  config: {
    height: 200,
  },
}
NumberProfilerSummary.storyName = 'number'

export const FewExamplesProfilerSummary = (args: any) => (
  <>
    {args.dataset.map((props: any) => (
      <div style={{ margin: '10px', padding: 0, border: '1px solid #000', width: '150px' }}>
        <ProfilerSummaryComponent {...props} />
      </div>
    ))}
  </>
)
FewExamplesProfilerSummary.args = {
  dataset: [
    {
      data: stringData,
      config: {
        height: 80,
      },
    },
    {
      data: dateData,
      config: {
        height: 100,
      },
    },
    {
      data: numberData,
      config: {
        height: 200,
      },
    },
  ],
}
FewExamplesProfilerSummary.storyName = 'few examples'

export default {
  title: 'Components/ProfilerSummary',
  component: [
    StringProfilerSummary,
    NumberProfilerSummary,
    DateProfilerSummary,
    FewExamplesProfilerSummary,
  ],
}
