import 'emoji-log';
import {browser} from 'webextension-polyfill-ts';

browser.runtime.onInstalled.addListener((reason): void => {
  console.log('browser.runtime.onInstalled', reason);
});

console.log('process.env.VERSION', process.env.VERSION);
