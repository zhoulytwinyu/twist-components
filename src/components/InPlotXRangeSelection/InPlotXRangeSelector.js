import {PureComponent} from "react";
import {fromDomXCoord_Linear} from "plot-utils";

class InPlotXRangeSelector extends PureComponent{
  constructor(props) {
    super(props);
    this.lastEvent = null;
    this.snapshot = {};
  }
  
  render(){
    return null;
  }


  componentDidMount(){
    this.select();
  }
  
  componentDidUpdate(){
    this.select();
  }

  select(){
    let { selectingPositions,
          minX,maxX,width,
          selectHandler
          } = this.props;
    let {snapshot} = this;
    // Stale event
    if (selectingPositions===this.lastEvent) {
      return;
    }
    // Selection stops
    if (selectingPositions===null) {
      selectHandler(null,null);
      this.lastEvent = null;
      return;
    }
    // Selecting
    if (!this.lastEvent) {
      // Start of selection, create snapshot
      snapshot.width = width;
      snapshot.minX = minX;
      snapshot.maxX = maxX;
      snapshot.initialStartX = fromDomXCoord_Linear(width,minX,maxX,selectingPositions.start.domX);
    }
    let curDataX = fromDomXCoord_Linear(snapshot.width,snapshot.minX,snapshot.maxX,selectingPositions.end.domX);
    selectHandler(snapshot.initialStartX,curDataX);
    this.lastEvent = selectingPositions;
  }
}

export default InPlotXRangeSelector;
