import React, { PureComponent } from "react";
import { connect } from "react-redux";

// Components
import {changeTopLevelPlot} from "../actions/plot-actions";
import MedicationRecordsDynamicYAxisTwoLevelPanel from "../components/MedicationRecordsPlot/MedicationRecordsDynamicYAxisTwoLevelPanel";
import MedicationRecordsPlotHorizontalSlabGrid from "../components/MedicationRecordsPlot/MedicationRecordsPlotHorizontalSlabGrid";
import MedicationRecordsGroupingProvider from "../components/MedicationRecordsPlot/MedicationRecordsGroupingProvider"
import MedicationRecordsMedicationsInUseProvider from "../components/MedicationRecordsPlot/MedicationRecordsMedicationsInUseProvider"
import MedicationRecordsProvider from "../components/MedicationRecordsPlot/MedicationRecordsProvider"
import MedicationRecordsDynamicGroupedPlot from "../components/MedicationRecordsPlot/MedicationRecordsDynamicGroupingPlot"
//
import DynamicDateYAxisTwoLevelPanel from "../components/DateXAxis/DynamicDateYAxisTwoLevelPanel";
import DateXAxis from "../components/DateXAxis/DateXAxis";
import DateVerticalGridLines from "../components/DateXAxis/DateVerticalGridLines";
//
import PlotInteractionBoxProvider from "../components/Interaction/PlotInteractionBoxProvider";
import VerticalCrosshair from "../components/VerticalCrosshair/VerticalCrosshair";
import VerticalCrosshairSelector from "../components/VerticalCrosshair/VerticalCrosshairSelector";
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
const ROW_HEIGHT = 30;

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
      <>
        <MedicationRecordsProvider  medicationRecords={medications}
                                    categoryStructure={categoryStructure}
                                    render={ (requiredMedicationRecords) =>
          <MedicationRecordsGroupingProvider  medicationRecords={requiredMedicationRecords}
                                              render={ (groupedMedicationRecords)=>
            <MedicationRecordsMedicationsInUseProvider  medicationRecords={requiredMedicationRecords}
                                                        minX={minX}
                                                        maxX={maxX}
                                                        render={ (useMedications)=>
              <div style={{position:"relative",width:width,height:useMedications.size*ROW_HEIGHT+X1AXIS_HEIGHT+XAXIS_HEIGHT}}>
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
                              position="x1"
                              />
                </div>
                <div style={{position:"absolute",width:YAXIS_WIDTH,height:useMedications.size*ROW_HEIGHT,left:0,top:X1AXIS_HEIGHT}}>
                  <MedicationRecordsDynamicYAxisTwoLevelPanel categoryStructure={categoryStructure}
                                                              useMedications={useMedications}
                                                              rowHeight={ROW_HEIGHT}
                                                              width={YAXIS_WIDTH}
                                                              height={useMedications.size*ROW_HEIGHT}
                                                              />
                </div>
                <div style={{position:"absolute",width:plotWidth,height:useMedications.size*ROW_HEIGHT,left:YAXIS_WIDTH,top:X1AXIS_HEIGHT}}>
                  <MedicationRecordsPlotHorizontalSlabGrid  className="fillParent"
                                                            height={useMedications.size*ROW_HEIGHT} rowHeight={ROW_HEIGHT}
                                                            />
                  <DateVerticalGridLines  className="fillParent"
                                          minX={minX} maxX={maxX} width={plotWidth}
                                          />
                  <MedicationRecordsDynamicGroupedPlot  className="fillParent"
                                                        medicationRecords={groupedMedicationRecords}
                                                        categoryStructure={categoryStructure}
                                                        useMedications={useMedications}
                                                        rowHeight={ROW_HEIGHT}
                                                        minX={minX} maxX={maxX}
                                                        width={plotWidth} height={useMedications.size*ROW_HEIGHT}
                                                        />
                  <VerticalCrosshair className="fillParent"
                                     X={verticalCrosshair_X}
                                     minX={minX} maxX={maxX} width={plotWidth}
                                     />
                  {/* Main plot area interaction */}
                  <PlotInteractionBoxProvider className="fillParent"
                                              render={({hoveringPosition,
                                                        clickPosition,doubleClickPosition,
                                                        selectingPositionStart,selectingPositionEnd,
                                                        selectedPositionStart,selectedPositionEnd,
                                                        panningPositionStart,panningPositionEnd,
                                                        pannedPositionStart,pannedPositionEnd})=>
                    <>
                      <VerticalCrosshairSelector  hoveringPosition={hoveringPosition}
                                                  selectHandler={this.updateVerticalCrosshairX}
                                                  minX={minX} maxX={maxX} width={plotWidth}
                                                  />
                    </>
                  }/>
                </div>
                {/* Other decorations*/}
                <GradientOverlay  style={{position:"absolute",width:10,height:useMedications.size*ROW_HEIGHT+XAXIS_HEIGHT+X1AXIS_HEIGHT,left:YAXIS_WIDTH,top:0}}/>
              </div>
            }/>
          }/>
        }/>
      </>
    );
  }
  
  updateVerticalCrosshairX = (VCX)=>{
    let {changeHandler} = this.props;
    changeHandler({verticalCrosshair_X:VCX});
  }
}

const mapStateToProps = function (state,ownProps) {
  return {
    minX: state.plot.onPlotXRangeSelection_StartX || 1482858000,
    maxX: state.plot.onPlotXRangeSelection_EndX || 1502858000,
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
