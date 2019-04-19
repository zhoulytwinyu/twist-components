import React, {PureComponent} from "react";
import PropTypes from 'prop-types';
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
          realHeight,realRange,
          scrollStart,
          direction,
          } = this.props;
    let {mode} = this.state;
    let thumbTop = scrollStart/realHeight*height;
    let thumbHeight = realRange/realHeight*height;
    
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
import PropTypes from 'prop-types';
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
    let {height, realHeight, realRange} = this.props;
    let domY = ev.clientY - this.ref.current.getBoundingClientRect().top;
    
    let scrollStart = domY*realHeight/height-realRange/2;
    this.setState({mode:MODE_GROVE_DRAGGING});
    this.updateScrollStart(scrollStart);
  }
  
  startThumbDragging = (ev)=> {
    ev.preventDefault();
    ev.stopPropagation();
    this.snapshot.scrollStart = this.props.scrollStart;
    this.snapshot.clientY = ev.clientY;
    this.setState({mode:MODE_THUMB_DRAGGING});
  }
  
  endDragging = (ev)=> {
    this.setState({mode:MODE_HOVERING});
  }
  
  handleGroveDraggingMouseMove = (ev)=> {
    let {height, realHeight, realRange} = this.props;
    let domY = ev.clientY - this.ref.current.getBoundingClientRect().top;
    let scrollStart = domY*realHeight/height-realRange/2;
    this.updateScrollStart(scrollStart);
  }
  
  handleThumbDraggingMouseMove = (ev)=> {
    let {height, realHeight, realRange} = this.props;
    let domY = ev.clientY - this.ref.current.getBoundingClientRect().top;
    let scrollStart = this.snapshot.scrollStart + realHeight/height*(ev.clientY-this.snapshot.clientY);
    this.updateScrollStart(scrollStart);
  }
  
  updateScrollStart(scrollStart) {
    let {updateScrollStartHandler} = this.props;
    scrollStart = this.capScrollStart(scrollStart);
    if (updateScrollStartHandler && this.props.scrollStart !== scrollStart) {
      updateScrollStartHandler(scrollStart);
    }
  }
  
  capScrollStart(scrollStart) {
    let {realHeight,realRange} = this.props;
    return Math.max(0,Math.min(realHeight-realRange,scrollStart));
  }
}

BeautifulScrollbar.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  realHeight: PropTypes.string,
  realRange: PropTypes.string,
  scrollStart: PropTypes.string,
  direction: PropTypes.string,
}

export default BeautifulScrollbar;
