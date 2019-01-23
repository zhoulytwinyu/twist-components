import React, { Component } from "react";
import { connect } from "react-redux";
//~ import InteractionBox from "../components/InteractionBox";
//~ import VerticalCrosshair from "../components/VerticalCrosshair";
import {changeTopLevelPlot} from "../actions/plot-actions";
import MedicationRecord from "../components/MedicationRecord";
import {medication,
        medCategory,
        categoryOrder} from "./test-data/medication";

class MedicationRecordBundle extends Component {
  constructor(props){
    super(props);
    this.state = {
      height:null
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
      <div style={{position:"relative", width:width, height:height}}>
        <MedicationRecord data={medication} useMeds={["","","",""]} medCategory={medCategory} categoryOrder={categoryOrder}
                          minX={minX} maxX={maxX} width={1000} left={0} top={0}
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