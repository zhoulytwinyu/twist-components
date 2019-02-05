import React, { Component } from "react";
import { connect } from "react-redux";
//~ import InteractionBox from "../components/InteractionBox";
//~ import VerticalCrosshair from "../components/VerticalCrosshair";
import {changeTopLevelPlot} from "../actions/plot-actions";
import MedicationRecord from "../components/MedicationRecord";
import YCategoricalPanel from "../components/YCategoricalPanel";
import FourPhaseInteractionHOC from "../components/InteractionHOC/FourPhaseInteractionHOC";
import {medication,
        medCategory,
        useMeds,
        categoryOrder} from "./test-data/medication";

const categoryColors = ["yellow","cyan"];
const subcategoryColors = ["red","blue"];

class MedicationRecordBundle extends Component {
  constructor(props){
    super(props);
    this.state = {
      height:0,
      categoryPosition:[],
      subcategoryPosition:[]
    }
    this.setState = this.setState.bind(this);
  }
  
  render() {
    let { minX,maxX,
          hoverX,
          width
          } = this.props;
    let {height,categoryPosition,subcategoryPosition} = this.state;
    let {LEFT} = this;
    let { changeHandler } = this.props;
    return (
      <div style={{position:"relative", width:width+LEFT, height:height, border:"black 1px solid"}} onMouseDown={this.props.onMouseDown}>
        <YCategoricalPanel  categoryPosition={categoryPosition} subcategoryPosition={subcategoryPosition}
                            categoryColors={categoryColors} subcategoryColors={subcategoryColors}
                            width={LEFT} height={height} rowHeight={30} left={0} top={0} />
        <FourPhaseInteractionHOC Component={MedicationRecord} data={medication} useMeds={useMeds} medCategory={medCategory} categoryOrder={categoryOrder}
                          minX={minX} maxX={maxX} width={1000} left={LEFT} top={0} rowHeight={30}
                          updateHeightHandler={this.setState}
                          updatePanelHandler={this.setState}
                          clickHandler={console.log}
                          hoveringHandler={console.log} mouseOutHandler={console.log}
                          selectingHandler={console.log} selectedHandler={console.log}
                          panningHandler={console.log} pannedHandler={console.log}
                          />
      </div>
    );
  }
}

MedicationRecordBundle.prototype.LEFT = 150;

const mapStateToProps = function (state,ownProps) {
  return {
    minX: state.plot.minX,
    maxX: state.plot.maxX,
    hoverX: state.plot.hoverX,
    ...ownProps
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    changeHandler: (obj) => dispatch(changeTopLevelPlot(obj))
  };
};

const MedicationRecordBundleConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(MedicationRecordBundle);

export default MedicationRecordBundleConnector;
