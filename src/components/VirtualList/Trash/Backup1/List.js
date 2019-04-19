import React, {PureComponent} from "react";

const COLORS = ["white","#eeeeee"];

class List extends PureComponent{
  render(){
    let {children, start} = this.props;
    let childrenArray = React.Children.toArray(children);
    let decoratedChildren = childrenArray.slice(start,start+20)
                                          .map((child,i)=>
      <div key={i} style={{backgroundColor:COLORS[i%COLORS.length]}}>
        {child}
      </div>
      )
    
    return (
      <div style={{width:"100%",height:"100%",overflow:"hidden"}}>
        { decoratedChildren }
      </div>
    );
  }
}

export default List;
