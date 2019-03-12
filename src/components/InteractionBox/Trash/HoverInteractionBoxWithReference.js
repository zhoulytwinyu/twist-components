import React, { PureComponent } from 'react';
import HoverInteractionBox from "./HoverInteractionBox";
import {fromDomXCoord_Linear,
        fromDomYCoord_Linear} from "plot-utils";

class HoverInteractionBoxWithReference extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }
  
  render(){
    let {children,hoveringHandler,mouseOutHandler,
          minX,maxX,width,
          minY,maxY,height,
          ...rest} = this.props;
    return (
      <HoverInteractionBox  {...rest}
                            hoveringHandler={this.handleHovering}
                            mouseOutHandler={this.handleMouseOut}
                            >
        {children}
      </HoverInteractionBox>
    );
  }
  
  handleHovering = ({domX,domY,timestamp}) => {
    let {hoveringHandler} = this.props;
    if (!hoveringHandler){
      return;
    }
    let dataX = this.fromDomXCoord(domX);
    let dataY = this.fromDomYCoord(domY);
    hoveringHandler({dataX,dataY,domX,domY,timestamp});
  }
  
  handleMouseOut = ({domX,domY,timestamp}) => {
    let {mouseOutHandler} = this.props;
    if (!mouseOutHandler){
      return;
    }
    let dataX = this.fromDomXCoord(domX);
    let dataY = this.fromDomYCoord(domY);
    mouseOutHandler({dataX,dataY,domX,domY,timestamp});
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

export default HoverInteractionBoxWithReference;
