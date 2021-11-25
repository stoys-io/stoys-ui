import React, { useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import cytoscape from 'cytoscape'

// @ts-ignore
/* import cytoscapeDomNode from 'cytoscape-dom-node' */

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

import { elements } from './mock'
import { Node } from './Node'

const Cyt = () => {
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
      div.onclick = e => console.log('asdf', e)

      return { ...el, data: { ...el.data, dom: div, type: 'bezier' } }
    })

    console.log({ actualElements })

    const dagreOpts = {
      direction: 'RL',
      align: 'DL',
      ranksep: 64,
      nodesep: 16,
      ranker: 'logest-path',
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
            'background-color': '#ad1a66',
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
            'line-color': '#ad1a66',
            'curve-style': 'straight',
          },
        },
        {
          selector: 'edge.meta',
          style: {
            width: 2,
            'line-color': 'red',
          },
        },
        {
          selector: 'edge.bezier',
          style: {
            'curve-style': 'bezier',
            'control-point-step-size': 40,
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
    const El = React.createElement(Node, {}, 'click')
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
      ur.do('collapseAll') // cy.collapseAll(options);
      cy.layout({ name: 'dagre', ...dagreOpts }).run()
    })

    document.getElementById('expandAll')?.addEventListener('click', function () {
      ur.do('expandAll')
      cy.layout({ name: 'dagre', ...dagreOpts }).run()
    })

    document.addEventListener(
      'keydown',
      function (e) {
        // @ts-ignore
        if (e.ctrlKey && e.which == '90') {
          // @ts-ignore
          cy.undoRedo().undo()
          // @ts-ignore
        } else if (e.ctrlKey && e.which == '89') {
          // @ts-ignore
          cy.undoRedo().redo()
        }
        if (e.key == 'Delete') {
          cy.remove(cy.$(':selected'))
        }
      },
      true
    )

    cy.layout({ name: 'dagre', ...dagreOpts }).run()
  }, [ref.current])

  return (
    <>
      <div
        ref={ref}
        id="cy"
        style={{
          width: '1400px',
          height: '1000px',
        }}
      ></div>
    </>
  )
}

export default Cyt
