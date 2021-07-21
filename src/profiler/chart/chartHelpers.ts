import { ChildDataItem, HygratePmfPlotDataItem } from '../model'

export function hygratePmfPlotData(
  data?: Array<ChildDataItem>
): Array<HygratePmfPlotDataItem> | null {
  if (!data) {
    return null
  }

  return data.map(({ pmf, parent, color, items, data_type }, index: number) => {
    return {
      name: `${parent}-${index}`,
      parent,
      pmf,
      items,
      color,
      type: data_type,
    }
  })
}
