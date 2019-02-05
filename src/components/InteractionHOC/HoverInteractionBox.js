import React, { PureComponent } from 'react';

class HoverInteractionBox extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }
  
  render(){
    let {hoverCursor,children,hoveringHandler,mouseOutHandler,...rest} = this.props;
    return (
      <div {...rest} onMouseMove={this.handleMouseMove} onMouseOut={this.handleHoverEnd}>
        {children}
      </div>
    );
  }
  
  handleMouseMove(ev) {
    if (ev.buttons!==0) {
      return;
    }
    let {hoveringHandler} = this.props;
    if (!hoveringHandler){
      return;
    }
    let bounds = ev.target.getBoundingClientRect();
    let domX = ev.clientX;
    let domY = ev.clientY;
    hoveringHandler({domX,domY});
  }
  
  handleMouseOut(ev) {
    if (ev.buttons!==0) {
      return;
    }
    let {mouseOutHandler} = this.props;
    if (!mouseOutHandler){
      return;
    }
    let bounds = ev.target.getBoundingClientRect();
    let domX = ev.clientX - bounds.left;
    let domY = ev.clientY - bounds.top;
    mouseOutHandler({domX,domY});
  }
}

export default HoverInteractionBox;
