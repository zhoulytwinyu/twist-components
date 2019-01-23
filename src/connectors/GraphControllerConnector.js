import { connect } from "react-redux";
import GraphController from "../components/GraphController";
import {changeTopLevelPlot} from "../actions/plot-actions";

const mapStateToProps = function (state,ownProps) {
  return {
    minX: state.plot.minX,
    maxX: state.plot.maxX,
    minY: state.plot.minY,
    maxY: state.plot.maxY,
    hoverX: state.plot.hoverX,
    hoverY: state.plot.hoverY,
    ...ownProps
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    changeHandler: (obj) => dispatch(changeTopLevelPlot(obj))
  };
};

const GraphControllerConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphController);

export default GraphControllerConnector;
