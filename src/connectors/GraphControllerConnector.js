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
    let {maxX,maxY,text,selectorMinX,selectorMaxX} = this.props;
    let {hoverSelection} = this.props;
    return (
      <>
        <p>X</p> <input type="range" min={1000} max={180000} value={maxX} step={1000} onChange={this.handleXChange}/>
        <p>selectorMinX</p> <input type="range" min={0} max={180000} value={selectorMinX} step={1000} onChange={this.handleSelectorMinXChange}/>
        <p>selectorMaxX</p> <input type="range" min={selectorMinX} max={180000} value={selectorMaxX} step={1000} onChange={this.handleSelectorMaxXChange}/>
        <p>Y</p> <input type="range" min={0} max={1000} value={maxY} step={10} onChange={this.handleYChange}/>
        <p>Text</p> <input type="text" value={JSON.stringify(hoverSelection)} onChange={this.handleTextChange}/>
      </>
    );
  }
  
  handleXChange (ev) {
    let maxX = parseFloat(ev.target.value);
    this.props.changeHandler({maxX});
  }
  
  handleSelectorMinXChange (ev) {
    let selectorMinX = parseFloat(ev.target.value);
    this.props.changeHandler({selectorMinX});
  }
  
  handleSelectorMaxXChange (ev) {
    let selectorMaxX = parseFloat(ev.target.value);
    this.props.changeHandler({selectorMaxX});
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
    selectorMinX: state.plot.selectorMinX,
    selectorMaxX: state.plot.selectorMaxX,
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
