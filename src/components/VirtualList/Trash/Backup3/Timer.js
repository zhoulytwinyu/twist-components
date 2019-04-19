import React, {PureComponent} from "react";

class Timer extends PureComponent {
  constructor(props){
    super(props);
    this.interval = null;
  }
  render(){
    return null;
  }
  componentDidMount(){
    let {callback,period} = this.props;
    this.interval = setInterval(callback,period);
  }
  componentDidUpdate(){
    //
  }
  componentWillUnmount(){
    clearInterval(this.interval);
  }
}

export default Timer;
