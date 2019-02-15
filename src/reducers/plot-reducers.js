import { CHANGE_TOP_LEVEL_PLOT } from "../actions/plot-actions";

let initialState = {
  minX:0,
  maxX:18000,
  minY:0,
  maxY:400,
  VerticalCrosshair_X:null,
}

export function plot(state=initialState,action) {
  if (action.type===CHANGE_TOP_LEVEL_PLOT) {
    state = {...state,...action.payload};
  }
  return state;
}
