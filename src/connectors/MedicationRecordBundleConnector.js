import React, { PureComponent } from "react";
import { connect } from "react-redux";

// Components
import {changeTopLevelPlot} from "../actions/plot-actions";
import MedicationRecordsDynamicGroupingProvider from "../components/MedicationRecordsPlot/MedicationRecordsDynamicGroupingProvider";
import MedicationRecordsDynamicGroupingPlot from "../components/MedicationRecordsPlot/MedicationRecordsDynamicGroupingPlot";
import MedicationRecordsDynamicYAxisTwoLevelPanel from "../components/MedicationRecordsPlot/MedicationRecordsDynamicYAxisTwoLevelPanel";

import InPlotXRangeSelection from "../components/InPlotXRangeSelection";
//import HoverInteractionBoxWithReference from "../components/InteractionBox/HoverInteractionBoxWithReference";
import TriPhaseInteractionBoxWithReference from "../components/InteractionBox/TriPhaseInteractionBoxWithReference";
import {medications,
        categoryStructure} from "./test-data/medication";

const ROW_HEIGHT =40;
const LEFT = 150;

class MedicationRecordBundle extends PureComponent {
  constructor(props) {
    super(props);
  }
  
  render() {
    let { minX,maxX,
          verticalCrosshair_X,
          width,
          panningX,
          } = this.props;
    let { MedicationRecordsGroupingContext,
          MedicationRecordsDynamicGroupedUseMedicationsContext} = this;
    let { changeHandler } = this.props;
    return (
      <MedicationRecordsDynamicGroupingProvider medicationRecords={medications}
                                                categoryStructure={categoryStructure}
                                                minX={minX} maxX={maxX}
                                                rowHeight={ROW_HEIGHT}
                                                render={(groupedMedicationRecords,useMedications,height)=>
        <div style={{position:"absolute"}}>
          <div style={{position:"absolute",width:LEFT,height:height,left:0,top:0}}>
            <MedicationRecordsDynamicYAxisTwoLevelPanel categoryStructure={categoryStructure}
                                                        useMedications={useMedications}
                                                        rowHeight={ROW_HEIGHT}
                                                        width={LEFT}
                                                        height={height}
                                                        />
          </div>
          <div style={{position:"absolute",width:width,height:height,left:LEFT,top:0}}>
            <MedicationRecordsDynamicGroupingPlot  medicationRecords={groupedMedicationRecords}
                                                  categoryStructure={categoryStructure}
                                                  useMedications={useMedications}
                                                  rowHeight={ROW_HEIGHT}
                                                  minX={minX} maxX={maxX}
                                                  width={width} height={height}
                                                  />
          </div>
        </div>
      }/>
    );
  }
}

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
