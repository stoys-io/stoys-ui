import React, { useCallback, useState } from 'react'
import { RadioChangeEvent } from 'antd/lib/radio'
import BarChartOutlined from '@ant-design/icons/lib/icons/BarChartOutlined'

import ChartTableHeader from './ChartTableHeader'
import { ChartCellTitleProps } from '../model'
import ChartTableSwitcher from './ChartTableSwitcher'

const ChartCellTitle = ({
  logarithmicScale,
  axisOptions,
  tableOptions,
}: ChartCellTitleProps): JSX.Element => {
  const [activeBtn, setActiveBtn] = useState<string>(
    tableOptions.isUsedByDefault ? 'table' : 'chart'
  )

  const onChangeRadioGroup = useCallback(
    (event: RadioChangeEvent) => {
      const {
        target: { value },
      } = event
      setActiveBtn(value)
      tableOptions.setChecked(value !== 'chart')
    },
    [tableOptions]
  )

  return (
    <ChartTableHeader logarithmicScale={logarithmicScale} axisOptions={axisOptions}>
      {tableOptions.isCheckboxShown ? (
        <ChartTableSwitcher onChange={onChangeRadioGroup} value={activeBtn} />
      ) : (
        <BarChartOutlined style={{ fontSize: '24px' }} />
      )}
    </ChartTableHeader>
  )
}

export default ChartCellTitle
