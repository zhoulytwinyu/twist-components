import React, { PureComponent } from 'react';

class DragInteractionHOC extends PureComponent {
  constructor(props){
    super(props);
    this.mouseDownEvent = null;
    this.ref = React.createRef();
    
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleDocumentMouseUp = this.handleDocumentMouseUp.bind(this);
    this.handleDocumentMouseMove = this.handleDocumentMouseMove.bind(this);
  }
  
  render(){
    let {Component,dragCursor,style,...spread} = this.props;
    console.log(spread);
    style = {...style, cursor:dragCursor};
    return <Component {...spread}
            style={style}
            onMouseDown={this.handleMouseDown}/>
  }
  
  handleMouseDown(ev) {
    ev.preventDefault();
    this.mouseDownEvent = ev;
    this.mouseDownEvent.persist();
    document.onmousemove = this.handleDocumentMouseMove;
    document.onmouseup = this.handleDocumentMouseUp;
    document.body.style.cursor = this.props.dragCursor;
  }
  
  handleDocumentMouseUp(ev) {
    let {draggedHandler} = this.props;
    document.onmousemove = null;
    document.onmouseup = null;
    document.body.style.cursor = "auto";
    if (!draggedHandler) {
      return;
    }
    let deltaDomX = ev.clientX-this.mouseDownEvent.clientX;
    let deltaDomY = ev.clientY-this.mouseDownEvent.clientY;
    draggedHandler({deltaDomX, deltaDomY});
  }
  
  handleDocumentMouseMove(ev) {
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

export default DragInteractionHOC;
