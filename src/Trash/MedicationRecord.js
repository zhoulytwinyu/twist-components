import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";

class MedicationRecordRelay extends PureComponent {
  render() {
    return null;
  }

  componentDidMount(){
    this.modifyData();
  }
  
  componentDidUpdate(){
    this.modifyData();
  }
  
  modifyData() {
    let { minX,maxX,width,rowHeight,
          data,useMeds,medCategory,categoryOrder} = this.props;
    categoryOrder = this.expandCategoryOrder(categoryOrder);
    let filteredData = this.filterDataByUsage(data,useMeds);
    //console.log("filtered by usage",filteredData);
    filteredData = this.assignCategory(filteredData, medCategory);
    //console.log("assigned",filteredData);
    filteredData = this.groupData(filteredData, maxX-minX);
    //console.log("grouped",filteredData);
    filteredData = this.filterDataByRange(filteredData,minX,maxX);
    //console.log("filtered by range",filteredData);
    let height = this.calculateHeight(filteredData,rowHeight);
    let {categoryPosition,medPosition} = this.getCategoryAndMedsPosition(filteredData,categoryOrder);
    
    this.handleUpdate({categoryPosition,medPosition,height,filteredData});
  }

  handleUpdate(obj) {
    let {updateHandler} = this.props;
    updateHandler(obj);
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
    // TODO
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
}

export default MedicationRecordRelay;
