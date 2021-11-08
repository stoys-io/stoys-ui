import React from 'react'
import Radio, { RadioChangeEvent } from 'antd/lib/radio'

import { ModalRadioGroupProps } from '../model'
import { StyledRadioGroup } from './styles'

const ModalRadioGroup = ({
  keyColumn,
  metricsDataItem,
  onChangeHandler,
}: ModalRadioGroupProps): JSX.Element => {
  const { columnName, title } = keyColumn

  return (
    <StyledRadioGroup>
      <label htmlFor="treshhold-radio-group">{title}</label>
      <Radio.Group
        id="treshhold-radio-group"
        defaultValue={metricsDataItem[columnName]}
        onChange={(e: RadioChangeEvent) => onChangeHandler(e, columnName)}
      >
        <Radio value={metricsDataItem[columnName]}>{metricsDataItem[columnName]}</Radio>
        <Radio value="*">Any</Radio>
      </Radio.Group>
    </StyledRadioGroup>
  )
}

export default ModalRadioGroup
