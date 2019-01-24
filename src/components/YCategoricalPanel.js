import React, { PureComponent } from 'react';
import {memoize_one} from "../utils/memoize";
import {toDomXCoord_Linear,
        labelPlot} from "plot-utils";

class YCategoricalPanel extends PureComponent {
  constructor(props){
    super(props);
  }
  
  render() {
    let {width, height, left, top, rowHeight} = this.props;
    let {categoryData, subcategoryData,
         categoryColors, subCategoryColors,
         labelCategory} = this.props;
    return (
      <canvas width=width height=height style={{left:left,top:top}}> </canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }
  
  draw(){
    
  }
  
  toDomYCoord(dataY){
    let rowHeight = this.props;
    return dataY*rowHeight;
  }
}

