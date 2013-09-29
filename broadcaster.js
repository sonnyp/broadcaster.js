(function(window) {

  'use strict';

  var getWorkerPath = function() {
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
  };

  var Broadcaster = function(backend) {
    if (!backend) {
      if (typeof window.SharedWorker !== 'undefined')
        backend = sharedWorkerBackend;
      else if (typeof window.StorageEvent === 'function')
        backend = storageEventBackend;
    }
    else if (backend === 'sharedWorker') {
      backend = sharedWorkerBackend;
    }
    else if (backend = 'storageEvent') {
      backend = storageEventBackend;
    }

    for (var i in backend) {
      Broadcaster.prototype[i] = backend[i];
    }

    this.init();
  };
  Broadcaster.prototype = {
    workerPath: null,
    onmessage: new Function(),
    onremove: new Function(),
    onitem: new Function()
  };

  //
  //SharedWorker backend
  //
  var sharedWorkerBackend = {
    init: function() {
      if (!this.workerPath)
        this.workerPath = getWorkerPath();
      var worker = new SharedWorker(this.workerPath);
      worker.port.addEventListener('message', this);
      worker.port.start();
      this.worker = worker;
      this.callbacks = {};
    },
    handleEvent: function(e) {
      var m = e.data;
      if (m.broadcast)
        this.onmessage(m.broadcast);
      else if (m.id && this.callbacks[m.id]) {
        if (m.value)
          this.callbacks[m.id](m.value);
        else
          this.callbacks[m.id]();
      }
      else if (m.remove)
        this.onremove(m.remove);
      else if (m.key && m.value)
        this.onitem(m.key, m.value);
    },
    broadcast: function(message, callback) {
      var e = {broadcast: message};
      if (callback) {
        var id = Date.now() + '-' + Math.random();
        e.id = id;
        this.callbacks[id] = callback;
      }

      this.worker.port.postMessage(e);
    },
    get: function(key, callback) {
      var e = {get: key};
      if (callback) {
        var id = Date.now() + '-' + Math.random();
        e.id = id;
        this.callbacks[id] = callback;
      }

      this.worker.port.postMessage(e);
    },
    set: function(key, value, callback) {
      var e = {set: key, value: value};
      if (callback) {
        var id = Date.now() + '-' + Math.random();
        e.id = id;
        this.callbacks[id] = callback;
      }

      this.worker.port.postMessage(e);
    },
    remove: function(key, callback) {
      var e = {remove: key};
      if (callback) {
        var id = Date.now() + '-' + Math.random();
        e.id = id;
        this.callbacks[id] = callback;
      }

      this.worker.port.postMessage(e);
    }
  };

  //
  //DOMStorage/StorageEvent backend
  //
  var storageEventBackend = {
    init: function() {
      window.addEventListener('storage', this);
      //FIXME when the last tab has been closed, clear localstorage
      // window.addEventListener('unload', function() {
      //   localStorage.clear();
      // });
    },
    handleEvent: function(e) {
      if(e.key === 'broadcast') {
        this.onmessage(JSON.parse(e.newValue));
      }
      else if (e.newValue === null) {
        this.onremove(e.key);
      }
      else {
        this.onitem(e.key, JSON.parse(e.newValue));
      }
    },
    broadcast: function(message, callback) {
      localStorage.setItem('broadcast', JSON.stringify(message));
      if (callback)
        callback();
    },
    set: function(key, value, callback) {
      localStorage.setItem(key, JSON.stringify(value));
      if (callback)
        callback()
    },
    get: function(key, callback) {
      var value = localStorage.getItem(key);
      if (callback)
        callback(JSON.parse(value));
    }
  };

  window.broadcaster = new Broadcaster();
  window.Broadcaster = Broadcaster;

})(window);