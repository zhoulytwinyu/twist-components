import React, {PureComponent} from "react";

class HoveringInteractionBox extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  
  render() {
    return (
      <div  ref={this.ref}
            onMouseMove={this.handleMouseMove}
            onMouseOut={this.handleHoverEnd}
            onMouseDown={this.handleHoverEnd}
            >
        {children}
      </div>
    );
  }
  
  getCustomEventObject(ev){
    let {left,top} = this.ref.current.getBoundingClientRect();
    let {clientX,clientY} = ev;
    let domX = clientX - left;
    let domY = clientY - top;
    return {domX,domY,clientX,clientY}
  }
  
  handleMouseMove(ev){
    let {hoveringHandler} = this.props;
    let myEV = this.getCustomEventObject(ev);
    hoveringHandler(myEV);
  }
  
  handleHoverEnd(ev){
    let {hoverEndHandler} = this.props;
    hoverEndHandler();
  }
}

export default HoveringInteractionBox;
