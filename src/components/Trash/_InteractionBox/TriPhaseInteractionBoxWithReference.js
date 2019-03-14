import React, { PureComponent } from 'react';
import TriPhaseInteractionBox from "./TriPhaseInteractionBox";
import {fromDomXCoord_Linear,
        fromDomYCoord_Linear} from "plot-utils";

class TriPhaseInteractionBoxWithReference extends PureComponent {
  constructor(props){
    super(props);
    this.state = {mode:"hovering"};
    this.ref = React.createRef();
  }
  
  render(){
    let { children,
          minX,maxX,width,
          minY,maxY,height,
          clickedHandler,doubleClickHandler,
          selectingHandler,selectedHandler,
          panningHandler,pannedHandler,
          ...rest} = this.props;
    return (
      <TriPhaseInteractionBox {...rest}
                              clickedHandler={this.clickedHandler}
                              doubleClickHandler={this.doubleClickHandler}
                              selectingHandler={this.selectingHandler} selectedHandler={this.selectedHandler}
                              panningHandler={this.panningHandler} pannedHandler={this.pannedHandler}
                              >
        {children}
      </TriPhaseInteractionBox>
    );
  }
  
  clickedHandler = ({domX,domY,timestamp}) => {
    let {clickedHandler} = this.props;
    if (!clickedHandler){
      return;
    }
    let dataX = this.fromDomXCoord(domX);
    let dataY = this.fromDomYCoord(domY);
    clickedHandler({dataX,dataY,domX,domY,timestamp});
  }
  
  doubleClickHandler = ({domX,domY,timestamp}) => {
    let {doubleClickHandler} = this.props;
    if (!doubleClickHandler){
      return;
    }
    let dataX = this.fromDomXCoord(domX);
    let dataY = this.fromDomYCoord(domY);
    doubleClickHandler({dataX,dataY,domX,domY,timestamp});
  }
  
  selectingHandler = ({startDomX,endDomX,startDomY,endDomY}) => {
    let {selectingHandler} = this.props;
    if (!selectingHandler){
      return;
    }
    let startDataX = this.fromDomXCoord(startDomX);
    let endDataX = this.fromDomXCoord(endDomX);
    let startDataY = this.fromDomYCoord(startDomY);
    let endDataY = this.fromDomYCoord(endDomY);
    selectingHandler({startDataX,endDataX,startDomX,endDomX,
                      startDataY,endDataY,startDomY,endDomY});
  }
  
  selectedHandler = ({startDomX,endDomX,startDomY,endDomY}) => {
    let {selectedHandler} = this.props;
    if (!selectedHandler){
      return;
    }
    let startDataX = this.fromDomXCoord(startDomX);
    let endDataX = this.fromDomXCoord(endDomX);
    let startDataY = this.fromDomYCoord(startDomY);
    let endDataY = this.fromDomYCoord(endDomY);
    selectedHandler({startDataX,endDataX,startDomX,endDomX,
                      startDataY,endDataY,startDomY,endDomY});
  }
  
  panningHandler = ({startDomX,endDomX,startDomY,endDomY}) => {
    let {panningHandler} = this.props;
    if (!panningHandler){
      return;
    }
    let startDataX = this.fromDomXCoord(startDomX);
    let endDataX = this.fromDomXCoord(endDomX);
    let startDataY = this.fromDomYCoord(startDomY);
    let endDataY = this.fromDomYCoord(endDomY);
    panningHandler({startDataX,endDataX,startDomX,endDomX,
                      startDataY,endDataY,startDomY,endDomY});
  }
  
  pannedHandler = ({startDomX,endDomX,startDomY,endDomY}) => {
    let {pannedHandler} = this.props;
    if (!pannedHandler){
      return;
    }
    let startDataX = this.fromDomXCoord(startDomX);
    let endDataX = this.fromDomXCoord(endDomX);
    let startDataY = this.fromDomYCoord(startDomY);
    let endDataY = this.fromDomYCoord(endDomY);
    pannedHandler({startDataX,endDataX,startDomX,endDomX,
                      startDataY,endDataY,startDomY,endDomY});
  }
  
  fromDomXCoord(domX) {
    let {minX,maxX,width} = this.props;
    return fromDomXCoord_Linear(width,minX,maxX,domX);
  }
  
  fromDomYCoord(domY) {
    let {minY,maxY,height} = this.props;
    return fromDomYCoord_Linear(height,minY,maxY,domY);
  }
}

export default TriPhaseInteractionBoxWithReference;
