import { Component } from "react";
import {toDomXCoord_Linear} from "plot-utils";
// Import constants
import ProcedureObject, {compareProcedureObjects} from "./ProcedureObject";

class ProcedurePlotClickSelector extends Component {
  constructor(props){
    super(props);
    this.pickingCanvas = document.createElement("canvas");
    this.pickingCanvas.width = 1;
    this.pickingCanvas.height = 1;
  }
  
  render() {
    return null;
  }

  shouldComponentUpdate(nextProps,nextState){
    if (nextProps.clickPosition!==this.props.clickPosition) {
      return true;
    }
    return false;
  }
  
  componentDidMount(){
    this.select();
  }
  
  componentDidUpdate(){
    this.select();
  }
  
  select() {
    let { data,
          selection,
          minX,maxX,width,height,
          clickPosition,
          selectHandler} = this.props;
    if (clickPosition===undefined) {
      return;
    }
    if (clickPosition===null) {
      selectHandler(null);
      return;
    }
    this.select_memo = this.select_memo || {};
    let memo = this.select_memo;
    if (memo.data !== data ) {
      memo.data = data;
      memo.ProcedureObjectCollection = data.map( (obj)=>new ProcedureObject(obj) )
                                            .sort(compareProcedureObjects);
    }
    // Clear plots
    let {pickingCanvas} = this;
    let ctx = pickingCanvas.getContext("2d");
    ctx.clearRect(0,0,1,1);
    ctx.translate(-clickPosition.domX,-clickPosition.domY);
    // Draw and pick
    let curSelection;
    for (let obj of memo.ProcedureObjectCollection) {
      if (obj.start > maxX || obj.end < minX) {
        continue;
      }
      // Draw
      let startDomX = toDomXCoord_Linear(width,minX,maxX,obj.start);
      let endDomX = toDomXCoord_Linear(width,minX,maxX,obj.end);
      if (obj.id === selection) {
        obj.drawSelectedHitbox(ctx,width,height,startDomX,endDomX);
      }
      else {
        obj.drawHitbox(ctx,width,height,startDomX,endDomX);
      }
      // Pick
      let imgData = ctx.getImageData(0,0,1,1);
      if (imgData.data[3]!==0) {
        curSelection = obj.id;
        if (curSelection === selection) {
          curSelection = null;
        }
        break;
      }
    }
    selectHandler(curSelection);
    ctx.translate(clickPosition.domX,clickPosition.domY);
  }
}

export default ProcedurePlotClickSelector;
