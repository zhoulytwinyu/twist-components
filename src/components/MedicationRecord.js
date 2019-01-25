import React, { PureComponent } from 'react';
import {memoize_one} from "../utils/memoize";
import {toDomXCoord_Linear,
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
    
    return (
      <canvas ref={this.ref} width={width} style={{position:"absolute", left:left, top:top}}></canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    let t= new Date();
    this.draw();
    console.log( new Date()-t );
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
    let {categoryToPlot,medToPlot} = this.getCategoryAndMedsPosition(filteredData,categoryOrder);
    this.handleUpdatePanel(categoryToPlot,medToPlot);
    
    let medPosLUT = this.getPosLUT(medToPlot);
    // Draw 
    let domX = filteredData.map( ({start,end})=>this.toDomXCoord((start+end)/2) );
    let domY = filteredData.map( ({name})=>this.toDomYCoord(name,medPosLUT,rowHeight) );
    let option = {shape:"dot",radius:5,fillStyle:"red"};
    scatterPlot(canvas,domX,domY,option);
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
  
  toDomYCoord(dataY,medPosLUT,rowHeight) {
    return (medPosLUT[dataY]+0.5)*rowHeight;
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

  handleUpdatePanel(categoryToPlot,medToPlot) {
    if (!this.memo) {
      this.memo = {};
    }
    let categoryToPlotJSON = JSON.stringify(categoryToPlot);
    let medToPlotJSON = JSON.stringify(medToPlot)
    if (this.memo.categoryToPlotJSON !== JSON.stringify(categoryToPlot) ||
        this.memo.medToPlotJSON !== JSON.stringify(medToPlot)
        ) {
      this.memo.categoryToPlotJSON = categoryToPlotJSON;
      this.memo.medToPlotJSON = medToPlotJSON;
      let {updatePanelHandler} = this.props;
      updatePanelHandler({categoryToPlot,medToPlot});
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
    let categoryToPlot = this.getCategoryToPlot(categoryMeds_LUT,categoryOrder);
    let medToPlot = this.getMedToPlot(categoryMeds_LUT,categoryOrder);
    return {categoryToPlot,medToPlot};
  }
  
  getCategoryToPlot(categoryMeds_LUT,categoryOrder) {
    let categoryToPlot=[];
    let startPos = 0;
    for (let category of categoryOrder) {
      let medSet = categoryMeds_LUT[category];
      if (medSet) {
        categoryToPlot.push({name:category,start:startPos,end:startPos+medSet.size});
        startPos += medSet.size;
      }
    }
    return categoryToPlot;
  }
  
  getMedToPlot(categoryMeds_LUT,categoryOrder) {
    let medToPlot = [];
    let startPos=0;
    for (let category of categoryOrder) {
      let medSet = categoryMeds_LUT[category];
      if (!medSet) {
        continue;
      }
      let sortedMeds = [...medSet];
      sortedMeds.sort();
      for (let med of sortedMeds) {
        medToPlot.push({name:med,start:startPos,end:startPos+1});
        startPos+=1;
      }
    }
    
    return medToPlot;
  }
  
  getPosLUT(toPlot) {
    let pos_LUT ={};
    for (let i=0; i<toPlot.length; i++) {
      pos_LUT[toPlot[i]["name"]] = i;
    }
    return pos_LUT;
  }
}

MedicationRecord.prototype.SHAPE_LUT={"iv":"square","po":"circle","cont":"rectangle"};
MedicationRecord.prototype.CATEGORY_LABEL_COLORS = ["#d2b4de","#aed6f1","#a9dfbf","#f9e79f","#f5cba7"];
MedicationRecord.prototype.MED_LABEL_COLORS = ["#FDFAEB","#FEF0D6"];

export default MedicationRecord;
