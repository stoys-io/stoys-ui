import React from 'react'
import RotateRightOutlined from '@ant-design/icons/RotateRightOutlined'
import RotateLeftOutlined from '@ant-design/icons/RotateLeftOutlined'

import { ModeCheckbox, ModeCheckboxWrapper } from '../styles'
import { ModeSwitcherProps } from '../model'

const ModeSwitcher = ({ checked, onChange }: ModeSwitcherProps): JSX.Element => {
  return (
    <ModeCheckboxWrapper>
      <ModeCheckbox checked={checked} onChange={onChange} data-testid="profiler-mode-switcher">
        {checked ? <RotateRightOutlined /> : <RotateLeftOutlined />}
      </ModeCheckbox>
    </ModeCheckboxWrapper>
  )
}

export default ModeSwitcher
