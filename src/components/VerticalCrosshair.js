import React, { Component } from 'react';

class VerticalCrosshair extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let {hoverX,height,width,left,top} = this.props;
    if (hoverX===null || hoverX===undefined) {
      return null;
    }
    let crosshairLeft = this.toDomXCoord(hoverX)-0.5;
    return (
      <div style={{position:"absolute",height:height,width:width,left:left,top:top}}>
        <div style={{position:"absolute",backgroundColor:"grey",height:"100%",width:1,left:crosshairLeft-0.5}}></div>
      </div>
    );
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    let dataXPxScale = (maxX-minX)/width;
    return (dataX-minX)/dataXPxScale;
  }
}

export default VerticalCrosshair;
