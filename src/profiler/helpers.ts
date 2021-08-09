import { Dataset, Column, HydratedColumn } from './model'

export const hydrateColumnData =
  (color: string) =>
  (column: Column): HydratedColumn => {
    return {
      ...column,
      key: `${column.name}`,
      color,
    }
  }

export const hydrateDataset = (dataset: Dataset, color: string): Array<HydratedColumn> => {
  return dataset.columns.map(hydrateColumnData(color))
}
