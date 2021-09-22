import React from 'react'
import { ReactFlowProvider, MiniMap } from 'react-flow-renderer'

import Radio from 'antd/lib/radio'
import Space from 'antd/lib/space'

import { Node, Highlight } from './model'
import {
  MenuTitle,
  SidebarContentWrapper,
  SelectVersion,
  SidebarWrapper,
  NodeSearch,
} from './styles'

export const Sidebar = ({ highlight, onHighlightChange }: Props) => (
  <SidebarWrapper>
    <SidebarContentWrapper>
      <NodeSearch
        error={''}
        placeholder="Search node"
        allowClear
        value={'search'}
        onChange={() => {}}
        onSearch={() => {}}
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
      <MenuTitle>Highlight:</MenuTitle>
      <Radio.Group onChange={onHighlightChange} value={highlight}>
        <Space direction="vertical">
          <Radio value={'nearest'}>Nearest</Radio>
          <Radio value={'children'}>Downstream (children)</Radio>
          <Radio value={'parents'}>Upstream (parents)</Radio>
        </Space>
      </Radio.Group>
    </SidebarContentWrapper>
  </SidebarWrapper>
)

const MinimapWrapper = ({ children }: { children: React.ReactNode }) => (
  <ReactFlowProvider>
    <MiniMap
      style={{ position: 'static' }}
      nodeColor={(node: Node) => {
        switch (node.type) {
          case 'input':
            return 'red'
          case 'default':
            return '#00ff00'
          case 'output':
            return 'rgb(0,0,255)'
          default:
            return '#eee'
        }
      }}
    />
    {children}
  </ReactFlowProvider>
)

export const SidebarWithMiniMap = (props: Props) => (
  <MinimapWrapper>
    <Sidebar {...props} />
  </MinimapWrapper>
)

interface Props {
  highlight: Highlight
  onHighlightChange: (_: any) => void
}
