import React, { useEffect, useRef } from 'react'
import Select, { SelectValue } from 'antd/lib/select'
import debounce from 'lodash.debounce'

const ScrollableSelect = <T extends SelectValue>({
  placeholder,
  value,
  filterOption,
  onChange,
  options,
}: Props<T>) => {
  const ref = useRef<HTMLDivElement>(null)
  const lengthOptions = options.length
  const curIndex = options.findIndex(option => option.value === value)

  console.log({ lengthOptions, curIndex, value })

  const onScroll = debounce(
    (event: WheelEvent) => {
      if (!isScrollDown(event)) {
        if (curIndex === 0) {
          return
        }

        return onChange(options[curIndex - 1].value as T)
      }

      if (curIndex === lengthOptions - 1) {
        return
      }

      return onChange(options[curIndex + 1].value as T)
    },
    delay,
    { leading: true }
  )

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.addEventListener('wheel', onScroll)
    }

    return () => ref?.current?.removeEventListener('wheel', onScroll)
  }, [ref.current, value, options])

  return (
    <div ref={ref}>
      <Select<T>
        showSearch
        placeholder={placeholder}
        options={options}
        onChange={onChange}
        filterOption={filterOption}
        value={value}
        defaultValue={value}
      />
    </div>
  )
}

const delay = 250

interface Props<T> {
  options: Opt[]
  onChange: (value: T) => void
  value: T
  placeholder: string
  filterOption: any
}

interface Opt {
  value: string
  label: string
}

export { ScrollableSelect }

// TODO: Fix
const isScrollDown = (e: any) => {
  if (e.wheelDelta) {
    return e.wheelDelta > 0
  }

  return e.deltaY < 0
}
