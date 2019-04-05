export function generateGridLayoutStyle(width,height,
                                        yAxisWidth,plotWidth,y2AxisWidth,
                                        x2AxisHeight,plotHeight,xAxisHeight) {
  return {display:"grid",
          height:height,
          width:width,
          gridGap:0,
          gridTemplateColumns:`${yAxisWidth}px ${plotWidth}px ${y2AxisWidth}px`,
          gridTemplateRows:`${x2AxisHeight}px ${plotHeight}px ${xAxisHeight}px`,
          position:"relative"
          };
}
