import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '../../__mocks__/matchMedia.mock'

import { Quality } from '..'
import { QualityData as QualityModel } from '../model'

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(
    () => ({ measureText: jest.fn(() => ({ width: 100 })) } as any)
  )
})

describe('Quality', () => {
  describe('mode', () => {
    const simpleData: QualityModel = {
      columns: [],
      rules: [],
      row_sample: [],
      metadata: {},
      statistics: {
        column: [],
        table: { rows: 0, violations: 0 },
        rule: [],
      },
    }

    it('should render "row" by default', () => {
      const { container } = render(<Quality data={simpleData} />)
      expect(container.querySelector('[mode="row"]')).toBeTruthy()
    })

    it('should change "row" to "column"', () => {
      const { container, getByTestId } = render(<Quality data={simpleData} />)
      const expandBtn = getByTestId('expand-rules-table-btn')

      expect(container.querySelector('[mode="row"]')).toBeTruthy()
      fireEvent.click(expandBtn)
      expect(container.querySelector('[mode="row"]')).toBeFalsy()
      expect(container.querySelector('[mode="column"]')).toBeTruthy()
    })

    it('should render passed mode via props', () => {
      const mode = 'column'
      const { container } = render(<Quality data={simpleData} config={{ mode }} />)
      expect(container.querySelector(`[mode="${mode}"]`)).toBeTruthy()
    })

    it('should call onModeChange if mode changed', () => {
      const onModeChangeHandler = jest.fn()
      const { container, getByTestId } = render(
        <Quality data={simpleData} config={{ mode: 'column', onModeChange: onModeChangeHandler }} />
      )
      const expandBtn = getByTestId('shrink-rules-table-btn')

      expect(container.querySelector(`[mode="column"]`)).toBeTruthy()
      fireEvent.click(expandBtn)
      expect(onModeChangeHandler).toBeCalledWith('row')
      expect(container.querySelector('[mode="row"]')).toBeTruthy()
    })
  })

  describe('selectedRules', () => {
    const data: QualityModel = {
      columns: [{ name: 'id' }, { name: 'amount' }, { name: 'count' }],
      rules: [
        { expression: 'id expression', name: 'id_rule', referenced_column_names: ['id'] },
        {
          expression: 'amount expression',
          name: 'amount_rule',
          referenced_column_names: ['amount'],
        },
        { expression: 'count expression', name: 'count_rule', referenced_column_names: ['count'] },
      ],
      row_sample: [
        {
          row: ['0', '100', '10'],
          violated_rule_names: ['id_rule'],
        },
        {
          row: ['1', '200', '20'],
          violated_rule_names: ['amount_rule'],
        },
        {
          row: ['2', '300', '30'],
          violated_rule_names: ['count_rule'],
        },
      ],
      metadata: {},
      statistics: {
        column: [
          { violations: 1, column_name: 'id' },
          { violations: 1, column_name: 'amount' },
          { violations: 1, column_name: 'count' },
        ],
        table: { rows: 100, violations: 1 },
        rule: [
          { rule_name: 'id_rule', violations: 1 },
          { rule_name: 'amount_rule', violations: 1 },
          { rule_name: 'count_rule', violations: 1 },
        ],
      },
    }

    it('should render rules', () => {
      const { getAllByText } = render(<Quality data={data} />)

      expect(getAllByText(data.rules[0].name)).toBeTruthy()
      expect(getAllByText(data.rules[1].name)).toBeTruthy()
      expect(getAllByText(data.rules[2].name)).toBeTruthy()
    })

    it('should render passed selectedRules', () => {
      const { container } = render(<Quality data={data} config={{ selectedRules: ['id_rule'] }} />)
      const idRuleCheckbox = container
        .querySelector("[data-row-key='id_rule']")
        .querySelector('input[type="checkbox"]')
      const countRuleheckbox = container
        .querySelector("[data-row-key='count_rule']")
        .querySelector('input[type="checkbox"]')

      expect(idRuleCheckbox.hasAttribute('checked')).toBeTruthy()
      expect(countRuleheckbox.hasAttribute('checked')).toBeFalsy()
    })

    it('should call onSelectedRulesChange', () => {
      const onSelectedRulesChangeHandler = jest.fn()
      const { container } = render(
        <Quality data={data} config={{ onSelectedRulesChange: onSelectedRulesChangeHandler }} />
      )
      const idRuleRow = container.querySelector("[data-row-key='id_rule']")
      const idRuleCheckboxLabel = container
        .querySelector("[data-row-key='id_rule']")
        .querySelector('label')
      const idRuleCheckbox = idRuleRow.querySelector('input[type="checkbox"]')

      expect(idRuleCheckboxLabel.classList.contains('ant-checkbox-wrapper-checked')).toBeFalsy()

      fireEvent.click(idRuleCheckbox)

      expect(onSelectedRulesChangeHandler).toBeCalledWith(['id_rule'])
      expect(idRuleCheckboxLabel.classList.contains('ant-checkbox-wrapper-checked')).toBeTruthy()
    })

    it('should select rules without passed onSelectedRulesChange', () => {
      const { container } = render(<Quality data={data} />)
      const idRuleRow = container.querySelector("[data-row-key='id_rule']")
      const idRuleCheckboxLabel = container
        .querySelector("[data-row-key='id_rule']")
        .querySelector('label')
      const idRuleCheckbox = idRuleRow.querySelector('input[type="checkbox"]')

      expect(idRuleCheckboxLabel.classList.contains('ant-checkbox-wrapper-checked')).toBeFalsy()

      fireEvent.click(idRuleCheckbox)

      expect(idRuleCheckboxLabel.classList.contains('ant-checkbox-wrapper-checked')).toBeTruthy()
    })
  })
})
