import React from 'react'
import Tooltip from 'antd/lib/tooltip'
import RotateRightOutlined from '@ant-design/icons/RotateRightOutlined'

import { ModeIconWrapper } from '../styles'
import { SwitcherProps } from '../model'

const ModeSwitcher = ({ checked, onChange }: SwitcherProps): JSX.Element => {
  return (
    <ModeIconWrapper checked={checked} onClick={onChange} data-testid="profiler-mode-switcher">
      <Tooltip title={checked ? 'Vertical view' : 'Horizontal view'}>
        <RotateRightOutlined data-testid={checked ? 'vertical-mode' : 'horizontal-mode'} />
      </Tooltip>
    </ModeIconWrapper>
  )
}

export default ModeSwitcher
