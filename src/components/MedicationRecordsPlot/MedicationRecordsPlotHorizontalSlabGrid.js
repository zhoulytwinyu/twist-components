import React, { PureComponent } from 'react';

const COLOR_CYCLE = ["#fff7e4","#fffef9"];

class MedicationRecordsPlotHorizontalSlabGrid extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  render(){
    let { height, rowHeight,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} height={height} width={1} {...rest}></canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }

  componentDidUpdate(){
    this.draw();
  }
  
  draw() {
    let { height, rowHeight,} = this.props;
    // Draw
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,1,height);
    let startDomY = 0;
    for (let i=0; i<Math.ceil(height/rowHeight); i+=1) {
      let color = COLOR_CYCLE[i%COLOR_CYCLE.length];
      let endDomY = Math.round((i+1)*rowHeight);
      ctx.fillStyle = color;
      ctx.fillRect(0,startDomY,1,endDomY-startDomY);
      startDomY = endDomY;
    }
  }
}

export default MedicationRecordsPlotHorizontalSlabGrid;

