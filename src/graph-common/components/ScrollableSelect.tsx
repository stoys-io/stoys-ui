import React, { useState } from 'react'
import Select, { SelectValue } from 'antd/lib/select'

const ScrollableSelect = <T extends SelectValue>({
  placeholder,
  value,
  filterOption,
  onChange,
  options,
}: Props<T>) => {
  const [isOpen, setIsOpen] = useState(false)

  const lengthOptions = options.length
  const curIndex = options.findIndex(option => option.value === value)

  const wheel = (evt: React.WheelEvent) => {
    if (isWheelUp(evt)) {
      if (curIndex === 0) {
        return
      }

      return onChange(options[curIndex - 1].value as T)
    }

    if (curIndex === lengthOptions - 1) {
      return
    }

    return onChange(options[curIndex + 1].value as T)
  }

  const wheelFn = withThreshold(wheel, isWheelUp, scrollRate)
  const onWheel = (evt: React.WheelEvent) => {
    // Prevent wheel on open dropdown
    if (!isOpen) {
      wheelFn(evt)
    }
  }

  return (
    <div onWheel={onWheel}>
      <Select<T>
        showSearch
        placeholder={placeholder}
        options={options}
        onChange={onChange}
        filterOption={filterOption}
        value={value}
        defaultValue={value}
        style={style}
        onDropdownVisibleChange={setIsOpen}
      />
    </div>
  )
}

export default ScrollableSelect

// Slow down the scrollwheel
// Fire `fn`` only after `threshold` number of calls. `resetCondFn` to check they are the same
const withThreshold = <X, Y>(
  fn: (arg: X) => Y,
  resetCondFn: (arg: X) => boolean,
  threshold: number
) => {
  let prevCond: boolean | null = null
  let count = 0

  return (arg: X) => {
    const newCond = resetCondFn(arg)
    if (prevCond !== newCond) {
      prevCond = newCond
      count = 0

      return
    }

    prevCond = newCond
    count = count + 1

    if (count < threshold) {
      return
    }

    prevCond = null
    count = 0

    return fn(arg)
  }
}

const isWheelUp = (evt: React.WheelEvent) => evt.deltaY < 0
const scrollRate = 3
const style = { width: '100%' }

interface Props<T> {
  options: Opt[]
  onChange: (value: T) => void
  value: T
  placeholder: string
  filterOption: any // can't infer Select type properly
}

interface Opt {
  // ideally this should have been Opt<T> { value: T; ... }
  value: string
  label: string
}
