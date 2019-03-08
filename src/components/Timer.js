import {PureComponent} from "react";

class Timer extends PureComponent {
  constructor(props){
    super(props);
    this.animationRequestId = null;
  }
  
  render() {
    return null;
  }
  
  componentDidMount(){
    this.animationRequestId = requestAnimationFrame(this.timer);
  }
  
  componentWillUnmount(){
    cancelAnimationFrame(this.animationRequestId);
  }
  
  timer = ()=>{
    let {callback} = this.props;
    callback();
    requestAnimationFrame(this.timer);
  }
}


export default Timer;
