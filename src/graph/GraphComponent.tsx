import React, { useMemo, useEffect, useRef } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  Background,
  isNode,
  Node as Node0,
  Edge as Edge0,
} from 'react-flow-renderer'

import { Sidebar } from './components/Sidebar'
import { SearchArgs } from './components/SidebarSearch'
import { DagNode } from './components/DagNode'
import { DagEdge } from './components/DagEdge'

import { ConnectedDrawer } from './components/ConnectedDrawer'
import { DrawerTabs } from './components/DrawerTabs'

import { graphLayout } from './graph-layout'
import {
  useGraphStore,
  setInitialStore,
  resetHighlightedColumns,
  resetHighlights,
  nodeClick,
  highlightIds,
  useGraphDispatch,
} from './graph-store'

import { Container, GraphContainer } from './styles'
import { DataGraph, ChromaticScale, Orientation } from './model'

import { mapInitialNodes, mapInitialEdges } from './graph-ops'

const GraphComponent = ({ data, config: cfg }: Props) => {
  const releases = data.map(dataItem => dataItem.version)
  const config: Required<Config> = {
    ...defaultConfig,
    ...cfg,
    currentRelease: cfg?.currentRelease || data[0].version,
  }
  const containerRef = useRef<HTMLDivElement>(null)

  const baseReleases = releases
    .filter(release => release !== config.currentRelease)
    .map(release => ({ value: release, label: release }))

  const tables = useMemo(
    () => data.find(dataItem => dataItem.version === config.currentRelease)!.tables,
    [data]
  )

  const currentGraph = {
    nodes: mapInitialNodes(tables),
    edges: mapInitialEdges(tables),
  }

  const dispatch = useGraphDispatch()
  const searchNodeLabels = useGraphStore(state => state.searchNodeLabels)

  const onElementClick = (_: any, element: Node0 | Edge0) => {
    if (isNode(element)) {
      return dispatch(nodeClick(element.id, config.chromaticScale))
    }
  }

  const onPaneClick = () => {
    dispatch(resetHighlights)
    dispatch(resetHighlightedColumns)
  }

  const onSearchNode = ({ val, err, onError }: SearchArgs) => {
    if (!val) {
      return
    }
    const nodeIds = searchNodeLabels(val)

    if (!nodeIds?.length) {
      return onError(true)
    }

    if (err) {
      return onError(false)
    }

    dispatch(highlightIds(nodeIds))
  }

  useEffect(() => {
    dispatch(
      setInitialStore({
        graph: currentGraph,
        data,
        tables,
      })
    )
    // TODO: Leave only currentGraph argument ?
  }, [])

  // TODO: Computing currentGraph layout is not fair in case of diffing
  const elements = graphLayout([...currentGraph.nodes, ...currentGraph.edges], config.orientation)
  return (
    <Container ref={containerRef}>
      <Sidebar
        onSearch={onSearchNode}
        releases={baseReleases}
        chromaticScale={config.chromaticScale}
      />
      <GraphContainer>
        <ReactFlowProvider>
          <ReactFlow
            nodesDraggable={false}
            onElementClick={onElementClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            elements={elements}
            onlyRenderVisibleElements={true}
            nodesConnectable={false}
            minZoom={0.2}
          >
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
      </GraphContainer>
      <ConnectedDrawer containerRef={containerRef} isOpenDrawer={config.openDrawer}>
        <DrawerTabs />
      </ConnectedDrawer>
    </Container>
  )
}

export default GraphComponent

export interface Props {
  data: DataGraph[]
  config?: Config
}

interface Config {
  currentRelease?: string
  orientation?: Orientation
  openDrawer?: boolean

  // You can use any color scheme from https://github.com/d3/d3-scale-chromatic#sequential-single-hue
  // Pass the name of the scheme as chromaticScale prop (ex. 'interpolateBlues', 'interpolateGreens', etc.)
  chromaticScale?: ChromaticScale
}

const defaultConfig: Required<Omit<Config, 'currentRelease'>> = {
  orientation: 'horizontal',
  chromaticScale: 'interpolatePuOr',
  openDrawer: false,
}

const nodeTypes = {
  dagNode: DagNode,
}

const edgeTypes = {
  dagEdge: DagEdge,
}
