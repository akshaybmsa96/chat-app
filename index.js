const MsgType = {
  sent: "SENT",
  received: "RECEIVED",
  open: "OPEN",
  error: "ERROR",
  close: "CLOSE",
};

const ConnectionStatus = {
  connected: 200,
  connecting: 201,
  disconnected: 400,
};

class ChatAPI {
  constructor() {
    this.currentState = ConnectionStatus.disconnected;
    this.sendButton = document.getElementById("send-button");
    this.userInput = document.getElementById("user-input");
    this.stopButton = document.getElementById("stop-button");
    this.chatMsgArea = document.getElementById("chatMsgArea");
    this.statusContainer = document.getElementById("status-container");

    this.updateConnectionStatus();

    if (this.sendButton) {
      this.sendButton.addEventListener("click", () => {
        this.onSendClickHandler();
      });
    }

    if (this.stopButton) {
      this.stopButton.addEventListener("click", () => {
        this.stopConnection();
      });
    }

    if (this.userInput) {
      this.userInput.addEventListener("keydown", (e) => {
        if (e.keyCode === 13) {
          this.onSendClickHandler();
        }
      });
    }
  }

  onSendClickHandler() {
    if (this?.userInput?.value) {
      this.sendMsg(this.userInput.value);
      this.userInput.value = "";
    }
  }

  initializeConnection() {
    this.worker = new Worker("webWorker.js");
    this.worker.postMessage(JSON.stringify({ type: "start" }));
    this.currentState = ConnectionStatus.connecting;
    this.updateConnectionStatus();

    this.worker.onmessage = (message) => {
      this.getMsg(message.data);
    };
  }

  stopConnection() {
    if (this.worker) {
      this.worker.postMessage(JSON.stringify({ type: "stop" }));
    } else {
      this.initializeConnection();
    }
  }

  sendMsg(msg) {
    if (this.worker && this.currentState) {
      const data = { type: "send", msg: msg };
      this.worker.postMessage(JSON.stringify(data));
    }

    this.updateInterface(MsgType.sent, msg);
  }

  getMsg(msgData) {
    console.log("msg from server", msgData);
    const data = JSON.parse(msgData);

    this.updateInterface(data.type, data.msg);
  }

  getSentMsgDiv(msg) {
    const sentMsgContainer = document.createElement("p");
    sentMsgContainer.innerHTML = msg;
    sentMsgContainer.classList.add("msgBox");
    sentMsgContainer.classList.add("sent-msg");

    return sentMsgContainer;
  }

  getReceivedMsgDiv(msg) {
    const receivedMsgContainer = document.createElement("p");
    receivedMsgContainer.innerHTML = msg;
    receivedMsgContainer.classList.add("msgBox");
    receivedMsgContainer.classList.add("received-msg");

    return receivedMsgContainer;
  }

  updateInterface(type, msg) {
    switch (type) {
      case MsgType.sent:
        const sentMsgContainer = this.getSentMsgDiv(msg);
        this.chatMsgArea && this.chatMsgArea.appendChild(sentMsgContainer);
        this.chatMsgArea.scrollTop = this.chatMsgArea.scrollHeight;
        break;
      case MsgType.received:
        const receivedMsgContainer = this.getReceivedMsgDiv(msg);
        this.chatMsgArea && this.chatMsgArea.appendChild(receivedMsgContainer);
        this.chatMsgArea.scrollTop = this.chatMsgArea.scrollHeight;
        break;
      case MsgType.open:
        this.currentState = ConnectionStatus.connected;
        this.stopButton.innerText = "STOP CHAT";
        this.updateConnectionStatus();
        break;
      case MsgType.close:
        this.currentState = ConnectionStatus.disconnected;
        this.stopButton.innerText = "START CHAT";
        this.worker.terminate();
        this.worker = null;
        this.updateConnectionStatus();
        break;
      default:
        return null;
    }
  }

  updateConnectionStatus() {
    let status;
    switch (this.currentState) {
      case 200:
        status = "Connected";
        break;
      case 201:
        status = "Connecting...";
        break;
      case 400:
        status = "Disconnected";
      default:
        break;
    }
    this.statusContainer.innerHTML = status;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const chat = new ChatAPI();
  // chat.initializeConnection();
});
