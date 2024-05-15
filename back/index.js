const WebSocket = require('./WebSocket');

class Main {

  constructor() {
    this.wss = new WebSocket('8080');
  }

  start() {
    this.wss.start();
    console.log('Web Socket Started');
  }
}

const myApp = new Main();
myApp.start();