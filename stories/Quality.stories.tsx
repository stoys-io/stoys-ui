import React from 'react'
import { Story } from '@storybook/react'

import { Quality as QualityComponent, QualityProps } from '../src/quality'
import dataMock from './mocks/yellow_tripdata_2020-02.csv.dq_result.json'

const Template: Story<QualityProps> = args => <QualityComponent {...args} />

export const Quality = Template.bind({})
Quality.args = {
  data: dataMock,
  pagination: { disabled: true },
  smallSize: true,
}

Quality.storyName = 'with large dataset'

export default {
  title: 'Data Quality/Quality',
  component: Quality,
}
