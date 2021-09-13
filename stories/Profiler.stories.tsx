import React from 'react'
import { Story } from '@storybook/react'

import { Profiler as ProfilerComponent, DataProfilerProps } from '../src/profiler'
import firstDatasetMock from './mocks/yellow_tripdata_2020-02.csv.dp_result.json'
import secondDatasetMock from './mocks/yellow_tripdata_2020-03.csv.dp_result.json'
import { Dataset, Orient } from '../src/profiler/model'

const Template: Story<DataProfilerProps> = args => <ProfilerComponent {...args} />

export const ProfilerForOneDataset = Template.bind({})
ProfilerForOneDataset.args = {
  datasets: [firstDatasetMock as Dataset],
  config: {
    pagination: false,
    showLogarithmicSwitcher: true,
    showAxesSwitcher: true,
    showChartTableSwitcher: true,
    showOrientSwitcher: true,
    onOrientChange: (orient: Orient) => console.log('orient => ', orient),
    showJsonSwitcher: true,
    onJsonChange: (shown: boolean) => console.log('json => ', shown),
    showNormalizeSwitcher: true,
    normalizeChecked: false,
    showSearch: true,
    onSearchChange: (value: string) => console.log('search => ', value),
    visibleColumns: ['count_nulls', 'count_unique', 'mean', 'min', 'max', 'nullable'],
    smallSize: true,
    colors: ['#4363d8'],
  },
}
ProfilerForOneDataset.storyName = 'simple'

export const Profiler = Template.bind({})
Profiler.args = {
  datasets: [firstDatasetMock as Dataset, secondDatasetMock as Dataset],
  config: {
    showLogarithmicSwitcher: true,
    showAxesSwitcher: true,
    showChartTableSwitcher: true,
    showOrientSwitcher: true,
    onOrientChange: (orient: Orient) => console.log('orient => ', orient),
    showJsonSwitcher: true,
    onJsonChange: (shown: boolean) => console.log('json => ', shown),
    showNormalizeSwitcher: true,
    normalizeChecked: false,
    showSearch: true,
    onSearchChange: (value: string) => console.log('search => ', value),
    smallSize: false,
  },
}
Profiler.storyName = 'comparable'

export default {
  title: 'Data Quality/Profiler',
  component: [ProfilerForOneDataset, Profiler],
  argTypes: {
    datasets: {
      type: { required: true },
    },
    config: {
      control: 'object',
    },
  },
}
