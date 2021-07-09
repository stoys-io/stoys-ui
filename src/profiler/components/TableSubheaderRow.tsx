import React from 'react'

import ChartTitle from './ChartTitle'
import { TableSubheaderRowProps } from '../model'
import { FlexWrapper, TableSubheader } from '../styles'

const TableSubheaderRow = ({
  row,
  rowOptions,
  tableOptions,
}: TableSubheaderRowProps): JSX.Element => {
  return (
    <TableSubheader>
      <FlexWrapper className="table-flex-row">
        <span data-testid="row-column-name">{row.columnName}</span>
        <ChartTitle row={row} rowOptions={rowOptions} tableOptions={tableOptions} />
      </FlexWrapper>
    </TableSubheader>
  )
}

export default TableSubheaderRow
