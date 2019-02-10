const plot1x = [...Array(1800).keys()].map( (x)=>x*100 );
const plot1ys = [[...Array(1800).keys()].map( ()=> Math.random()*500),
                 [...Array(1800).keys()].map( ()=> Math.random()*500)
                 ];

export {plot1x,plot1ys};
