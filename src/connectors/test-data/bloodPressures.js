//1482858000000
//1513698300000
export const DBP = [];
export const MBP = [];
export const SBP = [];

for ( let i=1482858000000-60*60*1000, toArc=(x)=>(2*Math.PI)/(1513698300000-1482858000000)*(x-1482858000000);
      i<1513698300000+60*60*1000;
      i+=60*60*1000) {
  let arc = toArc(i);
  let dbp = {time: i/1000,value: 10*Math.cos(arc)+120};
  let mbp = {time: i/1000,value: 10*Math.cos(arc)+100};
  let sbp = {time: i/1000,value: 10*Math.cos(arc)+80};
  DBP.push(dbp)
  MBP.push(mbp)
  SBP.push(sbp)
}
