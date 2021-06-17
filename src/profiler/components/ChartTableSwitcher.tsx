import React from 'react'
import Radio, { RadioChangeEvent } from 'antd/lib/radio'
import TableOutlined from '@ant-design/icons/lib/icons/TableOutlined'
import BarChartOutlined from '@ant-design/icons/lib/icons/BarChartOutlined'

import { RadioButton } from '../styles'

const ChartTableSwitcher = ({
  onChange,
  value,
}: {
  onChange: (event: RadioChangeEvent) => void
  value: string
}): JSX.Element => {
  return (
    <Radio.Group onChange={onChange} value={value}>
      <RadioButton value="table" data-testid="table-view-btn">
        <TableOutlined />
      </RadioButton>
      <RadioButton value="chart" data-testid="chart-view-btn">
        <BarChartOutlined />
      </RadioButton>
    </Radio.Group>
  )
}

export default ChartTableSwitcher
