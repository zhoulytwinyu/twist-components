import React, { PureComponent } from 'react';
import {createPrimaryCategoryBitmap,createSecondaryCategoryBitmap,
        drawPrimaryCategory,drawSecondaryCategory} from "../Modules/YAxisTwoLevelPanelPlotters";

const PRIMARY_COLOR_CYCLE = ["#d2b4de","#aed6f1","#a9dfbf","#f9e79f","#f5cba7"];
const SECONDARY_COLOR_CYCLE = ["#feefce","#fffbe7"];

class MedicationRecordsDynamicYAxisTwoLevelPanel extends PureComponent{
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }
  render(){
    let { categoryStructure, /* [{name,children:[...]}] */
          useMedications, /* Set */
          rowHeight, width, height,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={height} {...rest}></canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }

  componentDidUpdate(){
    this.draw();
  }

  draw(){
    let { categoryStructure, /* [{name,children:[...]}] */
          useMedications, /* Set */
          rowHeight, width, height,
          } = this.props;
    this.draw_memo = this.draw_memo ||{};
    let memo = this.draw_memo;
    if (memo.categoryStructure !== categoryStructure) {
      memo.categoryStructure = categoryStructure;
      memo.categoryStructureClone = [];
      for (let i=0; i<categoryStructure.length; i++){
        let p = categoryStructure[i];
        let newP = {};
        newP.name = p.name;
        newP.children = [];
        newP.bitmap = createPrimaryCategoryBitmap(p.name);;
        newP.color = PRIMARY_COLOR_CYCLE[i%PRIMARY_COLOR_CYCLE.length];
        for (let j=0; j<p.children.length; j++) {
          let s = p.children[j];
          let newS = {};
          newS.name = s.name;
          newS.bitmap = createSecondaryCategoryBitmap(s.name);
          newP.children.push(newS);
        }
        memo.categoryStructureClone.push(newP);
      }
    }
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    for (let i=0,rowNum=0; i<categoryStructure.length; i++) {
      let p = memo.categoryStructureClone[i];
      let rowStart = rowNum;
      for (let s of p.children) {
        if (useMedications.has(s.name)) {
          let color = SECONDARY_COLOR_CYCLE[rowNum%SECONDARY_COLOR_CYCLE.length];
          drawSecondaryCategory(ctx,width,height,s.bitmap,color,rowNum*rowHeight,(rowNum+1)*rowHeight);
          rowNum+=1;
        }
      }
      if (rowNum !== rowStart) {
        drawPrimaryCategory(ctx,width,height,p.bitmap,p.color,rowStart*rowHeight,rowNum*rowHeight);
      }
    }
  }
}

export default MedicationRecordsDynamicYAxisTwoLevelPanel;
