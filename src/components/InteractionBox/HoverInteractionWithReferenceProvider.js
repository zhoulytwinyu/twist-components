import React, { PureComponent } from 'react';
import HoverInteractionBoxWithReference from "./HoverInteractionBoxWithReference";

class HoverInteractionWithReferenceProvider extends PureComponent {
  constructor(props){
    super(props);
    this.state={dataX:null,dataY:null,
                domX:null,domY:null,
                timestamp:null};
  }
  
  render(){
    let { children,
          Context,
          minX,maxX,width,
          minY,maxY,height,
          ...rest} = this.props;
    return (
      <HoverInteractionBoxWithReference minX={minX} maxX={maxX} width={width}
                                        minY={minY} maxY={maxY} height={height}
                                        hoveringHandler={this.handleHovering}
                                        mouseOutHandler={this.handleMouseOut}
                                        {...rest}
                                        >
        <Context.Provider value={this.state}>
        {children}
        </Context.Provider>
      </HoverInteractionBoxWithReference>
    );
  }
  
  handleHovering = ({domX,domY,dataX,dataY,timestamp}) => {
    this.setState({domX,domY,dataX,dataY,timestamp});
  }
  
  handleMouseOut = () => {
    this.setState({domX:null,domY:null,dataX:null,dataY:null,timestamp:null});
  }
}

export default HoverInteractionWithReferenceProvider;
