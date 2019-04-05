import React, {Component} from "react";
import { connect } from "react-redux";
import {changeTopLevelPlot} from "../actions/plot-actions";

class GraphController extends Component {
  constructor(props) {
    super(props);
    this.handleXChange = this.handleXChange.bind(this);
    this.handleSelectorMinXChange = this.handleSelectorMinXChange.bind(this);
    this.handleSelectorMaxXChange = this.handleSelectorMaxXChange.bind(this);
    this.handleYChange = this.handleYChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }
  
  render() {
    let { maxX,maxY,text,
          onPlotXRangeSelection_StartDataX,
          onPlotXRangeSelection_EndDataX,
          onPlotXRangeSelection_LeftDeltaDataX,
          onPlotXRangeSelection_RightDeltaDataX,
          hoverX,hoverY} = this.props;
    let {hoverSelection} = this.props;
    return (
      <>
        <p>X</p> <input type="range" min={1000} max={180000} value={maxX} step={1000} onChange={this.handleXChange}/>
        <p>onPlotXRangeSelection_StartDataX</p> <input type="range" min={0} max={onPlotXRangeSelection_EndDataX+onPlotXRangeSelection_RightDeltaDataX} value={onPlotXRangeSelection_StartDataX+onPlotXRangeSelection_LeftDeltaDataX} step={1000} onChange={this.handleSelectorMinXChange}/>
        <p>onPlotXRangeSelection_EndDataX</p> <input type="range" min={onPlotXRangeSelection_StartDataX+onPlotXRangeSelection_LeftDeltaDataX} max={240000} value={onPlotXRangeSelection_EndDataX+onPlotXRangeSelection_RightDeltaDataX} step={1000} onChange={this.handleSelectorMaxXChange}/>
        <p>Y</p> <input type="range" min={0} max={1000} value={maxY} step={10} onChange={this.handleYChange}/>
        <p>Text</p> <input type="text" value={hoverX===null ? '' : hoverX} onChange={this.handleTextChange}/>
      </>
    );
  }
  
  handleXChange (ev) {
    let maxX = parseFloat(ev.target.value);
    this.props.changeHandler({maxX});
  }
  
  handleSelectorMinXChange (ev) {
    let onPlotXRangeSelection_StartDataX = parseFloat(ev.target.value);
    this.props.changeHandler({onPlotXRangeSelection_StartDataX});
  }
  
  handleSelectorMaxXChange (ev) {
    let onPlotXRangeSelection_EndDataX = parseFloat(ev.target.value);
    this.props.changeHandler({onPlotXRangeSelection_EndDataX});
  }

  handleYChange (ev) {
    let maxY = parseFloat(ev.target.value);
    this.props.changeHandler({maxY});
  }
  
  handleTextChange (ev) {
    let text = ev.target.value;
    this.props.changeHandler({text});
  }
}

const mapStateToProps = function (state,ownProps) {
  return {
    minX: state.plot.minX,
    maxX: state.plot.maxX,
    minY: state.plot.minY,
    maxY: state.plot.maxY,
    onPlotXRangeSelection_StartDataX: state.plot.onPlotXRangeSelection_StartDataX || null,
    onPlotXRangeSelection_EndDataX: state.plot.onPlotXRangeSelection_EndDataX || null,
    onPlotXRangeSelection_LeftDeltaDataX: state.plot.onPlotXRangeSelection_LeftDeltaDataX || 0,
    onPlotXRangeSelection_RightDeltaDataX: state.plot.onPlotXRangeSelection_RightDeltaDataX || 0,
    hoverX: state.plot.hoverX,
    hoverY: state.plot.hoverY,
    hoverSelection: state.plot.hoverSelection,
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
