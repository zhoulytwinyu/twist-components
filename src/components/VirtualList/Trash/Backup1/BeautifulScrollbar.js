import React, {PureComponent} from "react";
import DragOverlay from "../components/UtilityComponents/DragOverlay";
import "./BeautifulScrollbar.css";

const MODE_HOVERING = "hovering";
const MODE_GROVE_DRAGGING = "grove_dragging";
const MODE_THUMB_DRAGGING = "thumb_dragging";

class BeautifulScrollbar extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.state = {mode:MODE_HOVERING
                  };
    this.snapshot = {};
  }
  
  render(){
    let { width,height,
          rowCount,showCount,
          start
          } = this.props;
    let {mode} = this.state;
    let thumbTop = height/rowCount*start;
    let thumbHeight = height/rowCount*showCount;
    
    if (mode===MODE_HOVERING){
      return (
        <>
          <div  className="BeautifulScrollbar-container" 
                style={{height:height,width:width}}
                onMouseDown={this.startGroveDragging}
                ref={this.ref}
                >
            <div  className="BeautifulScrollbar-grove">
            </div>
            <div  className="BeautifulScrollbar-thumb"
                  style={{height:thumbHeight,top:thumbTop}}
                  onMouseDown={this.startThumbDragging}
                  >
            </div>
          </div>
        </>
      );
    }
    else if (mode===MODE_GROVE_DRAGGING) {
      return (
        <>
          <div  className="BeautifulScrollbar-container" 
                style={{height:height,width:width}}
                ref={this.ref}
                >
            <div className="BeautifulScrollbar-grove">
            </div>
            <div  className="BeautifulScrollbar-thumb"
                  style={{height:thumbHeight,top:thumbTop}}
                  onMouseDown={this.startThumbDragging}
                  >
            </div>
          </div>
          <DragOverlay  mouseMoveHandler={this.handleGroveDraggingMouseMove}
                        mouseUpHandler={this.endDragging}
                        style={{height:thumbHeight,top:thumbTop}}
                        cursor="ns-resize"/>
        </>
      );
    }
    else if (mode===MODE_THUMB_DRAGGING) {
      return (
        <>
          <div  className="BeautifulScrollbar-container" 
                style={{height:height,width:width}}
                ref={this.ref}
                >
            <div className="BeautifulScrollbar-grove">
            </div>
            <div  className="BeautifulScrollbar-thumb"
                  style={{height:thumbHeight,top:thumbTop}}
                  onMouseDown={this.startThumbDragging}
                  >
            </div>
          </div>
          <DragOverlay mouseMoveHandler={this.handleThumbDraggingMouseMove}
                       mouseUpHandler={this.endDragging}
                       cursor="ns-resize"/>
        </>
      );
    }
    else {
      throw new TypeError("Unknown mode",mode);
    }
  }
  
  startGroveDragging = (ev)=> {
    ev.preventDefault();
    ev.stopPropagation();
    let {height, rowCount, showCount} = this.props;
    let domY = ev.clientY - this.ref.current.getBoundingClientRect().top;
    let start = domY*rowCount/height-showCount/2;
    this.setState({mode:MODE_GROVE_DRAGGING});
    this.updateStart(start);
  }
  
  startThumbDragging = (ev)=> {
    ev.preventDefault();
    ev.stopPropagation();
    this.snapshot.start = this.props.start;
    this.snapshot.clientY = ev.clientY;
    this.setState({mode:MODE_THUMB_DRAGGING});
  }
  
  endDragging = (ev)=> {
    this.setState({mode:MODE_HOVERING});
  }
  
  handleGroveDraggingMouseMove = (ev)=> {
    let {height, rowCount, showCount} = this.props;
    let domY = ev.clientY - this.ref.current.getBoundingClientRect().top;
    let start = domY*rowCount/height-showCount/2;
    this.updateStart(start);
  }
  
  handleThumbDraggingMouseMove = (ev)=> {
    let {height, rowCount, showCount} = this.props;
    let domY = ev.clientY - this.ref.current.getBoundingClientRect().top;
    let start = this.snapshot.start + rowCount/height*(ev.clientY-this.snapshot.clientY);
    this.updateStart(start);
  }
  
  updateStart(start) {
    let {updateStartHandler} = this.props;
    start = this.capStart(start);
    if (updateStartHandler && this.props.start !== start) {
      updateStartHandler(start);
    }
  }
  
  capStart(start) {
    let {rowCount,showCount} = this.props;
    return Math.max(0,Math.min(rowCount-showCount,start));
  }
}

export default BeautifulScrollbar;
