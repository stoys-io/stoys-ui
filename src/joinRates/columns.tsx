import React from 'react'
import Tooltip from 'antd/lib/tooltip'

import { renderNumericCell } from '../common'
import { TableHeaderCellText } from './styles'

export const getJoinRatesColumns = (columns: Array<string>) =>
  columns.map(column => {
    return {
      id: column,
      title: () => <Tooltip title={column}>{column}</Tooltip>,
      dataIndex: column,
      ...(column === 'Table names' ? { width: `${(2 / columns.length) * 100}%` } : {}),
      render: (data: Array<string> | number) => {
        if (data && Array.isArray(data) && column === 'Table names') {
          return (
            <>
              {data.map(dataItem => (
                <Tooltip key={dataItem} title={dataItem}>
                  <TableHeaderCellText>{dataItem}</TableHeaderCellText>
                </Tooltip>
              ))}
            </>
          )
        }

        if (data && typeof data === 'number') {
          return renderNumericCell(data)
        }

        return null
      },
    }
  })
