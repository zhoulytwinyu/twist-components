import React, {PureComponent} from "react";

class CascadeTwo extends PureComponent {
  render (){
    return null;
  }

  componentDidMount(){
    let {updateHandler,b} = this.props;
    updateHandler({c:b+1});
  }
}

export default CascadeTwo;
