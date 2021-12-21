import React, { useEffect, useRef } from 'react'
import { isNode, Edge as Edge0 } from 'react-flow-renderer'

import { Sidebar } from '../graph/components/Sidebar'
import { SearchArgs } from '../graph/components/SidebarSearch'
import { DagNode } from './DagNode'
import { DagEdge } from './DagEdge'

import { ConnectedDrawer } from '../graph/components/ConnectedDrawer'
import { DrawerTabs } from '../graph/components/DrawerTabs'

import { graphLayout } from '../graph/graph-layout'
import {
  useGraphStore,
  setInitialStore,
  resetHighlightedColumns,
  resetHighlights,
  nodeClick,
  highlightIds,
  useGraphDispatch,
  openDrawer,
} from '../graph/graph-store'

import { Container, GraphContainer } from '../graph/styles'
import { DataGraph, ChromaticScale, Orientation } from '../graph/model'

import { mapInitialNodes, mapInitialEdges } from '../graph/graph-ops'
import CustomGraphComponent from './CustomGraphComponent'
import { NODE_HEIGHT, NODE_WIDTH } from '../graph/constants'

const GraphScreen = ({ data, config: cfg }: Props) => {
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
  const gNodes = elements
    .filter(el => isNode(el))
    .reduce((acc, node) => ({ ...acc, [node.id]: node }), {})

  const gEdges = elements.filter(el => !isNode(el)) as Edge0[]
  const customGraphData = { nodes: gNodes, edges: gEdges }

  const onNodeClick = (id: string) => {
    dispatch(nodeClick(id, config.chromaticScale))
  }

  const onNodeDoubleClick = (id: string) => {
    dispatch(openDrawer(id))
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
        <CustomGraphComponent
          graph={customGraphData}
          nodeComponent={(props: any) => (
            <DagNode {...props} onClick={onNodeClick} onDoubleClick={onNodeDoubleClick} />
          )}
          edgeComponent={DagEdge}
          onPaneClick={onPaneClick}
          nodeHeight={NODE_HEIGHT}
          nodeWidth={NODE_WIDTH}
          minScale={0.12}
          maxScale={2}
        />
      </GraphContainer>
      <ConnectedDrawer containerRef={containerRef} isOpenDrawer={config.openDrawer}>
        <DrawerTabs />
      </ConnectedDrawer>
    </Container>
  )
}

export default GraphScreen

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
