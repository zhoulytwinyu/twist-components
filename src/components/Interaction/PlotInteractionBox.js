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
          width,height,
          children
          } = this.props;
    let style = {width,height};
    switch (this.state.mode) {
      case "hovering":
        return (
          <>
            <div  ref={this.ref} style={style}
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
            <div  ref={this.ref} style={style}>
              {children}
            </div>
            <DragOverlay mouseMoveHandler={this.handleMouseMove_Clicking} mouseUpHandler={this.handleMouseUp_Clicking} cursor="point"/>
            <CountDown timeout={200} callback={this.clickTimeout}/>
          </>
        );
      case "auto-selecting":
        return (
          <>
            <div  ref={this.ref} style={style}>
              {children}
            </div>
            <DragOverlay mouseMoveHandler={this.handleMouseMove_AutoSelecting} mouseUpHandler={this.handleMouseUp_AutoSelecting} cursor="nesw-resize"/>
            <CountDown timeout={500} callback={this.autoSelectingTimeout}/>
          </>
        );
      case "selecting":
        return (
          <>
            <div  ref={this.ref} style={style}>
              {children}
            </div>
            <DragOverlay mouseMoveHandler={this.handleMouseMove_Selecting} mouseUpHandler={this.handleMouseUp_Selecting} cursor="nesw-resize"/>
          </>
        );
      case "panning":
        return (
          <>
            <div  ref={this.ref} style={style}>
              {children}
            </div>
            <DragOverlay mouseMoveHandler={this.handleMouseMove_Panning} mouseUpHandler={this.handleMouseUp_Panning} cursor="grabbing"/>
          </>
        );
      default:
        throw new Error("ProgrammerTooDumbError");
    }
  }
  
  getCustomEventObject(ev){
    let {left,top} = this.ref.current.getBoundingClientRect();
    let {clientX,clientY} = ev;
    let domX = clientX - left;
    let domY = clientY - top;
    return {domX,domY,clientX,clientY}
  }
  
  handleMouseMove_Hovering = (ev)=>{
    let {hoveringHandler} = this.props;
    let myEV = this.getCustomEventObject(ev);
    hoveringHandler(myEV);
  }

  handleMouseOut_Hovering = (ev)=>{
    let {hoverEndHandler} = this.props;
    hoverEndHandler();
  }
  
  handleMouseDown_Hovering = (ev)=>{
    let {hoverEndHandler} = this.props;
    ev.preventDefault();
    let myEV = this.getCustomEventObject(ev);
    this.initialMouseDownPosition = myEV;
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
    let myEV = this.getCustomEventObject(ev);
    if (Math.abs(myEV.domX-initialMouseDownPosition.domX)<10 ||
        Math.abs(myEV.domY-initialMouseDownPosition.domX)<10) {
      return;
    }
    else {
      selectingHandler({start:initialMouseDownPosition,end:myEV});
      this.setState({mode:"selecting"});
    }
  }

  handleMouseUp_Clicking = (ev)=> {
    let {clickHandler,doubleClickHandler} = this.props;
    let {prevClickTimeStamp} = this;
    let myEV = this.getCustomEventObject(ev);
    if (prevClickTimeStamp===null || prevClickTimeStamp+200<ev.timeStamp ) {
      this.prevClickTimeStamp = ev.timeStamp;
      clickHandler(myEV);
    }
    else {
      this.prevClickTimeStamp = null;
      doubleClickHandler(myEV);
    }
    this.setState({mode:"hovering"});
  }


  handleMouseMove_AutoSelecting = (ev)=>{
    let {selectingHandler} = this.props;
    let {initialMouseDownPosition} = this;
    let myEV = this.getCustomEventObject(ev);
    if (Math.abs(myEV.domX-initialMouseDownPosition.domX)<10 ||
        Math.abs(myEV.domY-initialMouseDownPosition.domX)<10) {
      return;
    }
    else {
      selectingHandler({start:initialMouseDownPosition,end:myEV});
      this.setState({mode:"selecting"});
    }
  }

  handleMouseUp_AutoSelecting = (ev)=>{
    this.setState({mode:"hovering"});
  }
  
  handleMouseMove_Selecting = (ev)=>{
    let {selectingHandler} = this.props;
    let {initialMouseDownPosition} = this;
    let myEV = this.getCustomEventObject(ev);
    selectingHandler({start:initialMouseDownPosition,end:myEV});
  }

  handleMouseUp_Selecting = (ev)=>{
    let {selectedHandler} = this.props;
    let {initialMouseDownPosition} = this;
    let myEV = this.getCustomEventObject(ev);
    selectedHandler({start:initialMouseDownPosition,end:myEV});
    this.setState({mode:"hovering"});
  }

  handleMouseMove_Panning = (ev)=>{
    let {panningHandler} = this.props;
    let {initialMouseDownPosition} = this;
    let myEV = this.getCustomEventObject(ev);
    panningHandler({start:initialMouseDownPosition,end:myEV});
  }

  handleMouseUp_Panning = (ev)=>{
    let {pannedHandler} = this.props;
    let {initialMouseDownPosition} = this;
    let myEV = this.getCustomEventObject(ev);
    pannedHandler({start:initialMouseDownPosition,end:myEV});
    this.setState({mode:"hovering"});
  }
}

export default PlotInteractionBox;
