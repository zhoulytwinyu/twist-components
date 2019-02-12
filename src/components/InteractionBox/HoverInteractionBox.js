import React, { PureComponent } from 'react';
import {fromDomXCoord_Linear,
        fromDomYCoord_Linear} from "plot-utils";

class HoverInteractionBox extends PureComponent {
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
      <div ref={this.ref} {...rest} onMouseDown={console.log} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut}>
        {children}
      </div>
    );
  }
  
  handleMouseMove = (ev) => {
    let {hoveringHandler} = this.props;
    if (!hoveringHandler || ev.buttons!==0){
      return;
    }
    let bounds = this.ref.current.getBoundingClientRect();
    let domX = ev.clientX - bounds.left;
    let domY = ev.clientY - bounds.top;
    hoveringHandler({domX,domY});
  }
  
  handleMouseOut = (ev) => {
    let {mouseOutHandler} = this.props;
    if (!mouseOutHandler){
      return;
    }
    let bounds = this.ref.current.getBoundingClientRect();
    let domX = ev.clientX - bounds.left;
    let domY = ev.clientY - bounds.top;
    mouseOutHandler({domX,domY});
  }
}

export default HoverInteractionBox;
