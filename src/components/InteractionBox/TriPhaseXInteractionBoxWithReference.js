import React, { PureComponent } from 'react';
import TriPhaseXInteractionBox from "./TriPhaseXInteractionBox";
import {fromDomXCoord_Linear,
        fromDomYCoord_Linear} from "plot-utils";

class TriPhaseXInteractionBoxWithReference extends PureComponent {
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
      <TriPhaseXInteractionBox  {...rest}
                                clickedHandler={this.clickedHandler}
                                doubleClickHandler={this.doubleClickHandler}
                                selectingHandler={this.selectingHandler} selectedHandler={this.selectedHandler}
                                panningHandler={this.panningHandler} pannedHandler={this.pannedHandler}
                                >
        {children}
      </TriPhaseXInteractionBox>
    );
  }
  
  clickedHandler = ({domX,domY}) => {
    let {clickedHandler} = this.props;
    if (!clickedHandler){
      return;
    }
    let dataX = this.fromDomXCoord(domX);
    let dataY = this.fromDomYCoord(domY);
    clickedHandler({dataX,dataY,domX,domY});
  }
  
  doubleClickHandler = ({domX,domY}) => {
    let {doubleClickHandler} = this.props;
    if (!doubleClickHandler){
      return;
    }
    let dataX = this.fromDomXCoord(domX);
    let dataY = this.fromDomYCoord(domY);
    doubleClickHandler({dataX,dataY,domX,domY});
  }
  
  selectingHandler = ({startDomX,endDomX}) => {
    let {selectingHandler} = this.props;
    if (!selectingHandler){
      return;
    }
    let startDataX = this.fromDomXCoord(startDomX);
    let endDataX = this.fromDomXCoord(endDomX);
    selectingHandler({startDataX,endDataX,startDomX,endDomX});
  }
  
  selectedHandler = ({startDomX,endDomX}) => {
    let {selectedHandler} = this.props;
    if (!selectedHandler){
      return;
    }
    let startDataX = this.fromDomXCoord(startDomX);
    let endDataX = this.fromDomXCoord(endDomX);
    selectedHandler({startDataX,endDataX,startDomX,endDomX});
  }
  
  panningHandler = ({startDomX,endDomX}) => {
    let {panningHandler} = this.props;
    if (!panningHandler){
      return;
    }
    let startDataX = this.fromDomXCoord(startDomX);
    let endDataX = this.fromDomXCoord(endDomX);
    panningHandler({startDataX,endDataX,startDomX,endDomX});
  }
  
  pannedHandler = ({startDomX,endDomX}) => {
    let {pannedHandler} = this.props;
    if (!pannedHandler){
      return;
    }
    let startDataX = this.fromDomXCoord(startDomX);
    let endDataX = this.fromDomXCoord(endDomX);
    pannedHandler({startDataX,endDataX,startDomX,endDomX});
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

export default TriPhaseXInteractionBoxWithReference;
