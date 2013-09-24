'use strict';

var ports = [];
self.onconnect = function(e) {
  var port = e.ports[0];
  ports.push(port);
  port.onmessage = function(e) {
    for (var i = 0, l=ports.length; i < l; i++)
      if (ports[i] !== port)
        ports[i].postMessage(e.data);
  };
  port.start();
};