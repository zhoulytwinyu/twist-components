import React, {PureComponent} from "react";
import {format} from "date-fns";
import {createPrimaryCategoryBitmap,createSecondaryCategoryBitmap,
        drawPrimaryCategory,drawSecondaryCategory} from "../Modules/YAxisTwoLevelPanelPlotters";

const PRIMARY_CATEGORY_COLOR = "lightgrey";
const SECONDARY_CATEGORY_COLOR = "#fedda7";

class DynamicDateYAxisTwoLevelPanel extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.secondaryBitmap = document.createElement("canvas");
    this.primaryBitmap = createPrimaryCategoryBitmap("");
  }
  
  render(){
    let { minX,maxX,
          height,width,
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
    let { minX,maxX,
          height,width} = this.props;
    let canvas = this.ref.current;
    let {secondaryBitmap,primaryBitmap} = this;
    // Label
    let label = this.createLabel(minX,maxX);
    secondaryBitmap = createSecondaryCategoryBitmap(label,secondaryBitmap);
    // Plot
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    drawPrimaryCategory(ctx,width,height,primaryBitmap,PRIMARY_CATEGORY_COLOR,0,height);
    drawSecondaryCategory(ctx,width,height,secondaryBitmap,SECONDARY_CATEGORY_COLOR,0,height);
  }

  createLabel(minX,maxX) {
    let minT = new Date(minX);
    let maxT = new Date(maxX);
    if (minT.getFullYear()===maxT.getFullYear()) {
      if (minT.getMonth()===maxT.getMonth()) {
        if (minT.getDate()===maxT.getDate()) {
          if (minT.getHours()===maxT.getHours()) {
            if (minT.getMinutes()===maxT.getMinutes()) {
              if (minT.getSeconds()===maxT.getSeconds()) {
                return format(minT,"YYYY/MMM/Do HH:mm:ss")
              }
              return format(minT,"YYYY/MMM/Do HH:mm")
            }
            return format(minT,"YYYY/MMM/Do HH")
          }
          return format(minT,"YYYY/MMM/Do")
        }
        return format(minT,"YYYY/MMM")
      }
      return format(minT,"YYYY")
    }
    return "Time";
  }
}

export default DynamicDateYAxisTwoLevelPanel;
