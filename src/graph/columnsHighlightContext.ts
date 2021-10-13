import { createContext } from 'react'
import { Highlight } from './model'

const HighlightedColumnsContext = createContext<{
  selectedTableId: string
  selectedColumnId: string
  reletedColumnsIds: Array<string>
  reletedTablesIds: Array<string>
  highlightedType: Highlight
  setHighlightedColumns: (columnId: string, tableId: string) => void
}>({
  selectedTableId: '',
  selectedColumnId: '',
  reletedColumnsIds: [],
  reletedTablesIds: [],
  highlightedType: 'nearest' as 'nearest',
  setHighlightedColumns: () => {
    console.log('Initialization ... ')
  },
})

export default HighlightedColumnsContext
