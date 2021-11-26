import React, { useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import cytoscape from 'cytoscape'

// @ts-ignore
import cytoscapeDomNode from './customNode'

// @ts-ignore
import expandCollapse from 'cytoscape-expand-collapse'

// @ts-ignore
import cytoscapeFcose from 'cytoscape-fcose'

// @ts-ignore
import undoRedo from 'cytoscape-undo-redo'

// @ts-ignore
import dagre from 'cytoscape-dagre'

import { elements1 } from './mock'
import { Node } from './Node'

const Graph = (props: { elements: any[] }) => {
  const { elements = elements1 } = props

  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    cytoscape.warnings(true)

    cytoscape.use(cytoscapeFcose)
    cytoscape.use(expandCollapse)
    cytoscape.use(dagre)
    cytoscape.use(undoRedo)
    cytoscape.use(cytoscapeDomNode)

    const actualElements = elements.map((el: any) => {
      if (el.group !== 'nodes') {
        return { ...el, classes: 'bezier' }
      }

      const div = document.createElement('div')
      div.id = `node-${el.data.id}`

      return { ...el, data: { ...el.data, dom: div } }
    })

    console.log({ actualElements })

    const dagreOpts = {
      rankDir: 'RL',
      align: 'DL',
      rankSep: 64,
      nodeSep: 16,
      ranker: 'longest-path',
    }

    const cy = cytoscape({
      container: ref.current,
      elements: actualElements,
      style: [
        {
          selector: 'node',
          style: {
            width: '220px',
            height: '136px',
            shape: 'rectangle',
            'background-color': '#ad1a66',
            'background-opacity': 0.04,
          },
        },
        {
          selector: ':parent',
          style: {
            'background-opacity': 0.333,
          },
        },
        {
          selector: 'node.cy-expand-collapse-collapsed-node',
          style: {
            'background-color': 'darkblue',
            shape: 'rectangle',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#b1b1b7',
            'curve-style': 'unbundled-bezier',
            'control-point-distances': [40, -40],
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#b1b1b7',
            'source-endpoint': '-50% 0',
            'target-endpoint': '50% 0',
          },
        },
        {
          selector: 'edge.meta',
          style: {
            width: 2,
            'line-color': 'green',
          },
        },
        {
          selector: ':selected',
          style: {
            'overlay-color': '#6c757d',
            'overlay-opacity': 0.3,
            'background-color': '#999999',
          },
        },
      ],

      layout: {
        // @ts-ignore
        name: 'dagre',
        ...dagreOpts,
      },
    })

    // @ts-ignore
    cy.domNode()
    const El = React.createElement(Node, { onClick: e => console.log('click', e.target) })
    elements.forEach((el: any) => {
      if (el.group === 'nodes') {
        ReactDOM.render(El, document.getElementById(`node-${el.data.id}`))
      }
    })

    // @ts-ignore
    const ur = cy.undoRedo()

    // @ts-ignore
    cy.expandCollapse({
      layoutBy: {
        name: 'dagre',
        animate: true,
        randomize: false,
        fit: true,
        ...dagreOpts,
      },
      fisheye: true,
      animate: true,
      zIndex: 10,
    })

    document.getElementById('collapseRecursively')?.addEventListener('click', function () {
      ur.do('collapseRecursively', {
        nodes: cy.$(':selected'),
      })
      cy.layout({ name: 'dagre', ...dagreOpts }).run()
    })

    document.getElementById('expandRecursively')?.addEventListener('click', function () {
      ur.do('expandRecursively', {
        nodes: cy.$(':selected'),
      })
      cy.layout({ name: 'dagre', ...dagreOpts }).run()
    })

    document.getElementById('collapseAll')?.addEventListener('click', function () {
      ur.do('collapseAll')
      cy.layout({ name: 'dagre', ...dagreOpts }).run()
    })

    document.getElementById('expandAll')?.addEventListener('click', function () {
      ur.do('expandAll')
      cy.layout({ name: 'dagre', ...dagreOpts }).run()
    })

    cy.layout({ name: 'dagre', ...dagreOpts }).run()
  }, [ref.current])

  return (
    <>
      <div id="domContainer" style={{ zIndex: 8 }}></div>
      <div
        ref={ref}
        id="cy"
        style={{
          zIndex: 9,
          width: '1400px',
          height: '1000px',
        }}
      ></div>
    </>
  )
}

export default Graph
