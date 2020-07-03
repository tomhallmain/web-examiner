

// Handle writing to document

files = ['script.js']
files.map( file => loadScript(file) );

function loadScript(fileName) {
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL(fileName);
  s.onload = function() { this.remove() };
  appendScript(s); 
};

function fireEvent(toFire) {
  var s = document.createElement('script');
  s.appendChild(document.createTextNode(toFire + ';'));
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
  
  var selection = message['buttonPressed'];
  var exactMatches = (message['buttonPressed'] === 'exact');
  var filters = {tag: '', classVal: '', idVal: '', textVal: '', 
    attrName: '', attrVal: ''};
  var filterSettings = [];
  
  Object.keys(filters).forEach( (filter, index) => {
    filters[filter] = (message[filter] ? "'" + message[filter] + "'" : 'null')
    filterSettings[index] = filter + ': ' + filters[filter]
  });
  filterSettings = '{' + filterSettings.join(', ') + '}';

  var event = (function(selection) {
    switch(selection) {
      case 'exact': 
        return 'revealSelectors(' + exactMatches + ', ' + filterSettings + ')'; break;
      case 'regex': 
        return 'revealSelectors(' + exactMatches + ', ' + filterSettings + ')'; break;
      case 'data': 
        return 'revealDataSelectors()'; break;
      case 'dataTest': 
        return 'revealDataTestSelectors()'; break;
      default: console.log('Message not understood');
    };
  })(selection);
  console.log(event);
  if (event) fireEvent(event);
};




