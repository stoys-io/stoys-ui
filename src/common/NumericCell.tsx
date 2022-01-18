import React from 'react'
import Tooltip from 'antd/lib/tooltip'

import { CellWrapper } from './styles'
import { renderNumericValue } from '../helpers'

const renderNumericCell = (value: number | string) => {
  return (
    <Tooltip title={renderNumericValue(2, false)(value)} placement="topLeft">
      <CellWrapper>{renderNumericValue(2, true)(value)}</CellWrapper>
    </Tooltip>
  )
}

export default renderNumericCell
