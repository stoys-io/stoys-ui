import React from 'react'

import ChartCellTitle from './ChartCellTitle'
import { TableSubheaderRowProps } from '../model'
import { FlexWrapper, TableSubheader } from '../styles'

const TableSubheaderRow = ({ row, rowOptions }: TableSubheaderRowProps): JSX.Element => {
  return (
    <TableSubheader>
      <FlexWrapper className="table-flex-row">
        <span data-testid="row-column-name">{row.columnName}</span>
        <ChartCellTitle row={row} rowOptions={rowOptions} />
      </FlexWrapper>
    </TableSubheader>
  )
}

export default TableSubheaderRow
