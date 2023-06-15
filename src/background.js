chrome.runtime.onInstalled.addListener((details) => {
    const defaultConfigs = {
        // Global
        APIKEY: null,
        PLANTYPE: null,
        customEndpoint: null,
        hCaptchaEnabled: true,
        reCaptchaEnabled: true,
        dataDomeEnabled: true,
        ocrEnabled: true,
        extensionEnabled: true,
        logsEnabled: false,
        fastAnimationMode: true,
        debugMode: false,
        // hCaptcha
        hCaptchaAutoOpen: true,
        hCaptchaAutoSolve: true,
        hCaptchaGridSolveTime: 7, // seconds
        hCaptchaMultiSolveTime: 5, // seconds
        hCaptchaBoundingBoxSolveTime: 5, // seconds
        hCaptchaAlwaysSolve: true,
        englishLanguage: true,
        // reCaptcha
        reCaptchaAutoOpen: true,
        reCaptchaAutoSolve: true,
        reCaptchaAlwaysSolve: true,
        reCaptchaClickDelay: 400, // milliseconds
        reCaptchaSubmitDelay: 1, // seconds
        reCaptchaSolveType: "image", // for default audio use "audio"
    };

    // Set the default configs
    // for (const [key, value] of Object.entries(defaultConfigs)) {
    //     chrome.storage.sync.set({ [key]: value });
    // }

    if (details.reason === "install" || details.reason === "update") {
        // Save default configurations to sync storage
        chrome.storage.sync.set(defaultConfigs, () => {
            console.log("Default configurations saved to sync storage.");
        });
        chrome.storage.sync.get(null, (result) => {
            console.log("Stored values:", result);
        });

        chrome.storage.sync.get(null, (result) => {
            console.log("Stored keys and values:");
            Object.entries(result).forEach(([key, value]) => {
                console.log(`${key}:`, value);
            });
        });
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
            chrome.tabs.captureVisibleTab(null, {}, sendResponse);
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


// chrome.runtime.onInstalled.addListener(() => {
//   //  global config
//   chrome.storage.sync.set({ apikey: "apikey" });  // your "apikey"
//   chrome.storage.sync.set({ plantype: "pro" }); // "PRO", "FREE" and "custom" if custom endpoint
//   chrome.storage.sync.set({ endpoint: null }); // custom endpoint eg. "something.nocaptchaai.com"
//   chrome.storage.sync.set({ hCap: true }); // hCaptcha enable or disable
//   chrome.storage.sync.set({ reCap: true }); // reCaptcha enable or disable
//   chrome.storage.sync.set({ datadome: true }); // datadome enable or disable
//   chrome.storage.sync.set({ OCR: true }); // OCR enable or disable
//   chrome.storage.sync.set({ power: true }); // enable extension power
//   chrome.storage.sync.set({ logs: false }); // logs
//   chrome.storage.sync.set({ fast: true }); // fast animation mode
//   chrome.storage.sync.set({ debug: false }); // debug mode tests all new hcaptcha challenges

//   // hCaptcha config
//   chrome.storage.sync.set({ autoOpen: true }); // auto open hCaptcha
//   chrome.storage.sync.set({ autoSolve: true }); // auto solve hCaptcha
//   chrome.storage.sync.set({ hcaptime: 3 }); // hCaptcha grid solve in seconds (7 recommended)
//   chrome.storage.sync.set({ hcaptime_multi: 2 }); // in seconds
//   chrome.storage.sync.set({ hcaptime_bbox: 2 }); // in seconds
//   chrome.storage.sync.set({ hCAlwaysSolve: true }); // always solve hCaptcha
//   chrome.storage.sync.set({ english: true }); // langauge issue? use english "true"

//   // reCaptcha config
//   chrome.storage.sync.set({ RautoOpen: true }); // auto open reCaptcha
//   chrome.storage.sync.set({ RautoSolve: true }); // Recapctha auto solve
//   chrome.storage.sync.set({ RclickDelay: 400 }); // in milliseconds
//   chrome.storage.sync.set({ RsubmitDelay: 1 }); // in seconds
//   chrome.storage.sync.set({ RsolveType: "image" }); // for audio use "audio"

//   chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "sendtask") {
//       fetch(request.url, {
//         method: "POST",
//         headers: request.header,
//         body: request.body,
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           sendResponse({ success: true, data: data });
//         })
//         .catch((error) => {
//           sendResponse({ success: false, error: error.message });
//         });

//       return true; // Keep the message channel open for async response
//     }
//   });

//   async function getBase64FromUrl(url) {
//     const blob = await (await fetch(url)).blob();
//     return new Promise(function (resolve) {
//       const reader = new FileReader();
//       reader.readAsDataURL(blob);
//       reader.onloadend = function () {
//         resolve(reader.result.replace(/^data:image\/(png|jpeg);base64,/, ""));
//       };
//       reader.onerror = function () {
//         console.log("❌ Failed to convert url to base64");
//       };
//     });
//   }

//   chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "getBase64FromUrl") {
//       getBase64FromUrl(request.url).then(sendResponse);
//       return true;  // will respond asynchronously
//     }
//   });

//   chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//     if (message === "screenshot") {
//       chrome.tabs.captureVisibleTab(null, {}, sendResponse);
//       return true;
//     }
//   });

// });



