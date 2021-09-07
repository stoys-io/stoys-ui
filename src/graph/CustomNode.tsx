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
  const { label, highlighted, badgeNumber } = cfg
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
          width: 150,
          height: 'auto',
          fill: '#fff',
          stroke: highlighted ? '#1e80fe' : '#2e2d2d',
          shadowColor: '#eee',
          shadowBlur: 30,
          radius: [2],
          padding: [8],
          cursor: 'pointer',
        }}
        onClick={(evt, node: any) => onNodeClick(node.getModel())}
      >
        <Text
          style={{
            fill: highlighted ? '#1e80fe' : '#000000',
            fontWeight: highlighted ? 600 : 400,
            fontSize: 16,
            cursor: 'pointer',
          }}
          onClick={(evt, node: any) => onNodeClick(node.getModel())}
        >
          {getLabelText(label)}
        </Text>
      </Rect>
    </Group>
  )
}

export default CustomNode
