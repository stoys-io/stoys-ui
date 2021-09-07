import React from 'react'
import Tooltip from 'antd/lib/tooltip'

import { renderNumericCell } from '../profiler/columns'

export const getJoinRatesColumns = (columns: Array<string>) =>
  columns.map(column => {
    return {
      id: column,
      title: () => <Tooltip title={column}>{column}</Tooltip>,
      dataIndex: column,
      render: (data: Array<string> | number) => {
        if (data && Array.isArray(data) && column === 'Table names') {
          return data.join(', ')
        }

        if (data && typeof data === 'number') {
          return renderNumericCell(data)
        }

        return null
      },
    }
  })
