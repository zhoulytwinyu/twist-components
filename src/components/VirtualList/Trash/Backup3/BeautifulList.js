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
    if (scrollStart>React.Children.count(children)*rowHeight-height) {
      return {scrollStart:Math.max(0,React.Children.count(children)*rowHeight-height)};
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
    let realHeight = rowHeight*React.Children.count(children);
    if (realHeight<height){
      return 0;
    }
    else {
      return Math.max(0,Math.min(realHeight-height,scrollStart));
    }
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
    let {scrollStart} = this.state;
    if (ev.deltaY<0) {
      this.handleScrollStartUpdate(scrollStart-10);
    }
    else {
      this.handleScrollStartUpdate(scrollStart+10);
    }
  }
}

BeautifulList.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
}

export default BeautifulList;
