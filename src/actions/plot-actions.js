export const CHANGE_TOP_LEVEL_PLOT = 'CHANGE_TOP_LEVEL_PLOT'

export function changeTopLevelPlot(changes) {
  return {type:CHANGE_TOP_LEVEL_PLOT,
          payload: changes}
}
