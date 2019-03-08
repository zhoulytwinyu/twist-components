import React, { PureComponent } from "react";
import { connect } from "react-redux";

// Components
import {changeTopLevelPlot} from "../actions/plot-actions";
import MedicationRecordPlot from "../components/MedicationRecordPlot";
import MedicationRecordModifier from "../components/MedicationRecordModifier";
import MedicationRecordYAxisTwoLevelPanel from "../components/MedicationRecordYAxisTwoLevelPanel";
import InPlotXRangeSelection from "../components/InPlotXRangeSelection";
import HoverInteractionBoxWithReference from "../components/InteractionBox/HoverInteractionBoxWithReference";
import TriPhaseInteractionBoxWithReference from "../components/InteractionBox/TriPhaseInteractionBoxWithReference";
import {medications,
        categoryStructure} from "./test-data/medication";
        
class MedicationRecordBundle extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {height:0,
                  useMedications:null,
                  modifiedMedicationRecords:null,
                  };
    this.setState = this.setState.bind(this);
  }
  
  render() {
    let { minX,maxX,
          verticalCrosshair_X,
          width,
          panningX,
          } = this.props;
    let {height,useMedications,modifiedMedicationRecords} = this.state;
    let {LEFT,ROW_HEIGHT} = this;
    let { changeHandler } = this.props;
    return (
      <>
        <MedicationRecordModifier medicationRecords={medications}
                                  categoryStructure={categoryStructure}
                                  rowHeight = {ROW_HEIGHT}
                                  minX={minX} maxX={maxX}
                                  updateHandler={this.setState}
                                  />
        <div style={{position:"relative", width:width+LEFT, height:height, border:"black 1px solid"}} onMouseDown={this.props.onMouseDown}>
          <div style={{ position:"absolute",width:LEFT,height:height}}>
            { useMedications!==null ?
              <MedicationRecordYAxisTwoLevelPanel categoryStructure={categoryStructure}
                                                  useMedications={useMedications}
                                                  width={150} height={height} rowHeight={ROW_HEIGHT}
                                                  /> :
              null
            }
          </div>
          <div style={{ position:"absolute",width:width,height:height,left:LEFT}}>
            { useMedications!==null  ?
              <MedicationRecordPlot medicationRecords={modifiedMedicationRecords}
                                    categoryStructure={categoryStructure}
                                    useMedications={useMedications}
                                    rowHeight={ROW_HEIGHT}
                                    minX={minX} maxX={maxX}
                                    width={width} height={height} 
                                    /> :
              null
            }
          </div>
          {/*
          <HoverInteractionBoxWithReference style={{position:"absolute",width:width,height:height,left:LEFT}}
                                              minX={minX} maxX={maxX} width={width}
                                              minY={1} maxY={0} height={height}
                                              hoveringHandler={this.hoveringHandler} mouseOutHandler={this.mouseOutHandler}
                                              >
            <TriPhaseInteractionBoxWithReference style={{position:"absolute",width:width,height:height}}
                                                  minX={minX} maxX={maxX} width={width}
                                                  minY={1} maxY={0} height={height}
                                                  clickedHandler={console.log}
                                                  doubleClickHandler={console.log}
                                                  selectingHandler={console.log} selectedHandler={console.log}
                                                  panningHandler={console.log} pannedHandler={console.log}
                                                  >
            </TriPhaseInteractionBoxWithReference>
          </HoverInteractionBoxWithReference>
          */}
        </div>
      </>
    );
  }
}

MedicationRecordBundle.prototype.LEFT = 150;
MedicationRecordBundle.prototype.ROW_HEIGHT = 40;

const mapStateToProps = function (state,ownProps) {
  return {
    minX: state.plot.minX-state.plot.panningX,
    maxX: state.plot.maxX-state.plot.panningX,
    verticalCrosshair_X: state.plot.verticalCrosshair_X,
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
