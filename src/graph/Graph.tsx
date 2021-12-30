import React, { useEffect, useRef } from 'react'
import { DagNode } from './DagNode'
import { DagEdge } from './DagEdge'
import { graphLayout } from './graph-layout'

import { Sidebar } from '../graph-common/components/Sidebar'
import { SearchArgs } from '../graph-common/components/SidebarSearch'
import { ConnectedDrawer } from '../graph-common/components/ConnectedDrawer'
import { DrawerTabs } from '../graph-common/components/DrawerTabs'

import {
  useGraphStore,
  setInitialStore,
  resetHighlightedColumns,
  resetHighlights,
  nodeClick,
  highlightIds,
  useGraphDispatch,
  openDrawer,
  StoreProvider,
} from '../graph-common/store'

import { DataGraph, ChromaticScale, Orientation, Edge } from '../graph-common/model'
import { NODE_HEIGHT, NODE_WIDTH } from '../graph-common/constants'
import { mapInitialNodes, mapInitialEdges } from '../graph-common/ops'
import { Container, GraphContainer } from '../graph-common/styles'

import CustomGraph from '../CustomGraph'

const Graph = ({ data, config: cfg }: Props) => {
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
  const bubbleSets = data.find(dataItem => dataItem.version === config.currentRelease)!.bubbleSets

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
    // We use init flag to track that store did init and prevent race condition
    state => (state.init ? state.graph : currentGraph),
    (oldGraph, newGraph) => oldGraph.release === newGraph.release
  )

  const graphWithLayout = graphLayout(graph)
  const graphDrawable = {
    nodes: graphWithLayout.nodes.reduce((acc, node) => ({ ...acc, [node.id]: node }), {}),
    edges: graphWithLayout.edges,
  }

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
        <CustomGraph
          graph={graphDrawable}
          bubbleSets={bubbleSets}
          nodeComponent={props => (
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

const WrappedGraph = (props: Props) => (
  <StoreProvider>
    <Graph {...props} />
  </StoreProvider>
)

export default WrappedGraph

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
