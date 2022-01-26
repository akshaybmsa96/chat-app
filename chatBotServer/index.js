const WebSocket = require("ws");
const dictorary = require("./dictonary.json");
const wss = new WebSocket.Server({ port: 3000 });

wss.on("connection", (ws) => {
  console.log("Connection estabilished", ws);

  ws.on("close", () => {
    console.log("Connection Closed");
  });

  ws.on("message", (data) => {
    setTimeout(() => {
      sendData(`${data}`, ws);
    }, 500);
  });
});

const sendData = async (msg, ws) => {
  const response = await calculateResponse(msg);
  ws.send(response || msg?.toUpperCase());
};

const calculateResponse = async (msg) => {
  if (msg.toLowerCase().match(/joke/g)) {
    const index = Math.floor(Math.random() * dictorary.joke.length);
    return dictorary.joke[index];
  } else if (
    msg.toLowerCase().match(/hi|hello|greetings|wassup|whatsup|hey/g)
  ) {
    const index = Math.floor(Math.random() * dictorary.greetings.length);
    return dictorary.greetings[index];
  } else if (msg.toLowerCase().match(/bye|tata/g)) {
    const index = Math.floor(Math.random() * dictorary.bye.length);
    return dictorary.bye[index];
  } else if (msg.toLowerCase().match(/shayari|shayari|shayar/g)) {
    const index = Math.floor(Math.random() * dictorary.shayari.length);
    return dictorary.shayari[index];
  } else {
    const index = Math.floor(Math.random() * dictorary.default.length);
    return dictorary.default[index];
  }
};

const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  fs.createReadStream("./client/index.html").pipe(res);
});

server.listen(process.env.PORT || 3001);
