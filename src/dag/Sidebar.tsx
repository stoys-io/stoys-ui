import React from 'react'
import { ReactFlowProvider, MiniMap, Node } from 'react-flow-renderer'

import { Radio } from './styles'

export const Sidebar = ({ highlight, onHighlightChange }: Props) => (
  <>
    <Radio>
      <div>
        <input
          type="radio"
          id="nearest"
          value="nearest"
          onChange={onHighlightChange}
          checked={highlight === 'nearest'}
        />
        Nearest
      </div>
      <div>
        <input
          type="radio"
          id="parents"
          value="parents"
          onChange={onHighlightChange}
          checked={highlight === 'parents'}
        />
        Downstream (parents)
      </div>
      <div>
        <input
          type="radio"
          id="children"
          value="children"
          onChange={onHighlightChange}
          checked={highlight === 'children'}
        />
        Upstream (children)
      </div>
    </Radio>
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
  highlight: 'nearest' | 'parents' | 'children'
  onHighlightChange: (_: any) => void
}
