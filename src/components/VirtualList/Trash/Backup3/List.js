import React, {PureComponent} from "react";

const COLORS = ["white","#eeeeee"];

class List extends PureComponent{
  constructor(props) {
    super(props);
    this.mountedListItems = new Set();
    console.log("Constructr");
  }
  
  render(){
    let {children, height, rowHeight, scrollStart} = this.props;
    let tmpKeys = new Set();
    let decoratedChildren = React.Children.map(children,(child,i)=> {
        tmpKeys.add(child.key);
        if ((i+1)*rowHeight>scrollStart && i*rowHeight<scrollStart+height) {
          this.mountedListItems.add(child.key);
          return (
            <div key={child.key} style={{ position:"absolute",backgroundColor:COLORS[i%COLORS.length],width:"100%",height:rowHeight,
                                  top:rowHeight*i}}>
              {child}
            </div>
          );
        }
        else if (this.mountedListItems.has(child.key)) {
          return (
            <div key={child.key} style={{ position:"absolute",backgroundColor:COLORS[i%COLORS.length],width:"100%",height:rowHeight,
                                  top:rowHeight*i}}>
              {child}
            </div>
          );
        }
        else {
          return null;
        }
      });
    
    for (let k of this.mountedListItems) {
      if (!tmpKeys.has(k)){
        this.mountedListItems.delete(k);
      }
    }
    
    return (
      <div style={{height:children.length*rowHeight, top:-scrollStart,position:"relative"}}>
        {decoratedChildren}
      </div>
    );
  }
}

export default List;
