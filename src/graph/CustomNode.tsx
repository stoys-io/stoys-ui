import React from 'react'
import { Group, Rect, Text } from '@antv/g6-react-node'
import { getLabelText } from './helpers'
import { renderNumericValue } from '../helpers'

type ToolbarItemProps = {
  text: string
  table: string
  openDrawer: (node: any, table: string) => void
}

const ToolbarItem = ({ text, table, openDrawer }: ToolbarItemProps) => (
  <Rect
    style={{
      width: 30,
      stroke: '#ffffff',
      fill: '#ccc',
      cursor: 'pointer',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onClick={(evt, node, shape, graph) => openDrawer(node, table)}
  >
    <Text
      style={{ fill: '#000000', cursor: 'pointer' }}
      onClick={(evt, node, shape, graph) => openDrawer(node, table)}
    >
      {text}
    </Text>
  </Rect>
)

type CustomNodeProps = {
  cfg: any
  openDrawer: (node: any, table: string) => void
  onNodeClick: (node: any) => void
}

const CustomNode = ({ cfg, openDrawer, onNodeClick }: CustomNodeProps) => {
  const { label, badgeNumber, highlightingColor } = cfg
  const badge = badgeNumber ? renderNumericValue(2, true)(badgeNumber) : ''
  return (
    <Group>
      <Rect style={{ width: 155, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Rect style={{ flexDirection: 'row' }}>
          <ToolbarItem text={'JR'} table={'join_rates'} openDrawer={openDrawer} />
          <ToolbarItem text={'M'} table={'metrics'} openDrawer={openDrawer} />
          <ToolbarItem text={'P'} table={'profiler'} openDrawer={openDrawer} />
          <ToolbarItem text={'Q'} table={'quality'} openDrawer={openDrawer} />
        </Rect>
        <Rect
          style={{
            height: 'auto',
            width: 'auto',
            minWidth: 35,
            padding: [4],
            radius: [2],
            stroke: '#000000',
            fill: '#ffffff',
          }}
        >
          <Text style={{ fill: '#000000' }}>{badge}</Text>
        </Rect>
      </Rect>

      <Rect
        style={{
          width: 210,
          height: 'auto',
          fill: '#fff',
          stroke: highlightingColor || '#2e2d2d',
          lineWidth: highlightingColor ? '2' : '1',
          radius: [2],
          shadowColor: '#eee',
          shadowBlur: 30,
          cursor: 'pointer',
        }}
        onClick={(evt, node: any) => onNodeClick(node.getModel())}
      >
        <Text
          style={{
            fill: highlightingColor || '#000000',
            fontWeight: highlightingColor ? 600 : 400,
            fontSize: 16,
            margin: [8],
            cursor: 'pointer',
          }}
          onClick={(evt, node: any) => onNodeClick(node.getModel())}
        >
          {getLabelText(label)}
        </Text>
        <Rect
          style={{
            stroke: highlightingColor || '#2e2d2d',
            lineWidth: highlightingColor ? '2' : '1',
            radius: [0, 0, 2, 2],
            height: 60,
          }}
        >
          <Text style={{ fontSize: 14, fill: '#000000', margin: [3] }}>Lorem ipsum 1</Text>
          <Text style={{ fontSize: 14, fill: '#000000', margin: [3] }}>Lorem ipsum 2</Text>
          <Text style={{ fontSize: 14, fill: '#000000', margin: [3] }}>Lorem ipsum 3</Text>
        </Rect>
      </Rect>
    </Group>
  )
}

export default CustomNode
