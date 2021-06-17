import React from 'react'

import { ModeCheckbox, ModeCheckboxWrapper } from '../styles'
import { ModeSwitcherProps } from '../model'

const ModeSwitcher = ({ checked, onChange }: ModeSwitcherProps): JSX.Element => {
  return (
    <ModeCheckboxWrapper>
      <ModeCheckbox checked={checked} onChange={onChange} data-testid="profiler-mode-switcher">
        Vertical view
      </ModeCheckbox>
    </ModeCheckboxWrapper>
  )
}

export default ModeSwitcher
