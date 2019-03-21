import React, { PureComponent } from 'react';
// Components
import DragOverlay from "../UtilityComponents/DragOverlay";
import CountDown from "../UtilityComponents/CountDown";

// CSS
import "./PlotInteractionBox.css";

class PlotInteractionBox extends PureComponent {
  constructor(props){
    super(props);
    this.state={mode:"hovering"};
    this.ref = React.createRef();
    this.initialMouseDownPosition = null;
    this.prevClickTimeStamp = null;
  }

  render() {
    let { hoveringHandler,hoverEndHandler,
          clickHandler,doubleClickHandler,
          selectingHandler,selectedHandler,
          panningHandler,pannedHandler,
          children,
          ...rest
          } = this.props;
    switch (this.state.mode) {
      case "hovering":
        return (
          <>
            <div  ref={this.ref} {...rest}
                  onMouseMove={this.handleMouseMove_Hovering}
                  onMouseOut={this.handleMouseOut_Hovering}
                  onMouseDown={this.handleMouseDown_Hovering}
                  >
              {children}
            </div>
          </>
        );
      case "clicking":
        return (
          <>
            <div  ref={this.ref} {...rest}>
              {children}
            </div>
            <DragOverlay mouseMoveHandler={this.handleMouseMove_Clicking} mouseUpHandler={this.handleMouseUp_Clicking} cursor="point"/>
            <CountDown timeout={200} callback={this.clickTimeout}/>
          </>
        );
      case "auto-selecting":
        return (
          <>
            <div  ref={this.ref} {...rest}>
              {children}
            </div>
            <DragOverlay mouseMoveHandler={this.handleMouseMove_AutoSelecting} mouseUpHandler={this.handleMouseUp_AutoSelecting} cursor="nesw-resize"/>
            <CountDown timeout={500} callback={this.autoSelectingTimeout}/>
          </>
        );
      case "selecting":
        return (
          <>
            <div  ref={this.ref} {...rest}>
              {children}
            </div>
            <DragOverlay mouseMoveHandler={this.handleMouseMove_Selecting} mouseUpHandler={this.handleMouseUp_Selecting} cursor="nesw-resize"/>
            <div className="PlotInteractionBox-selectingOverlay"></div>
          </>
        );
      case "panning":
        return (
          <>
            <div  ref={this.ref} {...rest}>
              {children}
            </div>
            <DragOverlay mouseMoveHandler={this.handleMouseMove_Panning} mouseUpHandler={this.handleMouseUp_Panning} cursor="grabbing"/>
            <div className="PlotInteractionBox-panningOverlay"></div>
          </>
        );
      default:
        throw new Error("ProgrammerTooDumbError");
    }
  }
  
  handleMouseMove_Hovering = (ev)=>{
    let {hoveringHandler} = this.props;
    let referenceFrame = this.ref.current.getBoundingClientRect();
    let domX = ev.clientX - referenceFrame.left;
    let domY = ev.clientY - referenceFrame.top;
    hoveringHandler({domX,domY});
  }

  handleMouseOut_Hovering = (ev)=>{
    let {hoverEndHandler} = this.props;
    hoverEndHandler();
  }
  
  handleMouseDown_Hovering = (ev)=>{
    let {hoverEndHandler} = this.props;
    ev.preventDefault();
    let referenceFrame = this.ref.current.getBoundingClientRect();
    let domX = ev.clientX - referenceFrame.left;
    let domY = ev.clientY - referenceFrame.top;
    let mousePosition = {domX,domY};
    this.initialMouseDownPosition = mousePosition;
    hoverEndHandler();
    this.setState({mode:"clicking"});
  }

  
  clickTimeout = ()=> {
    this.setState({mode:"auto-selecting"});
  }

  autoSelectingTimeout = ()=>{
    this.setState({mode:"panning"});
  }
  
  handleMouseMove_Clicking = (ev)=> {
    let {selectingHandler} = this.props;
    let {initialMouseDownPosition} = this;
    let referenceFrame = this.ref.current.getBoundingClientRect();
    let domX = ev.clientX - referenceFrame.left;
    let domY = ev.clientY - referenceFrame.top;
    if (Math.abs(domX-initialMouseDownPosition.domX)<10 ||
        Math.abs(domY-initialMouseDownPosition.domX)<10) {
      return;
    }
    else {
      selectingHandler({domX,domY});
      this.setState({mode:"selecting"});
    }
  }

  handleMouseUp_Clicking = (ev)=> {
    let {clickHandler,doubleClickHandler} = this.props;
    let {prevClickTimeStamp} = this;
    let referenceFrame = this.ref.current.getBoundingClientRect();
    let domX = ev.clientX - referenceFrame.left;
    let domY = ev.clientY - referenceFrame.top;
    if (prevClickTimeStamp===null || prevClickTimeStamp+200<ev.timeStamp ) {
      this.prevClickTimeStamp = ev.timeStamp;
      clickHandler({domX,domY});
    }
    else {
      this.prevClickTimeStamp = null;
      doubleClickHandler({domX,domY});
    }
    this.setState({mode:"hovering"});
  }


  handleMouseMove_AutoSelecting = (ev)=>{
    let {selectingHandler} = this.props;
    let {initialMouseDownPosition} = this;
    let referenceFrame = this.ref.current.getBoundingClientRect();
    let domX = ev.clientX - referenceFrame.left;
    let domY = ev.clientY - referenceFrame.top;
    if (Math.abs(domX-initialMouseDownPosition.domX)<10 ||
        Math.abs(domY-initialMouseDownPosition.domX)<10) {
      return;
    }
    else {
      selectingHandler(initialMouseDownPosition, {domX,domY});
      this.setState({mode:"selecting"});
    }
  }

  handleMouseUp_AutoSelecting = (ev)=>{
    this.setState({mode:"hovering"});
  }
  
  handleMouseMove_Selecting = (ev)=>{
    let {selectingHandler} = this.props;
    let {initialMouseDownPosition} = this;
    let referenceFrame = this.ref.current.getBoundingClientRect();
    let domX = ev.clientX - referenceFrame.left;
    let domY = ev.clientY - referenceFrame.top;
    selectingHandler(initialMouseDownPosition,{domX,domY});
  }

  handleMouseUp_Selecting = (ev)=>{
    let {selectedHandler} = this.props;
    let {initialMouseDownPosition} = this;
    let referenceFrame = this.ref.current.getBoundingClientRect();
    let domX = ev.clientX - referenceFrame.left;
    let domY = ev.clientY - referenceFrame.top;
    selectedHandler(initialMouseDownPosition,{domX,domY});
    this.setState({mode:"hovering"});
  }

  handleMouseMove_Panning = (ev)=>{
    let {panningHandler} = this.props;
    let {initialMouseDownPosition} = this;
    let referenceFrame = this.ref.current.getBoundingClientRect();
    let domX = ev.clientX - referenceFrame.left;
    let domY = ev.clientY - referenceFrame.top;
    panningHandler(initialMouseDownPosition,{domX,domY});
  }

  handleMouseUp_Panning = (ev)=>{
    let {pannedHandler} = this.props;
    let {initialMouseDownPosition} = this;
    let referenceFrame = this.ref.current.getBoundingClientRect();
    let domX = ev.clientX - referenceFrame.left;
    let domY = ev.clientY - referenceFrame.top;
    pannedHandler(initialMouseDownPosition,{domX,domY});
    this.setState({mode:"hovering"});
  }
}

export default PlotInteractionBox;
