import React, { useCallback, useMemo } from 'react'
import Radio, { RadioChangeEvent } from 'antd/lib/radio'
import Space from 'antd/lib/space'
import {
  SidebarWrapper,
  UnderMiniMapBackground,
  SidebarContentWrapper,
  MenuTitle,
  NodeSearch,
  SelectVersion,
} from './styles'
import { SidebarProps } from './model'

const Sidebar = ({
  drawerHeight,
  badge,
  changeBadge,
  searchInputValue,
  setSearchInputValue,
  onSearchNode,
  searchHasError,
  highlight,
  setHighlight,
  releases,
  onReleaseChange,
}: SidebarProps) => {
  const onChangeBadge = useCallback(
    (e: RadioChangeEvent) => {
      changeBadge(e.target.value)
    },
    [changeBadge]
  )
  const onSetHighlight = useCallback(
    (e: RadioChangeEvent) => {
      setHighlight(e.target.value)
    },
    [setHighlight]
  )
  const _releases = useMemo(
    () => releases?.map(release => ({ label: release, value: release })),
    [releases]
  )

  return (
    <SidebarWrapper drawerHeight={drawerHeight}>
      <UnderMiniMapBackground />
      <SidebarContentWrapper>
        <NodeSearch
          error={searchHasError ? 'true' : ''}
          placeholder="Search node"
          allowClear
          value={searchInputValue}
          onChange={e => setSearchInputValue(e.target.value)}
          onSearch={onSearchNode}
        />
        <MenuTitle>Select previous run:</MenuTitle>

        {_releases && _releases.length ? (
          <SelectVersion
            placeholder="Previous Version"
            options={_releases}
            onChange={onReleaseChange}
          />
        ) : null}

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
      </SidebarContentWrapper>
    </SidebarWrapper>
  )
}

export default Sidebar
