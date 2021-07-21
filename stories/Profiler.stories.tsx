import React from 'react'
import { Story } from '@storybook/react'

import { Profiler as ProfilerComponent, DataProfilerProps } from '../src/profiler'
import firstDatasetMock from './mocks/yellow_tripdata_2020-02.csv.dp_result.json'
import secondDatasetMock from './mocks/yellow_tripdata_2020-03.csv.dp_result.json'
import { Dataset } from '../src/profiler/model'

const Template: Story<DataProfilerProps> = args => <ProfilerComponent {...args} />

export const ProfilerForOneDataset = Template.bind({})
ProfilerForOneDataset.args = {
  datasets: [firstDatasetMock as Dataset],
  pagination: { disabled: false },
  toolboxOptions: {
    logarithmicScaleOptions: { isCheckboxShown: false, isUsedByDefault: false },
    axisOptions: { isCheckboxShown: false, isUsedByDefault: false },
    chartTableOptions: { isCheckboxShown: false, isUsedByDefault: false },
  },
  modeOptions: { isCheckboxShown: true, onModeChange: mode => console.log('mode => ', mode) },
  smallSize: true,
  searchOptions: { disabled: false, onChangeHandler: value => console.log('search => ', value) },
}
ProfilerForOneDataset.storyName = 'dataset with one item'

export const Profiler = Template.bind({})
Profiler.args = {
  datasets: [firstDatasetMock as Dataset, secondDatasetMock as Dataset],
  pagination: { disabled: false },
  toolboxOptions: {
    axisOptions: { isCheckboxShown: true, isUsedByDefault: false },
    chartTableOptions: { isCheckboxShown: true, isUsedByDefault: false },
  },
  modeOptions: { isCheckboxShown: true, onModeChange: mode => console.log('mode => ', mode) },
  smallSize: false,
  searchOptions: { disabled: false, onChangeHandler: value => console.log('search => ', value) },
}
Profiler.storyName = 'dataset with two items'

export default {
  title: 'Data Quality/Profiler',
  component: [ProfilerForOneDataset, Profiler],
}
