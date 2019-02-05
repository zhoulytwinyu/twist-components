import React, { PureComponent } from "react";
import {toDomXCoord_Linear,
        fromDomXCoord_Linear} from "plot-utils";
import DragInteractionBox from "../components/InteractionHOC/DragInteractionBox";

class Div extends PureComponent {
  
  render (){
    return (
      <div {...this.props}> </div>
    );
  }
}

class XRangeSelector extends PureComponent {
  constructor(props) {
    super(props);
    this.handleDragging = this.handleDragging.bind(this);
    this.HandleDragged = this.HandleDragged.bind(this);
  }
  
  render() {
    let {minX,maxX,selectorMinX,selectorMaxX,width,height,style,...rest} = this.props;
    let {SIDE_HANDLE_WIDTH,TOP_HANDLE_HEIGHT} = this;
    
    let mainBoxLeft = this.toDomXCoord(selectorMinX);
    let leftHandleLeft = mainBoxLeft-SIDE_HANDLE_WIDTH;
    let topHandleLeft = leftHandleLeft;
    let rightHandleLeft = this.toDomXCoord(selectorMaxX);
    let mainBoxWidth = rightHandleLeft-mainBoxLeft;
    let topHandleWidth = mainBoxWidth+2*SIDE_HANDLE_WIDTH;
    
    style = {...style,width,height,overflow:"hidden",position:"relative"};
    
    return (
      <div  style={style}>
        {/* left handle */}
        <DragInteractionBox dragCursor="w-resize" draggingHandler={this.handleDragging} draggedHandler={this.handleDragged}
                            style={{position:"absolute", top:TOP_HANDLE_HEIGHT, left:leftHandleLeft,
                                    width:SIDE_HANDLE_WIDTH, height:height-TOP_HANDLE_HEIGHT, backgroundColor:"rgba(150,150,150,0.8)",
                                    cursor:"w-resize"
                                    }}
                            />
        {/* right handle */}
        <DragInteractionBox dragCursor="e-resize" draggingHandler={this.handleDragging} draggedHandler={this.handleDragged}
                            style={{position:"absolute", top:TOP_HANDLE_HEIGHT, left:rightHandleLeft,
                                    width:SIDE_HANDLE_WIDTH, height:height-TOP_HANDLE_HEIGHT, backgroundColor:"rgba(150,150,150,0.8)",
                                    cursor:"e-resize"
                                    }}
                            />
        {/* top handle */}
        <DragInteractionBox dragCursor="grabbing" draggingHandler={this.handleDragging} draggedHandler={this.handleDragged}
                            style={{position:"absolute", top:0, left:topHandleLeft,
                                    width:topHandleWidth, height:TOP_HANDLE_HEIGHT, backgroundColor:"rgba(160,150,150,0.2)",
                                    cursor:"grabbing"
                                    }}
                            />
        {/* main box */}
        <DragInteractionBox dragCursor="grabbing" draggingHandler={this.handleDragging} draggedHandler={this.handleDragged}
                            style={{position:"absolute", top:TOP_HANDLE_HEIGHT, left:mainBoxLeft,
                                    width:mainBoxWidth, height:height-TOP_HANDLE_HEIGHT, backgroundColor:"rgba(160,150,150,0.2)",
                                    cursor:"grabbing"
                                    }}
                            />
      </div>
    );
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
  
  handleDragging({deltaDomX}) {
    let {draggingHandler} = this.props;
    if (!draggingHandler) {
      return;
    }
    let deltaDataX = this.fromDeltaDomXCoord(deltaDomX);
    draggingHandler({deltaDataX});
  }
  
  HandleDragged({deltaDomX}) {
    let {draggedHandler} = this.props;
    if (!draggedHandler) {
      return;
    }
    let deltaDataX = this.fromDeltaDomXCoord(deltaDomX);
    draggedHandler({deltaDataX});
  }
}

XRangeSelector.prototype.SIDE_HANDLE_WIDTH = 10;
XRangeSelector.prototype.TOP_HANDLE_HEIGHT = 10;

export default XRangeSelector;
