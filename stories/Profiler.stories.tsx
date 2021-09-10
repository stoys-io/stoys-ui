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
    rowToolbarOptions: {
      logarithmicScaleOptions: true,
      axesOptions: true,
      chartTableOptions: true,
    },
    profilerToolbarOptions: {
      orientOptions: {
        isCheckboxShown: true,
        onOrientChange: (orient: Orient) => console.log('orient => ', orient),
      },
      jsonOptions: {
        isCheckboxShown: true,
        onChange: (shown: boolean) => console.log('json => ', shown),
      },
      normalizeOptions: {
        isCheckboxShown: true,
        checked: false,
      },
      searchOptions: {
        disabled: false,
        onChange: (value: string) => console.log('search => ', value),
      },
    },
    visibleColumns: ['count_nulls', 'count_unique', 'mean', 'min', 'max', 'nullable'],
    smallSize: true,
    colors: ['#4363d8'],
  },
}
ProfilerForOneDataset.storyName = 'simple'

export const Profiler = Template.bind({})
Profiler.args = {
  datasets: [firstDatasetMock as Dataset, secondDatasetMock as Dataset],
  pagination: { disabled: false },
  config: {
    rowToolbarOptions: {
      logarithmicScaleOptions: { isCheckboxShown: true, isUsedByDefault: false },
      axesOptions: { isCheckboxShown: true, isUsedByDefault: false },
      chartTableOptions: { isCheckboxShown: true, isUsedByDefault: false },
    },
    profilerToolbarOptions: {
      normalizeOptions: {
        isCheckboxShown: true,
        checked: false,
      },
      jsonOptions: {
        isCheckboxShown: true,
        onChange: (shown: boolean) => console.log('json => ', shown),
      },
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
    pagination: {
      control: 'object',
    },
    config: {
      control: 'object',
    },
  },
}
