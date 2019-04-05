// Original Author Jiaan
import React, { PureComponent } from "react";
import "./BloodPressurePanel.css"

class BloodPressureLeftPanel extends PureComponent {
  render() {
    let { height, width } = this.props
    return (
      <div className="bloodPressurePanel-container" style={{height: height,width: width}}>
        <div className="bloodPressurePanel-section">
          <div className="bloodPressurePanel-sectionTitle"> ARTERIAL PRESSURE </div>
          <div className="bloodPressurePanel-greenLabel"> 72/48 (55) </div>
          <div className="bloodPressurePanel-orangeLabel"> 155 </div>
          <div className="bloodPressurePanel-redLabel"> 68% </div>
        </div>
        <div className="bloodPressurePanel-section">
          <LinearGradientColorScale width={100} height={20}/>
        </div>
        <div className="bloodPressurePanel-section">
          <div className="bloodPressurePanel-sectionTitle"> VENOUS PRESSURE </div>
          <div>
            <span className="bloodPressurePanel-VPSubtitle">IJ</span>
            <span className="bloodPressurePanel-VPLabel">12</span>
          </div>
          <div>
            <span className="bloodPressurePanel-VPSubtitle">RA</span>
            <span className="bloodPressurePanel-VPLabel">8</span>
          </div>
          <div>
            <span className="bloodPressurePanel-VPSubtitle">LA</span>
            <span className="bloodPressurePanel-VPLabel">10</span>
          </div>
        </div>
      </div>
    )
  }
}

class LinearGradientColorScale extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }
  
  render(){
    let {width,height} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={height} style={{border:"solid 1px black"}}/>
    )
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw()
  }
  
  draw() {
    let {width,height} = this.props;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    //create gradient
    let grd = ctx.createLinearGradient(0,0,width,0);
        
        let stops = [0.1,0.3,0.5,0.7,0.9];
        // Add colors
        grd.addColorStop(stops[0], "rgb(255,   7,   7)");
        grd.addColorStop(stops[1], "rgb(255, 127,   0)");
        grd.addColorStop(stops[2], "rgb(  0, 191,  95)");
        grd.addColorStop(stops[3], "rgb(255, 127,   0)");
        grd.addColorStop(stops[4], "rgb(255,   0,   0)");

        // Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, width, height);

        // Fill gradient text
        ctx.font = "13px Sans";
        ctx.fillStyle = "#373c62";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("-2", stops[0]*width, height/2);
        ctx.fillText("-1", stops[1]*width, height/2);
        ctx.fillText( "0", stops[2]*width, height/2);
        ctx.fillText("+1", stops[3]*width, height/2);
        ctx.fillText("+2", stops[4]*width, height/2);
  }
}

export default BloodPressureLeftPanel
