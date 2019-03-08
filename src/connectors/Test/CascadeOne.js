import React, {PureComponent} from "react";

class CascadeOne extends PureComponent {
  render (){
    return null;
  }

  componentDidMount(){
    let {updateHandler,a} = this.props;
    updateHandler({b:a+1});
  }
}

export default CascadeOne;
