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
