export const getMargin = (showAxes: boolean, showXAxis: boolean, showYAxis: boolean) => ({
  left: showAxes || showYAxis ? 20 : 2,
  right: 2,
  top: 2,
  bottom: showAxes || showXAxis ? 20 : 2,
})
