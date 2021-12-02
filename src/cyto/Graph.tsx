import React, { useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import cytoscape from 'cytoscape'

// @ts-ignore
import cytoscapeDomNode from './customNode'

// @ts-ignore
import expandCollapse from 'cytoscape-expand-collapse'

// @ts-ignore
/* import cytoscapeFcose from 'cytoscape-fcose' */

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

    cytoscape.use(expandCollapse)
    cytoscape.use(dagre)
    cytoscape.use(undoRedo)
    cytoscape.use(cytoscapeDomNode)

    const parentNodes = elements.reduce((acc: string[], el: any) => {
      if (!el.data.parent) {
        return acc
      }

      return !acc.includes(el.data.parent) ? [...acc, el.data.parent] : acc
    }, [])

    const actualElements = elements.map((el: any) => {
      if (el.group !== 'nodes') {
        return el
      }

      if (parentNodes.includes(el.data.id)) {
        return el
      }

      const dom = document.createElement('div')
      dom.id = `node-${el.data.id}`

      return { ...el, data: { ...el.data, dom } }
    })

    const dagreOpts = {
      name: 'dagre',
      rankDir: 'RL',
      align: 'DL',
      rankSep: 64,
      nodeSep: 16,
      ranker: 'longest-path',
    }

    const cy = cytoscape({
      container: ref.current,
      elements: actualElements,
      autoungrabify: true,
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
        dagreOpts,
      },
    })

    // @ts-ignore
    const createNodes = () => {
      const El = React.createElement(Node, { onClick: e => console.log('click', e.target) })
      actualElements.forEach((el: any) => {
        if (el.group === 'nodes' && el.data.dom) {
          ReactDOM.render(El, document.getElementById(`node-${el.data.id}`))
        }
      })
    }

    const destoyNodes = () => {
      actualElements.forEach((el: any) => {
        if (el.group === 'nodes' && el.data.dom) {
          const domEl = document.getElementById(`node-${el.data.id}`)
          domEl && ReactDOM.unmountComponentAtNode(domEl)
        }
      })
    }

    // @ts-ignore
    const destroyRecur = id => {
      const toDestroy = actualElements.filter((el: any) => el.data.parent === id)
      toDestroy.forEach((el: any) => {
        const domEl = document.getElementById(`node-${el.data.id}`)

        // @ts-ignore
        domEl && ReactDOM.unmountComponentAtNode(domEl)
        domEl && domEl.remove()
      })
    }

    // @ts-ignore
    cy.domNode({ destroyRecur })

    // @ts-ignore
    cy.expandCollapse({
      layoutBy: null,
      fisheye: false,
      animate: true,
      zIndex: 10,
      ready: () => console.log('ready'),
    })

    // @ts-ignore
    /* const api = cy.expandCollapse('get') */

    cy.layout(dagreOpts).run()
    createNodes()

    return () => {
      destoyNodes()
      cytoscape.use = () => {} // https://github.com/cytoscape/cytoscape.js-cxtmenu/issues/62
      cy.destroy()
      console.log('cy destroyed')
    }
  }, [ref.current])

  return (
    <>
      <div id="domContainer" style={{ zIndex: 8 }}></div>
      <div
        ref={ref}
        id="cy"
        style={{
          zIndex: 9,
          width: '100vw',
          height: '100vh',
        }}
      ></div>
    </>
  )
}

export default Graph