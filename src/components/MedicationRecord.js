import React, { PureComponent } from 'react';
import {memoize_one} from "../utils/memoize";
import {toDomXCoord_Linear,
        toDomCoord_Categorical,
        scatterPlot} from "plot-utils";

class MedicationRecord extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.toDomXCoord = this.toDomXCoord.bind(this);
    this.toDomYCoord = this.toDomYCoord.bind(this);
    this.expandCategoryOrder = memoize_one(this.expandCategoryOrder);
    this.filterDataByUsage = memoize_one(this.filterDataByUsage);
    this.assignCategory = memoize_one(this.assignCategory);
    this.groupData = memoize_one(this.groupData);
    this.filterDataByRange = memoize_one(this.filterDataByRange);
    this.calculateHeight = memoize_one(this.calculateHeight);
  }

  render() {
    let {ROW_HEIGHT} = this;
    let {width,left,top,style} = this.props;
    let {kargs} = this.props;
    
    return (
      <canvas ref={this.ref} width={width} style={{position:"absolute", left:left, top:top}} {...kargs}></canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  draw() {
    let {minX,maxX,width,rowHeight} = this.props;
    let {data,useMeds,medCategory,categoryOrder} = this.props;
    categoryOrder = this.expandCategoryOrder(categoryOrder);
    let filteredData = this.filterDataByUsage(data,useMeds);
    //console.log("filtered by usage",filteredData);
    filteredData = this.assignCategory(filteredData, medCategory);
    //console.log("assigned",filteredData);
    filteredData = this.groupData(filteredData, maxX-minX);
    //console.log("grouped",filteredData);
    filteredData = this.filterDataByRange(filteredData,minX,maxX);
    //console.log("filtered by range",filteredData);
    let requiredHeight = this.calculateHeight(filteredData,rowHeight);
    this.handleUpdateHeight(requiredHeight);
    let canvas = this.ref.current;
    canvas.height=requiredHeight;
    // Clear plots
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,requiredHeight);
    // Calculate ordering
    let {categoryPosition,medPosition} = this.getCategoryAndMedsPosition(filteredData,categoryOrder);
    this.handleUpdatePanel(categoryPosition,medPosition);
    let medPosLUT = this.getMedPosLUT(medPosition);
    //console.log(medPosLUT);
    // Draw 
    let domX = filteredData.map( ({start,end})=>this.toDomXCoord((start+end)/2) );
    let domY = filteredData.map( ({name})=>this.toDomYCoord(name,medPosLUT,"middle") );
    let option = {shape:"dot",radius:5,fillStyle:"red"};
    scatterPlot(canvas,domX,domY,option);
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
  
  toDomYCoord(med,medPosLUT,type) {
    let {rowHeight} = this.props;
    return toDomCoord_Categorical(med,medPosLUT,rowHeight,type);
  }
  
  handleUpdateHeight(height) {
    if (!this.memo) {
      this.memo = {};
    }
    if (this.memo.height !== height) {
      this.memo.height = height;
      let {updateHeightHandler} = this.props;
      updateHeightHandler({height});
    }
  }

  handleUpdatePanel(categoryPosition,medPosition) {
    if (!this.memo) {
      this.memo = {};
    }
    let categoryPosition_JSON = JSON.stringify(categoryPosition);
    let medPosition_JSON = JSON.stringify(medPosition)
    if (this.memo.categoryPosition_JSON !== categoryPosition_JSON ||
        this.memo.medPosition_JSON !== medPosition_JSON
        ) {
      this.memo.categoryPosition_JSON = categoryPosition_JSON;
      this.memo.medPosition_JSON = medPosition_JSON;
      let {updatePanelHandler} = this.props;
      updatePanelHandler({categoryPosition,subcategoryPosition:medPosition});
    }
  }
  
  expandCategoryOrder(categoryOrder) {
    return categoryOrder.concat(["other"]);
  }
  
  filterDataByUsage(data,useMeds) {
    return data.filter( ({name})=> useMeds.has(name) );
  }
  
  assignCategory(data,medCategory) {
    return data.map((row)=>({ ...row,
                              category: medCategory[row.name] || "other"
                              })
                    );
  }
  
  groupData(data,diffX) {
    /////////////////////////////////////////////////////////////////
    return data;
  }
  
  filterDataByRange(data,minX,maxX) {
    return data.filter( ({start,end})=> {
        if (start>=maxX) {
          return false;
        }
        if (end === undefined || end === null) {
          return true;
        }
        if (end <= minX) {
          return false;
        }
        return true;
      } );
  }
  
  calculateHeight(data,rowHeight) {
    return new Set(data.map( ({name})=>name )).size*rowHeight;
  }
  
  getCategoryAndMedsPosition(data,categoryOrder) {
    let categoryMeds_LUT = {};
    for (let {name,category} of data) {
      categoryMeds_LUT[category] = categoryMeds_LUT[category] || new Set();
      categoryMeds_LUT[category].add(name);
    }
    
    let categoryPosition = [];
    let medPosition = [];
    let startPos = 0;
    for (let category of categoryOrder) {
      let medSet = categoryMeds_LUT[category];
      if (!medSet) {
        continue;
      }
      // update categoryPosition
      categoryPosition.push({name:category,start:startPos,end:startPos+medSet.size});
      // update medPosition
      let medList = [...medSet];
      medList.sort();
      for (let med of medList){
        medPosition.push({name:med,start:startPos,end:startPos+1});
        startPos+=1;
      }
    }
    return {categoryPosition,medPosition};
  }
  
  getMedPosLUT(medPosition) {
    let medPosLUT = {};
    for (let {name,start,end} of medPosition) {
      medPosLUT[name] = {start,end};
    }
    return medPosLUT;
  }
}

MedicationRecord.prototype.SHAPE_LUT={"iv":"square","po":"circle","cont":"rectangle"};

export default MedicationRecord;
