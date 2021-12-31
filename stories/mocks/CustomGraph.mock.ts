const mock = {
  nodes: [
    {
      id: 'test 1',
      position: { x: 10, y: 100 },
      data: { label: 'test 1' },
    },
    {
      id: 'test 2',
      position: {
        x: 150,
        y: 10,
      },
      data: { label: 'test 2' },
    },
    {
      id: 'test 3',
      position: { x: 230, y: 70 },
      data: { label: 'test 3' },
    },
    {
      id: 'test 4',
      position: { x: 500, y: 300 },
      data: { label: 'test 4' },
      groupId: 'common',
    },
    {
      id: 'test 5',
      position: { x: 400, y: 440 },
      data: { label: 'test 5' },
      rootId: 'test 4',
      groupId: 'common',
    },
    {
      id: 'test 6',
      position: { x: 280, y: 330 },
      data: { label: 'test 6' },
      rootId: 'test 4',
      groupId: 'common',
    },
  ],
  edges: [
    { id: '2-1', source: 'test 2', target: 'test 1' },
    { id: '3-1', source: 'test 3', target: 'test 1' },
    { id: '4-3', source: 'test 4', target: 'test 3' },

    { id: '4-5', source: 'test 4', target: 'test 5' },
    { id: '4-6', source: 'test 4', target: 'test 6' },
    { id: '5-3', source: 'test 5', target: 'test 3' },
  ],
}

export default mock
