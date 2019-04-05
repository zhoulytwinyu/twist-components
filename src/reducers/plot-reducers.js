import { CHANGE_TOP_LEVEL_PLOT } from "../actions/plot-actions";

let initialState = {
  minX:1482858000,
  maxX:1513698300,
  VerticalCrosshair_X:null,
}

export function plot(state=initialState,action) {
  if (action.type===CHANGE_TOP_LEVEL_PLOT) {
    state = {...state,...action.payload};
  }
  return state;
}
