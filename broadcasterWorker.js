(function() {
  'use strict';

  var ports = [];
  var data = {};

  var broadcast = function(message, port) {
    for (var i = 0, l = ports.length; i < l; i++) {
      if (port !== ports[i])
        ports[i].postMessage(message);
    }
  };

  self.onconnect = function(e) {
    var port = e.ports[0];
    ports.push(port);
    port.onmessage = function(e) {
      var m = e.data;
      var r = {};
      var b;
      //set key/value
      if (m.set) {
        data[m.set] = m.value;
        b = {key: m.set, value: m.value};
      }
      else if (m.remove) {
        delete data[m.remove];
        b = {remove: m.remove};
      }
      else if (m.get) {
        r.value = data[m.get];
      }
      else if (m.broadcast) {
        b = m;
      }

      if (m.id) {
        r.id = m.id;
        port.postMessage(r);
      }

      if (b)
        broadcast(b, port);
    };
    port.start();
  };
  self.ondisconnect = function() {
  };
}());
