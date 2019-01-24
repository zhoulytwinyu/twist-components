import React, { Component } from "react";
import { connect } from "react-redux";
//~ import InteractionBox from "../components/InteractionBox";
//~ import VerticalCrosshair from "../components/VerticalCrosshair";
import {changeTopLevelPlot} from "../actions/plot-actions";
import MedicationRecord from "../components/MedicationRecord";
import {medication,
        medCategory,
        useMeds,
        categoryOrder} from "./test-data/medication";

class MedicationRecordBundle extends Component {
  constructor(props){
    super(props);
    this.state = {
      height:0
    }
    this.setState=this.setState.bind(this);
  }
  
  render() {
    let { minX,maxX,
          hoverX,
          width
          } = this.props;
    let {height} = this.state;
    let { changeHandler } = this.props;
    let {LEFT,TOP,RIGHT,BOTTOM} = this;
    return (
      <div style={{position:"relative", width:width, height:height, backgroundColor:"red"}}>
        <MedicationRecord data={medication} useMeds={useMeds} medCategory={medCategory} categoryOrder={categoryOrder}
                          minX={minX} maxX={maxX} width={1000} height={height} left={left} top={30}
                          updateHeightHandler={this.setState} />
      </div>
    );
  }
}

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

export default MedicationRecordBundleConnector
