import React, { useCallback } from 'react'

import Checkbox from 'antd/lib/checkbox'

import { CheckboxWithTitleProps } from '../model'
import { CheckboxWrapper } from '../styles'

const CheckboxWithTitle = ({
  isChecked,
  setChecked,
  title,
}: CheckboxWithTitleProps): JSX.Element => {
  const onChangeHandler = useCallback(event => setChecked(event.target.checked), [setChecked])

  return (
    <CheckboxWrapper>
      <Checkbox checked={isChecked} onChange={onChangeHandler} data-testid="title-checkbox">
        {title}
      </Checkbox>
    </CheckboxWrapper>
  )
}

export default CheckboxWithTitle
