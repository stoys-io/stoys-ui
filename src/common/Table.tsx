import React from 'react'
import AntdTable from 'antd/lib/table'

import ProfilerSummary from '../profilerSummary'

const Table = ({ data, summary }: { data: any; summary: any }) => {
  const render = (value: any) => {
    if (typeof value === 'object') {
      return <ProfilerSummary data={value} config={{ height: 80 }} />
    }

    return value
  }

  const columns = [
    {
      title: 'VendorID',
      dataIndex: 'VendorID',
      key: 'VendorID',
      render,
    },
    {
      title: 'tpep_pickup_datetime',
      dataIndex: 'tpep_pickup_datetime',
      key: 'tpep_pickup_datetime',
      render,
    },
    {
      title: 'passengers',
      dataIndex: 'passengers',
      key: 'passengers',
      render,
    },
  ]
  const _summary = summary.reduce(
    (s: any, item: any) => {
      s[item.name] = item

      return s
    },
    { key: 'summary' }
  )
  const _data = [_summary, ...data]

  return <AntdTable dataSource={_data} columns={columns} pagination={false} />
}

export default Table
