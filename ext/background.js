// connect to content script
chrome.runtime.onConnect.addListener(port => {
  console.assert(port.name == "contentscript");

  // listen for our browserAction to be clicked
  chrome.browserAction.onClicked.addListener(() => {
    console.log("clicked");
    // post a message to the content script to tell content script to inject the reveal script
    port.postMessage({ method: 'revealSelectors' });
    return true;
  });
  return true;
});


function sendMessage(message, tabId) {
  console.log("Sending message:");
  console.log(message);
  console.log(Object.keys(chrome.tabs));
  if (!tabId) tabId = chrome.tabs.getCurrent.id;
  chrome.tabs.query({}, function(tabs){
    chrome.tabs.sendMessage(tabId, message);
  });
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function loadScriptToPage(fileName, tabId) {
  chrome.scripting.executeScript(
    {
      target: {tabId: tabId},
      files: [fileName],
    },
    () => {});
}

function fireEventToPage(func, args, tabId) {
  if (tabId) {
    chrome.scripting.executeScript(
      {
        target: {tabId: tabId, allFrames: true},
        func: func,
        args: args || []
      },
      () => {});
  } else {
    getCurrentTab().then(tab => {
      if (tab) {
        chrome.scripting.executeScript(
          {
            target: {tabId: tab.id, allFrames: true},
            func: func,
            args: args || []
          },
          () => {});
      }
    })
  }
}

function setupInternalScripts(tabId) {
  loadScriptToPage('script.js', tabId);
}

function messageHandler(request, sender, sendResponse) {
  console.log('Background received message:');
  console.log(request);

  if (request.action === "setupInternalScripts") {
    setupInternalScripts(sender.tab.id);
    return;
  }
  else if (request.action !== "buttonPressed") {
    console.log("Request not understood.");
    return;
  }

  var exactMatch = (request.buttonPressed === 'exact');
  var filters = {tag: '', classVal: '', idVal: '', textVal: '',
    attrName: '', attrVal: ''};

  Object.keys(filters).forEach( (filter, index) => {
    filters[filter] = request[filter] || '';
  });

  switch(request.buttonPressed) {
    case 'exact':
    case 'regex':
      fireEventToPage(function(exactMatch, filters) {
        revealSelectors(exactMatch, filters);
      }, [exactMatch, filters]);
      break;
    case 'data':
      fireEventToPage(function() {revealDataSelectors();});
      break;
    case 'dataTest':
      fireEventToPage(function() {revealDataTestSelectors();});
      break;
    default:
      console.log('Selection not understood.');
      break;
  }
};


chrome.runtime.onMessage.addListener(messageHandler);
