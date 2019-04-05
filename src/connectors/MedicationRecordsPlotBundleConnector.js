import { connect } from "react-redux";
// Components
import MedicationRecordsPlotBundle from "../components/PlotBundles/MedicationRecordsPlotBundle";
// Actions
import {changeTopLevelPlot} from "../actions/plot-actions";
// Data
import {medications,categoryStructure} from "./test-data/medication";

const mapStateToProps = function (state,ownProps) {
  return {
    minX: state.plot.onPlotXRangeSelection_StartX || 1482858000,
    maxX: state.plot.onPlotXRangeSelection_EndX || 1502858000,
    verticalCrosshair_X: state.plot.verticalCrosshair_X,
    medications,
    categoryStructure,
    ...ownProps
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    changeHandler: (obj) => dispatch(changeTopLevelPlot(obj))
  };
};

const MedicationRecordsPlotBundleConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(MedicationRecordsPlotBundle);

export default MedicationRecordsPlotBundleConnector;
