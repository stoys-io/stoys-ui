import { createContext } from 'react'

const HighlightedColumnsContext = createContext<{
  selectedTableId: string
  selectedColumnId: string
  reletedColumnsIds: Array<string>
  reletedTablesIds: Array<string>
  setHighlightedColumns: (columnId: string, tableId: string) => void
}>({
  selectedTableId: '',
  selectedColumnId: '',
  reletedColumnsIds: [],
  reletedTablesIds: [],
  setHighlightedColumns: () => {
    console.log('Initialization ... ')
  },
})

export default HighlightedColumnsContext
