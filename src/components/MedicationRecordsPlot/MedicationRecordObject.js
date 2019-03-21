class MedicationRecordObject {
  constructor({name,start,end,type}) {
    this.name = name;
    this.start = start;
    this.end = end || start;
    this.type = type; // "iv","po","cont","merged"
    Object.freeze(this);
  }
  
  draw(ctx,startDomX,endDomX,startDomY,endDomY){
    
  }
  
  drawHitbox(ctx,startDomX,endDomX,startDomY,endDomY){
    
  }
}

function canMerge(obj1,obj2) {
  if (obj1.name!==obj2.name)
    throw new TypeError("Invalid objects to merge.");
  if (curRecordType==="point" && prevRecordType==="point") {
    if (curRecord["start"]-prevRecord["end"] < pointGroupRange) {
      ret = true;
    }
  }
}


  needMerge(prevRecord,prevRecordType,curRecord,curRecordType,pointGroupRange,rangeGroupRange) {
    let ret = false;
    if (curRecordType==="point" && prevRecordType==="point") {
      if (curRecord["start"]-prevRecord["end"] < pointGroupRange) {
        ret = true;
      }
    }
    else if (curRecordType==="point" && prevRecordType==="point"){
      if (curRecord["start"]-prevRecord["end"] < pointGroupRange) {
        ret = true;
      }
    }
    else {
      if (curRecord["start"]-prevRecord["end"] < (pointGroupRange+rangeGroupRange)/2) {
        ret = true;
      }
    }
    return ret;
  }
  
function getMergeDistance() {
  
}

function getChangeDistance(obj1) {
  
}
