let socket = null;

const estabilishConnection = () => {
  socket = new WebSocket("ws:/localhost:3000");

  socket.addEventListener("open", () => {
    console.log("Connection estabilished with server");
    postMessage(JSON.stringify({ type: "OPEN" }));
  });

  socket.addEventListener("close", () => {
    console.log("Connection closed with server");
    postMessage(JSON.stringify({ type: "CLOSE" }));
  });

  socket.addEventListener("error", function (event) {
    console.log("Got error: ", event);
    postMessage(JSON.stringify({ type: "ERROR" }));
  });

  socket.onmessage = function (event) {
    let message = event.data;
    postMessage(JSON.stringify({ type: "RECEIVED", msg: message }));
  };
};

onmessage = function (e) {
  console.log("Worker: Message received from main script");
  const data = JSON.parse(e.data);

  switch (data.type) {
    case "start":
      estabilishConnection();
      break;
    case "send":
      if (socket !== null) {
        socket.send(data.msg);
      }
      break;
    case "stop":
      if (socket !== null) {
        socket.close();
      }
      break;
    default:
      break;
  }
};
