(function(window) {

  'use strict';

  //
  //SharedWorker support
  //
  var sharedWorkerBroadcaster = function(workerPath) {
    var worker = new SharedWorker(workerPath || this.getWorkerPath());
    worker.port.addEventListener('message', this);
    worker.port.start();
    this.worker = worker;
  };
  sharedWorkerBroadcaster.prototype = {
    handleEvent: function(e) {
      window.onbroadcast(e.data);
    },
    broadcast: function(message) {
      this.worker.port.postMessage(message);
    },
    getWorkerPath: function() {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0, l = scripts.length; i < l ; i++) {
        if (scripts[i].src.match('broadcaster.js')) {
          var a = document.createElement('a');
          a.href = scripts[i].src;
          var index = a.pathname.indexOf('broadcaster.js');
          var parentPath = a.pathname.substring(0, index);
          return a.origin + parentPath + 'broadcasterWorker.js';
        }
      }    
    }
  }

  //
  //DOMStorage/StorageEvent (localStorage) support
  var storageBroadcaster = function() {
    window.addEventListener('storage', this);
  };
  storageBroadcaster.prototype = {
    handleEvent: function(e) {
      if(e.key === 'broadcast')
        window.onbroadcast(e.newValue);
    },
    broadcast: function(message) {
      console.log(typeof message)
      try {
        localStorage.setItem('broadcast', message);
      }
      catch(e) {
        return e;
      }
    },
  }

  var broadcaster;
  if (typeof window.SharedWorker !== 'undefined')
    broadcaster = new sharedWorkerBroadcaster(window.broadcasterWorkerPath);
    // if (typeof workerURL === undefined)
      // var workerURL = 
  else if (typeof window.StorageEvent === 'function')
    broadcaster = new storageBroadcaster();

  if (!broadcaster)
    return;

  if (!window.onbroadcast)
    window.onbroadcast = function() {};
  window.broadcast = broadcaster.broadcast.bind(broadcaster);

})(window);