// Listen for the keyboard command from Chrome
chrome.commands.onCommand.addListener((command) => {
  if (command === 'make-bold') {
    // Send message to the active tab's content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'make-bold' });
      }
    });
  }
});

console.log('LinkedIn Bold Formatter background service worker loaded');
