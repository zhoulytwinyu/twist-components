import React, { PureComponent } from 'react';
import {memoize_one} from "../utils/memoize";
import {toDomXCoord_Linear,
        scatterPlot} from "plot-utils";
        
class MedicationRecord extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.toDomXCoord = this.toDomXCoord.bind(this);
    this.filterDataByUsage = memoize_one(this.filterDataByUsage);
    this.assignCategory = memoize_one(this.assignCategory);
    this.groupData = memoize_one(this.groupData);
    this.filterDataByRange = memoize_one(this.filterDataByRange);
    this.calculateHeight = memoize_one(this.calculateHeight);
  }

  render() {
    let {ROW_HEIGHT} = this;
    let {width,height,left,top,style} = this.props;
    
    return (
      <canvas ref={this.ref} height={height} width={width} style={{position:"absolute", left:left, top:top}}></canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  draw() {
    let {minX,maxX,width,height} = this.props;
    let {data,useMeds,medCategotyLUT} = this.props;
    let filteredData = this.filterDataByUsage(data,useMeds);
    filteredData = this.assignCategory(filteredData, medCategotyLUT);
    filteredData = this.groupData(filteredData, maxX-minX);
    filteredData = this.filterDataByRange(filteredData,minX,maxX);
    let requiredHeight = this.calculateHeight(filteredData,this.ROW_HEIGHT);
    if (height !== requiredHeight){
      this.requestHeight(requiredHeight);
    }
    // data: [{name,start,end: eq start if admin, null/undefined if ongoing, },...]
    // assumptions: No overlap.
    let preprocessedData = this.assignCategory(data);
    
    let canvas = this.ref.current;

    // Clear plots
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    
  }
  
  filterDataByUsage(data,useMeds) {
    return data.filter( ({name})=> (name in useMeds) );
  }
  
  assignCategory(data,medCategory) {
    return data.map((row)=>({ ...row,
                              category: medCategory[row.name] || "other"
                              })
                    );
  }
  
  groupData(data,diffX) {
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
  
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
  
  requestHeight(newHeight) {
    let {updateHeightHandler} = this.props;
    updateHeightHandler({height:newHeight});
  }
}

MedicationRecord.prototype.ROW_HEIGHT=30;
MedicationRecord.prototype.SHAPE_LUT={"IV":"rectangle","PO":""};

export default MedicationRecord;
