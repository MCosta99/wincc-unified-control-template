function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16).toUpperCase();
    });
  }
//console.log(uuidv4());



fs = require('fs');
var name = 'manifest.json';
var m = JSON.parse(fs.readFileSync(name).toString());

var gen = uuidv4();

console.log("\x1b[32mNew GUID Generated: " + gen);

m.control.identity.type = "guid://"+gen;

fs.writeFileSync(name, JSON.stringify(m, null, "\t"));

