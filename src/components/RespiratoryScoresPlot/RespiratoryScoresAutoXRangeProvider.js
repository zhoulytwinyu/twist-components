import {PureComponent} from "react";

class RespiratoryScoresAutoXRangeProvider extends PureComponent {
  render() {
    let { render, minX, maxX,
          RespiratoryScores /* [{time, ...}] */
          } = this.props;
    if (minX==="auto") {
      minX = Math.min( ...RespiratoryScores.map(({time})=>time) );
    }
    if (maxX==="auto") {
      maxX = Math.max( ...RespiratoryScores.map(({time})=>time) );
    }
    let tmpMinX = Math.min(minX,maxX);
    maxX = Math.max(minX,maxX);
    minX = tmpMinX;
    return (
      {render(minX,maxX)}
    );
  }
}

export default RespiratoryScoresAutoXRangeProvider;
