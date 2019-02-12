import React, { PureComponent } from "react";
import {toDomXCoord_Linear,
        fromDomXCoord_Linear} from "plot-utils";
import DragInteractionBox from "../components/InteractionBox/DragInteractionBox";


class OnPlotXRangeSelection extends PureComponent {
  constructor(props) {
    super(props);
  }
  
  render() {
    let { minX,maxX,width,
          startX,endX,
          height,style,
          ...rest} = this.props;
    let {SIDE_HANDLE_WIDTH,TOP_HANDLE_HEIGHT} = this;
    let mainBoxLeft = this.toDomXCoord(startX);
    let leftHandleLeft = mainBoxLeft-SIDE_HANDLE_WIDTH;
    let topHandleLeft = leftHandleLeft;
    let rightHandleLeft = this.toDomXCoord(endX);
    let mainBoxWidth = rightHandleLeft-mainBoxLeft;
    let topHandleWidth = mainBoxWidth+2*SIDE_HANDLE_WIDTH;
    
    style = {width,height,overflow:"hidden",position:"relative",...style};
    
    return (
      <div style={style}>
        {/* left handle */}
        <DragInteractionBox style={{position:"absolute", top:TOP_HANDLE_HEIGHT, left:leftHandleLeft,
                                    width:SIDE_HANDLE_WIDTH, height:height-TOP_HANDLE_HEIGHT, backgroundColor:"rgba(150,150,150,0.8)",
                                    cursor:"w-resize"
                                    }}
                            draggingHandler={this.handleDraggingLeft} draggedHandler={this.handleDraggedLeft}
                            />
        {/* right handle */}
        <DragInteractionBox style={{position:"absolute", top:TOP_HANDLE_HEIGHT, left:rightHandleLeft,
                                    width:SIDE_HANDLE_WIDTH, height:height-TOP_HANDLE_HEIGHT, backgroundColor:"rgba(150,150,150,0.8)",
                                    cursor:"e-resize"
                                    }}
                            draggingHandler={this.handleDraggingRight} draggedHandler={this.handleDraggedRight}
                            />
        {/* top handle */}
        <DragInteractionBox style={{position:"absolute", top:0, left:topHandleLeft,
                                    width:topHandleWidth, height:TOP_HANDLE_HEIGHT, backgroundColor:"rgba(160,150,150,0.2)",
                                    cursor:"grab"
                                    }}
                            draggingHandler={this.handleDraggingMain} draggedHandler={this.handleDraggedMain}
                            />
        {/* main box */}
        <DragInteractionBox style={{position:"absolute", top:TOP_HANDLE_HEIGHT, left:mainBoxLeft,
                                    width:mainBoxWidth, height:height-TOP_HANDLE_HEIGHT, backgroundColor:"rgba(160,150,150,0.2)",
                                    cursor:"grab"
                                    }}
                            draggingHandler={this.handleDraggingMain} draggedHandler={this.handleDraggedMain}
                            />
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
