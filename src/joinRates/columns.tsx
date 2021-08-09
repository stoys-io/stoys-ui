import { renderNumericCell } from '../profiler/columns'

export const getJoinRatesColumns = (columns: Array<string>) =>
  columns.map(column => {
    return {
      id: column,
      title: column,
      dataIndex: column,
      render: (data: Array<string> | number) => {
        if (data && Array.isArray(data) && column === 'Table names') {
          return data.join(', ')
        }

        if (data) {
          return renderNumericCell(data as number)
        }

        return null
      },
    }
  })
