import React, { useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import cytoscape from 'cytoscape'

// @ts-ignore
import cytoscapeDomNode from 'cytoscape-dom-node'

const Cyt = () => {
  const ref = useRef(null)

  useEffect(() => {
    console.log(ref)
    if (!ref.current) {
      return
    }

    cytoscape.warnings(true)
    cytoscape.use(cytoscapeDomNode)

    const cy = cytoscape({
      container: ref.current, //document.getElementById('cy'), // container to render in

      elements: [
        { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
        { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
        { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } },
      ],

      layout: {
        name: 'grid',
      },
    })

    // @ts-ignore
    cy.domNode()

    const div = document.createElement('div')
    div.id = 'test'

    cy.add({
      data: {
        id: 'three',
        dom: div,
      },
    })

    const El = React.createElement('button', { onClick: console.log }, 'click')
    ReactDOM.render(El, document.getElementById('test'))
  }, [ref.current])

  return (
    <>
      <h3>testtt</h3>
      <div ref={ref} id="cy" style={{ zIndex: 999, width: '80vw', height: '80vh' }}></div>
    </>
  )
}

export default Cyt
