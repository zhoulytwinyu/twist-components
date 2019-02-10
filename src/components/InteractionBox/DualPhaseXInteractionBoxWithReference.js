import React, { PureComponent } from 'react';
import DualPhaseXInteractionBox from "./DualPhaseXInteractionBox";
import {fromDomXCoord_Linear} from "plot-utils";

class DualPhaseXInteractionBoxWithReference extends PureComponent {
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
      <DualPhaseXInteractionBox  {...rest}
                                selectingHandler={this.selectingHandler} selectedHandler={this.selectedHandler}
                                panningHandler={this.panningHandler} pannedHandler={this.pannedHandler}
                                >
        {children}
      </DualPhaseXInteractionBox>
    );
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

export default DualPhaseXInteractionBoxWithReference;
