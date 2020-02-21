const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Subfolders are not supported');
      }

      fs.access(filepath, (err) => {
        if (err) {
          res.statusCode = 404;
          res.end('File not found');
        } else {
          fs.createReadStream(filepath).pipe(res);
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

server.on('error', (err) => {
  res.statusCode = 500;
});

module.exports = server;
