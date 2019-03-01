const respiratoryScoreLimits = [
  {"name":"RA","start":0,"end":1},
  {"name":"NC/MASK/BB","start":1,"end":6},
  {"name":"HFNC/CPAP","start":6,"end":16},
  {"name":"BIPAP","start":16,"end":26},
  {"name":"PSV","start":26,"end":36},
  {"name":"PCV/VCV","start":36,"end":70},
  {"name":"PHFOV/HFJV","start":70,"end":81},
  {"name":"ECMO","start":81,"end":100}
  ];

export default respiratoryScoreLimits;
