import { NORMALIZABLE_COLUMN_PREFIX } from './constants'
import { Dataset, Column, HydratedColumn, DataItem, CountColumnKey } from './model'

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

export const transformNormalize = (data: Array<DataItem>) =>
  data.map(item => {
    if ('count' in item) {
      const { count } = item
      const countColumns = Object.keys(item).filter(column =>
        column.startsWith(NORMALIZABLE_COLUMN_PREFIX)
      )
      const normalizedCountValues = countColumns.reduce((acc, key) => {
        const columnValue = item[key as CountColumnKey]
        const normalizedValue = columnValue === null ? null : columnValue / count

        return { ...acc, [key]: normalizedValue }
      }, {})

      return {
        ...item,
        ...normalizedCountValues,
      }
    }

    return item
  })

export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
