import { Maybe } from '../../model'
import { ChildDataItem, HygratePmfPlotDataItem } from '../model'

export function hygratePmfPlotData(
  data?: Array<ChildDataItem>
): Maybe<Array<HygratePmfPlotDataItem>> {
  if (!data) {
    return null
  }

  return data.map(
    ({ pmf, parent, color, items, data_type, count: itemsTotalCount }, index: number) => {
      return {
        name: `${parent}-${index}`,
        parent,
        pmf,
        items,
        itemsTotalCount,
        color,
        type: data_type,
      }
    }
  )
}
