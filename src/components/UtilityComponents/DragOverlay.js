import React, { PureComponent } from "react";
// CSS
import "./DragOverlay.css";

class DragOverlay extends PureComponent {
  render() {
    let { cursor,
          mouseMoveHandler,mouseUpHandler} = this.props;
    return <div className="fullscreen" style={{cursor:cursor}}></div>;
  }

  componentDidMount(){
    document.addEventListener("mousemove",this.handleMouseMove,true);
    document.addEventListener("mouseup",this.handleMouseUp,true);
  }

  componentWillUnmount(){
    document.removeEventListener("mousemove",this.handleMouseMove,true);
    document.removeEventListener("mouseup",this.handleMouseUp,true);
  }
  
  handleMouseMove = (ev)=>{
    ev.stopPropagation();
    let {mouseMoveHandler} = this.props;
    mouseMoveHandler(ev);
  }

  handleMouseUp = (ev)=>{
    ev.stopPropagation();
    let {mouseUpHandler} = this.props;
    mouseUpHandler(ev);
  }
}

export default DragOverlay;
