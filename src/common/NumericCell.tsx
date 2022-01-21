import React from 'react'
import Tooltip from 'antd/lib/tooltip'

import { CellWrapper } from './styles'
import { renderNumericValue } from '../helpers'

const renderFullNumber = renderNumericValue(2, false)
const renderShortNumber = renderNumericValue(2, true)

const renderNumericCell = (value: number | string) => {
  return (
    <Tooltip title={renderFullNumber(value)} placement="topLeft">
      <CellWrapper>{renderShortNumber(value)}</CellWrapper>
    </Tooltip>
  )
}

export default renderNumericCell
