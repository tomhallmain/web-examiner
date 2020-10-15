
// Setup

var filterSettings = {};

document.addEventListener('DOMContentLoaded', function() {
  mapBtn( select('.exact') );
  mapBtn( select('.regex') );
  mapBtn( select('.data') );
  mapBtn( select('.dataTest') );
  mapInput( select('.tag') );
  mapInput( select('.classVal') );
  mapInput( select('.idVal') );
  mapInput( select('.textVal') );
  mapInput( select('.attrName') );
  mapInput( select('.attrVal') );
});

function select(className) {
  return document.querySelector(className);
}
function mapBtn(btn) {
  btn.addEventListener('click', function() { 
    btnPressed(btn.className);
  });
};
function mapInput(input) {
  input.addEventListener('change', function() { 
    updateFilter(input.className, input.value);
  });
};

// Message passing

let activeTabParams = {
  active: true,
  currentWindow: true
};
function sendMsg(message, filterSettings) {
  chrome.tabs.query(activeTabParams, messagePush);
  function messagePush(tabs) {
    console.log(message);
    console.log({'tab': tabs[0]});
    chrome.tabs.sendMessage(tabs[0].id, message);
  };
};


// Actions

function btnPressed(msgVal) {
  console.log('button pressed for ' + msgVal);
  sendMsg(applyFilter({'buttonPressed': msgVal}));
};

function applyFilter(msg) {
  return Object.assign({}, msg, filterSettings);
};

function updateFilter(inputClass, input) {
  filterSettings[inputClass] = input;
  console.log('changed filter for ' + inputClass + ' to ' + input);
};



