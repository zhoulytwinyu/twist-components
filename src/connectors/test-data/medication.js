const medication = [
  {name:"furosemide", start:1000, end:1000, route:"iv", score: -100},
  {name:"furosemide", start:3500, end:3500, route:"iv", score: 0},
  {name:"furosemide", start:12000, end:12000, route:"po", score: 100},
  {name:"bumetanide", start:6000, end:6000, route:"iv", score: 30},
  {name:"bumetanide", start:90000, end:90000, route:"iv", score: 50},
  {name:"bumetanide", start:110000, end:110000, route:"iv", score: -10},
  {name:"chlorotiazide", start:300, end:300, route:"iv", score: 90},
  {name:"albumin", start:1000, end:4000, route:"cont", score: 10},
  {name:"spironolactone", start:2000, end:40000, route:"cont", score: 10}
]

const medCategory = { "furosemide":"loop",
                      "bumetanide":"loop",
                      "chlorotiazide":"thiazide",
                      "albumin":"vol"};

const categoryOrder = ["loop","thiazide","vol"];

const useMeds = new Set(["furosemide","bumetanide","chlorotiazide","albumin","spironolactone"]);

export {medication,
        medCategory,
        useMeds,
        categoryOrder
        };
