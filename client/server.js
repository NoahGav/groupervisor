const __dirname = process.cwd();

import http from "http";
import express from "express";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.static("express"));
// default URL for website
app.use('/', function (req, res) {
  const url = new URL(req.url, "http://www.test.com:80");

  if (!url.pathname.includes(".")) res.sendFile(path.join(__dirname, '/dist/index.html'));
  else res.sendFile(path.join(__dirname, "dist", url.pathname));
});
const server = http.createServer(app);
const port = 80;
server.listen(port);
console.debug('Server listening on port ' + port);