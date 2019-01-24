const medication = [
  {name:"furosemide", start:1000, end:1000, route:"IV", score: -100},
  {name:"furosemide", start:3500, end:3500, route:"IV", score: 0},
  {name:"furosemide", start:12000, end:12000, route:"PO", score: 100},
  {name:"bumetanide", start:6000, end:6000, route:"IV", score: 30},
  {name:"bumetanide", start:9000, end:9000, route:"IV", score: 50},
  {name:"bumetanide", start:11000, end:11000, route:"IV", score: -10},
  {name:"chlorotiazide", start:300, end:300, route:"IV", score: 90},
  {name:"albumin", start:1000, end:4000, route:"IV", score: 10},
  {name:"spironolactone", start:1000, end:4000, route:"IV", score: 10}
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
