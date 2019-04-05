import {PureComponent} from "react";
import {fromDomXCoord_Linear} from "plot-utils";
import {bisect_left,bisect_right} from "bisect";

class RespiratoryScoresPlotPointSelector extends PureComponent {
  constructor(props){
    super(props);
    this.lastEvent = null;
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
    let { data,
          hoveringPosition,
          selectHandler,
          minX,maxX,width} = this.props;
    if (this.lastEvent === hoveringPosition) {
      return;
    }
    this.lastEvent = hoveringPosition;
    if (hoveringPosition===null) {
      selectHandler(null);
      return;
    }
    this.select_memo = this.select_memo || {};
    let memo = this.select_memo;
    if (memo.data !== data) {
      memo.data=data;
      memo.sortedData = data.sort( (a,b)=> a.time-b.time );
      memo.sortedTimes = memo.sortedData.map(({time})=>time);
    }
    let {domX} = hoveringPosition;
    let dataX = fromDomXCoord_Linear(width,minX,maxX,domX);
    let startIndex = Math.max(0,bisect_left(memo.sortedTimes,dataX));
    let endIndex = Math.min(memo.sortedData.length-1,bisect_right(memo.sortedTimes,dataX));
    let selection;
    if (dataX-memo.sortedTimes[startIndex] <= memo.sortedTimes[endIndex]-dataX) {
      selection = memo.sortedData[startIndex];
    }
    else {
      selection = memo.sortedData[endIndex];
    }
    selectHandler(selection);
  }
}

export default RespiratoryScoresPlotPointSelector;
