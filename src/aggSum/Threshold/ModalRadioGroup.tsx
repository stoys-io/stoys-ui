import React from 'react'
import Radio, { RadioChangeEvent } from 'antd/lib/radio'

import { ModalRadioGroupProps } from '../model'
import { StyledRadioGroup } from './styles'

const ModalRadioGroup = ({
  keyColumn,
  aggSumDataItem,
  onChangeHandler,
}: ModalRadioGroupProps): JSX.Element => {
  const { columnName, title } = keyColumn

  return (
    <StyledRadioGroup>
      <label htmlFor="treshhold-radio-group">{title}</label>
      <Radio.Group
        id="treshhold-radio-group"
        defaultValue={aggSumDataItem[columnName]}
        onChange={(e: RadioChangeEvent) => onChangeHandler(e, columnName)}
      >
        <Radio value={aggSumDataItem[columnName]}>{aggSumDataItem[columnName]}</Radio>
        <Radio value="*">Any</Radio>
      </Radio.Group>
    </StyledRadioGroup>
  )
}

export default ModalRadioGroup
