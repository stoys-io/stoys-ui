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
  pagination: { disabled: false },
  rowToolbarOptions: {
    logarithmicScaleOptions: { isCheckboxShown: false, isUsedByDefault: false },
    axisOptions: { isCheckboxShown: false, isUsedByDefault: false },
    chartTableOptions: { isCheckboxShown: false, isUsedByDefault: false },
  },
  profilerToolbarOptions: {
    orientOptions: {
      isCheckboxShown: true,
      onOrientChange: (orient: Orient) => console.log('orient => ', orient),
    },
    searchOptions: {
      disabled: false,
      onChange: (value: string) => console.log('search => ', value),
    },
  },
  visibleColumns: ['count_nulls', 'count_unique', 'mean', 'min', 'max', 'nullable'],
  smallSize: true,
}
ProfilerForOneDataset.storyName = 'dataset with one item'

export const Profiler = Template.bind({})
Profiler.args = {
  datasets: [firstDatasetMock as Dataset, secondDatasetMock as Dataset],
  pagination: { disabled: false },
  rowToolbarOptions: {
    axisOptions: { isCheckboxShown: true, isUsedByDefault: false },
    chartTableOptions: { isCheckboxShown: true, isUsedByDefault: false },
  },
  profilerToolbarOptions: {
    searchOptions: {
      disabled: false,
      onChange: (value: string) => console.log('search => ', value),
    },
    orientOptions: {
      isCheckboxShown: true,
      onOrientChange: (orient: Orient) => console.log('orient => ', orient),
    },
  },
  smallSize: false,
}
Profiler.storyName = 'dataset with two items'

export default {
  title: 'Data Quality/Profiler',
  component: [ProfilerForOneDataset, Profiler],
}
