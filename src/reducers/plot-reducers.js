import { CHANGE_TOP_LEVEL_PLOT } from "../actions/plot-actions";

let initialState = {
  minX:0,
  maxX:1,
  minY:0,
  maxY:400
}

export function plot(state=initialState,action) {
  if (action.type===CHANGE_TOP_LEVEL_PLOT) {
    state = {...state,...action.payload};
  }
  return state;
}

