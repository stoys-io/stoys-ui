import React from 'react'
import Radio from 'antd/lib/radio'
import Space from 'antd/lib/space'

import SidebarSearch, { OnSearch } from './SidebarSearch'

import { SidebarWrapper, SidebarContentWrapper, MenuTitle, SelectVersion } from '../styles'
import { useGraphStore } from '../graph-store'
import { ChromaticScale } from '../model'

const highlightList = [
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
    label: 'Upstream (children)',
  },
  {
    key: 'parents',
    value: 'parents',
    label: 'Downstream (parents)',
  },
  {
    key: 'diffing',
    value: 'diffing',
    label: 'Version diff',
  },
]

const Sidebar = ({ onSearch, releases, chromaticScale }: Props) => {
  const setBaseRelease = useGraphStore(state => state.setBaseRelease)

  const badge = useGraphStore(state => state.badge)
  const setBadge = useGraphStore(state => state.setBadge)

  const highlightMode = useGraphStore(state => state.highlightMode)
  const setHighlightMode = useGraphStore(state => state.setHighlightMode)

  return (
    <SidebarWrapper>
      <SidebarContentWrapper>
        <SidebarSearch onSearch={onSearch} />

        {releases && releases.length ? (
          <>
            <MenuTitle>Select previous run:</MenuTitle>
            <SelectVersion
              placeholder="Previous Version"
              options={releases}
              onChange={value => typeof value === 'string' && setBaseRelease(value)}
              allowClear
            />
          </>
        ) : null}

        <MenuTitle>Badges:</MenuTitle>
        <Radio.Group onChange={e => setBadge(e.target.value)} value={badge}>
          <Space direction="vertical">
            <Radio value={'violations'}>Errors</Radio>
            <Radio value={'partitions'}>Partitions</Radio>
          </Space>
        </Radio.Group>
        <MenuTitle>Highlight:</MenuTitle>
        <Radio.Group
          onChange={e => setHighlightMode(e.target.value, chromaticScale)}
          value={highlightMode}
        >
          <Space direction="vertical">
            {highlightList.map(listItem => (
              <Radio key={listItem.key} value={listItem.value}>
                {listItem.label}
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
  releases?: Array<{ label: string; value: string }>
}
