import { BackendClient } from '../utils/backend-client';

console.log('SubStyle Service Worker Loaded');

// Clean up on extension update or reload
chrome.runtime.onSuspend.addListener(() => {
  console.log('SubStyle: Extension suspending, cleaning up...');
  // Cancel any ongoing transcription
  BackendClient.cancelTranscription();
  // Clear storage flags
  chrome.storage.local.remove(['isProcessing', 'processingUrl']);
});

// Clean up when all windows close
chrome.windows.onRemoved.addListener(() => {
  chrome.windows.getAll({}, (windows) => {
    if (windows.length === 0) {
      console.log('SubStyle: All windows closed, cleaning up...');
      BackendClient.cancelTranscription();
      chrome.storage.local.remove(['isProcessing', 'processingUrl']);
    }
  });
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener(() => {
  // Check if the closed tab was a YouTube tab with processing
  chrome.storage.local.get(['isProcessing'], (result) => {
    if (result.isProcessing) {
      console.log('SubStyle: Tab closed during processing, cleaning up...');
      BackendClient.cancelTranscription();
      chrome.storage.local.remove(['isProcessing', 'processingUrl']);
    }
  });
});

// Listen for tab URL changes
chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
  if (changeInfo.url) {
    chrome.storage.local.get(['isProcessing', 'processingUrl'], (result) => {
      if (result.isProcessing && result.processingUrl && result.processingUrl !== changeInfo.url) {
        console.log('SubStyle: Tab URL changed during processing, cancelling...');
        BackendClient.cancelTranscription();
        chrome.storage.local.remove(['isProcessing', 'processingUrl']);
      }
    });
  }
});
