import React from 'react'
import Tooltip from 'antd/lib/tooltip'
import RotateRightOutlined from '@ant-design/icons/RotateRightOutlined'

import JsonIcon from '../icons/Json'

import { TableSettingsWrapper, ModeIconWrapper, JsonIconWrapper } from '../styles'
import { ModeSwitcherProps } from '../model'

const ModeSwitcher = ({ checked, onChange }: ModeSwitcherProps): JSX.Element => {
  return (
    <TableSettingsWrapper>
      <ModeIconWrapper checked={checked} onClick={onChange} data-testid="profiler-mode-switcher">
        <Tooltip title={checked ? 'Vertical view' : 'Horizontal view'}>
          <RotateRightOutlined data-testid={checked ? 'vertical-mode' : 'horizontal-mode'} />
        </Tooltip>
      </ModeIconWrapper>
      <JsonIconWrapper checked>
        <JsonIcon width="1em" height="1em" />
      </JsonIconWrapper>
    </TableSettingsWrapper>
  )
}

export default ModeSwitcher
