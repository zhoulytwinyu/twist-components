import React, { PureComponent } from 'react';
import {fromDomXCoord_Linear} from "plot-utils";

class DualPhaseInteractionBox extends PureComponent {
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
    this.setModeCascade("selecting");
    document.addEventListener("mousemove",this.handleDocumentMouseMove);
    document.addEventListener("mouseup",this.handleDocumentMouseUp);
  }
  
  handleDocumentMouseUp = (ev) => {
    clearTimeout(this.timeout);
    document.removeEventListener("mousemove",this.handleDocumentMouseMove);
    document.removeEventListener("mouseup",this.handleDocumentMouseUp);
    if (this.moved) {
      let startDomX = this.mouseDownClientX-this.ref.current.getBoundingClientRect().left;
      let endDomX = ev.clientX-this.ref.current.getBoundingClientRect().left;
      switch (this.mode) {
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
          throw new Error("ProgrammerTooStupidError");
      }
    }
    this.setHovering();
  }
  
  handleDocumentMouseMove = (ev) => {
    if (!this.moved && Math.abs(ev.clientX-this.mouseDownClientX)>5) {
      this.moved = true;
    }
    if (!this.moved) {
      return;
    }
    let deltaDomX = null;
    let deltaDataX = null;
    let startDomX = this.mouseDownClientX-this.ref.current.getBoundingClientRect().left;
    let endDomX = ev.clientX-this.ref.current.getBoundingClientRect().left;
    switch (this.mode){
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
        throw new Error("ProgrammerTooStupidError");
    }
  }

  setModeCascade = (targetMode)=>{
    switch (targetMode) {
      case "selecting":
        if (!this.moved) {
          this.setSelecting();
          this.timeout = setTimeout(this.setModeCascade,500,"panning");
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

export default DualPhaseInteractionBox;
