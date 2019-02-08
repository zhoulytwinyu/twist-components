import React, { PureComponent } from 'react';

class DragInteractionBox extends PureComponent {
  constructor(props){
    super(props);
    this.mouseDownEvent = null;
    this.ref = React.createRef();
  }
  
  render(){
    let {dragCursor,children,draggingHandler,draggedHandler,...rest} = this.props;
    return (
      <div {...rest} onMouseDown={this.handleMouseDown}>
        {children}
      </div>
    );
  }
  
  handleMouseDown = (ev)=>{
    ev.preventDefault();
    ev.stopPropagation();
    this.mouseDownEvent = ev;
    this.mouseDownEvent.persist();
    document.addEventListener("mousemove",this.handleDocumentMouseMove);
    document.addEventListener("mouseup",this.handleDocumentMouseUp);
    document.body.style.cursor = this.props.dragCursor;
  }
  
  handleDocumentMouseUp = (ev)=>{
    let {draggedHandler} = this.props;
    document.removeEventListener("mousemove",this.handleDocumentMouseMove);
    document.removeEventListener("mouseup",this.handleDocumentMouseUp);
    document.body.style.cursor = "auto";
    if (!draggedHandler) {
      return;
    }
    let deltaDomX = ev.clientX-this.mouseDownEvent.clientX;
    let deltaDomY = ev.clientY-this.mouseDownEvent.clientY;
    draggedHandler({deltaDomX, deltaDomY});
  }
  
  handleDocumentMouseMove = (ev)=>{
    let {draggingHandler} = this.props;
    this.moved = true;
    if (!draggingHandler) {
      return;
    }
    let deltaDomX = ev.clientX-this.mouseDownEvent.clientX;
    let deltaDomY = ev.clientY-this.mouseDownEvent.clientY;
    draggingHandler({deltaDomX, deltaDomY});
  }
}

export default DragInteractionBox;

