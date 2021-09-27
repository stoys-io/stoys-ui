import { Graph, IG6GraphEvent, INode, IShape } from '@antv/g6'
export type ShapeEventListner = (
  event: IG6GraphEvent,
  node: INode | null,
  shape: IShape,
  graph: Graph
) => void

const propsToEventMap = {
  click: 'onClick',
  dbclick: 'onDBClick',
  mouseenter: 'onMouseEnter',
  mousemove: 'onMouseMove',
  mouseout: 'onMouseOut',
  mouseover: 'onMouseOver',
  mouseleave: 'onMouseLeave',
  mousedown: 'onMouseDown',
  mouseup: 'onMouseUp',
  dragstart: 'onDragStart',
  drag: 'onDrag',
  dragend: 'onDragEnd',
  dragenter: 'onDragEnter',
  dragleave: 'onDragLeave',
  dragover: 'onDragOver',
  drop: 'onDrop',
  contextmenu: 'onContextMenu',
}

export function appendAutoShapeListener(graph: Graph) {
  Object.entries(propsToEventMap).map(([eventName, propName]) => {
    graph.on(`node:${eventName}`, evt => {
      const shape = evt.shape
      const item = evt.item as INode
      const graph = evt.currentTarget as Graph
      const func = shape?.get(propName) as ShapeEventListner
      if (func) {
        func(evt, item, shape, graph)
      }
    })
  })
}
