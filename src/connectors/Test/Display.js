import React, {PureComponent} from "react";

class Display extends PureComponent {
  render (){
    console.log('!');
    return (
      this.props.c
    )
  }
  
}

export default Display;
