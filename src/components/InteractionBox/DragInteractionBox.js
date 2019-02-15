import React, { PureComponent } from 'react';
import "./DragInteractionBox.css";

class DragInteractionBox extends PureComponent {
  constructor(props){
    super(props);
    this.state = {dragging:false};
    this.mouseDownEventClientX = null;
    this.mouseDownEventClientY = null;
    this.ref = React.createRef();
  }
  
  render(){
    let {children,draggingHandler,draggedHandler,...rest} = this.props;
    let {dragging} = this.state;
    return (
      <div {...rest} onMouseDown={this.handleMouseDown}>
        {children}
        <div  className={this.determineOverlayClass(dragging)}>
        </div>
      </div>
    );
  }
  
  componentDidMount() {
    document.addEventListener("mousemove",this.handleDocumentMouseMove);
    document.addEventListener("mouseup",this.handleDocumentMouseUp);
  }

  componentWillUnmount(){
    document.removeEventListener("mousemove",this.handleDocumentMouseMove);
    document.removeEventListener("mouseup",this.handleDocumentMouseUp);
  }
  
  determineOverlayClass(dragging){
    if (dragging) {
      return "DragInteractionBox-draggingOverlay"
    }
    else {
      return "DragInteractionBox-notDraggingOverlay";
    }
  }
  
  handleMouseDown = (ev)=>{
    ev.preventDefault();
    ev.stopPropagation();
    this.mouseDownEventClientX = ev.clientX;
    this.mouseDownEventClientY = ev.clientY;
    this.setState({dragging:true});
  }
  
  handleDocumentMouseUp = (ev)=>{
    let {dragging} = this.state;
    if (dragging===false) {
      return;
    }
    this.setState({dragging:false});
    let {draggedHandler} = this.props;
    if (!draggedHandler) {
      return;
    }
    let deltaDomX = ev.clientX-this.mouseDownEventClientX;
    let deltaDomY = ev.clientY-this.mouseDownEventClientY;
    draggedHandler({deltaDomX, deltaDomY});
  }
  
  handleDocumentMouseMove = (ev)=>{
    let {dragging} = this.state;
    if (dragging===false) {
      return;
    }
    let {draggingHandler} = this.props;
    if (!draggingHandler) {
      return;
    }
    let deltaDomX = ev.clientX-this.mouseDownEventClientX;
    let deltaDomY = ev.clientY-this.mouseDownEventClientY;
    draggingHandler({deltaDomX, deltaDomY});
  }
}

export default DragInteractionBox;

