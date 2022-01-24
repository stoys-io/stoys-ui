import React, { useEffect, useRef } from 'react'
import { DagNode } from './DagNode'
import { DagEdge } from './DagEdge'

import { Sidebar, SearchArgs, ConnectedDrawer } from '../graph-common/components'

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

import { DataGraph, ChromaticScale, Orientation, Node } from '../graph-common/model'
import { NODE_HEIGHT, NODE_WIDTH } from '../graph-common/constants'
import { mapInitialNodes, mapInitialEdges } from '../graph-common/ops'
import { Container, GraphContainer } from '../graph-common/styles'

import CustomGraph, { useZoomUtilStore, ZoomUtilProvider } from '../CustomGraph'

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

  const tables = data.find(dataItem => dataItem.version === config.currentRelease)?.tables ?? []
  const bubbleSets =
    data.find(dataItem => dataItem.version === config.currentRelease)?.bubbleSets ?? {}

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
      })
    )
  }, [])

  const dispatch = useGraphDispatch()
  const searchNodeLabels = useGraphStore(state => state.searchNodeLabels)

  const graph = useGraphStore(
    // We use init flag to track that store did init and prevent race condition
    state => (state.init ? state.graph : currentGraph),
    (oldGraph, newGraph) => oldGraph.release === newGraph.release
  )
  const initZoomUtil = useZoomUtilStore(state => state.initZoomUtil)
  const jump = useZoomUtilStore(state => state.jump)

  const onNodeClick = (id: string) => dispatch(nodeClick(id, config.chromaticScale))
  const onNodeDoubleClick = (id: string) => dispatch(openDrawer(id))

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
    const first = nodeIds[0]
    const nd = graph.nodes.find(node => node.id === first)
    const pos = nd?.position
    if (pos) {
      jump(pos)
    }
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
          graph={graph}
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
          withDagreLayout
          initZoomUtil={initZoomUtil}
        />
      </GraphContainer>
      <ConnectedDrawer containerRef={containerRef} isOpenDrawer={config.openDrawer} />
    </Container>
  )
}

const WrappedGraph = (props: Props) => (
  <ZoomUtilProvider>
    <StoreProvider>
      <Graph {...props} />
    </StoreProvider>
  </ZoomUtilProvider>
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
