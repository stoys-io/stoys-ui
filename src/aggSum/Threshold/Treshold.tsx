import React, { useState, useRef } from 'react'
import Modal from 'antd/lib/modal'
import InputNumber from 'antd/lib/input-number'
import Button from 'antd/lib/button'
import { RadioChangeEvent } from 'antd/lib/radio'
import 'antd/lib/modal/style/css'
import 'antd/lib/input-number/style/css'

import { renderPercentColumnValue } from '../helpers'
import {
  ThresholdContainer,
  ThresholdEditButton,
  ThresholdInputLabel,
  ModalButtonsWrapper,
  RemoveThresholdButton,
} from './styles'
import { KeyValueInput, ThresholdProps } from '../model'
import ModalRadioGroup from './ModalRadioGroup'

const Threshold = ({
  threshold,
  keyColumns,
  metricsDataItem,
  valueColumnName,
  saveMetricThreshold,
}: ThresholdProps): JSX.Element => {
  const [isModalOpen, toggleModal] = useState(false)
  const [updatedThreshold, updateThreshold] = useState<number | undefined>(threshold)
  const modalContainerRef = useRef(null)

  const getKeyColumnsWithValues = (): Array<KeyValueInput> =>
    keyColumns.map(column => ({
      key: column.columnName,
      value: metricsDataItem[column.columnName],
    }))

  const [keyColumnsWithValue, updateKeyColumnsValue] =
    useState<Array<KeyValueInput>>(getKeyColumnsWithValues)

  const onChangeHandler = (e: RadioChangeEvent, key: string) => {
    const updatedKeyColumns = keyColumnsWithValue.map(column => {
      if (column.key === key) {
        return {
          key: column.key,
          value: e.target.value,
        }
      }
      return column
    })
    updateKeyColumnsValue(updatedKeyColumns)
  }

  const onSubmit = () => {
    saveMetricThreshold?.(updatedThreshold, keyColumnsWithValue, valueColumnName)
    toggleModal(false)
  }

  const onRemove = () => {
    updateThreshold(undefined)
    saveMetricThreshold?.(null, keyColumnsWithValue, valueColumnName)
    toggleModal(false)
  }

  const onCancel = (): null => {
    toggleModal(!isModalOpen)

    return null
  }

  return (
    <ThresholdContainer>
      <span>{renderPercentColumnValue(threshold)}</span>
      {saveMetricThreshold ? (
        <>
          <ThresholdEditButton
            onClick={() => toggleModal(!isModalOpen)}
            data-testid="treshold-edit-btn"
          >
            Edit
          </ThresholdEditButton>
          <div ref={modalContainerRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 9 }} />
          <Modal
            title="Update the threshold"
            visible={isModalOpen}
            onCancel={onCancel}
            getContainer={() => modalContainerRef.current!}
            destroyOnClose
            footer={
              <ModalButtonsWrapper data-testid="treshold-modal">
                <RemoveThresholdButton onClick={onRemove} data-testid="remove-threshold-button">
                  Remove the threshold
                </RemoveThresholdButton>
                <Button
                  onClick={() => toggleModal(!isModalOpen)}
                  data-testid="treshold-modal-cancel"
                >
                  Cancel
                </Button>
                <Button type="primary" onClick={onSubmit} data-testid="save-threshold-button">
                  Save
                </Button>
              </ModalButtonsWrapper>
            }
          >
            {keyColumns.map(column => (
              <ModalRadioGroup
                key={column.columnName}
                keyColumn={column}
                metricsDataItem={metricsDataItem}
                onChangeHandler={onChangeHandler}
              />
            ))}
            <ThresholdInputLabel htmlFor="threshold-input">Threshold</ThresholdInputLabel>
            <InputNumber
              min={0}
              max={100}
              step={1}
              precision={2}
              value={updatedThreshold}
              onChange={(value: string | number | undefined) => updateThreshold(value as number)}
              formatter={value => (value || value === 0 ? `${value}%` : `${value}`)}
              id="threshold-input"
            />
          </Modal>{' '}
        </>
      ) : null}
    </ThresholdContainer>
  )
}

export default Threshold
