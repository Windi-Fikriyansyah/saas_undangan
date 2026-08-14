const fs = require('fs');
let p = 'd:/wedding-template-engine/src/templates/premium-forest.json';
let s = fs.readFileSync(p, 'utf8');
s = s.split('"duration". }').join('"duration": 0.9 }');
fs.writeFileSync(p, s);
