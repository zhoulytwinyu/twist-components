import {PureComponent} from "react";
import {fromDomXCoord_Linear} from "plot-utils";

class PlotPanningController extends PureComponent {
  constructor(props){
    super(props);
    this.lastEvent = null;
    this.snapshot = {};
  }
  
  render(){
    return null;
  }
  
  componentDidMount(){
    this.pan();
  }
  
  componentDidUpdate(){
    this.pan();
  }
  
  pan() {
    let { panningPositions,panHandler,
          minX,maxX,width} = this.props;
    let {snapshot} = this;
    // Do not process stale panningPositions
    if (panningPositions===this.lastEvent) {
      return;
    }
    // Panning stops
    if (panningPositions===null) {
      this.lastEvent = null;
      return;
    }
    // Panning ongoing
    if (!this.lastEvent) {
      //Start of panning, store snapshot
      snapshot.minX = minX;
      snapshot.maxX = maxX;
      snapshot.width = width;
      snapshot.initialDataX = fromDomXCoord_Linear(width,minX,maxX,panningPositions.start.domX);
    }
    let curDataX = fromDomXCoord_Linear(snapshot.width,snapshot.minX,snapshot.maxX,panningPositions.end.domX);
    let deltaX = curDataX - snapshot.initialDataX;
    panHandler(snapshot.minX-deltaX, snapshot.maxX-deltaX);
    this.lastEvent = panningPositions;
  }
}

export default PlotPanningController;
