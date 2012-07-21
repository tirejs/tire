var connect = require('connect')
  , http = require('http')
  , fs   = require('fs')
  , app = connect()
      .use(connect.static(__dirname))
      .use(function (req, res) {
        if (req.originalUrl === '/') {
          res.writeHead(302, {
            'Location': '/test/'
          });
          res.end();
        } else {
          fs.readFile(__dirname + req.originalUrl, function (err, buf) {
            if (!err) res.end(buf.toString());
          });
        }
      });

http.createServer(app).listen(3000);
console.log('Server running at http://localhost:3000');