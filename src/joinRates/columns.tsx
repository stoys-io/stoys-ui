export const getJoinRatesColumns = (columns: Array<string>) =>
  columns.map(column => {
    return {
      id: column,
      title: column,
      dataIndex: column,
      render: (data: any) => {
        if (data && column === 'Table names') {
          return data.join(', ')
        }
        return data
      },
    }
  })
