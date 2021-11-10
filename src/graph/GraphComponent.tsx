import React, { useState, useEffect, useRef } from 'react'
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
import { Spinner } from './components/Spinner'

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
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const validCurrentRelease =
    // check if the release specified in config is present in the data
    cfg?.currentRelease && !!data.find(dataItem => dataItem.version === cfg.currentRelease)
      ? cfg.currentRelease
      : data[0].version

  const config: Required<Config> = {
    ...defaultConfig,
    ...cfg,
    currentRelease: validCurrentRelease,
  }

  const releaseOptions = data
    .map(dataItem => dataItem.version)
    .filter(release => release !== config.currentRelease)
    .map(release => ({ value: release, label: release }))

  const tables = data.find(dataItem => dataItem.version === config.currentRelease)!.tables

  const currentGraph = {
    nodes: mapInitialNodes(tables),
    edges: mapInitialEdges(tables),
    release: config.currentRelease,
  }

  useEffect(() => {
    dispatch(
      setInitialStore({
        data,
        graph: currentGraph,
        tables,
      })
    )
    // TODO: Leave only currentGraph argument ?
  }, [])

  const dispatch = useGraphDispatch()
  const searchNodeLabels = useGraphStore(state => state.searchNodeLabels)

  const graph = useGraphStore(
    state => state.graph,
    (oldGraph, newGraph) => oldGraph.release === newGraph.release
  )
  const elements = graphLayout([...graph.nodes, ...graph.edges], config.orientation)

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

  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <Container ref={containerRef}>
      <Sidebar
        onSearch={onSearchNode}
        releaseOptions={releaseOptions}
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
            onLoad={() => setIsLoading(false)}
            onlyRenderVisibleElements={true}
            nodesConnectable={false}
            minZoom={0.2}
          >
            <Spinner spinning={isLoading} />
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
