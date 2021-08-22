import 'emoji-log';
import {browser, Tabs} from 'webextension-polyfill-ts';

browser.runtime.onInstalled.addListener((reason): void => {
  console.log('browser.runtime.onInstall (previousVersion)', reason.previousVersion);
  console.log('browser.runtime.onInstall (reason)', reason.reason);
});

const setCurrentTabContext = (tabId: number, windowId: number) => {
  console.log('contentScript.bundle.js - tabId: ', tabId);
  console.log('contentScript.bundle.js - windowId: ', windowId);
  // Original code below
  // window.tabId = tabId;
  // window.windowId = windowId;
}

const toggleIFrame = async (tab: Tabs.Tab) => {
  try {
    // TODO: NOTE - I removed logic to check if the content script is already loaded for the sake of demonstrating the problem

    if (tab.id) {
      // TODO: Note - Here's where I start to execute a script into a tab.
      // TODO: Note - I'm using two strategies. Injecting a function and a javascript file
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: setCurrentTabContext,
          args: [tab.id, tab.windowId],
        },
        () => {
          const error = chrome.runtime.lastError;
          if (error?.message) {
            browser.tabs.create({
              url: `${chrome.runtime.getURL('iframe.html')}`,
              index: tab.index,
            });
            return;
          }

          // TODO: Note - This is where the javascript file is executed into the tab
          tab.id &&
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['js/contentScript.bundle.js'],
          });
        },
      );
    }
  } catch (error) {
    console.error('background.toggleIFrame.error: ', error);
  }
}

const toggleIFrameInActiveTab = async () => {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (tabs.length > 0) {
    await toggleIFrame(tabs[0]);
  }
};


browser.commands.onCommand.addListener((command) => {
  switch (command) {
    case 'toggle-iframe':
      toggleIFrameInActiveTab();
      break;
  }
});

console.log('Should reflect version in chrome://extension: => ', process.env.VERSION);
