import React, {PureComponent} from "react";
import VirtualList from "./VirtualList";
// Import Other
import A_png from "./imgs/A.png";
import B_png from "./imgs/B.png";
import C_png from "./imgs/C.png";
import D_png from "./imgs/D.png";
import E_png from "./imgs/E.png";
import F_png from "./imgs/F.png";

const NAMES = ["E.colo","H.Sapien","Bradley Cooper","Netflix","Twist","Color","Box","Item"];
const IMGS = [A_png,B_png,C_png,D_png,E_png,F_png];

class ListItem extends PureComponent{
  constructor(props){
    super(props);
    console.log("C");
  }
  
  render(){
    let {src, ts, name} = this.props;
    return (
      <div style={{display:"flex",alignItems:"center",cursor:"pointer",height:"100%"}} onClick={()=>alert('!')}>
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
}

const LIST_ITEMS = [...new Array(20).keys()].map( (i)=> <ListItem  key={i}
                                                                      src={IMGS[Math.floor(Math.random()*IMGS.length)]}
                                                                      ts={`${Math.floor(Math.random()*12)}:${Math.floor(Math.random()*60)} ${["AM","PM"][Math.round(Math.random())]}`}
                                                                      name={NAMES[Math.floor(Math.random()*NAMES.length)]}
                                                                      />
                                                 );


class Bundle extends PureComponent {
  constructor(props) {
    super(props);
    this.increment = 1;
  }
  
  render() {
    let {width,height,children} = this.props;
    
    return (
      <>
        <VirtualList width={500} height={200} rowHeight={40}>
          {LIST_ITEMS}
        </VirtualList>
      </>
    )
  }
}

export default Bundle;

