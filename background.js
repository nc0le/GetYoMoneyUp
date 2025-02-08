/*Listens for messages from content.js and triggers the pop-up when the user reaches a checkout page.*/

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "showPopup") {
        chrome.action.openPopup();
    }
    chrome.storage.local.get(["laterList"], (data) => {
        if (!data.laterList) {
          chrome.storage.local.set({ laterList: [] });
        }
      });

});

  