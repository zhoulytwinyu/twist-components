const plot1x = [...Array(18000).keys()].map( (x)=>x*10 );
const plot1ys = [[...Array(18000).keys()].map( ()=> Math.random()*500),
                 [...Array(18000).keys()].map( ()=> Math.random()*500)
                 ];

export {plot1x,plot1ys};
