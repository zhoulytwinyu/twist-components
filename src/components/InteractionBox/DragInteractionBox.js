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
        <div  className="DragInteractionBox-grabbingOverlay"
              style={{display: dragging ? "initial" : "none"}}>
        </div>
      </div>
    );
  }

  componentWillUnmount(){
    document.removeEventListener("mousemove",this.handleDocumentMouseMove);
    document.removeEventListener("mouseup",this.handleDocumentMouseUp);
  }
  
  handleMouseDown = (ev)=>{
    ev.preventDefault();
    ev.stopPropagation();
    this.mouseDownEventClientX = ev.clientX;
    this.mouseDownEventClientY = ev.clientY;
    this.setState({dragging:true});
    document.addEventListener("mousemove",this.handleDocumentMouseMove);
    document.addEventListener("mouseup",this.handleDocumentMouseUp);
  }
  
  handleDocumentMouseUp = (ev)=>{
    document.removeEventListener("mousemove",this.handleDocumentMouseMove);
    document.removeEventListener("mouseup",this.handleDocumentMouseUp);
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

