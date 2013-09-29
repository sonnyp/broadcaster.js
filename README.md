#broadcaster.js
Server-less cross tabs messaging.

##Usage
#####Include broadcaster.js
```html
<script src="broadcaster/broadcaster.js"></script>
```

#####API

```javascript
window.broadcaster.broadcast('this message will be broadcasted to the other tabs');

window.broadcaster.onmessage = function(message) {
  console.log(message + ' has been received from an other tab/window');
};

//key value will be shared between tabs
window.broadcaster.set('key', 'value', function() {
	// key/value have been saved
});

//you can retrieve it from any tab with
window.broadcaster.get('foo', function(value) {
  console.log(value);
});

//event will be broadcasted
window.broadcaster.onitem = function(key, value) {
	console.log(key + ': ' + value),
};

//a key/value pair can be removed
window.broadcaster.remove('key', function() {
	//the key/value pair has been removed
});

//event will be broadcaster
window.broadcaster.onremove = function(key) {
	console.log(key + ' has been removed');
};
```

Broadcasted message/value support types are string, number, boolean, array and object.

#Underhood

If SharedWorker interface is available, broadcaster use it otherwise it falls back to StorageEvent.

If StorageEvevent is unsupported by the browser, window.broadcast is undefined.

When SharedWorker is used, broadcaster.js guesses the worker path based on its own URL. broadcasterWorker.js script must be in the same folder as 
```javascript
Broadcaster.prototype.WorkerPath = path;
```

