import React, { Component } from "react";
import { connect } from "react-redux";
import {memoize_one} from "memoize";

// Components
//~ import InteractionBox from "../components/InteractionBox";
//~ import VerticalCrosshair from "../components/VerticalCrosshair";
import {changeTopLevelPlot} from "../actions/plot-actions";
import MedicationRecord from "../components/MedicationRecord";
import MedicationRecordModifier from "../components/MedicationRecordModifier";
import YCategoricalPanel from "../components/YCategoricalPanel";
import InPlotXRangeSelection from "../components/InPlotXRangeSelection";
import HoverInteractionBoxWithReference from "../components/InteractionBox/HoverInteractionBoxWithReference";
import TriPhaseXInteractionBoxWithReference from "../components/InteractionBox/TriPhaseXInteractionBoxWithReference";
import {medication,
        medCategory,
        useMeds,
        categoryOrder} from "./test-data/medication";

class MedicationRecordBundle extends Component {
  constructor(props){
    super(props);
    this.state = {
      height:0,
      category:[],
      subcategory:[],
      filteredMedicationData:[]
    }
    this.setState = this.setState.bind(this);
  }
  
  render() {
    let { minX,maxX,
          hoverX,
          width
          } = this.props;
    let {height,category,subcategory,filteredMedicationData} = this.state;
    let {LEFT,ROW_HEIGHT} = this;
    let { changeHandler } = this.props;
    return (
      <div style={{position:"relative", width:width+LEFT, height:height, border:"black 1px solid"}} onMouseDown={this.props.onMouseDown}>
        <MedicationRecordModifier data={medication} useMeds={useMeds} medCategory={medCategory} categoryOrder={categoryOrder}
                                  minX={minX} maxX={maxX} width={width} rowHeight={ROW_HEIGHT}
                                  updateHandler={this.MedicationRecordModifier_updateHandler}
                                  />
        <div style={{ position:"absolute",width:LEFT,height:height}}>
          <YCategoricalPanel  style={{ position:"absolute",width:30,height:height}}
                              category={this.applyCategoryStyle(category)}
                              width={30} height={height} rowHeight={ROW_HEIGHT}
                              />
          <YCategoricalPanel  style={{ position:"absolute",width:LEFT-30,height:height,left:30}}
                              category={this.applySubcategoryStyle(subcategory)}
                              width={LEFT-30} height={height} rowHeight={ROW_HEIGHT}
                              />
        </div>
        <div style={{ position:"absolute",width:width,height:height,left:LEFT}}>
          <MedicationRecord style={{position:"absolute",width:width,height:height}}
                            minX={minX} maxX={maxX} width={width}
                            height={height} rowHeight={ROW_HEIGHT}
                            category={subcategory}
                            data={filteredMedicationData}
                            />
        </div>
        <HoverInteractionBoxWithReference style={{position:"absolute",width:width,height:height,left:LEFT}}
                                            minX={minX} maxX={maxX} width={width}
                                            minY={1} maxY={0} height={height}
                                            hoveringHandler={this.hoveringHandler} mouseOutHandler={this.mouseOutHandler}
                                            >
          <TriPhaseXInteractionBoxWithReference style={{position:"absolute",width:width,height:height}}
                                                minX={minX} maxX={maxX} width={width}
                                                minY={1} maxY={0} height={height}
                                                updateHeightHandler={this.setState}
                                                updatePanelHandler={this.setState}
                                                clickedHandler={console.log}
                                                doubleClickHandler={console.log}
                                                hoveringHandler={console.log} mouseOutHandler={console.log}
                                                selectingHandler={console.log} selectedHandler={console.log}
                                                panningHandler={console.log} pannedHandler={console.log}
                                                >
          </TriPhaseXInteractionBoxWithReference>
        </HoverInteractionBoxWithReference>
      </div>
    );
  }
  
  MedicationRecordModifier_updateHandler = (obj)=>{
    let {categoryPosition:category,medPosition:subcategory,height,filteredData:filteredMedicationData} = obj;
    this.setState({category,subcategory,height,filteredMedicationData});
  }
  
  applyCategoryStyle = memoize_one( (category) => {
    let colorCycle = ["red","green","blue","cyan"];
    return category.map( ({name,start,end},i) =>({name,
                                                  start,
                                                  end,
                                                  bgStyle:{fillStyle:colorCycle[i%colorCycle.length]},
                                                      textStyle:{ fillStyle:"white",strokeStyle:"lightgrey",lineWidth:1,
                                                                  font:"bold 12pt Sans",
                                                                  textAlign:"center",textBaseline:"middle"},
                                                      textPosition:4,
                                                      textRotation:-Math.PI/2,
                                                  }) );
  });
  
  applySubcategoryStyle = memoize_one( (subcategory) => {
    let colorCycle = ["magenta","green","blue","cyan","yellow","pink"];
    return subcategory.map( ({name,start,end},i) =>({ name,
                                                      start,
                                                      end,
                                                      bgStyle:{fillStyle:colorCycle[i%colorCycle.length]},
                                                      textStyle:{ fillStyle:"grey",lineWidth:1,
                                                                  font:"bold 10pt Sans",
                                                                  textAlign:"left",textBaseline:"middle"},
                                                      textPosition:3,
                                                      textRotation:0,
                                                      }) );
  });
}

MedicationRecordBundle.prototype.LEFT = 150;
MedicationRecordBundle.prototype.ROW_HEIGHT = 40;

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
