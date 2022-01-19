import React from 'react'
import Radio from 'antd/lib/radio'
import Space from 'antd/lib/space'
import Select from 'antd/lib/select'
import Checkbox from 'antd/lib/checkbox'

import SidebarSearch, { OnSearch } from './SidebarSearch'
import ScrollableSelect from './ScrollableSelect'

import { SidebarWrapper, SidebarContentWrapper, MenuTitle } from '../styles'
import { ChromaticScale, TableMetric, Highlight, ColumnMetric } from '../model'
import {
  useGraphStore,
  useGraphDispatch,
  setTableMetric,
  setColumnMetric,
  setBaseRelease,
  clearBaseRelease,
  setHighlightMode,
  setCountNormalize,
} from '../store'

const Sidebar = ({ onSearch, releaseOptions, chromaticScale }: Props) => {
  const dispatch = useGraphDispatch()
  const tableMetric = useGraphStore(state => state.tableMetric)
  const columnMetric = useGraphStore(state => state.columnMetric)
  const countNormalize = useGraphStore(state => state.countNormalize)
  const highlightMode = useGraphStore(state => state.highlightMode)

  const showCountNormalize = columnMetric.startsWith('count_')

  return (
    <SidebarWrapper>
      <SidebarContentWrapper>
        <SidebarSearch onSearch={onSearch} />

        {releaseOptions && releaseOptions.length ? (
          <>
            <MenuTitle>Select previous run: </MenuTitle>
            <Select<string>
              placeholder="Previous Version"
              options={releaseOptions}
              onChange={value => dispatch(setBaseRelease(value))}
              onClear={() => dispatch(clearBaseRelease())}
              allowClear
            />
          </>
        ) : null}

        <MenuTitle>Table metric: </MenuTitle>
        <ScrollableSelect
          placeholder="Table metric"
          options={tableMetricOptions}
          onChange={value => dispatch(setTableMetric(value))}
          filterOption={filterOption}
          value={tableMetric}
        />

        <MenuTitle>Column metric: </MenuTitle>
        <ScrollableSelect
          placeholder="Column metric"
          options={columnMetricOptions}
          onChange={value => dispatch(setColumnMetric(value))}
          filterOption={filterOption}
          value={columnMetric}
        />

        <Checkbox
          checked={countNormalize}
          onChange={e => dispatch(setCountNormalize(e.target.checked))}
          disabled={!showCountNormalize}
          style={checkboxStyle}
        >
          normalize count?
        </Checkbox>

        <MenuTitle>Highlight: </MenuTitle>
        <Radio.Group
          onChange={e => dispatch(setHighlightMode(e.target.value, chromaticScale))}
          value={highlightMode}
        >
          <Space direction="vertical">
            {highlightOptions.map(option => (
              <Radio key={option.key} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </SidebarContentWrapper>
    </SidebarWrapper>
  )
}

export default Sidebar

interface Props {
  onSearch: OnSearch
  chromaticScale: ChromaticScale
  releaseOptions?: Array<{ label: string; value: string }>
}

const checkboxStyle = { marginTop: '8px' }
const filterOption = (searchInput: string, option: TableMetricOption | ColumnMetricOption) => {
  return option.label.toLowerCase().indexOf(searchInput.toLowerCase()) >= 0
}

const tableMetricOptions: TableMetricOption[] = [
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'Errors',
    value: 'violations',
  },
  {
    label: 'Partitions',
    value: 'partitions',
  },
]

const columnMetricOptions: ColumnMetricOption[] = [
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'data_type',
    value: 'data_type',
  },
  {
    label: 'count',
    value: 'count',
  },
  {
    label: 'count_empty',
    value: 'count_empty',
  },
  {
    label: 'count_nulls',
    value: 'count_nulls',
  },
  {
    label: 'count_unique',
    value: 'count_unique',
  },
  {
    label: 'count_zeros',
    value: 'count_zeros',
  },
  {
    label: 'pmf',
    value: 'pmf',
  },
  {
    label: 'max_length',
    value: 'max_length',
  },
  {
    label: 'min',
    value: 'min',
  },
  {
    label: 'max',
    value: 'max',
  },
  {
    label: 'mean',
    value: 'mean',
  },
]

const highlightOptions: HighlighOption[] = [
  {
    key: 'none',
    value: 'none',
    label: 'None',
  },
  {
    key: 'nearest',
    value: 'nearest',
    label: 'Nearest',
  },
  {
    key: 'children',
    value: 'children',
    // Note: user's notion of children and parents is the opposite of what we use in data structures
    label: 'Upstream (parents)',
  },
  {
    key: 'parents',
    value: 'parents',
    // Note: user's notion of children and parents is the opposite of what we use in data structures
    label: 'Downstream (children)',
  },
  {
    key: 'metrics',
    value: 'metrics',
    label: 'Metrics',
  },
  {
    key: 'diffing',
    value: 'diffing',
    label: 'Version diff',
  },
]

interface TableMetricOption {
  label: string
  value: TableMetric
}

interface ColumnMetricOption {
  label: string
  value: ColumnMetric
}

interface HighlighOption {
  key: Highlight
  value: Highlight
  label: string
}
