import React from 'react'

import { ModeCheckbox } from '../styles'
import { ModeSwitcherProps } from '../model'

const ModeSwitcher = ({ checked, onChange }: ModeSwitcherProps): JSX.Element => {
  return (
    <ModeCheckbox checked={checked} onChange={onChange} data-testid="profiler-mode-switcher">
      Vertical view
    </ModeCheckbox>
  )
}

export default ModeSwitcher
