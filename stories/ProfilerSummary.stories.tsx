import React from 'react'
import { Story } from '@storybook/react'

import ProfilerSummaryComponent from '../src/profilerSummary'

const Template: Story<any> = args => (
  <div style={{ margin: '10px', padding: 0, border: '1px solid #000', width: '150px' }}>
    <ProfilerSummaryComponent {...args} />
  </div>
)

export const StringProfilerSummary = Template.bind({})
StringProfilerSummary.args = {
  data: {
    name: 'passengers',
    data_type: 'string',
    nullable: true,
    enum_values: [],
    format: null,
    count: 6299354,
    count_empty: 0,
    count_nulls: 48834,
    count_unique: 138437,
    count_zeros: null,
    max_length: 18,
    min: '\ud83d\udc08',
    max: '\ud83d\udc35\ud83d\udc35\ud83d\udc35\ud83d\udc35\ud83d\udc35\ud83d\udc22',
    mean: null,
    pmf: [],
    items: [
      {
        item: '\ud83d\udc08',
        count: 561543,
      },
      {
        item: '\ud83d\udc08\ud83d\udc08',
        count: 16500,
      },
      {
        item: '\ud83d\udc08\ud83d\udc0c',
        count: 16527,
      },
      {
        item: '\ud83d\udc08\ud83d\udc0f',
        count: 16521,
      },
      {
        item: '\ud83d\udc08\ud83d\udc15',
        count: 16456,
      },
      {
        item: '\ud83d\udc08\ud83d\udc15\ud83d\udc15',
        count: 5826,
      },
      {
        item: '\ud83d\udc08\ud83d\udc19',
        count: 16438,
      },
      {
        item: '\ud83d\udc08\ud83d\udc19\ud83d\udc22\ud83d\udc27\ud83d\udc35',
        count: 5826,
      },
      {
        item: '\ud83d\udc08\ud83d\udc22',
        count: 16351,
      },
      {
        item: '\ud83d\udc08\ud83d\udc27',
        count: 16474,
      },
      {
        item: '\ud83d\udc08\ud83d\udc27\ud83d\udc0c',
        count: 5827,
      },
      {
        item: '\ud83d\udc08\ud83d\udc27\ud83d\udc19',
        count: 5826,
      },
      {
        item: '\ud83d\udc08\ud83d\udc35',
        count: 16434,
      },
      {
        item: '\ud83d\udc08\ud83d\udc35\ud83d\udc22\ud83d\udc15\ud83d\udc0f\ud83d\udc0c',
        count: 5826,
      },
      {
        item: '\ud83d\udc0c',
        count: 562287,
      },
      {
        item: '\ud83d\udc0c\ud83d\udc08',
        count: 16576,
      },
      {
        item: '\ud83d\udc0c\ud83d\udc0c',
        count: 16424,
      },
      {
        item: '\ud83d\udc0c\ud83d\udc0c\ud83d\udc22',
        count: 5826,
      },
      {
        item: '\ud83d\udc0c\ud83d\udc0c\ud83d\udc35',
        count: 5826,
      },
      {
        item: '\ud83d\udc0c\ud83d\udc0f',
        count: 16351,
      },
      {
        item: '\ud83d\udc0c\ud83d\udc15',
        count: 16145,
      },
      {
        item: '\ud83d\udc0c\ud83d\udc19',
        count: 16536,
      },
      {
        item: '\ud83d\udc0c\ud83d\udc22',
        count: 16494,
      },
      {
        item: '\ud83d\udc0c\ud83d\udc22\ud83d\udc15',
        count: 5826,
      },
      {
        item: '\ud83d\udc0c\ud83d\udc27',
        count: 16455,
      },
      {
        item: '\ud83d\udc0c\ud83d\udc35',
        count: 16412,
      },
      {
        item: '\ud83d\udc0c\ud83d\udc35\ud83d\udc0f\ud83d\udc27\ud83d\udc08',
        count: 5826,
      },
      {
        item: '\ud83d\udc0f',
        count: 561207,
      },
      {
        item: '\ud83d\udc0f\ud83d\udc08',
        count: 16131,
      },
      {
        item: '\ud83d\udc0f\ud83d\udc08\ud83d\udc35\ud83d\udc0c\ud83d\udc35',
        count: 5826,
      },
      {
        item: '\ud83d\udc0f\ud83d\udc0c',
        count: 16451,
      },
      {
        item: '\ud83d\udc0f\ud83d\udc0c\ud83d\udc08\ud83d\udc35\ud83d\udc22',
        count: 5826,
      },
      {
        item: '\ud83d\udc0f\ud83d\udc0f',
        count: 16405,
      },
      {
        item: '\ud83d\udc0f\ud83d\udc15',
        count: 16139,
      },
      {
        item: '\ud83d\udc0f\ud83d\udc19',
        count: 16368,
      },
      {
        item: '\ud83d\udc0f\ud83d\udc19\ud83d\udc0c\ud83d\udc0f',
        count: 5826,
      },
      {
        item: '\ud83d\udc0f\ud83d\udc22',
        count: 16426,
      },
      {
        item: '\ud83d\udc0f\ud83d\udc27',
        count: 16507,
      },
      {
        item: '\ud83d\udc0f\ud83d\udc35',
        count: 16300,
      },
      {
        item: '\ud83d\udc0f\ud83d\udc35\ud83d\udc27\ud83d\udc27',
        count: 5826,
      },
      {
        item: '\ud83d\udc0f\ud83d\udc35\ud83d\udc35',
        count: 5827,
      },
      {
        item: '\ud83d\udc15',
        count: 562110,
      },
      {
        item: '\ud83d\udc15\ud83d\udc08',
        count: 16397,
      },
      {
        item: '\ud83d\udc15\ud83d\udc08\ud83d\udc08',
        count: 5827,
      },
      {
        item: '\ud83d\udc15\ud83d\udc0c',
        count: 16639,
      },
      {
        item: '\ud83d\udc15\ud83d\udc0f',
        count: 16270,
      },
      {
        item: '\ud83d\udc15\ud83d\udc15',
        count: 16393,
      },
      {
        item: '\ud83d\udc15\ud83d\udc19',
        count: 16348,
      },
      {
        item: '\ud83d\udc15\ud83d\udc22',
        count: 16473,
      },
      {
        item: '\ud83d\udc15\ud83d\udc22\ud83d\udc35\ud83d\udc19\ud83d\udc0f\ud83d\udc0c',
        count: 5826,
      },
      {
        item: '\ud83d\udc15\ud83d\udc27',
        count: 16523,
      },
      {
        item: '\ud83d\udc15\ud83d\udc35',
        count: 16453,
      },
      {
        item: '\ud83d\udc19',
        count: 562658,
      },
      {
        item: '\ud83d\udc19\ud83d\udc08',
        count: 16420,
      },
      {
        item: '\ud83d\udc19\ud83d\udc0c',
        count: 16441,
      },
      {
        item: '\ud83d\udc19\ud83d\udc0f',
        count: 16170,
      },
      {
        item: '\ud83d\udc19\ud83d\udc15',
        count: 16421,
      },
      {
        item: '\ud83d\udc19\ud83d\udc19',
        count: 16404,
      },
      {
        item: '\ud83d\udc19\ud83d\udc19\ud83d\udc19',
        count: 5826,
      },
      {
        item: '\ud83d\udc19\ud83d\udc22',
        count: 16279,
      },
      {
        item: '\ud83d\udc19\ud83d\udc22\ud83d\udc19\ud83d\udc15\ud83d\udc15',
        count: 5826,
      },
      {
        item: '\ud83d\udc19\ud83d\udc27',
        count: 16261,
      },
      {
        item: '\ud83d\udc19\ud83d\udc35',
        count: 16504,
      },
      {
        item: '\ud83d\udc22',
        count: 561974,
      },
      {
        item: '\ud83d\udc22\ud83d\udc08',
        count: 16554,
      },
      {
        item: '\ud83d\udc22\ud83d\udc0c',
        count: 16539,
      },
      {
        item: '\ud83d\udc22\ud83d\udc0f',
        count: 16224,
      },
      {
        item: '\ud83d\udc22\ud83d\udc15',
        count: 16342,
      },
      {
        item: '\ud83d\udc22\ud83d\udc15\ud83d\udc0c',
        count: 5826,
      },
      {
        item: '\ud83d\udc22\ud83d\udc19',
        count: 16380,
      },
      {
        item: '\ud83d\udc22\ud83d\udc22',
        count: 16738,
      },
      {
        item: '\ud83d\udc22\ud83d\udc27',
        count: 16454,
      },
      {
        item: '\ud83d\udc22\ud83d\udc27\ud83d\udc0f\ud83d\udc08\ud83d\udc08',
        count: 5826,
      },
      {
        item: '\ud83d\udc22\ud83d\udc35',
        count: 16268,
      },
      {
        item: '\ud83d\udc22\ud83d\udc35\ud83d\udc08\ud83d\udc08',
        count: 5826,
      },
      {
        item: '\ud83d\udc27',
        count: 562109,
      },
      {
        item: '\ud83d\udc27\ud83d\udc08',
        count: 16546,
      },
      {
        item: '\ud83d\udc27\ud83d\udc0c',
        count: 16453,
      },
      {
        item: '\ud83d\udc27\ud83d\udc0c\ud83d\udc0f',
        count: 5826,
      },
      {
        item: '\ud83d\udc27\ud83d\udc0f',
        count: 16317,
      },
      {
        item: '\ud83d\udc27\ud83d\udc0f\ud83d\udc35',
        count: 5826,
      },
      {
        item: '\ud83d\udc27\ud83d\udc15',
        count: 16278,
      },
      {
        item: '\ud83d\udc27\ud83d\udc15\ud83d\udc0c\ud83d\udc27\ud83d\udc22',
        count: 5826,
      },
      {
        item: '\ud83d\udc27\ud83d\udc19',
        count: 16441,
      },
      {
        item: '\ud83d\udc27\ud83d\udc22',
        count: 16330,
      },
      {
        item: '\ud83d\udc27\ud83d\udc27',
        count: 16461,
      },
      {
        item: '\ud83d\udc27\ud83d\udc35',
        count: 16331,
      },
      {
        item: '\ud83d\udc35',
        count: 561377,
      },
      {
        item: '\ud83d\udc35\ud83d\udc08',
        count: 16252,
      },
      {
        item: '\ud83d\udc35\ud83d\udc08\ud83d\udc0c\ud83d\udc19\ud83d\udc19',
        count: 5826,
      },
      {
        item: '\ud83d\udc35\ud83d\udc0c',
        count: 16452,
      },
      {
        item: '\ud83d\udc35\ud83d\udc0f',
        count: 16303,
      },
      {
        item: '\ud83d\udc35\ud83d\udc15',
        count: 16511,
      },
      {
        item: '\ud83d\udc35\ud83d\udc15\ud83d\udc0f\ud83d\udc0f',
        count: 5826,
      },
      {
        item: '\ud83d\udc35\ud83d\udc15\ud83d\udc22',
        count: 5826,
      },
      {
        item: '\ud83d\udc35\ud83d\udc19',
        count: 16571,
      },
      {
        item: '\ud83d\udc35\ud83d\udc22',
        count: 16489,
      },
      {
        item: '\ud83d\udc35\ud83d\udc22\ud83d\udc08\ud83d\udc35',
        count: 5826,
      },
      {
        item: '\ud83d\udc35\ud83d\udc27',
        count: 16410,
      },
      {
        item: '\ud83d\udc35\ud83d\udc35',
        count: 16455,
      },
    ],
    extras: {
      is_exact: 'false',
    },
  },
  config: {
    height: 80,
  },
}
StringProfilerSummary.storyName = 'string'

export const NumberProfilerSummary = Template.bind({})
NumberProfilerSummary.args = {
  data: {
    name: 'VendorID',
    data_type: 'long',
    nullable: true,
    enum_values: [],
    format: null,
    count: 6299354,
    count_empty: null,
    count_nulls: 48834,
    count_unique: 2,
    count_zeros: 0,
    max_length: 1,
    min: '1',
    max: '2',
    mean: 2.0,
    pmf: [
      {
        low: 0.5,
        high: 1.5,
        count: 2056411,
      },
      {
        low: 1.5,
        high: 2.5,
        count: 4194109,
      },
    ],
    items: [
      {
        item: '1',
        count: 2056411,
      },
      {
        item: '2',
        count: 4194109,
      },
    ],
    extras: {
      is_exact: 'true',
      quantiles: '{"0.05": "1.0","0.25": "1.0","0.5": "2.0","0.75": "2.0","0.95": "2.0"}',
      max_length_in_bits: '2',
    },
  },
  config: {
    height: 200,
  },
}
NumberProfilerSummary.storyName = 'number'

export default {
  title: 'Components/ProfilerSummary',
  component: [StringProfilerSummary, NumberProfilerSummary],
}
