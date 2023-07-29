// ref: https://dev.to/dhiwise/how-to-implement-server-sent-events-in-nodejs-11d9

const http = require('http');

/*
 * send interval in millis
 */
const sendInterval = 5000;
const port = 8080;

function sendServerSendEvent(_, res) {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  setInterval(function () {
    writeServerSendEvent(res, new Date().toLocaleTimeString());
  }, sendInterval);

  writeServerSendEvent(res, new Date().toLocaleTimeString());
}

function writeServerSendEvent(res, data) {
  const sseId = new Date().toLocaleTimeString();
  res.write('id: ' + sseId + '\n');
  res.write('data: ' + data + '\n\n');
}

http
  .createServer(function (req, res) {
    if (
      req.headers.accept &&
      req.headers.accept == 'text/event-stream' &&
      req.url == '/sse'
    ) {
      sendServerSendEvent(req, res);
    } else {
      res.writeHead(404);
      res.end();
    }
  })
  .listen(port, function () {
    console.log(`Server running at http://localhost:${port}/`);
  });
