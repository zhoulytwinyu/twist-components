import { connect } from "react-redux";
// Components
import BloodPressurePlotBundle from "../components/PlotBundles/BloodPressurePlotBundle";
// Actions
import {changeTopLevelPlot} from "../actions/plot-actions";
// Data
import {DBP,MBP,SBP} from "./test-data/bloodPressures"

const mapStateToProps = function (state,ownProps) {
  return {
    minX: state.plot.onPlotXRangeSelection_StartX || 1482858000,
    maxX: state.plot.onPlotXRangeSelection_EndX || 1502858000,
    DBP: DBP,
    MBP: MBP,
    SBP: SBP,
    verticalCrosshair_X: state.plot.verticalCrosshair_X,
    ...ownProps
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    changeHandler: (obj) => dispatch(changeTopLevelPlot(obj))
  };
};

const BloodPressurePlotBundleConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(BloodPressurePlotBundle);

export default BloodPressurePlotBundleConnector;
