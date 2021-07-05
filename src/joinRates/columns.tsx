export const getJoinRatesColumns = (columns: Array<string>) =>
  columns.map(column => {
    return {
      id: column,
      title: column,
      dataIndex: column,
      render: (data: any) => {
        if (column === 'table_names') {
          return data.join(', ')
        }
        return data
      },
    }
  })
