import React, { PureComponent } from 'react';
import "./TriPhaseInteractionBox.css";

class TriPhaseInteractionBox extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.mouseDownClientX = null;
    this.mouseDownClientY = null;
    this.referenceClientX = null;
    this.referenceClientY = null;
    this.timeout = null;
    this.lastClick = null;
    this.state = {mode:"hovering"};
  }
  
  render(){
    let { children,
          clickedHandler,doubleClickHandler,
          selectingHandler,selectedHandler,
          panningHandler,pannedHandler,
          ...rest} = this.props;
    let {mode} = this.state;
    let overlayClass = "TriPhaseInteractionBox-clickingOverlay";
    if (mode === "selecting" || mode === "auto-selecting") {
      overlayClass = "TriPhaseInteractionBox-selectingOverlay";
    }
    if (mode === "panning") {
      overlayClass = "TriPhaseInteractionBox-panningOverlay";
    }
    return (
      <div ref={this.ref} onMouseDown={this.handleMouseDown}
                          {...rest}>
        {children}
        <div  className={overlayClass}
              style={{display: mode==="hovering" ? "none" : "initial"}}>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    this.clearModeCascade();
    document.removeEventListener("mousemove",this.handleDocumentMouseMove);
    document.removeEventListener("mouseup",this.handleDocumentMouseUp);
  }
  
  handleMouseDown = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.lastClick!==null && ev.timeStamp-this.lastClick<1000 &&
        Math.abs(ev.clientX-this.mouseDownClientX)<10 && Math.abs(ev.clientY-this.mouseDownClientY)<10) {
      this.lastClick=null;
      let {doubleClickHandler} = this.props;
      if (!doubleClickHandler) {
        return;
      }
      doubleClickHandler({domX:this.mouseDownClientX,
                          domY:this.mouseDownClientY});
      return;
    }
    this.lastClick = ev.timeStamp;
    this.mouseDownClientX = ev.clientX;
    this.mouseDownClientY = ev.clientY;
    this.referenceClientX = this.ref.current.getBoundingClientRect().left;
    this.referenceClientY = this.ref.current.getBoundingClientRect().top;
    this.setModeCascade();
    document.addEventListener("mousemove",this.handleDocumentMouseMove);
    document.addEventListener("mouseup",this.handleDocumentMouseUp);
  }
  
  handleDocumentMouseUp = (ev) => {
    document.removeEventListener("mousemove",this.handleDocumentMouseMove);
    document.removeEventListener("mouseup",this.handleDocumentMouseUp);
    this.clearModeCascade();
    let {mode} = this.state;
    let startDomX = this.mouseDownClientX-this.referenceClientX;
    let startDomY = this.mouseDownClientY-this.referenceClientY;
    let endDomX = ev.clientX-this.referenceClientX;
    switch (mode) {
      case "clicking":
        let {clickedHandler} = this.props;
        if (!clickedHandler) {
          break;
        }
        clickedHandler({domX:startDomX,domY:startDomY});
        break;
      case "auto-selecting":
        //pass
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
        throw new Error("ProgrammerTooStupidError");
    }
    this.setHovering();
  }
  
  handleDocumentMouseMove = (ev) => {
    let {mode} = this.state;
    switch (mode){
      case "clicking":
        this.handleDocumentMouseMove_ClickingMode(ev);
        break;
      case "auto-selecting":
        this.handleDocumentMouseMove_AutoSelectingMode(ev);
        break;
      case "selecting":
        this.handleDocumentMouseMove_SelectingMode(ev);
        break;
      case "panning":
        this.handleDocumentMouseMove_PanningMode(ev);
        break;
      default:
        throw new Error("ProgrammerTooDumpError");
    }
  }
  
  handleDocumentMouseMove_ClickingMode(ev) {
    let startDomX = this.mouseDownClientX-this.referenceClientX;
    let endDomX = ev.clientX-this.referenceClientX;
    let moved = Math.abs(startDomX-endDomX);
    if (moved>10 && this.timeout) {
      this.setSelecting();
      this.clearModeCascade();
      this.handleDocumentMouseMove_SelectingMode(ev);
    }
  }
  
  handleDocumentMouseMove_AutoSelectingMode(ev) {
    let startDomX = this.mouseDownClientX-this.referenceClientX;
    let endDomX = ev.clientX-this.referenceClientX;
    let moved = Math.abs(startDomX-endDomX);
    if (moved>10) {
      this.setSelecting();
      this.clearModeCascade();
      this.handleDocumentMouseMove_SelectingMode(ev);
    }
  }

  handleDocumentMouseMove_SelectingMode(ev) {
    let startDomX = this.mouseDownClientX-this.referenceClientX;
    let endDomX = ev.clientX-this.referenceClientX;
    let {selectingHandler} = this.props;
    if (!selectingHandler) {
      return;
    }
    selectingHandler({startDomX,
                      endDomX
                      });
  }
  
  handleDocumentMouseMove_PanningMode = (ev) => {
    let startDomX = this.mouseDownClientX-this.referenceClientX;
    let endDomX = ev.clientX-this.referenceClientX;
    let {panningHandler} = this.props;
    if (!panningHandler) {
      return;
    }
    panningHandler({startDomX,endDomX});
  }
  
  setModeCascade = (targetMode="clicking")=>{
    switch (targetMode) {
      case "clicking":
        this.setClicking();
        this.timeout = setTimeout(this.setModeCascade,200,"auto-selecting");
        break;
      case "auto-selecting":
        this.setAutoSelecting();
        this.timeout = setTimeout(this.setModeCascade,300,"panning");
        break;
      case "panning":
        this.setPanning();
        break;
      default:
        throw new Error("ProgrammerTooStupidError");
    }
  }
  
  clearModeCascade() {
    clearTimeout(this.timeout);
    this.timeout = null;
  }
  
  setHovering() {
    this.setState({mode:"hovering"});
  }
  
  setClicking() {
    this.setState({mode:"clicking"});
  }
  
  setAutoSelecting() {
    this.setState({mode:"auto-selecting"});
  }
  
  setSelecting() {
    this.setState({mode:"selecting"});
  }

  setPanning(){
    this.setState({mode:"panning"});
  }
}

export default TriPhaseInteractionBox;
