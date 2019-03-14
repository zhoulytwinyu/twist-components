import React, { PureComponent } from 'react';
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
            <DocumentInteractions mouseMoveHandler={this.handleMouseMove_Clicking} mouseUpHandler={this.handleMouseUp_Clicking}/>
            <Timer timeout={200} callback={this.clickTimeout}/>
          </>
        );
      case "auto-selecting":
        return (
          <>
            <div  ref={this.ref} {...rest}>
              {children}
            </div>
            <DocumentInteractions mouseMoveHandler={this.handleMouseMove_AutoSelecting} mouseUpHandler={this.handleMouseUp_AutoSelecting}/>
            <Timer timeout={500} callback={this.autoSelectingTimeout}/>
            <div className="PlotInteractionBox-selectingOverlay"></div>
          </>
        );
      case "selecting":
        return (
          <>
            <div  ref={this.ref} {...rest}>
              {children}
            </div>
            <DocumentInteractions mouseMoveHandler={this.handleMouseMove_Selecting} mouseUpHandler={this.handleMouseUp_Selecting}/>
            <div className="PlotInteractionBox-selectingOverlay"></div>
          </>
        );
      case "panning":
        return (
          <>
            <div  ref={this.ref} {...rest}>
              {children}
            </div>
            <DocumentInteractions mouseMoveHandler={this.handleMouseMove_Panning} mouseUpHandler={this.handleMouseUp_Panning}/>
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
    let referenceFrame = this.ref.current.getBoundingClientRect();
    let domX = ev.clientX - referenceFrame.left;
    let domY = ev.clientY - referenceFrame.top;
    hoverEndHandler({domX,domY});
  }
  
  handleMouseDown_Hovering = (ev)=>{
    let {hoverEndHandler} = this.props;
    ev.preventDefault();
    ev.stopPropagation();
    let referenceFrame = this.ref.current.getBoundingClientRect();
    let domX = ev.clientX - referenceFrame.left;
    let domY = ev.clientY - referenceFrame.top;
    let mousePosition = {domX,domY};
    hoverEndHandler(mousePosition);
    this.initialMouseDownPosition = mousePosition;
    this.setState({mode:"clicking"});
  }

  
  clickTimeout = ()=> {
    this.setState({mode:"auto-selecting"});
  }

  autoSelectingTimeout = ()=>{
    this.setState({mode:"panning"});
  }
  
  handleMouseMove_Clicking = (ev)=> {
    let {hoverEndHandler} = this.props;
    let {initialMouseDownPosition} = this;
    let referenceFrame = this.ref.current.getBoundingClientRect();
    let domX = ev.clientX - referenceFrame.left;
    let domY = ev.clientY - referenceFrame.top;
    if (Math.abs(domX-initialMouseDownPosition.domX)<10 ||
        Math.abs(domY-initialMouseDownPosition.domX)<10) {
      return;
    }
    else {
      hoverEndHandler({domX,domY});
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

class Timer extends PureComponent{
  render(){
    return null;
  }
  
  componentDidMount(){
    let {timeout,callback} = this.props;
    this.timeout = setTimeout(callback,timeout);
  }

  componentDidUpdate(){
    clearTimeout(this.timeout);
    let {timeout,callback} = this.props;
    this.timeout = setTimeout(callback,timeout);
  }

  componentWillUnmount(){
    clearTimeout(this.timeout);
  }
}

class DocumentInteractions extends PureComponent {
  constructor(props){
    super(props);
    this.state = {event:null};
  }
  
  render() {
    return null;
  }

  componentDidMount(){
    document.addEventListener("mousemove",this.handleMouseMove);
    document.addEventListener("mouseup",this.handleMouseUp);
  }

  componentWillUnmount(){
    document.removeEventListener("mousemove",this.handleMouseMove);
    document.removeEventListener("mouseup",this.handleMouseUp);
  }
  
  handleMouseMove = (ev)=>{
    let {mouseMoveHandler} = this.props;
    mouseMoveHandler(ev);
  }

  handleMouseUp = (ev)=>{
    let {mouseUpHandler} = this.props;
    mouseUpHandler(ev);
  }
}

export default PlotInteractionBox;
