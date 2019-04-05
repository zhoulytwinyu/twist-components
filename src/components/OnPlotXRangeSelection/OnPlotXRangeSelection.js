import React, { PureComponent } from "react";
import {toDomXCoord_Linear,
        fromDomXCoord_Linear} from "plot-utils";
// Components
import DragOverlay from "../UtilityComponents/DragOverlay";
// CSS
import "./OnPlotXRangeSelection.css";

const SIDE_HANDLE_WIDTH = 7;
const TOP_HANDLE_HEIGHT = 7;

class OnPlotXRangeSelection extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.state = {dragged:null};
    this.snapshot = {};
  }
  
  render() {
    let { minX,maxX,width,
          startX,endX,height,
          topHandle} = this.props;
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
    let top = topHandle ? TOP_HANDLE_HEIGHT : 0;
    // Left handle
    if (x0>=0 && x0<=width) {
      leftHandleElem = <div style={{position:"absolute",
                                    left:x0,
                                    top:top,
                                    width:SIDE_HANDLE_WIDTH,
                                    height:height-top}}
                            className="leftHandle"
                            onMouseDown={this.handleLeftHandleDragStart}
                            >
                       </div>;
    }
    if ( x1>=0 && x1<=width ) {
      rightHandleElem = <div  style={{position:"absolute",
                                      left:x1,
                                      marginLeft:-SIDE_HANDLE_WIDTH,
                                      top:top,
                                      width:SIDE_HANDLE_WIDTH,
                                      height:height-top}}
                              className="rightHandle"
                              onMouseDown={this.handleRightHandleDragStart}
                              >
                       </div>;
    }
    let mainLeft = Math.min(x0,x1-SIDE_HANDLE_WIDTH);
    let mainRight = Math.max(x1,x0+SIDE_HANDLE_WIDTH);
    let mainWidth = mainRight-mainLeft;
    if ( !(x0>width || 0>x1) ) {
      mainHandleElem = <div style={{position:"absolute",
                                    left:mainLeft,
                                    top:0,
                                    width:mainWidth,
                                    height:height}}
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
        <div ref={this.ref} style={{overflow:"hidden",position:"relative",height:height,width:width,top:0,left:0}}>
          {mainHandleElem}
          {leftHandleElem}
          {rightHandleElem}
        </div>
        {documentInteractionElem}
      </>
    );
  }
  
  handleDragStart(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    let { width,minX,
          maxX,startX,endX} = this.props;
    let {snapshot} = this;
    let referenceFrame = this.ref.current.getBoundingClientRect();
    snapshot.referenceFrame = referenceFrame;
    snapshot.width = width;
    snapshot.minX = minX;
    snapshot.maxX = maxX;
    snapshot.startX = startX;
    snapshot.endX = endX;
    snapshot.initialDragX = fromDomXCoord_Linear(width,minX,maxX,ev.clientX-referenceFrame.left);
  }
  handleLeftHandleDragStart = (ev)=>{
    this.handleDragStart(ev);
    this.setState({dragged:"left"});
  }
  handleRightHandleDragStart = (ev)=>{
    this.handleDragStart(ev);
    this.setState({dragged:"right"});
  }
  handleMainHandleDragStart = (ev)=>{
    this.handleDragStart(ev);
    this.setState({dragged:"main"});
  }

  handleLeftHandleDragging = (ev)=>{
    ev.stopPropagation();
    ev.preventDefault();
    let {draggingLeftHandler} = this.props;
    let {snapshot} = this;
    let { width,minX,maxX,
          startX,endX,
          referenceFrame,
          initialDragX} = snapshot;
    let curDragX = fromDomXCoord_Linear(width,minX,maxX,ev.clientX-referenceFrame.left);
    let newStartX = curDragX -initialDragX + startX;
    newStartX = this.snapStartX(newStartX,minX,endX);
    draggingLeftHandler(newStartX,endX);
  }
  handleRightHandleDragging = (ev)=>{
    ev.stopPropagation();
    ev.preventDefault();
    let {draggingRightHandler} = this.props;
    let {snapshot} = this;
    let { width,minX,maxX,
          startX,endX,
          referenceFrame,
          initialDragX} = snapshot;
    let curDragX = fromDomXCoord_Linear(width,minX,maxX,ev.clientX-referenceFrame.left);
    let newEndX = curDragX -initialDragX + endX;
    newEndX = this.snapEndX(newEndX,startX,maxX);
    draggingRightHandler(startX,newEndX);
  }
  handleMainHandleDragging = (ev)=>{
    ev.stopPropagation();
    ev.preventDefault();
    let {draggingMainHandler} = this.props;
    let {snapshot} = this;
    let { width,minX,maxX,
          startX,endX,
          referenceFrame,
          initialDragX} = snapshot;
    let curDragX = fromDomXCoord_Linear(width,minX,maxX,ev.clientX-referenceFrame.left);
    let deltaX = curDragX - initialDragX;
    deltaX = Math.max(Math.min(deltaX,maxX-endX),minX-startX);
    draggingMainHandler(startX+deltaX,endX+deltaX);
  }
  
  handleLeftHandleDragged = (ev)=>{
    ev.stopPropagation();
    ev.preventDefault();
    let {draggedLeftHandler} = this.props;
    let {snapshot} = this;
    let { width,minX,maxX,
          startX,endX,
          referenceFrame,
          initialDragX} = snapshot;
    let curDragX = fromDomXCoord_Linear(width,minX,maxX,ev.clientX-referenceFrame.left);
    let newStartX = curDragX -initialDragX + startX;
    newStartX = this.snapStartX(newStartX,minX,endX);
    draggedLeftHandler(newStartX,endX);
    this.setState({dragged:null});
  }
  handleRightHandleDragged = (ev)=>{
    ev.stopPropagation();
    ev.preventDefault();
    let {draggedRightHandler} = this.props;
    let {snapshot} = this;
    let { width,minX,maxX,
          startX,endX,
          referenceFrame,
          initialDragX} = snapshot;
    let curDragX = fromDomXCoord_Linear(width,minX,maxX,ev.clientX-referenceFrame.left);
    let newEndX = curDragX -initialDragX + endX;
    newEndX = this.snapEndX(newEndX,startX,maxX);
    draggedRightHandler(startX,newEndX);
    this.setState({dragged:null});
  }
  handleMainHandleDragged = (ev)=>{
    ev.stopPropagation();
    ev.preventDefault();
    let {draggedMainHandler} = this.props;
    let {snapshot} = this;
    let { width,minX,maxX,
          startX,endX,
          referenceFrame,
          initialDragX} = snapshot;
    let curDragX = fromDomXCoord_Linear(width,minX,maxX,ev.clientX-referenceFrame.left);
    let deltaX = curDragX - initialDragX;
    deltaX = Math.max(Math.min(deltaX,maxX-endX),minX-startX);
    draggedMainHandler(startX+deltaX,endX+deltaX);
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
