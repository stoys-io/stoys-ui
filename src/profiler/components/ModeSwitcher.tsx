import React from 'react'
import Tooltip from 'antd/lib/tooltip'
import RotateRightOutlined from '@ant-design/icons/RotateRightOutlined'

import { TableSettingsWrapper, ModeIconWrapper } from '../styles'
import { ModeSwitcherProps } from '../model'

const ModeSwitcher = ({ checked, onChange }: ModeSwitcherProps): JSX.Element => {
  return (
    <TableSettingsWrapper>
      <ModeIconWrapper checked={checked} onClick={onChange} data-testid="profiler-mode-switcher">
        <Tooltip title={checked ? 'Vertical view' : 'Horizontal view'}>
          <RotateRightOutlined data-testid={checked ? 'vertical-mode' : 'horizontal-mode'} />
        </Tooltip>
      </ModeIconWrapper>
    </TableSettingsWrapper>
  )
}

export default ModeSwitcher
