#broadcaster.js

Server-less cross windows/tabs messaging

#Usage

Include broadcaster.js

```html
<script src="broadcaster/broadcaster.js"></script>
```

Use it when the document is ready (DOMContentLoaded/$(document).ready)

```javascript
window.broadcast('this message will be broadcasted to other tabs/windows');

window.onbroadcast = function(message) {
  console.log(message + 'has been received from an other tab/window');
};
```

#Underhood

If SharedWorker interface is available, broadcaster use it otherwise it falls back to StorageEvent.

If StorageEvevent is unsupported by the browser, window.broadcast is undefined.

In the case where SharedWorker is used, broadcaster.js guesses the worker path based on its one URL. It should work on most cases but if it doesn't, you can set the worker path by setting
```javascript
window.broadcasterWorkerPath = path;
```

