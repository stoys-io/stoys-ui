import React from 'react'
import { ReactFlowProvider, MiniMap } from 'react-flow-renderer'

import Radio from 'antd/lib/radio'
import Space from 'antd/lib/space'
import { Node, Highlight } from './model'

export const Sidebar = ({ highlight, onHighlightChange }: Props) => (
  <>
    <Radio.Group onChange={onHighlightChange} value={highlight}>
      <Space direction="vertical">
        <Radio value={'nearest'}>Nearest</Radio>
        <Radio value={'children'}>Downstream (children)</Radio>
        <Radio value={'parents'}>Upstream (parents)</Radio>
      </Space>
    </Radio.Group>
  </>
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
