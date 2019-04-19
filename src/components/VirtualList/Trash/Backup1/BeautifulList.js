import React, {PureComponent} from "react";
import BeautifulScrollbar from "./BeautifulScrollbar";
import List from "./List";
import A_png from "./imgs/A.png";
import B_png from "./imgs/B.png";
import C_png from "./imgs/C.png";
import D_png from "./imgs/D.png";
import E_png from "./imgs/E.png";
import F_png from "./imgs/F.png";


const NAMES = ["E.colo","H.Sapien","Bradley Cooper","Netflix","Twist","Color","Box","Item"];
const IMGS = [A_png,B_png,C_png,D_png,E_png,F_png]

class ListItem extends PureComponent{  
  render(){
    let {src, ts, name} = this.props;
    return (
      <div style={{display:"flex",alignItems:"center"}}>
        <img alt="" src={src} style={{height:32}}/>
        <span style={{display:"inline-block",width:100}}>
          {ts}
        </span>
        <span>
          {name}
        </span>
      </div>
    );
  }
  
  componentDidMount(){
    console.log("M");
  }
  
  componentDidUpdate(){
    console.log("U");
  }
}

const LIST_ITEMS = [...new Array(100).keys()].map( (i)=> <ListItem key={i}
                                                                    src={IMGS[Math.floor(Math.random()*IMGS.length)]}
                                                                    ts={`${Math.floor(Math.random()*12)}:${Math.floor(Math.random()*60)} ${["AM","PM"][Math.round(Math.random())]}`}
                                                                    name={NAMES[Math.floor(Math.random()*NAMES.length)]}
                                                                    />
                                                   );

class BeautifulList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {start:0}
  }
  
  render() {
    let { width,height,
          showCount,listHeight,
          children} = this.props;
    let {start} = this.state;
    let rowCount = React.Children.count(children);
    
    return (
      <div style={{display:"flex",flexDirection:"row",width:width,height:height}}
            className="scrollContainer"
            onWheel={this.handleScroll}
            >
        <div style={{flexGrow:0,flexShrink:0}}>
          <BeautifulScrollbar width={10} height={height}
                              rowCount={100} showCount={20}
                              start={this.state.start}
                              updateStartHandler={(s)=>this.setState({start:s})}
                              />
        </div>
        <div style={{flexGrow:1}}>
          <List start={start}>
            {LIST_ITEMS}
          </List>
        </div>
      </div>
    )
  }
  
  handleScroll=(ev)=>{
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.deltaY<0) {
      this.setState((state)=>({ ...state,
                                start:Math.max(0,state.start-0.1)
                              })
        );
    }
    else {
      this.setState((state)=>({ ...state,
                                start:Math.max(0,state.start+0.1)
                              })
        );
    }
  }
}

export default BeautifulList;


class AutoSizer extends PureComponent {
  
}
