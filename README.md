# Debugging Stale Service Worker

## Explanation
I'm building an extension using Chrome's new Manifest v3. I discovered a scenario where the service worker seems to go "stale". Specifically, the manifest version I'm bundling into the JS code is not updating on extension update. 
I'm sharing an example project to help identify the reason for this odd situation.

⚠️ IMPORTANT: In my project, the service worker stops working entirely. I'm unable to listen to events from `chrome.commands.onCommand`  or `chrome.action.onClicked` The only remedy is to remove the extension and reinstall.

## Steps to Reproduce.
1. Build this project `yarn; yarn build:chrome`
2. Install the project into Chrome using Developer mode `chrome://extensions`: build artifact is located in `~/extension/chrome.zip`
3. Navigate to any webpage and enable the shortcut `toggle-iframe` using `CMD + Shift + Spacebar`
4. This adds an empty iFrame. You should see two console.logs 
```
1. contentScript.bundle.js executed, next up iframe load
2. iframe.html executed
```
5. Now, go back to the project and rebuild by bumping package version. Use script `yarn repro`. This bumps the patch version and rebuilds
6. Drag and drop build artifact to upgrade. Notice console.log
```
Should reflect version in chrome://extension: =>  0.0.54
browser.runtime.onInstall (previousVersion) 0.0.55
browser.runtime.onInstall (reason) update
```

The version displayed in `chrome://extension` and in console.log do not match.
This is the problem.

I've boiled it down to the iFrame loading being the problem, as for the reason, that's unclear.
Removing the iFrame code does not cause the issue above.

## For more context:

**stackoverflow question:**
https://stackoverflow.com/questions/68876486/manifest-v3-background-service-worker-seems-to-go-stale-how-to-verify-this-is-t

**chromium bug report:**
https://bugs.chromium.org/p/chromium/issues/detail?id=1242225
