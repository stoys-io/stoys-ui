import React from 'react'
import AntdTable from 'antd/lib/table'

import ProfilerSummary from '../profilerSummary'

const Table = ({ data, profiler }: { data: any; profiler: any }) => {
  const render = (value: any) => {
    if (typeof value === 'object') {
      return <ProfilerSummary data={value} config={{ height: 80 }} />
    }

    return value
  }

  const columns = data.columns.map((item: { name: string }) => {
    return {
      title: item.name,
      dataIndex: item.name,
      key: item.name,
      render,
    }
  })

  const dataSource = data.row_sample.map((item: any) => {
    return item.row.reduce(
      (acc: any, row: string, index: number) => {
        acc[columns[index].key] = row

        return acc
      },
      { key: Math.random() }
    )
  })

  const _summary = profiler.columns.reduce(
    (s: any, item: any) => {
      s[item.name] = item

      return s
    },
    { key: 'summary' }
  )
  const _data = [_summary, ...dataSource]

  return <AntdTable dataSource={_data} columns={columns} pagination={false} />
}

export default Table
