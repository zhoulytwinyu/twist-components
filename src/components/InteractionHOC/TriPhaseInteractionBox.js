import React, { PureComponent } from 'react';

class TriPhaseInteractionBox extends PureComponent {
  constructor(props){
    super(props);
    this.mouseDownPos = null;
    this.moved = null;
    this.timeout = null;
    this.mode = "hovering";
    
    this.ref = React.createRef();
    
    this.setModeCascade = this.setModeCascade.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleDocumentMouseUp = this.handleDocumentMouseUp.bind(this);
    this.handleDocumentMouseMove = this.handleDocumentMouseMove.bind(this);
  }
  
  render(){ 
    let {children,...rest} = this.props;      
    return (
      <div{...rest} onMouseDown={this.handleMouseDown}>
        {children}
      </div>
    );
  }
  
  handleMouseDown(ev) {
    this.mouseDownPos = {clientX:ev.clientX,clientY:ev.clientY};
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
        let {clickedHandler} = this.props;
        if (!clickedHandler) {
          break;
        }
        let bounds = ev.target.getBoundingClientRect();
        let domX = ev.clientX - bounds.left;
        let domY = ev.clientY - bounds.top;
        clickedHandler({domX,domY});
        break;
      case "selecting":
        let {selectedHandler} = this.props;
        if (!selectedHandler) {
          break;
        }
        let deltaDomX=ev.clientX-this.mouseDownPos.clientX;
        let deltaDomY=ev.clientY-this.mouseDownPos.clientY;
        selectedHandler({deltaDomX,deltaDomY});
        break;
      case "panning":
        let {pannedHandler} = this.props;
        if (!pannedHandler) {
          break;
        }
        deltaDomX=ev.clientX-this.mouseDownPos.clientX;
        deltaDomY=ev.clientY-this.mouseDownPos.clientY;
        pannedHandler({deltaDomX,deltaDomY});
        break;
      default:
        throw new Error("UserTooStupidError");
    }
    this.setHovering();
  }
  
  handleDocumentMouseMove(ev) {
    this.moved = true;
    let {updateHandler} = this.props;
    switch (this.mode){
      case "clicking":
        clearTimeout(this.timeout);
        this.setSelecting();
        this.handleDocumentMouseMove(ev);
        break;
      case "selecting":
        let {selectingHandler} = this.props;
        if (!selectingHandler) {
          return;
        }
        let deltaDomX=ev.clientX-this.mouseDownPos.clientX;
        let deltaDomY=ev.clientY-this.mouseDownPos.clientY;
        selectingHandler({deltaDomX,deltaDomY});
        break;
      case "panning":
        let {panningHandler} = this.props;
        if (!panningHandler) {
          return;
        }
        deltaDomX=ev.clientX-this.mouseDownPos.clientX;
        deltaDomY=ev.clientY-this.mouseDownPos.clientY;
        panningHandler({deltaDomX,deltaDomY});
        break;
      default:
        throw new Error("UserTooDumpError");
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
          this.setPanning();
        }
        break;
      default:
        throw new Error("UserTooStupidError");
    }
  }
  
  setHovering() {
    this.mode = "hovering";
    document.body.style.cursor = "auto";
  }
  
  setClicking() {
    this.mode = "clicking";
    document.body.style.cursor = "auto";
  }
  
  setSelecting() {
    this.mode = "selecting";
    document.body.style.cursor = "ew-resize";
    let {selectingHandler} = this.props;
    if (!selectingHandler) {
      return;
    }
    let deltaDomX=0;
    let deltaDomY=0;
    selectingHandler({deltaDomX,deltaDomY});
  }
  
  setPanning(){
    let panHandler 
    this.mode = "panning";
    document.body.style.cursor = "move";
    let {panningHandler} = this.props;
    if (!panningHandler) {
      return;
    }
    let deltaDomX=0;
    let deltaDomY=0;
    panningHandler({deltaDomX,deltaDomY});
  }
}

export default TriPhaseInteractionBox;
