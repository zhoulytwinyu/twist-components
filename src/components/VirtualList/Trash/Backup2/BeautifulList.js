import React, {PureComponent} from "react";
import PropTypes from 'prop-types';
import BeautifulScrollbar from "./BeautifulScrollbar";
import List from "./List";

class BeautifulList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {scrollStart:0
                  };
  }
  
  static getDerivedStateFromProps(props,state) {
    let {children, height, rowHeight} = props;
    let {scrollStart} = state;
    if (scrollStart>children.length*rowHeight-height) {
      return {scrollStart:Math.max(0,children.length*rowHeight-height)};
    }
    return null;
  }
  
  render() {
    let {width,height,rowHeight,children} = this.props;
    let {scrollStart} = this.state;
    let totalHeight = rowHeight*React.Children.count(children);
    let ScrollbarElem = null;
    if (height<totalHeight) {
      ScrollbarElem = <div style={{flexGrow:0,flexShrink:0}}>
                          <BeautifulScrollbar width={10} height={height}
                                              realHeight={totalHeight} realRange={height} scrollStart={scrollStart}
                                              updateScrollStartHandler={this.handleScrollStartUpdate}
                                              />
                        </div>
    }
    
    return (
      <>
        <div style={{width:width,height:height,overflow:"hidden",display:"flex"}}
              onWheel={this.handleScroll}
              >
          {ScrollbarElem}
          <div style={{flexGrow:1}}>
            <List height={height} rowHeight={rowHeight} totalHeight={totalHeight} scrollStart={scrollStart}>
              {children}
            </List>
          </div>
        </div>
      </>
    )
  }
  
  capScrollStart(scrollStart) {
    let {height,children,rowHeight} = this.props;
    let {listItems} = this.state;
    let realHeight = rowHeight*children.length;;
    return Math.max(0,Math.min(realHeight-height,scrollStart));
  }
  
  handleScrollStartUpdate = (scrollStart)=>{
    scrollStart = this.capScrollStart(scrollStart);
    this.setState({ scrollStart
                  }
      );
  }
  
  handleScroll=(ev)=>{
    ev.preventDefault();
    ev.stopPropagation();
    let {height,children,rowHeight} = this.props;
    let {listItems} = this.state;
    let totalHeight = rowHeight*children.length;
    if (ev.deltaY<0) {
      this.setState((state)=>({ scrollStart:Math.max(0,state.scrollStart-10)
                              })
        );
    }
    else {
      this.setState((state)=>({ scrollStart:Math.min(totalHeight-height,state.scrollStart+10)
                              })
        );
    }
  }
}

BeautifulList.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  children: PropTypes.object.isRequired,
}

export default BeautifulList;
