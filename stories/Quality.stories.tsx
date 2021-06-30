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

export const SmallQuality = Template.bind({})
SmallQuality.args = {
  data: {
    columns: [
      {
        name: 'id',
      },
      {
        name: 'value',
      },
      {
        name: 'extra',
      },
      {
        name: 'key',
      },
    ],
    rules: [
      {
        name: 'id__not_null',
        expression: '(`t.id` IS NOT NULL)',
        description: null,
        referenced_column_names: ['id'],
      },
      {
        name: 'value__shorter_then_extra',
        expression: '(LENGTH(`t.value`) < LENGTH(`extra`))',
        description: '(COUNT(*) OVER (PARTITION BY t.id)) = 1 AS id__unique,',
        referenced_column_names: ['extra', 'value'],
      },
      {
        name: 'value__in_lookup_sub_select',
        expression: '(scalarsubquery() IS NOT NULL)',
        description:
          'lookup.value IS NOT NULL AS value__in_lookup_join,\nthis should be: EXISTS (SELECT * FROM lookup AS l WHERE t.value = l.value) AS value__in_lookup_exists',
        referenced_column_names: [],
      },
    ],
    statistics: {
      table: {
        rows: 4,
        violations: 2,
      },
      column: [
        {
          column_name: 'id',
          violations: 0,
        },
        {
          column_name: 'value',
          violations: 2,
        },
        {
          column_name: 'extra',
          violations: 2,
        },
        {
          column_name: 'key',
          violations: 0,
        },
      ],
      rule: [
        {
          rule_name: 'id__not_null',
          violations: 0,
        },
        {
          rule_name: 'value__shorter_then_extra',
          violations: 2,
        },
        {
          rule_name: 'value__in_lookup_sub_select',
          violations: 2,
        },
      ],
    },
    row_sample: [
      {
        row: ['3', 'invalid', 'extra', 'a'],
        violated_rule_names: ['value__shorter_then_extra', 'value__in_lookup_sub_select'],
      },
      {
        row: ['4', null, 'extra', 'b'],
        violated_rule_names: ['value__shorter_then_extra', 'value__in_lookup_sub_select'],
      },
    ],
    metadata: {},
  },
  pagination: { disabled: true },
}
SmallQuality.storyName = 'with small dataset'


export default {
  title: 'Data Quality/Quality',
  component: [Quality, SmallQuality],
}
