import React, { PureComponent } from "react";
import {toDomXCoord_Linear,
        fromDomXCoord_Linear} from "plot-utils";
// Components
import DragOverlay from "../UtilityComponents/DragOverlay";
// CSS
import "./OnPlotXRangeSelection.css";

const SIDE_HANDLE_WIDTH = 5;
const TOP_HANDLE_HEIGHT = 10;

class OnPlotXRangeSelection extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.state = {dragged:null};
    this.initialDragStartDataX = null;
    this.initialStartX = null;
    this.initialEndX = null;
    this.referenceFrame = null;
  }
  
  render() {
    let { minX,maxX,width,
          startX,endX,height,
          topHandle,
          draggingLeftHandler,draggingMainHandler,draggingRightHandler,
          draggedLeftHandler,draggedMainHandler,draggedRightHandler,
          style,
          ...rest} = this.props;
    let {dragged} = this.state;
    // Calculate positions
    let x0,x1;
    x0 = toDomXCoord_Linear(width,minX,maxX,startX);
    x1 = toDomXCoord_Linear(width,minX,maxX,endX);
    // Create elements
    let leftHandleElem = null;
    let rightHandleElem = null;
    let mainHandleElem = null;
    let documentInteractionElem = null;
    let overlayElem = null;
    let top = topHandle ? TOP_HANDLE_HEIGHT : 0;
    // Left handle
    if (x0>=0 && x0<=width) {
      leftHandleElem = <div style={{position:"absolute",left:x0,top:top,width:SIDE_HANDLE_WIDTH,height:height-top}}
                            className="leftHandle"
                            onMouseDown={this.handleLeftHandleDragStart}
                            >
                       </div>;
    }
    if ( x1>=0 && x1<=width ) {
      rightHandleElem = <div  style={{position:"absolute",left:x1, marginLeft:-SIDE_HANDLE_WIDTH,top:top,width:SIDE_HANDLE_WIDTH,height:height-top}}
                              className="rightHandle"
                              onMouseDown={this.handleRightHandleDragStart}
                              >
                       </div>;
    }
    if ( !(x0>width || 0>x1) ) {
      mainHandleElem = <div style={{position:"absolute",left:x0,top:0,width:x1-x0,height:height}}
                            className="mainHandle"
                            onMouseDown={this.handleMainHandleDragStart}
                            >
                       </div>;
    }
    
    switch (dragged) {
      case "left":
        documentInteractionElem = <DragOverlay mouseMoveHandler={this.handleLeftHandleDragging} mouseUpHandler={this.handleLeftHandleDragged} cursor="w-resize"/>;
        break;
      case "right":
        documentInteractionElem = <DragOverlay mouseMoveHandler={this.handleRightHandleDragging} mouseUpHandler={this.handleRightHandleDragged} cursor="e-resize"/>;
        break;
      case "main":
        documentInteractionElem = <DragOverlay mouseMoveHandler={this.handleMainHandleDragging} mouseUpHandler={this.handleMainHandleDragged} cursor="ew-resize"/>;
        break;
      default:
        break;
    }
    
    return (
      <>
        <div ref={this.ref} {...rest}>
          {mainHandleElem}
          {leftHandleElem}
          {rightHandleElem}
        </div>
        {documentInteractionElem}
      </>
    );
  }
  
  handleLeftHandleDragStart = (ev)=>{
    ev.stopPropagation();
    ev.preventDefault();
    this.referenceFrame = this.ref.current.getBoundingClientRect();
    let {width,minX,maxX,startX} = this.props;
    let {referenceFrame} = this;
    this.initialStartX = startX;
    this.initialDragStartDataX = fromDomXCoord_Linear(width,minX,maxX,ev.clientX-referenceFrame.left);
    this.setState({dragged:"left"});
  }
  handleRightHandleDragStart = (ev)=>{
    ev.stopPropagation();
    ev.preventDefault();
    this.referenceFrame = this.ref.current.getBoundingClientRect();
    let {width,minX,maxX,endX} = this.props;
    let {referenceFrame} = this;
    this.initialEndX = endX;
    this.initialDragStartDataX = fromDomXCoord_Linear(width,minX,maxX,ev.clientX-referenceFrame.left);
    this.setState({dragged:"right"});
  }
  handleMainHandleDragStart = (ev)=>{
    ev.stopPropagation();
    ev.preventDefault();
    this.referenceFrame = this.ref.current.getBoundingClientRect();
    let {width,minX,maxX,startX,endX} = this.props;
    let {referenceFrame} = this;
    this.initialStartX = startX;
    this.initialEndX = endX;
    this.initialDragStartDataX = fromDomXCoord_Linear(width,minX,maxX,ev.clientX-referenceFrame.left);
    this.setState({dragged:"main"});
  }

  handleLeftHandleDragging = (ev)=>{
    ev.stopPropagation();
    ev.preventDefault();
    let {draggingLeftHandler,width,minX,maxX,endX} = this.props;
    let {initialDragStartDataX,initialStartX} = this;
    let {referenceFrame} = this;
    let currentDataX = fromDomXCoord_Linear(width,minX,maxX,ev.clientX-referenceFrame.left);
    let newStartX = initialStartX + currentDataX - initialDragStartDataX;
    newStartX = this.snapStartX(newStartX,minX,endX);
    let deltaDataX = newStartX - initialStartX;
    draggingLeftHandler(deltaDataX);
  }
  handleRightHandleDragging = (ev)=>{
    let {draggingRightHandler,width,minX,maxX,startX} = this.props;
    let {initialDragStartDataX,initialEndX} = this;
    let {referenceFrame} = this;
    let currentDataX = fromDomXCoord_Linear(width,minX,maxX,ev.clientX-referenceFrame.left);
    let newEndX = initialEndX + currentDataX - initialDragStartDataX;
    newEndX = this.snapEndX(newEndX,startX,maxX);
    let deltaDataX = newEndX - initialEndX;
    draggingRightHandler(deltaDataX);
  }
  handleMainHandleDragging = (ev)=>{
    let {draggingMainHandler,width,minX,maxX} = this.props;
    let {initialDragStartDataX} = this;
    let {referenceFrame,initialStartX,initialEndX} = this;
    let currentDataX = fromDomXCoord_Linear(width,minX,maxX,ev.clientX-referenceFrame.left);
    let deltaDataX = currentDataX - initialDragStartDataX;
    deltaDataX = Math.max(minX-initialStartX,Math.min(maxX-initialEndX,deltaDataX)) 
    draggingMainHandler(deltaDataX);
  }
  
  handleLeftHandleDragged = (ev)=>{
    let {draggedLeftHandler,width,minX,maxX,endX} = this.props;
    let {initialDragStartDataX} = this;
    let {referenceFrame,initialStartX} = this;
    let currentDataX = fromDomXCoord_Linear(width,minX,maxX,ev.clientX-referenceFrame.left);
    let newStartX = initialStartX + currentDataX - initialDragStartDataX;
    newStartX = this.snapStartX(newStartX,minX,endX);
    let deltaDataX = newStartX - initialStartX;
    draggedLeftHandler(deltaDataX);
    this.setState({dragged:null});
  }
  handleRightHandleDragged = (ev)=>{
    let {draggedRightHandler,width,minX,maxX,startX} = this.props;
    let {initialDragStartDataX} = this;
    let {referenceFrame,initialEndX} = this;
    let currentDataX = fromDomXCoord_Linear(width,minX,maxX,ev.clientX-referenceFrame.left);
    let newEndX = initialEndX + currentDataX - initialDragStartDataX;
    newEndX = this.snapEndX(newEndX,startX,maxX);
    let deltaDataX = newEndX - initialEndX;
    draggedRightHandler(deltaDataX);
    this.setState({dragged:null});
  }
  handleMainHandleDragged = (ev)=>{
    let {draggedMainHandler,width,minX,maxX} = this.props;
    let {initialDragStartDataX} = this;
    let {referenceFrame,initialStartX,initialEndX} = this;
    let currentDataX = fromDomXCoord_Linear(width,minX,maxX,ev.clientX-referenceFrame.left);
    let deltaDataX = currentDataX - initialDragStartDataX;
    deltaDataX = Math.max(minX-initialStartX,Math.min(maxX-initialEndX,deltaDataX)) 
    draggedMainHandler(deltaDataX);
    this.setState({dragged:null});
  }

  snapStartX(newStartX,minX,endX) {
    let dayMs = (60*60*1000);
    newStartX = Math.max(Math.min(newStartX,endX),minX);
    let snappedStartX = Math.round(newStartX/dayMs) * dayMs;
    if (snappedStartX>=endX) {
      snappedStartX = snappedStartX - dayMs;
    }
    if (snappedStartX<=minX) {
      snappedStartX = snappedStartX + dayMs;
    }
    let d0 = Math.abs(newStartX-minX);
    let d1 = Math.abs(snappedStartX-newStartX);
    let d2 = Math.abs(newStartX-(endX-dayMs));
    let minDist = Math.min(d0,d1,d2);
    if (d0 === minDist) {
      return minX;
    }
    if (d1 === minDist) {
      return snappedStartX;
    }
    if (d2 === minDist) {
      return endX-dayMs;
    }
    return snappedStartX;
  }
  
  snapEndX(newEndX,startX,maxX) {
    let dayMs = (60*60*1000);
    newEndX = Math.max(Math.min(newEndX,maxX),startX);
    let snappedEndX = Math.round(newEndX/dayMs) * dayMs;
    if (snappedEndX>=maxX) {
      snappedEndX = snappedEndX - dayMs;
    }
    if (snappedEndX<=startX) {
      snappedEndX = snappedEndX + dayMs;
    }
    let d0 = Math.abs(newEndX-(startX+dayMs));
    let d1 = Math.abs(snappedEndX-newEndX);
    let d2 = Math.abs(newEndX-maxX);
    let minDist = Math.min(d0,d1,d2);
    if (d0 === minDist) {
      return startX+dayMs;
    }
    if (d1 === minDist) {
      return snappedEndX;
    }
    if (d2 === minDist) {
      return maxX;
    }
    return snappedEndX;
  }
}

export default OnPlotXRangeSelection;
