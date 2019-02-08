import React, { PureComponent } from 'react';
import {fromDomXCoord_Linear} from "plot-utils";

class TriPhaseInteractionBox extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.mouseDownClientX = null;
    this.moved = null;
    this.timeout = null;
    this.mode = "hovering";
  }
  
  render(){
    let { children,
          clickedHandler,
          selectingHandler,selectedHandler,
          panningHandler,pannedHandler,
          ...rest} = this.props;
    return (
      <div ref={this.ref} onMouseDown={this.handleMouseDown} {...rest}>
        {children}
      </div>
    );
  }
  
  handleMouseDown = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    this.mouseDownClientX = ev.clientX;
    this.moved = false;
    this.setModeCascade("clicking");
    document.addEventListener("mousemove",this.handleDocumentMouseMove);
    document.addEventListener("mouseup",this.handleDocumentMouseUp);
  }
  
  handleDocumentMouseUp = (ev) => {
    document.removeEventListener("mousemove",this.handleDocumentMouseMove);
    document.removeEventListener("mouseup",this.handleDocumentMouseUp);
    clearTimeout(this.timeout);
    let startDomX = this.mouseDownClientX-this.ref.current.getBoundingClientRect().left;
    let endDomX = ev.clientX-this.ref.current.getBoundingClientRect().left;
    switch (this.mode) {
      case "clicking":
        let {clickedHandler} = this.props;
        if (!clickedHandler) {
          break;
        }
        clickedHandler({domX:startDomX});
        break;
      case "selecting":
        let {selectedHandler} = this.props;
        if (!selectedHandler) {
          break;
        }
        selectedHandler({ startDomX,
                          endDomX
                          });
        break;
      case "panning":
        let {pannedHandler} = this.props;
        if (!pannedHandler) {
          break;
        }
        pannedHandler({startDomX,endDomX});
        break;
      default:
        throw new Error("UserTooStupidError");
    }
    this.setHovering();
  }
  
  handleDocumentMouseMove = (ev) => {
    this.moved = true;
    let deltaDomX = null;
    let deltaDataX = null;
    let startDomX = this.mouseDownClientX-this.ref.current.getBoundingClientRect().left;
    let endDomX = ev.clientX-this.ref.current.getBoundingClientRect().left;
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
        selectingHandler({startDomX,
                          endDomX
                          });
        break;
      case "panning":
        let {panningHandler} = this.props;
        if (!panningHandler) {
          return;
        }
        panningHandler({startDomX,endDomX});
        break;
      default:
        throw new Error("UserTooDumpError");
    }
  }

  setModeCascade = (targetMode)=>{
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
        throw new Error("ProgrammerTooStupidError");
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
  }
  
  setPanning(){
    let panHandler 
    this.mode = "panning";
    document.body.style.cursor = "move";
  }
}

export default TriPhaseInteractionBox;
