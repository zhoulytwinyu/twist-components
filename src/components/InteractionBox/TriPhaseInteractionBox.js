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
    return (
      <div ref={this.ref} onMouseDown={this.handleMouseDown}
                          {...rest}>
        {children}
        <div  className={this.determineOverlayClass(mode)}></div>
      </div>
    );
  }
  
  componentDidMount() {
    document.addEventListener("mousemove",this.handleDocumentMouseMove);
    document.addEventListener("mouseup",this.handleDocumentMouseUp);
  }

  componentWillUnmount() {
    this.clearModeCascade();
    document.removeEventListener("mousemove",this.handleDocumentMouseMove);
    document.removeEventListener("mouseup",this.handleDocumentMouseUp);
  }
  
  determineOverlayClass(mode) {
    switch (mode){
      case "hovering":
      case "clicking":
      case "double-clicking":
        return "TriPhaseInteractionBox-hiddenOverlay";
      case "selecting":
      case "auto-selecting":
        return "TriPhaseInteractionBox-selectingOverlay";
      case "panning":
        return "TriPhaseInteractionBox-panningOverlay";
      default:
        return null;
    }
  }
  
  handleMouseDown = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    // detect double click 
    if (this.lastClick!==null && ev.timeStamp-this.lastClick<500 &&
        Math.abs(ev.clientX-this.mouseDownClientX)<10 && Math.abs(ev.clientY-this.mouseDownClientY)<10) {
      this.setModeCascade("double-clicking");
      this.lastClick=null;
      this.mouseDownClientX = ev.clientX;
      this.mouseDownClientY = ev.clientY;
      this.referenceClientX = this.ref.current.getBoundingClientRect().left;
      this.referenceClientY = this.ref.current.getBoundingClientRect().top;
      return;
    }
    else {
      this.setModeCascade("clicking");
      this.lastClick = ev.timeStamp;
      this.mouseDownClientX = ev.clientX;
      this.mouseDownClientY = ev.clientY;
      this.referenceClientX = this.ref.current.getBoundingClientRect().left;
      this.referenceClientY = this.ref.current.getBoundingClientRect().top;
    }
  }
  
  handleDocumentMouseUp = (ev) => {
    let {mode} = this.state;
    if (mode==="hovering") {
      return;
    }
    this.clearModeCascade();
    this.setHovering();
    // Trigger respective event on mouseup
    let startDomX = this.mouseDownClientX-this.referenceClientX;
    let startDomY = this.mouseDownClientY-this.referenceClientY;
    let endDomX = ev.clientX-this.referenceClientX;
    let endDomY = ev.clientY-this.referenceClientY;
    let timestamp = ev.timeStamp;
    switch (mode) {
      case "clicking":
        let {clickedHandler} = this.props;
        if (!clickedHandler) {
          break;
        }
        clickedHandler({domX:startDomX,domY:startDomY,timestamp});
        break;
      case "double-clicking":
        let {doubleClickHandler} = this.props;
        if (!doubleClickHandler) {
          break;
        }
        doubleClickHandler({domX:startDomX,domY:startDomY,timestamp});
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
                          endDomX,
                          startDomY,
                          endDomY
                          });
        break;
      case "panning":
        let {pannedHandler} = this.props;
        if (!pannedHandler) {
          break;
        }
        pannedHandler({ startDomX,
                        endDomX,
                        startDomY,
                        endDomY
                        });
        break;
      default:
        throw new Error("ProgrammerTooStupidError");
    }
  }
  
  handleDocumentMouseMove = (ev) => {
    let {mode} = this.state;
    switch (mode){
      case "hovering":
        break;
      case "clicking":
        this.handleDocumentMouseMove_ClickingMode(ev);
        break;
      case "double-clicking":
        this.handleDocumentMouseMove_DoubleClickingMode(ev);
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
  
  handleDocumentMouseMove_DoubleClickingMode(ev) {
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
    let startDomY = this.mouseDownClientY-this.referenceClientY;
    let endDomY = ev.clientY-this.referenceClientY;
    let {selectingHandler} = this.props;
    if (!selectingHandler) {
      return;
    }
    selectingHandler({startDomX,
                      endDomX,
                      startDomY,
                      endDomY
                      });
  }
  
  handleDocumentMouseMove_PanningMode = (ev) => {
    let startDomX = this.mouseDownClientX-this.referenceClientX;
    let endDomX = ev.clientX-this.referenceClientX;
    let startDomY = this.mouseDownClientY-this.referenceClientY;
    let endDomY = ev.clientY-this.referenceClientY;
    let {panningHandler} = this.props;
    if (!panningHandler) {
      return;
    }
    panningHandler({startDomX,
                    endDomX,
                    startDomY,
                    endDomY
                    });
  }
  
  setModeCascade = (targetMode)=>{
    switch (targetMode) {
      case "clicking":
        this.setClicking();
        this.timeout = setTimeout(this.setModeCascade,200,"auto-selecting");
        break;
      case "double-clicking":
        this.setDoubleClicking();
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
  
  setDoubleClicking() {
    this.setState({mode:"double-clicking"});
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
