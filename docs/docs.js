var fs = require('fs')
  , name = 'docs/index'
  , rep = {
      'http://documentup.com/stylesheets/screen.css': '/stylesheets/main.css'
    };
    
fs.readFile(name, function (err, buf) {
  if (err) throw err;
  buf = buf.toString();
  for (var k in rep) buf = buf.replace(k, rep[k]);
  fs.writeFile(name, buf);
});