import React, {Component} from "react";
import {memoize_one} from "memoize";
import "./PlotContainers.css";

export class PlotContainer extends Component{
  render(){
    let { children,width,height,
          leftWidth,plotWidth,rightWidth,
          topHeight,plotHeight,bottomHeight} = this.props;
    let style = this.generateGridLayoutStyle( width,height,
                                              leftWidth,plotWidth,rightWidth,
                                              topHeight,plotHeight,bottomHeight);
    return (
      <div style={style} className="PlotContainers-positionRelative">
        {children}
      </div>
    )
  }
  
  generateGridLayoutStyle = memoize_one((width,height,
                          leftWidth,plotWidth,rightWidth,
                          topHeight,plotHeight,bottomHeight)=>{
    let style = { display:"grid",
                  height:height,
                  width:width,
                  gridGap:0,
                  gridTemplateColumns:`${leftWidth}px ${plotWidth}px ${rightWidth}px`,
                  gridTemplateRows:`${topHeight}px ${plotHeight}px ${bottomHeight}px`
                  };
    return style;
  })
}

export const PlotSubContainer = (props)=>{
  return (
    <div className="PlotContainers-positionRelative">
      { props.children ? 
        React.Children.map(props.children,(child)=>
          <div className="PlotContainers-positionAbsolute">
            {child}
          </div>) :
        null
        }
    </div>
  );
}

