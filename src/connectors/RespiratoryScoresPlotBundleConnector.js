import { connect } from "react-redux";
import { changeTopLevelPlot } from "../actions/plot-actions";
import RespPlotBundle from "../components/PlotBundles/RespiratoryScoresPlotBundle";

// Fake data
import anesthetics from "./test-data/anesthetics";
import iNO from "./test-data/iNO";
import locations from "./test-data/location";
import procedures from "./test-data/procedure";
import respiratoryScores from "./test-data/respiratoryScore";
import respiratoryVariables from "./test-data/respiratoryVariables";

const mapStateToProps = function (state,ownProps) {
  return {
    minX: state.plot.minX,
    maxX: state.plot.maxX,
    verticalCrosshair_X: state.plot.verticalCrosshair_X,
    onPlotXRangeSelection_StartX: state.plot.onPlotXRangeSelection_StartX || 1482858000,
    onPlotXRangeSelection_EndX: state.plot.onPlotXRangeSelection_EndX || 1502858000,
    anesthetics,
    iNO,
    locations,
    procedures,
    respiratoryScores,
    respiratoryVariables,
    ...ownProps
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    changeHandler: (obj) => dispatch(changeTopLevelPlot(obj))
  };
};

const RespPlotBundleConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(RespPlotBundle);

export default RespPlotBundleConnector

