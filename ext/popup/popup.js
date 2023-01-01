
// Setup

var filterSettings = {};

document.addEventListener('DOMContentLoaded', function() {
  mapButton( select('.exact') );
  mapButton( select('.regex') );
  mapButton( select('.data') );
  mapButton( select('.dataTest') );
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
function mapButton(button) {
  button.addEventListener('click', function() {
    buttonPressed(button.className);
  });
}
function mapInput(input) {
  input.addEventListener('change', function() {
    updateFilter(input.className, input.value);
  });
}

// Message passing

let activeTabParams = {
  active: true,
  currentWindow: true
};
function sendMessage(message) {
  chrome.tabs.query(activeTabParams, messagePush);
  function messagePush(tabs) {
    console.log(message);
    console.log({'tab': tabs[0]});
    chrome.tabs.sendMessage(tabs[0].id, message);
  }
}

function sendMessageToBackground(message) {
  chrome.runtime.sendMessage(message,
    function (response) {
      if (response) {
        console.log("Received response from background: ");
        console.log(response);
      }
    }
  );
}

function sendMessageToBackgroundWithAction(message, action) {
  message['action'] = action;
  sendMessageToBackground(message);
}


// Actions

function buttonPressed(button) {
  console.log('button pressed for ' + button);
  sendMessageToBackgroundWithAction(
    applyFilter({'buttonPressed': button}), "buttonPressed"
  );
}

function applyFilter(msg) {
  return Object.assign({}, msg, filterSettings);
}

function updateFilter(inputClass, input) {
  filterSettings[inputClass] = input;
  console.log('changed filter for ' + inputClass + ' to ' + input);
}
