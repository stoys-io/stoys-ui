import React from 'react'

import CheckboxWithTitle from './CheckboxWithTitle'
import { StyledCheckbox } from '../styles'
import { HeaderCheckboxProps } from '../model'

const HeaderCheckbox = ({
  isPartiallyChecked,
  setChecked,
  isChecked,
  title,
}: HeaderCheckboxProps): JSX.Element => {
  return (
    <StyledCheckbox isPartiallyChecked={isPartiallyChecked}>
      <CheckboxWithTitle setChecked={setChecked} isChecked={isChecked} title={title} />
    </StyledCheckbox>
  )
}

export default HeaderCheckbox
