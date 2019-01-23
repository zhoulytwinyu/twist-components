import React, { Component } from 'react';

class InteractionBox extends Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.ref = React.createRef();
  }
  
  render() {
    let {style,height,width} = this.props;
    return (
      <div ref={this.ref} style={{...style,height:height+"px",width:width+"px"}}  onClick={this.handleClick} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut}></div>
    );
  }
  
  handleMouseMove(ev) {
    let {mouseMoveHandler} = this.props;
    let bounds = this.ref.current.getBoundingClientRect();
    let domX = ev.clientX - bounds.left;
    let domY = ev.clientY - bounds.top;
    mouseMoveHandler({hoverX:this.fromDomXCoord(domX),
                      hoverY:this.fromDomYCoord(domY)});
  }
  
  handleClick(ev) {
    
  }
  
  handleMouseOut(ev) {
    let {mouseMoveHandler} = this.props;
    mouseMoveHandler({hoverX:null,hoverY:null});
  }
  
  fromDomXCoord(domX) {
    let {minX,maxX,width} = this.props;
    let dataXPxScale = (maxX-minX)/width;
    return domX*dataXPxScale+minX;
  }
  
  fromDomYCoord(domY) {
    let {minY,maxY,height} = this.props;
    let dataYPxScale = (maxY-minY)/height;
    return (height-domY)*dataYPxScale+minY;
  }
}

export default InteractionBox;
