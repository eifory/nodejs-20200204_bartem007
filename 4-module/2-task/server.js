const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Subfolders not supported');
        return;
      }
      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File already exists');
        return;
      }
      const writeStream = fs.createWriteStream(filepath);
      const limitStream = new LimitSizeStream({ limit: 104856 });
      req.pipe(limitStream).pipe(writeStream);

      req.on('close', () => {
        if (!req.complete) {
          writeStream.destroy();
          fs.unlink(filepath, () => {
            res.statusCode = 500;
            res.end();
          });
        }
      });

      limitStream.on('error', (err) => {
        if (err.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end(err.message);
        }
      });

      writeStream.on('close', () => {
        res.statusCode = 201;
        res.end(`file ${pathname} was created successfully`);
      });

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

server.on('error', () => {
  res.statusCode = 501;
  res.end();
});

module.exports = server;
