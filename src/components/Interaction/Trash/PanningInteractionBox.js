import React, {PureComponent} from "react";

class SelectingInteractionBox extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  
  render() {
    return (
      <>
        <div ref={this.ref}>
          {children}
        </div>
        <DragOverlay  mouseMoveHandler={this.handleMouseMove}
                      mouseUpHandler={this.handleMouseUp}
                      cursor="grabbing"
                      />
      </>
    );
  }
  
  getCustomEventObject(ev) {
    let {left,top} = this.ref.current.getBoundingClientRect();
    let {clientX,clientY} = ev;
    let domX = clientX - left;
    let domY = clientY - top;
    return {domX,domY,clientX,clientY}
  }
  
  handleMouseMove(ev) {
    let {mouseMoveHandler} = this.props;
    let myEV = this.getCustomEventObject(ev);
    mouseMoveHandler(myEV);
  }
  
  handleMouseUp(ev) {
    let {mouseUpHandler} = this.props;
    mouseUpHandler();
  }
}
