import React, { PureComponent } from "react";
// CSS
import "./FloatWindow.css";

class FloatWindow extends PureComponent {
  render() {
    let { clientX,clientY,childre } = this.props;
    return (
      <div className="floatWindow">
        {children}
      </div>;
    );
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

export default FloatWindow;
