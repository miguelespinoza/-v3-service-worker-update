const DIV_ROOT_ID = 'div-root';
const IFRAME_ID = 'main-iframe';

let rootDiv = document.getElementById(DIV_ROOT_ID);

const injectTurboNavIFrameApp = async () => {
  const iFrameDivContainer = document.createElement('div');
  const iframe = document.createElement('iframe');
  iframe.src = `${chrome.runtime.getURL('iframe.html')}`;

  iFrameDivContainer.id = DIV_ROOT_ID;
  iframe.id = IFRAME_ID;

  document.body.appendChild(iFrameDivContainer);
  iFrameDivContainer.appendChild(iframe);

  rootDiv = document.getElementById(DIV_ROOT_ID);
  console.log('1. contentScript.bundle.js executed, next up iframe load');
};

const start = async () => {
  const rootDivDoesNotExist = rootDiv === null;

  if (rootDivDoesNotExist) {
    await injectTurboNavIFrameApp();
  }
};

start();


export {};
