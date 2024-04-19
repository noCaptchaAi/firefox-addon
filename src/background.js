browser.runtime.onInstalled.addListener((details) => {
  // automate extension configuration, easy to deploy in batch.
  // visit https://newconfig.nocaptchaai.com or https://dash.nocaptchaai.com/setup
  // paste the json {} defaultConfigs = {}

  const defaultConfigs = {
    APIKEY: null,
    PLANTYPE: "pro",
    customEndpoint: null,
    hCaptchaEnabled: "true",
    reCaptchaEnabled: "true",
    dataDomeEnabled: "true",
    ocrEnabled: "true",
    blsEnabled: "true",
    mtcaptchaEnabled : "true",
    ocrToastEnabled: "true",
    extensionEnabled: "true",
    logsEnabled: "false",
    fastAnimationMode: "true",
    debugMode: "false",
    debugModeGridOnly: "false",
    hCaptchaAutoOpen: "true",
    hCaptchaAutoSolve: "true",
    hCaptchaGridSolveTime: 3,
    hCaptchaMultiSolveTime: 3,
    hCaptchaBoundingBoxSolveTime: 3,
    hCaptchaAlwaysSolve: "true",
    englishLanguage: "true",
    reCaptchaAutoOpen: "true",
    reCaptchaAutoSolve: "true",
    reCaptchaAlwaysSolve: "true",
    reCaptchaClickDelay: 50,
    reCaptchaSubmitDelay: 1,
    reCaptchaSolveType: "image",
  };

  // saving versions.json to localstorage
  fetch(browser.runtime.getURL("versions.json"))
    .then((response) => response.json())
    .then((data) => {
      // Save JSON to local storage
      browser.storage.sync.set({ version_data: data }, () => {
        // console.log("JSON data is saved to local storage.");
      });

      browser.storage.sync.get(["version_data"], function (result) {
        if (result.versions) {
          // console.log( result.versions);
        } else {
          console.log("No data found.");
        }
      });
    })
    .catch((error) => console.log("Error loading JSON:", error));

  // Retrieve JSON from local storage

  if (details.reason === "install" || details.reason === "update") {
    // Save default configurations to sync storage
    browser.storage.sync.set(defaultConfigs, () => {
      console.log("Default config saved to sync storage.");
    });
    browser.storage.sync.get(null, (result) => {
      console.log("Store JSON:", result);
    });

    browser.storage.sync.get(null, (result) => {
      // console.log("Stored keys and values:");
      Object.entries(result).forEach(([key, value]) => {
        console.table(`${key}:`, value);
      });
    });
  }

  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendTask") {
      fetch(request.url, {
        method: "POST",
        headers: request.header,
        body: request.body,
      })
        .then((response) => response.json())
        .then((data) => sendResponse({ success: true, data }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );

      return true; // Keep the message channel open for async response
    }

    if (request.action === "getBase64FromUrl") {
      convertUrlToBase64(request.url).then(sendResponse);
      return true; // will respond asynchronously
    }

    if (request.action === "captureScreenshot") {
      browser.tabs.captureVisibleTab(null, {}, sendResponse);
      return true;
    }
  });

  async function convertUrlToBase64(url) {
    const blob = await (await fetch(url)).blob();
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.replace(
          /^data:image\/(png|jpeg);base64,/,
          ""
        );
        resolve(base64data);
      };
      reader.onerror = () => {
        console.log("❌ Failed to convert url to base64");
        reject(new Error("Failed to convert url to base64"));
      };
      reader.readAsDataURL(blob);
    });
  }

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getToken") {
      const pageGlobalObject = sender.tab.window.wrappedJSObject;
      const token = pageGlobalObject?.webpackChunkdiscord_app
        ?.find((m) => m?.exports?.default?.getToken !== void 0)
        ?.exports?.default?.getToken();
      sendResponse(token);
    }
  });
});

// element picker
browser.runtime.onMessage.addListener((request) => {
  browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    browser.tabs.sendMessage(tabs[0].id, { command: request.command });
  });
});

// call for iframe refresh
// browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete') {
//     browser.tabs.executeScript(tabId, { file: 'iframesRefresh.js' });
//   }
// });

// screenshot
// browser.runtime.onMessage.addListener((request, sender) => {
//   return browser.tabs.captureVisibleTab(sender.tab.windowId, { format: "png" }).then((screenshotUrl) => {
//     let img = new Image();
//     img.onload = function () {
//       let canvas = document.createElement('canvas');
//       canvas.width = request.rect.width;
//       canvas.height = request.rect.height;
//       let ctx = canvas.getContext('2d');
//       ctx.drawImage(img, request.rect.left, request.rect.top, request.rect.width, request.rect.height, 0, 0, request.rect.width, request.rect.height);
//       return canvas.toDataURL();
//     };
//     img.src = screenshotUrl;
//   });
// });
