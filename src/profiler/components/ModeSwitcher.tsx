import React from 'react'
import Tooltip from 'antd/lib/tooltip'
import RotateRightOutlined from '@ant-design/icons/RotateRightOutlined'

import { ModeCheckboxWrapper, ModeIconWrapper } from '../styles'
import { ModeSwitcherProps } from '../model'

const ModeSwitcher = ({ checked, onChange }: ModeSwitcherProps): JSX.Element => {
  return (
    <ModeCheckboxWrapper>
      <ModeIconWrapper checked={checked} onClick={onChange} data-testid="profiler-mode-switcher">
        <Tooltip title={checked ? 'Vertical view' : 'Horizontal view'}>
          <RotateRightOutlined />
        </Tooltip>
      </ModeIconWrapper>
    </ModeCheckboxWrapper>
  )
}

export default ModeSwitcher
