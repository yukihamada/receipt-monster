chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "captureScreenshot") {
      chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(dataUrl) {
        sendResponse({dataUrl: dataUrl});
      });
      return true;  // 非同期レスポンスのために必要
    }
  });
  
  chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({dailyFeedCount: 0, lastFeedDate: new Date().toDateString()});
  });