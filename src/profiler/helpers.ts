import { Dataset, Column, HydratedColumn } from './model'

export const hydrateColumnData = (color: string) => ({
  name,
  data_type: type,
  count_nulls,
  count_unique,
  mean,
  min,
  max,
  pmf,
  items,
}: Column): HydratedColumn => {
  return {
    key: `${name}`,
    type,
    name,
    nulls: count_nulls,
    unique: count_unique,
    mean,
    min,
    max,
    color,
    pmf,
    items,
  }
}

export const hydrateDataset = (dataset: Dataset, color: string): Array<HydratedColumn> => {
  return dataset.columns.map(hydrateColumnData(color))
}
