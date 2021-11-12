import { Datasets } from '../model'

export const smallDataset: Datasets = [
  {
    table: { rows: 100 },
    columns: [
      {
        name: 'id',
        data_type: 'integer' as 'integer',
        count: 10,
        count_nulls: 2,
        count_empty: 2,
        count_zeros: null,
        count_unique: null,
        max_length: null,
        mean: 20,
        min: '5',
        max: '30',
        pmf: [
          { low: 10, high: 20, count: 10 },
          { low: 20, high: 30, count: 15 },
          { low: 30, high: 40, count: 20 },
        ],
      },
      {
        name: 'value',
        data_type: 'integer' as 'integer',
        count: 20,
        count_nulls: 4,
        count_empty: 4,
        count_zeros: null,
        count_unique: null,
        max_length: null,
        mean: 10,
        min: '2',
        max: '20',
        pmf: [
          { low: 1, high: 2, count: 1 },
          { low: 2, high: 3, count: 1.5 },
          { low: 3, high: 4, count: 2 },
        ],
      },
    ],
  },
]
