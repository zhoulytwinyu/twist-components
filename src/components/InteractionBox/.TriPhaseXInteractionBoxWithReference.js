import React, { PureComponent } from 'react';
import TriPhaseXInteractionBox from "./TriPhaseXInteractionBox";
import {fromDomXCoord_Linear} from "plot-utils";

class TriPhaseXInteractionBoxWithReference extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }
  
  render(){
    let { children,
          minX,maxX,width,
          clickedHandler,selectingHandler,selectedHandler,
          panningHandler,pannedHandler,
          ...rest} = this.props;
    return (
      <TriPhaseXInteractionBox  {...rest}
                                clickedHandler={this.clickedHandler}
                                selectingHandler={this.selectingHandler} selectedHandler={this.selectedHandler}
                                panningHandler={this.panningHandler} pannedHandler={this.pannedHandler}
                                >
        {children}
      </TriPhaseXInteractionBox>
    );
  }
  
  clickedHandler = ({domX}) => {
    let {clickedHandler} = this.props;
    if (!clickedHandler){
      return;
    }
    let dataX = this.fromDomXCoord(domX);
    clickedHandler({dataX});
  }
  
  selectingHandler = ({startDomX,endDomX}) => {
    let {selectingHandler} = this.props;
    if (!selectingHandler){
      return;
    }
    let startDataX = this.fromDomXCoord(startDomX);
    let endDataX = this.fromDomXCoord(endDomX);
    selectingHandler({startDataX,endDataX});
  }
  
  selectedHandler = ({startDomX,endDomX}) => {
    let {selectedHandler} = this.props;
    if (!selectedHandler){
      return;
    }
    let startDataX = this.fromDomXCoord(startDomX);
    let endDataX = this.fromDomXCoord(endDomX);
    selectedHandler({startDataX,endDataX});
  }
  
  panningHandler = ({startDomX,endDomX}) => {
    let {panningHandler} = this.props;
    if (!panningHandler){
      return;
    }
    let startDataX = this.fromDomXCoord(startDomX);
    let endDataX = this.fromDomXCoord(endDomX);
    panningHandler({startDataX,endDataX});
  }
  
  pannedHandler = ({startDomX,endDomX}) => {
    let {pannedHandler} = this.props;
    if (!pannedHandler){
      return;
    }
    let startDataX = this.fromDomXCoord(startDomX);
    let endDataX = this.fromDomXCoord(endDomX);
    pannedHandler({startDataX,endDataX});
  }
  
  fromDomXCoord(domX) {
    let {minX,maxX,width} = this.props;
    return fromDomXCoord_Linear(width,minX,maxX,domX);
  }
}

export default TriPhaseXInteractionBoxWithReference;
