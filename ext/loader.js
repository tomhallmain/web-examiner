

function loadScript(fileName) {
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL(fileName);
  s.onload = function() { this.remove() };
  appendScript(s);
};

function appendScript(script) {
  (document.head || document.documentElement).appendChild(script);
};

// Handle messages

chrome.runtime.onMessage.addListener(messageHandler);

function messageHandler(message) {
  console.log('Content script received message:');
  console.log(message);
};


chrome.runtime.sendMessage({action: "setupInternalScripts"});
