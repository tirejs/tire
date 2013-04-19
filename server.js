var connect = require('connect')
  , http = require('http')
  , fs   = require('fs')
  , port = process.argv[2] || 3000
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

http.createServer(app).listen(port);
fs.writeFileSync(__dirname + '/test/pid.txt', process.pid, 'utf-8');