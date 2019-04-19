import React, {PureComponent} from "react";
import BeautifulList from "./BeautifulList";
// Import Other
import Timer from "./Timer";
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

class ListItem2 extends PureComponent{
  constructor(props){
    super(props);
    console.log("C2");
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

const LIST_ITEMS = [...new Array(100).keys()].map( (i)=> <ListItem key={"c"+i}
                                                                        src={IMGS[Math.floor(Math.random()*IMGS.length)]}
                                                                        ts={`${Math.floor(Math.random()*12)}:${Math.floor(Math.random()*60)} ${["AM","PM"][Math.round(Math.random())]}`}
                                                                        name={NAMES[Math.floor(Math.random()*NAMES.length)]}
                                                                        />
                                                 );

const LIST_ITEMS2 = [...new Array(100).keys()].map( (i)=> <ListItem2 key={"c2"+i}
                                                                        src={IMGS[Math.floor(Math.random()*IMGS.length)]}
                                                                        ts={`${Math.floor(Math.random()*12)}:${Math.floor(Math.random()*60)} ${["AM","PM"][Math.round(Math.random())]}`}
                                                                        name={NAMES[Math.floor(Math.random()*NAMES.length)]}
                                                                        />
                                                 );

class Bundle extends PureComponent {
  constructor(props) {
    super(props);
    this.increment = 1;
    this.state = {itemCount: 20
                  };
  }
  
  render() {
    let { width,height} = this.props;
    let {itemCount} = this.state;
    
    let listItems = [].concat(LIST_ITEMS.slice(0,itemCount),
                              LIST_ITEMS2.slice(0,itemCount));
    
    return (
      <>
        <BeautifulList width={500} height={200} rowHeight={40}>
          <p key="12312">asdad</p>
          {listItems}
          <p key="123123112">asd123123dasda2132</p>
        </BeautifulList>
        {/*<Timer callback={this.incrementItemCount} period={1000} />*/}
      </>
    )
  }
  
  incrementItemCount = ()=>{
    if (this.state.itemCount>=10){
      this.increment = -1;
    }
    else if (this.state.itemCount<=1){
      this.increment = +1;
    }
    
    this.setState((state)=>({itemCount:state.itemCount+this.increment}));
  }
}

export default Bundle;
