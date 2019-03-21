import React, { PureComponent } from 'react';
import {createPrimaryCategoryBitmap,createSecondaryCategoryBitmap,
        drawPrimaryCategory,drawSecondaryCategory} from "../Modules/YAxisTwoLevelPanelPlotters";

const PRIMARY_CATEGORY_COLOR = "lightgrey";
const SECONDARY_CATEGORY_COLOR = "#fedda7";

class LocationsPlotYAxisTwoLevelPanel extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.secondaryBitmap = createSecondaryCategoryBitmap("Location");
    this.primaryBitmap = createPrimaryCategoryBitmap("");
  }
  
  render(){
    let { height,width,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={height} {...rest}></canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }

  draw(){
    let { height,width} = this.props;
    let canvas = this.ref.current;
    let {secondaryBitmap,primaryBitmap} = this;
    // Plot
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    drawPrimaryCategory(ctx,width,height,primaryBitmap,PRIMARY_CATEGORY_COLOR,0,height);
    drawSecondaryCategory(ctx,width,height,secondaryBitmap,SECONDARY_CATEGORY_COLOR,0,height);
  }
}

export default LocationsPlotYAxisTwoLevelPanel;
