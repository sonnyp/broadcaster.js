#broadcaster.js

Server-less cross windows/tabs messaging

#Usage

Include broadcaster.js

```html
<script src="broadcaster/broadcaster.js"></script>
```

Use it when the document is ready (DOMContentLoaded)

```javascript
window.broadcast('this message will be broadcasted to other tabs/windows');

window.onbroadcast = function(message) {
  console.log(message + 'has been received from an other tab/window');
};
```