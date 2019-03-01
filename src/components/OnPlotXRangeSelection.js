import React, { PureComponent } from "react";
import {toDomXCoord_Linear,
        fromDomXCoord_Linear} from "plot-utils";
import DragInteractionBox from "../components/InteractionBox/DragInteractionBox";


class OnPlotXRangeSelection extends PureComponent {
  render() {
    let { minX,maxX,width,
          startX,endX,
          height,leftHandle,rightHandle,topHandle,
          draggingLeftHandler,draggingMainHandler,draggingRightHandler,
          draggedLeftHandler,draggedMainHandler,draggedRightHandler,
          ...rest} = this.props;
    let {SIDE_HANDLE_WIDTH,TOP_HANDLE_HEIGHT} = this;
    
    // calculate positions
    let mainHandleLeft = this.toDomXCoord(startX);
    let leftHandleLeft = mainHandleLeft-SIDE_HANDLE_WIDTH;
    let topHandleLeft = leftHandleLeft;
    let rightHandleLeft = this.toDomXCoord(endX);
    let mainHandleWidth = rightHandleLeft-mainHandleLeft;
    let topHandleWidth = mainHandleWidth+2*SIDE_HANDLE_WIDTH;
    // create elements
    let LeftHandle = null;
    let TopHandle = null;
    let RightHandle = null;
    let MainHandle = null;
    if (leftHandle && topHandle) {
      LeftHandle = <DragInteractionBox  style={{position:"absolute", top:TOP_HANDLE_HEIGHT, left:leftHandleLeft,
                                        width:SIDE_HANDLE_WIDTH, height:height-TOP_HANDLE_HEIGHT, backgroundColor:"rgba(150,150,150,0.8)",
                                        cursor:"w-resize"
                                        }}
                                        draggingHandler={this.handleDraggingLeft} draggedHandler={this.handleDraggedLeft}
                                        />;
    }
    else if (leftHandle && !topHandle) {
      LeftHandle = <DragInteractionBox  style={{position:"absolute", top:0, left:leftHandleLeft,
                                        width:SIDE_HANDLE_WIDTH, height:height, backgroundColor:"rgba(150,150,150,0.8)",
                                        cursor:"w-resize"
                                        }}
                                        draggingHandler={this.handleDraggingLeft} draggedHandler={this.handleDraggedLeft}
                                        />;
    }
    if (rightHandle && topHandle) {
      RightHandle = <DragInteractionBox style={{position:"absolute", top:TOP_HANDLE_HEIGHT, left:rightHandleLeft,
                                        width:SIDE_HANDLE_WIDTH, height:height-TOP_HANDLE_HEIGHT, backgroundColor:"rgba(150,150,150,0.8)",
                                        cursor:"e-resize"
                                        }}
                                        draggingHandler={this.handleDraggingRight} draggedHandler={this.handleDraggedRight}
                                        />
    }
    else if (rightHandle && !topHandle) {
      RightHandle = <DragInteractionBox style={{position:"absolute", top:0, left:rightHandleLeft,
                                        width:SIDE_HANDLE_WIDTH, height:height, backgroundColor:"rgba(150,150,150,0.8)",
                                        cursor:"e-resize"
                                        }}
                                        draggingHandler={this.handleDraggingRight} draggedHandler={this.handleDraggedRight}
                                        />
    }
    if (topHandle) {
      TopHandle = <DragInteractionBox style={{position:"absolute", top:0, left:topHandleLeft,
                                      width:topHandleWidth, height:TOP_HANDLE_HEIGHT, backgroundColor:"rgba(160,150,150,0.2)",
                                      cursor:"grab"
                                      }}
                                      draggingHandler={this.handleDraggingMain} draggedHandler={this.handleDraggedMain}
                                      />;
      MainHandle = <DragInteractionBox  style={{position:"absolute", top:TOP_HANDLE_HEIGHT, left:mainHandleLeft,
                                        width:mainHandleWidth, height:height-TOP_HANDLE_HEIGHT, backgroundColor:"rgba(160,150,150,0.2)",
                                        cursor:"grab"
                                        }}
                                        draggingHandler={this.handleDraggingMain} draggedHandler={this.handleDraggedMain}
                                        />;
    }
    else if (!topHandle) {
      MainHandle = <DragInteractionBox  style={{position:"absolute", top:0, left:mainHandleLeft,
                                        width:mainHandleWidth, height:height, backgroundColor:"rgba(160,150,150,0.2)",
                                        cursor:"grab"
                                        }}
                                        draggingHandler={this.handleDraggingMain} draggedHandler={this.handleDraggedMain}
                                        />;
    }
    
    return (
      <div {...rest} style={{overflow:"hidden"}}>
        {LeftHandle}
        {RightHandle}
        {TopHandle}
        {MainHandle}
      </div>
    );
  }
  
  handleDraggingLeft = ({deltaDomX}) => {
    let {draggingLeftHandler} = this.props;
    if (!draggingLeftHandler) {
      return;
    }
    let deltaDataX = this.fromDeltaDomXCoord(deltaDomX);
    draggingLeftHandler({deltaDataX});
  }
  
  handleDraggingMain = ({deltaDomX}) => {
    let {draggingMainHandler} = this.props;
    if (!draggingMainHandler) {
      return;
    }
    let deltaDataX = this.fromDeltaDomXCoord(deltaDomX);
    draggingMainHandler({deltaDataX});
  }
  
  handleDraggingRight = ({deltaDomX}) => {
    let {draggingRightHandler} = this.props;
    if (!draggingRightHandler) {
      return;
    }
    let deltaDataX = this.fromDeltaDomXCoord(deltaDomX);
    draggingRightHandler({deltaDataX});
  }
  
  handleDraggedLeft = ({deltaDomX}) => {
    let {draggedLeftHandler} = this.props;
    if (!draggedLeftHandler) {
      return;
    }
    let deltaDataX = this.fromDeltaDomXCoord(deltaDomX);
    draggedLeftHandler({deltaDataX});
  }
  
  handleDraggedMain = ({deltaDomX}) => {
    let {draggedMainHandler} = this.props;
    if (!draggedMainHandler) {
      return;
    }
    let deltaDataX = this.fromDeltaDomXCoord(deltaDomX);
    draggedMainHandler({deltaDataX});
  }
  
  handleDraggedRight = ({deltaDomX}) => {
    let {draggedRightHandler} = this.props;
    if (!draggedRightHandler) {
      return;
    }
    let deltaDataX = this.fromDeltaDomXCoord(deltaDomX);
    draggedRightHandler({deltaDataX});
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
  
  fromDeltaDomXCoord(deltaDomX) {
    let {minX,maxX,width} = this.props;
    let deltaDataX = fromDomXCoord_Linear(width,minX,maxX,deltaDomX) -
                     fromDomXCoord_Linear(width,minX,maxX,0);
    return deltaDataX;
  }
}

OnPlotXRangeSelection.prototype.SIDE_HANDLE_WIDTH = 10;
OnPlotXRangeSelection.prototype.TOP_HANDLE_HEIGHT = 10;

export default OnPlotXRangeSelection;
