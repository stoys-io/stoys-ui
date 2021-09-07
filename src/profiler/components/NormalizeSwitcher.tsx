import React from 'react'
import Tooltip from 'antd/lib/tooltip'
import PercentageOutlined from '@ant-design/icons/PercentageOutlined'

import { IconWrapper } from '../styles'
import { SwitcherProps } from '../model'

const NormalizeSwitcher = ({ checked, onChange }: SwitcherProps): JSX.Element => {
  return (
    <IconWrapper checked={checked} onClick={onChange}>
      <Tooltip title="Show normalized count">
        <PercentageOutlined />
      </Tooltip>
    </IconWrapper>
  )
}

export default NormalizeSwitcher
