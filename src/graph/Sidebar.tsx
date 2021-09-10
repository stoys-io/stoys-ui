import React, { SetStateAction, Dispatch } from 'react'
import Radio, { RadioChangeEvent } from 'antd/lib/radio'
import Space from 'antd/lib/space'
import { Badge, Highlight } from './model'
import { SidebarWrapper, MenuTitle, NodeSearch, SelectVersion } from './styles'

type SidebarProps = {
  badge: Badge
  changeBadge: Dispatch<SetStateAction<Badge>>
  searchInputValue: string
  setSearchInputValue: Dispatch<SetStateAction<string>>
  onSearchNode: () => void
  searchHasError: boolean
  highlight: Highlight
  setHighlight: Dispatch<SetStateAction<Highlight>>
}

const Sidebar = ({
  badge,
  changeBadge,
  searchInputValue,
  setSearchInputValue,
  onSearchNode,
  searchHasError,
  highlight,
  setHighlight,
}: SidebarProps) => {
  const onChangeBadge = (e: RadioChangeEvent) => {
    changeBadge(e.target.value)
  }
  const onSetHighlight = (e: RadioChangeEvent) => {
    setHighlight(e.target.value)
  }
  return (
    <SidebarWrapper>
      <NodeSearch
        error={searchHasError ? 'true' : ''}
        placeholder="Search node"
        allowClear
        value={searchInputValue}
        onChange={e => setSearchInputValue(e.target.value)}
        onSearch={onSearchNode}
      />
      <MenuTitle>Select previous run:</MenuTitle>
      <SelectVersion
        placeholder="Previous Version"
        options={[
          { label: '20210422_150647_120', value: '20210422_150647_120' },
          { label: '20210522_150647_470', value: '20210522_150647_470' },
          { label: '20210621_150647_385', value: '20210621_150647_385' },
          { label: '20210721_150647_861', value: '20210721_150647_861' },
          { label: '20210820_150647_975', value: '20210820_150647_975' },
        ]}
      />
      <MenuTitle>Badges:</MenuTitle>
      <Radio.Group onChange={onChangeBadge} value={badge}>
        <Space direction="vertical">
          <Radio value={'violations'}>Errors</Radio>
          <Radio value={'partitions'}>Partitions</Radio>
        </Space>
      </Radio.Group>
      <MenuTitle>Highlight:</MenuTitle>
      <Radio.Group onChange={onSetHighlight} value={highlight}>
        <Space direction="vertical">
          <Radio value={'nearest'}>Nearest</Radio>
          <Radio value={'parents'}>Downstream (parents)</Radio>
          <Radio value={'children'}>Upstream (children)</Radio>
        </Space>
      </Radio.Group>
    </SidebarWrapper>
  )
}

export default Sidebar
