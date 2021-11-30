// @ts-nocheck
class CytoscapeDomNode {
  constructor(cy, params = {}) {
    this._cy = cy
    this._params = params
    this._node_dom = {}

    if (params.dom_container) {
      this._nodes_dom_container = params.dom_container
    } else {
      let nodes_dom_container = document.createElement('div')
      nodes_dom_container.style.position = 'absolute'
      nodes_dom_container.style.zIndex = 10

      const actualContainer = document.getElementById('domContainer')
      actualContainer.appendChild(nodes_dom_container)

      this._nodes_dom_container = nodes_dom_container
    }

    this._resize_observer = new ResizeObserver(entries => {
      for (let e of entries) {
        let node_div = e.target
        let id = node_div.__cy_id
        let n = cy.getElementById(id)
        n.style({ width: node_div.offsetWidth, height: node_div.offsetHeight })
      }
    })

    cy.on('add', 'node', ev => {
      this._add_node(ev.target)
    })

    for (let n of cy.nodes()) this._add_node(n)

    cy.on('pan zoom', ev => {
      let pan = cy.pan()
      let zoom = cy.zoom()

      let transform = 'translate(' + pan.x + 'px,' + pan.y + 'px) scale(' + zoom + ')'
      this._nodes_dom_container.style.msTransform = transform
      this._nodes_dom_container.style.transform = transform
    })

    cy.on('position bounds', 'node', ev => {
      let cy_node = ev.target
      let id = cy_node.id()

      if (!this._node_dom[id]) return

      let dom = this._node_dom[id]

      let style_transform = `translate(-50%, -50%) translate(${cy_node
        .position('x')
        .toFixed(2)}px, ${cy_node.position('y').toFixed(2)}px)`
      dom.style.webkitTransform = style_transform
      dom.style.msTransform = style_transform
      dom.style.transform = style_transform

      dom.style.display = 'inline'
      dom.style.position = 'absolute'
      dom.style['z-index'] = 999999
    })

    cy.nodes().on('expandcollapse.beforecollapse', ev => {
      const id = ev.target.data.id

      if (this._params.destroyRecur) {
        this._params.destroyRecur(id)
      }
    })
  }

  _remove_node(n) {
    const data = n.data()
    if (!data.dom) {
      return
    }

    this._nodes_dom_container.removeChild(data.dom)
    this._node_dom[n.id()] = undefined
  }

  _add_node(n) {
    let data = n.data()

    if (!data.dom) {
      return
    }

    this._nodes_dom_container.appendChild(data.dom)
    data.dom.__cy_id = n.id()

    this._node_dom[n.id()] = data.dom

    this._resize_observer.observe(data.dom)
  }

  node_dom(id) {
    return this._node_dom[id]
  }
}

function register(cy) {
  if (!cy) {
    return undefined
  }

  cy('core', 'domNode', function (params, opts) {
    return new CytoscapeDomNode(this, params, opts)
  })
}

export default register
