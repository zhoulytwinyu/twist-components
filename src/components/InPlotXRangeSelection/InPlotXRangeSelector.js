import {Component} from "react";
import {fromDomXCoord_Linear} from "plot-utils";

class InPlotXRangeSelector extends Component{
  render(){
    return null;
  }

  shouldComponentUpdate(nextProps,nextState){
    if (this.props.selectingPositionStart !== this.props.selectingPositionEnd ||
        nextProps.selectingPositionStart !== nextProps.selectingPositionEnd) {
      return true;
    }
    return false;
  }

  componentDidMount(){
    this.select();
  }
  
  componentDidUpdate(){
    this.select();
  }

  select(){
    let { selectingPositionStart,selectingPositionEnd,
          minX,maxX,width,
          selectHandler
          } = this.props;
    if (selectingPositionStart===undefined || selectingPositionEnd===undefined) {
      return;
    }
    if (selectingPositionStart===null || selectingPositionEnd===null) {
      selectHandler(null,null);
      return;
    }
    let startX = fromDomXCoord_Linear(width,minX,maxX,selectingPositionStart.domX);
    let endX = fromDomXCoord_Linear(width,minX,maxX,selectingPositionEnd.domX);
    selectHandler(startX,endX);
  }
}

export default InPlotXRangeSelector;
