import React, { Component } from 'react';

class InteractionBox extends Component {
  constructor(props) {
    super(props);
    this.mouseDownEvent = null;
    this.timeout = null;
    this.mode = null;
    this.moved = null;
    this.setHovering();

    this.setModeCascade = this.setModeCascade.bind(this);
    // document event handler
    this.handleDocumentMouseMove = this.handleDocumentMouseMove.bind(this);
    this.handleDocumentMouseUp = this.handleDocumentMouseUp.bind(this);
    // canvas event handler
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.ref = React.createRef();
  }
  
  render() {
    let {height,width,top,left} = this.props;
    return (
      <div ref={this.ref} style={{position:"absolute",height:height,width:width,top:top,left:left}}
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseOut={this.handleMouseOut}></div>
    );
  }
  
  handleMouseDown(ev) {
    this.mouseDownEvent = ev;
    this.moved = false;
    this.setModeCascade("clicking");
    document.onmousemove = this.handleDocumentMouseMove;
    document.onmouseup = this.handleDocumentMouseUp;
  }
  
  handleDocumentMouseUp(ev) {
    document.onmousemove = null;
    document.onmouseup = null;
    clearTimeout(this.timeout);
    switch (this.mode) {
      case "clicking":
        console.log("clicked");
        break;
      case "selecting":
        console.log("selected");
        break;
      case "panning":
        console.log("panned");
        break;
      default:
        throw new Error("UserTooStupidError");
    }
    this.mode = "hovering";
    document.body.style.cursor = "auto";
  }
  
  handleDocumentMouseMove(ev) {
    this.moved = true;
    let {updateHandler} = this.props;
    switch (this.mode){
      case "clicking":
        clearTimeout(this.timeout);
        this.mode = "selecting";
        document.body.style.cursor = "ew-resize";
        console.log("switching mode");
        this.handleMouseMove(ev);
        break;
      case "selecting":
        console.log("Selecting",ev);
        break;
      case "panning":
        console.log("Panning",ev);
        return;
      default:
        throw new Error("UserTooDumpError");
    }
  }
  
  handleMouseMove(ev) {
    let {updateHandler} = this.props;
    if (this.mode === "hovering") {
      let bounds = this.ref.current.getBoundingClientRect();
      let domX = ev.clientX - bounds.left;
      let domY = ev.clientY - bounds.top;
      console.log({ hoverX:this.fromDomXCoord(domX),
                    hoverY:this.fromDomYCoord(domY)});
    }
  }
  
  handleMouseOut(ev) {
    if (this.mode === "hovering") {
      console.log("set hoverX hoverY to null");
    }
  }

  setModeCascade(targetMode) {
    switch (targetMode) {
      case "clicking":
        this.setClicking();
        this.timeout = setTimeout(this.setModeCascade,200,"selecting");
        break;
      case "selecting":
        if (!this.moved) {
          this.setSelecting();
          this.timeout = setTimeout(this.setModeCascade,1000,"panning");
        }
        break;
      case "panning":
        if (!this.moved) {
          document.body.style.cursor = "move";
          this.setPanning();
        }
        break;
      default:
        throw new Error("UserTooStupidError");
    }
  }
  
  setHovering() {
    console.log("hovering");
    this.mode = "hovering";
    document.body.style.cursor = "auto";
  }
  
  setClicking() {
    console.log("clicking");
    this.mode = "clicking";
    document.body.style.cursor = "auto";
  }
  
  setSelecting() {
    console.log("selecting");
    this.mode = "selecting";
    document.body.style.cursor = "ew-resize";
  }
  
  setPanning(){
    console.log("panning");
    this.mode = "panning";
    document.body.style.cursor = "move";
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
