import React from 'react'
import { Story } from '@storybook/react'

import { default as AggSummComponent, AggSumTableProps } from '../src/aggSum'
import currentMockedRawData from './mocks/covid19_locations_20210922_125856_444212.metrics_data.json'
import previousMockedRawData from './mocks/covid19_locations_20210922_120415_152372.metrics_data.json'
import mockedData from './mocks/yellow_tripdata_2020-02_vs_2020_03.metrics_data.json'

const Template: Story<AggSumTableProps> = args => <AggSummComponent {...args} />

export const AggSummWithRawData = Template.bind({})
AggSummWithRawData.args = {
  data: {
    current: currentMockedRawData,
  },
  config: {
    disabledColumns: [],
    pagination: false,
    smallSize: true,
  },
  bordered: false,
}

AggSummWithRawData.storyName = 'with raw data'

export const AggSummWithRawDataComparable = Template.bind({})
AggSummWithRawDataComparable.args = {
  data: {
    current: currentMockedRawData,
    previous: previousMockedRawData,
  },
  config: {
    disabledColumns: [],
    pagination: false,
    smallSize: true,
    showAbsDiffColumn: true,
    showRelativeDiffColumn: true,
  },
  bordered: false,
}

AggSummWithRawDataComparable.storyName = 'with raw data comparable'

export const AggSum = Template.bind({})
AggSum.args = {
  data: mockedData,
  config: {
    previousReleaseDataIsShown: true,
    disabledColumns: [],
    pagination: false,
    saveMetricThreshold: () => {},
    smallSize: true,
  },
  bordered: false,
}

AggSum.storyName = 'with comparable data'

export default {
  title: 'Data Quality/AggSum',
  component: AggSum,
  argTypes: {
    data: {
      type: { required: true },
    },
    config: {
      control: 'object',
    },
  },
}
