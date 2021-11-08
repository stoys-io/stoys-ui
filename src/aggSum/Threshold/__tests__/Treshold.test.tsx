import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import Treshold from '..'

describe('Treshold', () => {
  const treshold = 10
  const newTreshold = 10
  const keyColumns = [
    { title: 'id', columnName: 'id' },
    { title: 'count', columnName: 'count' },
  ]
  const aggSumDataItem = { id: 'id_value', count: 'count_value' }
  const valueColumnName = 'id'

  it('should render treshold', () => {
    const { getByText } = render(
      <Treshold
        threshold={treshold}
        keyColumns={keyColumns}
        aggSumDataItem={aggSumDataItem}
        valueColumnName={valueColumnName}
      />
    )

    expect(getByText(`${treshold}%`)).toBeTruthy()
  })

  describe('modal', () => {
    describe('should open and close modal', () => {
      it('should open modal after clicking "edit" btn', () => {
        const saveMetricThresholdMock = jest.fn()
        const { getByTestId } = render(
          <Treshold
            threshold={treshold}
            keyColumns={keyColumns}
            aggSumDataItem={aggSumDataItem}
            valueColumnName={valueColumnName}
            saveMetricThreshold={saveMetricThresholdMock}
          />
        )

        const editBtn = getByTestId('treshold-edit-btn')

        fireEvent.click(editBtn)

        const modal = getByTestId('treshold-modal')

        expect(modal).toBeTruthy()
      })

      it('should close modal after clicking "cancel" btn', () => {
        const saveMetricThresholdMock = jest.fn()
        const { getByTestId, queryByTestId } = render(
          <Treshold
            threshold={treshold}
            keyColumns={keyColumns}
            aggSumDataItem={aggSumDataItem}
            valueColumnName={valueColumnName}
            saveMetricThreshold={saveMetricThresholdMock}
          />
        )

        const editBtn = getByTestId('treshold-edit-btn')

        fireEvent.click(editBtn)

        const modal = getByTestId('treshold-modal')

        expect(modal).toBeTruthy()

        const cancelModalBtn = getByTestId('treshold-modal-cancel')

        fireEvent.click(cancelModalBtn)

        expect(queryByTestId('treshold-modal')).toBeNull()
      })

      it('should close modal after clicking "close" btn', () => {
        const saveMetricThresholdMock = jest.fn()
        const { getByTestId, queryByTestId, container } = render(
          <Treshold
            threshold={treshold}
            keyColumns={keyColumns}
            aggSumDataItem={aggSumDataItem}
            valueColumnName={valueColumnName}
            saveMetricThreshold={saveMetricThresholdMock}
          />
        )

        const editBtn = getByTestId('treshold-edit-btn')

        fireEvent.click(editBtn)

        expect(queryByTestId('treshold-modal')).toBeTruthy()

        const closeBtn = container.querySelector('.ant-modal-close')

        fireEvent.click(closeBtn)

        expect(queryByTestId('treshold-modal')).toBeNull()
      })
    })

    it('should call "saveMetricThreshold" with new value', () => {
      const saveMetricThresholdMock = jest.fn()
      const { container, debug, getByTestId } = render(
        <Treshold
          threshold={treshold}
          keyColumns={keyColumns}
          aggSumDataItem={aggSumDataItem}
          valueColumnName={valueColumnName}
          saveMetricThreshold={saveMetricThresholdMock}
        />
      )

      const editBtn = getByTestId('treshold-edit-btn')

      fireEvent.click(editBtn)

      const modalInput = container.querySelector('#threshold-input')

      fireEvent.change(modalInput, { target: { value: newTreshold } })

      const saveBtn = getByTestId('save-threshold-button')

      fireEvent.click(saveBtn)

      expect(saveMetricThresholdMock).toBeCalledWith(
        newTreshold,
        [
          { key: 'id', value: 'id_value' },
          { key: 'count', value: 'count_value' },
        ],
        valueColumnName
      )
    })

    it('should call "saveMetricThreshold" after click "Remove the treshold"', () => {
      const saveMetricThresholdMock = jest.fn()
      const { getByTestId } = render(
        <Treshold
          threshold={treshold}
          keyColumns={keyColumns}
          aggSumDataItem={aggSumDataItem}
          valueColumnName={valueColumnName}
          saveMetricThreshold={saveMetricThresholdMock}
        />
      )

      const editBtn = getByTestId('treshold-edit-btn')

      fireEvent.click(editBtn)

      const removeBtn = getByTestId('remove-threshold-button')

      fireEvent.click(removeBtn)

      expect(saveMetricThresholdMock).toBeCalledWith(
        null,
        [
          { key: 'id', value: 'id_value' },
          { key: 'count', value: 'count_value' },
        ],
        valueColumnName
      )
    })
  })
})
