import React, {PureComponent} from "react";
import {format} from "date-fns";

class DynamicDateYAxisTwoLevelPanel extends PureComponent {
  render(){
    let { minX,maxX,
          height,width,
          ...rest} = this.props;
    let label = this.createLabel(minX,maxX);
    return (
      <Panel  label={label}
              width={width} height={height}
              />
    );
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
                return format(minT,"YYYY/MMM/DD HH:mm:ss")
              }
              return format(minT,"YYYY/MMM/DD HH:mm")
            }
            return format(minT,"YYYY/MMM/DD HH")
          }
          return format(minT,"YYYY/MMM/DD")
        }
        return format(minT,"YYYY/MMM")
      }
      return format(minT,"YYYY")
    }
    return "Time";
  }
}

const PARIMARY_CATEGORY_WIDTH=30;
const PRIMARY_CATEGORY_COLOR = "lightgrey";
const SECONDARY_CATEGORY_COLOR = "#fedda7";

class Panel extends PureComponent{
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }
  
  render(){
    let { label,
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
    let {label,width,height} = this.props;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    //
    ctx.fillStyle = PRIMARY_CATEGORY_COLOR;
    ctx.fillRect(0,0,PARIMARY_CATEGORY_WIDTH,height);
    //
    ctx.fillStyle = SECONDARY_CATEGORY_COLOR;
    ctx.fillRect(PARIMARY_CATEGORY_WIDTH,0,width-PARIMARY_CATEGORY_WIDTH,height);
    //
    ctx.fillStyle = "black";
    ctx.font = "bold 12px Sans";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(label,PARIMARY_CATEGORY_WIDTH+5,height/2);
  }
}

export default DynamicDateYAxisTwoLevelPanel;
