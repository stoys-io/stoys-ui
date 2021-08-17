import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import 'src/__mocks__/matchMedia.mock'

import RulesTable from '../RulesTable'
import { Mode, RuleData } from '../../model'

describe('RulesTable', () => {
  const rowMode: Mode = 'row'
  const emptySelectedRules: Array<string> = []
  const selectedRules: Array<string> = ['id_rule']
  const smallSize: boolean = true
  const sampleData: Array<RuleData> = [
    {
      description: null,
      expression: 'id < 10',
      failureRatio: 0.007,
      key: 'id_rule',
      rule_name: 'id_rule',
      violations: 1000,
    },
    {
      description: null,
      expression: 'value > 20',
      failureRatio: 0.005,
      key: 'value_rule',
      rule_name: 'value_rule',
      violations: 2000,
    },
    {
      description: null,
      expression: 'count = 100',
      failureRatio: 0.0025,
      key: 'count_rule',
      rule_name: 'count_rule',
      violations: 100,
    },
  ]

  describe('select rules', () => {
    it('should select rules', () => {
      const setSelectRulesMock = jest.fn()
      const { container } = render(
        <RulesTable
          rulesData={sampleData}
          selectedRules={emptySelectedRules}
          mode={rowMode}
          smallSize={smallSize}
          setSelectRules={setSelectRulesMock}
          setMode={() => {}}
          tableProps={{}}
        />
      )
      const idRuleRow = container.querySelector("[data-row-key='id_rule']")
      const idRuleCheckbox = idRuleRow.querySelector('input[type="checkbox"]')

      fireEvent.click(idRuleCheckbox)

      expect(setSelectRulesMock).toBeCalledWith(['id_rule'])
    })

    it('should deselect rules', () => {
      const setSelectRulesMock = jest.fn()
      const { container } = render(
        <RulesTable
          rulesData={sampleData}
          selectedRules={selectedRules}
          mode={rowMode}
          smallSize={smallSize}
          setSelectRules={setSelectRulesMock}
          setMode={() => {}}
          tableProps={{}}
        />
      )
      const idRuleRow = container.querySelector("[data-row-key='id_rule']")
      const idRuleCheckbox = idRuleRow.querySelector('input[type="checkbox"]')

      fireEvent.click(idRuleCheckbox)

      expect(setSelectRulesMock).toBeCalledWith([])
    })
  })

  describe('search', () => {
    it('should search rules', async () => {
      const { container, findByText, queryByText } = render(
        <RulesTable
          rulesData={sampleData}
          selectedRules={emptySelectedRules}
          mode={rowMode}
          smallSize={smallSize}
          setSelectRules={() => {}}
          setMode={() => {}}
          tableProps={{}}
        />
      )
      const openSearchBtn = container.querySelector('span[role="button"]')

      fireEvent.click(openSearchBtn)

      const searchInput = await screen.findByTestId('search-input')
      const searchBtn = await screen.findByTestId('search-btn')

      fireEvent.change(searchInput, { target: { value: 'id_rule' } })
      fireEvent.click(searchBtn)

      const idRow = await findByText('id_rule')
      const countRow = queryByText('count_rule')
      const valueRow = queryByText('value_rule')

      expect(idRow).toBeTruthy()
      expect(countRow).toBeFalsy()
      expect(valueRow).toBeFalsy()
    })

    it('should clear search after clicking on "Reset"', async () => {
      const { container, findByText, queryByText } = render(
        <RulesTable
          rulesData={sampleData}
          selectedRules={emptySelectedRules}
          mode={rowMode}
          smallSize={smallSize}
          setSelectRules={() => {}}
          setMode={() => {}}
          tableProps={{}}
        />
      )
      const openSearchBtn = container.querySelector('span[role="button"]')

      fireEvent.click(openSearchBtn)

      const searchInput = await screen.findByTestId('search-input')
      const searchBtn = await screen.findByTestId('search-btn')
      const resetBtn = await screen.findByTestId('reset-btn')

      fireEvent.change(searchInput, { target: { value: 'id_rule' } })
      fireEvent.click(searchBtn)

      const idRow = await findByText('id_rule')
      const countRow = queryByText('count_rule')
      const valueRow = queryByText('value_rule')

      expect(idRow).toBeTruthy()
      expect(countRow).toBeFalsy()
      expect(valueRow).toBeFalsy()

      fireEvent.click(resetBtn)

      expect(queryByText('id_rule')).toBeTruthy()
      expect(queryByText('count_rule')).toBeTruthy()
      expect(queryByText('value_rule')).toBeTruthy()
    })
  })
})
