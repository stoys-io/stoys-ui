export const getMargin = (showAxes: boolean, showXAxis: boolean, showYAxis: boolean) => ({
  left: showAxes || showYAxis ? 25 : 2,
  right: showAxes || showYAxis ? 25 : 2,
  top: showAxes || showXAxis ? 25 : 2,
  bottom: showAxes || showXAxis ? 25 : 2,
})
