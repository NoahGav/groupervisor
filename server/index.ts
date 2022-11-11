import * as Y from "yjs";
import * as fs from "fs";
import { gzip, ungzip } from "node-gzip";
import { v4 as uuid } from "uuid";
import { WebsocketProvider } from "y-websocket";
import { Mutex } from "async-mutex";
import { exec } from "child_process";

const doc = new Y.Doc();
const mutex = new Mutex();
let cooldown = false;

initialize();

async function initialize() {
  // Load most up-to-date data (if any exists).
  await loadDoc();

  // Save data immediately on shutdown.
  process.on("SIGINT", async () => {
    await saveDoc();
    process.exit();
  });

  // Save the data every time there is an update (with a cooldown).
  doc.on("update", saveDocWithCooldown);

  // Create the websocker server.
  const server = exec("npx cross-env PORT=3000 npx y-websocket");
  server.stdout?.on("data", data => console.log(`server: ${data}`));

  new WebsocketProvider(
    "ws://localhost:3000",
    "room",
    doc,
    { WebSocketPolyfill: require('ws') }
  );
}

async function loadDoc() {
  if (!fs.existsSync("data")) fs.mkdirSync("data");

  const files = fs.readdirSync("data");
  if (files.length === 0) return;

  const info = files.map(file => ({ name: file, birth: fs.statSync(`data/${file}`).birthtimeMs }));
  const newest = info.sort((a, b) => b.birth - a.birth)[0].name;
  const data = await ungzip(fs.readFileSync(`data/${newest}`));

  Y.applyUpdate(doc, data);
}

function saveDocWithCooldown() {
  if (cooldown) return;
  cooldown = true;

  setTimeout(() => {
    cooldown = false;
    saveDoc();
  }, 15000);
}

async function saveDoc() {
  // This guarantees that saveDoc is never called twice at the same time.
  await mutex.runExclusive(_saveDoc);
}

async function _saveDoc() {
  // Save compressed data.
  const data = Y.encodeStateAsUpdate(doc);
  const compressed = await gzip(data);
  fs.writeFileSync(`data/${uuid()}.zip`, compressed);

  // Delete all but the three newest files.
  const files = fs.readdirSync("data");
  const info = files.map(file => ({ name: file, birth: fs.statSync(`data/${file}`).birthtimeMs }));
  let oldest = info.sort((a, b) => a.birth - b.birth);

  while (oldest.length > 3) {
    fs.rmSync(`data/${oldest[0].name}`);
    oldest.shift();
  }
}