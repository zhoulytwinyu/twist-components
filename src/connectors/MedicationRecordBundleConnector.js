import React, { PureComponent } from "react";
import { connect } from "react-redux";

// Components
import {changeTopLevelPlot} from "../actions/plot-actions";
import MedicationRecordsDynamicGroupingProvider from "../components/MedicationRecordsPlot/MedicationRecordsDynamicGroupingProvider";
import MedicationRecordsDynamicGroupingPlot from "../components/MedicationRecordsPlot/MedicationRecordsDynamicGroupingPlot";
import MedicationRecordsDynamicYAxisTwoLevelPanel from "../components/MedicationRecordsPlot/MedicationRecordsDynamicYAxisTwoLevelPanel";
import MedicationRecordsPlotHorizontalSlabGrid from "../components/MedicationRecordsPlot/MedicationRecordsPlotHorizontalSlabGrid";
//
import DynamicDateYAxisTwoLevelPanel from "../components/DateXAxis/DynamicDateYAxisTwoLevelPanel";
import DateXAxis from "../components/DateXAxis/DateXAxis";
import DateVerticalGridLines from "../components/DateXAxis/DateVerticalGridLines";
//
import GradientOverlay from "../components/UtilityComponents/GradientOverlay";
// CSS
import "./plot.css";

import {medications,
        categoryStructure} from "./test-data/medication";

const X1AXIS_HEIGHT = 40;
const XAXIS_HEIGHT = 0;
const YAXIS_WIDTH = 150;
const Y1AXIS_WIDTH = 0;
const ROW_HEIGHT = 40;

class MedicationRecordBundle extends PureComponent {
  render() {
    let { minX,maxX,
          verticalCrosshair_X,
          width,
          panningX,
          } = this.props;
    let { changeHandler } = this.props;
    let plotWidth = width-YAXIS_WIDTH;
    return (
      <MedicationRecordsDynamicGroupingProvider medicationRecords={medications}
                                                categoryStructure={categoryStructure}
                                                minX={minX} maxX={maxX}
                                                rowHeight={ROW_HEIGHT}
                                                render={(groupedMedicationRecords,useMedications,plotHeight)=>
        <div style={{position:"relative",width:width,height:plotHeight+X1AXIS_HEIGHT+XAXIS_HEIGHT}}>
          {/*  X1 Axis  */}
          <div style={{position:"absolute",width:YAXIS_WIDTH,height:X1AXIS_HEIGHT,left:0,top:0}}>
            <DynamicDateYAxisTwoLevelPanel  className="fillParent"
                                            minX={minX} maxX={maxX}
                                            width={YAXIS_WIDTH} height={X1AXIS_HEIGHT}
                                            />
          </div>
          <div style={{position:"absolute",width:plotWidth,height:X1AXIS_HEIGHT,left:YAXIS_WIDTH,top:0}}>
            <DateXAxis  className="fillParent"
                        minX={minX} maxX={maxX}
                        height={X1AXIS_HEIGHT} width={plotWidth}
                        position={"x1"}
                        />
          </div>
          <div style={{position:"absolute",width:YAXIS_WIDTH,height:plotHeight,left:0,top:X1AXIS_HEIGHT}}>
            <MedicationRecordsDynamicYAxisTwoLevelPanel categoryStructure={categoryStructure}
                                                        useMedications={useMedications}
                                                        rowHeight={ROW_HEIGHT}
                                                        width={YAXIS_WIDTH}
                                                        height={plotHeight}
                                                        />
          </div>
          <div style={{position:"absolute",width:plotWidth,height:plotHeight,left:YAXIS_WIDTH,top:X1AXIS_HEIGHT}}>
            <MedicationRecordsPlotHorizontalSlabGrid  className="fillParent"
                                                      height={plotHeight} rowHeight={ROW_HEIGHT}
                                                      />
            <DateVerticalGridLines  className="fillParent"
                                    minX={minX} maxX={maxX} width={plotWidth}
                                    />
            <MedicationRecordsDynamicGroupingPlot className="fillParent"
                                                  medicationRecords={groupedMedicationRecords}
                                                  categoryStructure={categoryStructure}
                                                  useMedications={useMedications}
                                                  rowHeight={ROW_HEIGHT}
                                                  minX={minX} maxX={maxX}
                                                  width={plotWidth} height={plotHeight}
                                                  />
          </div>
          {/* Other decorations*/}
          <GradientOverlay  style={{position:"absolute",width:10,height:plotHeight+XAXIS_HEIGHT+X1AXIS_HEIGHT,left:YAXIS_WIDTH,top:0}}/>
        </div>
      }/>
    );
  }
}

const mapStateToProps = function (state,ownProps) {
  return {
    minX: state.plot.minX,
    maxX: state.plot.maxX,
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
