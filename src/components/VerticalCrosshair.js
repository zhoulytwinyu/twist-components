import React, { Component } from 'react';

class VerticalCrosshair extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let {hoverX,height,width,style} = this.props;
    if (hoverX===null || hoverX===undefined) {
      return null;
    }
    let left = this.toDomXCoord(hoverX)-0.5;
    return (
      <div style={{...style,height:height+"px",width:width+"px"}}><div style={{position:"absolute",backgroundColor:"red",height:"100%",width:"1px",left:left+"px"}}></div></div>
    );
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    let dataXPxScale = (maxX-minX)/width;
    return (dataX-minX)/dataXPxScale;
  }
}

export default VerticalCrosshair;
