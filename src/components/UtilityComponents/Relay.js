import {Component} from "react";

class Relay extends Component{
  render(){
    return null;
  }

  shouldComponentUpdate(nextProps,nextState){
    let {updateHandler,...rest} = this.props;
    let {updateHandler:nupdateHandler,...nrest} = nextProps;
    if (Object.keys(rest).length !== Object.keys(nrest).length) {
      return true;
    }
    for (let k of Object.keys(rest)) {
      if (rest[k] !== nrest[k]) {
        return true;
      }
    }
    return false;
  }

  componentDidMount(){
    this.update();
  }
  
  componentDidUpdate(){
    this.update();
  }

  update(){
    let {updateHandler,...rest} = this.props;
    updateHandler(rest);
  }
}

export default Relay;
