import React, { Component } from 'react';
import {fromDomXCoord_Linear,
        fromDomYCoord_Linear} from "plot-utils";

class InteractionBoxProvider extends Component {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.state = {hoveringEvent:null,
                  clickEvent:null,
                  doubleClickEvent:null,
                  selectingEvent:null,
                  selectedEvent:null,
                  panningEvent:null,
                  pannedEvent:null,
                  };
    
  }

  shouldComponentUpdate(nextProps,nextState) {
    if (this.state === nextState) {
      return false;
    }
    return true;
  }
  
  render(){
    let { renderInside,
          renderOutdside,
          minX,maxX,width,
          minY,maxY,height,
          children,
          ...rest} = this.props;
    return (
      <>
        <HoverInteractionBoxWithReference {...rest}
                                          minX={minX} maxX={maxX} width={width}
                                          minY={minY} maxY={maxY} height={height}
                                          hoveringHandler={this.handleHovering}
                                          hoverEndHandler={this.handleHoverEnd}
                                          >
          <TriPhaseInteractionBoxWithReference  {...rest}
                                                minX={minX} maxX={maxX} width={width}
                                                minY={minY} maxY={maxY} height={height}
                                                clickedHandler={this.handleClick}
                                                doubleClickHandler={this.handleDoubleClick}
                                                selectingHandler={this.handleSelecting} selectedHandler={this.handleSelected}
                                                panningHandler={this.handlePanning} pannedHandler={this.handlePanned}
                                                >
            {children}
            {renderInside(this.state)}
          </TriPhaseInteractionBoxWithReference>
        </HoverInteractionBoxWithReference>
        </div>
        {renderOutside(this.state)}
        <>
      </>
    );
  }
  
  handleHovering = (ev) => {
    let {hoveringHandler} = this.props;
    if (!hoveringHandler){
      return;
    }
    let dataX = this.fromDomXCoord(domX);
    let dataY = this.fromDomYCoord(domY);
    hoveringHandler({dataX,dataY,domX,domY,timestamp});
  }
  
  handleHoverEnd = ({domX,domY,timestamp}) => {
    let {mouseOutHandler} = this.props;
    if (!mouseOutHandler){
      return;
    }
    let dataX = this.fromDomXCoord(domX);
    let dataY = this.fromDomYCoord(domY);
    mouseOutHandler({dataX,dataY,domX,domY,timestamp});
  }
  
  fromDomXCoord(domX) {
    let {minX,maxX,width} = this.props;
    return fromDomXCoord_Linear(width,minX,maxX,domX);
  }
  
  fromDomYCoord(domY) {
    let {minY,maxY,height} = this.props;
    return fromDomYCoord_Linear(height,minY,maxY,domY);
  }
}

export default HoverInteractionBoxWithReference;
