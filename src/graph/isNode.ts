import { Edge, Node } from '../graph-common/model'

export const isNode = (el: Edge | Node): el is Node => el.type === 'dagNode'
