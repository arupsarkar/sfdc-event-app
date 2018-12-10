//socket-singletion.js

let socket = require('socket.io');

let SocketSingleton = (function() {
  this.io = null;
  this.configure = function(server) {
    this.io = socket(server);
  };

  return this;
})();

module.exports;
