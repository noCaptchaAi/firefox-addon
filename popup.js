const browserAPI = typeof browser !== "undefined" ? browser : chrome;

document.getElementById("imagePicker").addEventListener("click", function () {
    browserAPI.runtime.sendMessage({ command: "ImageElementPicker" });
    console.log("imagePicker");
    window.close();
});

document.getElementById("answerPicker").addEventListener("click", function () {
    browserAPI.runtime.sendMessage({ command: "AnswerElementPicker" });
    console.log("answerPicker");
    window.close();
});


browser.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.yourSyncStorageValue) {
        // Refresh hCaptcha iframes
        refreshhCaptchaIframes();
    }
});

function refreshhCaptchaIframes() {
    // Get all active tabs
    browser.tabs.query({}).then((tabs) => {
        // Iterate through each tab
        tabs.forEach((tab) => {
            // Check if the tab is already loaded and has a content script injected
            if (tab.status === "complete" && tab.url.startsWith("http")) {
                // Send a message to the content script to refresh hCaptcha iframes
                browser.tabs
                    .sendMessage(tab.id, { command: "refresh_hcaptcha" })
                    .then(() => {
                        // Optional: Handle response from content script
                    })
                    .catch((error) => {
                        console.error(
                            "Error refreshing hCaptcha iframes:",
                            error
                        );
                    });
            }
        });
    });
}

// refresh iframes
function refreshIframes() {
    browser.tabs.executeScript({
        code: "iframesReload();",
    });
}

// Handle Extension Configs

const inputElements = document.querySelectorAll(
    'input[type="checkbox"], input[type="number"],input[type="text"], select'
);

// Retrieve values from chrome.storage.sync for all input elements
function retrieveValuesFromStorage() {
    chrome.storage.sync.get(null, (result) => {
        inputElements.forEach((element) => {
            const elementId = element.id;
            const elementType =
                element.nodeName.toLowerCase() === "select"
                    ? "select"
                    : element.getAttribute("type");

            if (elementType === "checkbox") {
                element.checked = result[elementId] === true;
            } else {
                element.value = result[elementId] || "";
            }
            console.log(`Retrieved key ${elementId}:`, result[elementId]);
        });
    });
}

// Update values in chrome.storage.sync when inputs change
function updateValuesInStorage() {
    inputElements.forEach((element) => {
        element.addEventListener("change", () => {
            const elementId = element.id;
            const elementType =
                element.nodeName.toLowerCase() === "select"
                    ? "select"
                    : element.getAttribute("type");
            const value =
                elementType === "checkbox" ? element.checked : element.value;
            const data = { [elementId]: value };

            chrome.storage.sync.set(data, () => {
                console.log(`Updated ${elementId}:`, value);
            });
            refreshIframes();
        });
    });
}

// Call the functions to initialize and handle the storage operations
retrieveValuesFromStorage();
updateValuesInStorage();

// const inputElements = document.querySelectorAll(
//     'input[type="checkbox"], input[type="number"], select'
// );

// inputElements.forEach((element) => {
//     const elementId = element.id;
//     const elementType =
//         element.nodeName.toLowerCase() === "select"
//             ? "select"
//             : element.getAttribute("type");

//     chrome.storage.sync.get(elementId, (result) => {
//         if (elementType === "checkbox") {
//             element.checked = result[elementId] === "true";
//         } else {
//             element.value = result[elementId] || "";
//         }
//         console.log(`Retrieved key ${elementId}:`, result[elementId]);
//     });
// });

// inputElements.forEach((element) => {
//     element.addEventListener("input", () => {
//         const elementId = element.id;
//         const elementType =
//             element.nodeName.toLowerCase() === "select"
//                 ? "select"
//                 : element.getAttribute("type");
//         const value =
//             elementType === "checkbox"
//                 ? element.checked.toString()
//                 : element.value;
//         const data = { [elementId]: value };

//         chrome.storage.sync.set(data, () => {
//             console.log(`Updated ${elementId}:`, value);
//         });
//         refreshIframes();
//     });
// });

// const ExtensionPowerBtn = document.getElementById("powerButton");
// const APIKEY = document.getElementById("APIKEY");
// const SolveDelay = document.getElementById("SolveDelay");

// ExtensionPowerBtn.addEventListener("click", function () {
//     // Toggle power
//     chrome.storage.sync.get("extensionEnabled", function (data) {
//         console.log("Extension enabled:", data.extensionEnabled);
//         chrome.storage.sync.set({ extensionEnabled: !data.extensionEnabled });
//     });
// });

// modal

const openSettingsModalBtn = document.getElementById("SettingsModalOpenButton");
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("hcModal");
    const openModalBtn = document.getElementById("hcModalOpenButton");
    const closeModalBtn = document.getElementById("hcModalCloseButton");

    const openModal = () => (modal.style.display = "block");
    const closeModal = () => (modal.style.display = "none");

    openModalBtn.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("rcModal");
    const openModalBtn = document.getElementById("rcModalOpenButton");
    const closeModalBtn = document.getElementById("rcModalCloseButton");

    const openModal = () => (modal.style.display = "block");
    const closeModal = () => (modal.style.display = "none");

    openModalBtn.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("ocrModal");
    const openModalBtn = document.getElementById("ocrModalOpenButton");
    const closeModalBtn = document.getElementById("ocrModalCloseButton");

    const openModal = () => (modal.style.display = "block");
    const closeModal = () => (modal.style.display = "none");

    openModalBtn.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("settingsModal");
    const openModalBtn = document.getElementById("SettingsModalOpenButton");
    const closeModalBtn = document.getElementById("SettingsModalCloseButton");

    const openModal = () => (modal.style.display = "block");
    const closeModal = () => (modal.style.display = "none");

    openModalBtn.addEventListener("click", openModal);
    closeModalBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });
});

// balance

// let cachedBalanceData = null;

// const fetchAndDisplayData = async (url, elementId, fields) => {
//     const settings = await new Promise((resolve) => {
//         chrome.storage.sync.get(null, (data) => {
//             resolve(data);
//         });
//     });

//     const element = document.getElementById(elementId);
//     if (!element && settings.APIKEY == null) {
//         jsNotif("Please enter your API key", 2000);
//         return;
//     }

//     const response = await fetch(url, {
//         headers: {
//             apikey: settings.APIKEY,
//         },
//     });

//     const data = await response.json();

//     const c = document.getElementById("error-api");
//     if (data.error) {
//         c.style.display = "block";
//         c.style.color = "red";
//         c.style.height = "100px";
//         c.style.fontSize = "20px";
//         c.style.textAlign = "center";
//         c.innerHTML = data.message;

//         const balanceDataElement = element.querySelector(".loader");
//         if (balanceDataElement) {
//             element.removeChild(balanceDataElement);
//         }

//         return;
//     } else if (c.style.display === "block") {
//         c.style.display = "none";
//     }

//     console.log(data, "data");
//     if (data && url === endpointurl && settings.PLANTYPE == null) {
//         if (data.plan == "free") {
//             settings.PLANTYPE = "free";
//             chrome.storage.sync.set({ PLANTYPE: "free" });
//             document.getElementById("PLANTYPE").value = "free";
//         } else {
//             chrome.storage.sync.set({ PLANTYPE: "pro" });
//             document.getElementById("PLANTYPE").value = "pro";
//         }
//     }

//     const balanceDataElement = element.querySelector(".loader");
//     if (balanceDataElement) {
//         element.removeChild(balanceDataElement);
//     }

//     const newBalanceDataElement = document.createElement("div");
//     newBalanceDataElement.id = "balance-data";

//     fields.forEach((key) => {
//         const value =
//             key in data
//                 ? data[key]
//                 : data.Subscription && data.Subscription[key];
//         const div = document.createElement("div");
//         const p1 = document.createElement("p");
//         const p2 = document.createElement("p");
//         div.className = "data-item";
//         // div.textContent = `${key}: ${value}`;
//         p1.textContent = key;
//         p1.className = "data-item-key";
//         p2.textContent = value;
//         p2.className = "data-item-value";
//         newBalanceDataElement.appendChild(div);
//         div.appendChild(p1);
//         div.appendChild(p2);
//     });

//     element.appendChild(newBalanceDataElement);

//     cachedBalanceData = JSON.stringify(data);
// };

// const jsNotif = (m, d) => {
//     const t = document.createElement("div");
//     (t.style.cssText =
//         "position:fixed;top:10%;left:0;background-color:rgba(0,0,0,.8);border-radius:4px;padding:16px;color:#fff;font:calc(14px + .5vw) 'Arial',sans-serif;font-weight:bold;text-transform:uppercase;letter-spacing:1px;z-index:9999;transition:all 1s;animation:slideIn 1s forwards"),
//         (t.innerHTML = m),
//         document.body.appendChild(t);
//     const o = document.createElement("style");
//     (o.innerHTML =
//         "@keyframes slideIn{0%{transform:translateX(-100%)}100%{transform:translateX(0)}}@keyframes slideOut{0%{transform:translateX(0)}100%{transform:translateX(100%)}}"),
//         document.head.appendChild(o);
//     setTimeout(() => {
//         (t.style.animation = "slideOut 1s forwards"),
//             setTimeout(() => {
//                 document.body.removeChild(t);
//             }, 1e3);
//     }, d || 3e3);
// };

// const balanceFields = [
//     "Balance",
//     "expire",
//     "planName",
//     "remaining",
//     "used",
//     "wallet_usages",
// ];

// const endpointurl = "https://manage.nocaptchaai.com/api/user/get_endpoint";
// const balanceurl = "https://manage.nocaptchaai.com/balance";

// const refreshData = async () => {
//     fetchAndDisplayData(balanceurl, "balance-section", balanceFields);
//     // fetchAndDisplayData(endpointurl, "endpoint-section", ["endpoint", "free"]);
// };

// document.addEventListener("DOMContentLoaded", () => {
//     refreshData();

//     const refreshButton = document.getElementById("refresh-button");
//     refreshButton.addEventListener("click", refreshData);
// });

let cachedBalanceData = null;

const fetchAndDisplayData = async (url, elementId, fields) => {
    const settings = await new Promise((resolve) => {
        chrome.storage.sync.get(null, (data) => {
            resolve(data);
        });
    });
    const errorApiElement = document.getElementById("error-api");

    const element = document.getElementById(elementId);
    if (element && !settings.APIKEY || settings.APIKEY.length < 1) {
        errorApiElement.style.display = "block";
        errorApiElement.style.color = "red";
        errorApiElement.style.height = "100px";
        errorApiElement.style.fontSize = "20px";
        errorApiElement.style.textAlign = "center";
        errorApiElement.innerHTML = "Please enter APIKEY to start solving";
        return;
    }


    const response = await fetch(url, {
        headers: {
            apikey: settings.APIKEY,
        },
    });
    const data = await response.json();



    if (data.error) {
        errorApiElement.style.display = "block";
        errorApiElement.style.color = "red";
        errorApiElement.style.height = "100px";
        errorApiElement.style.fontSize = "20px";
        errorApiElement.style.textAlign = "center";
        errorApiElement.innerHTML = data.message;

        // const balanceDataElement = element.querySelector(".loader");
        // if (balanceDataElement) {
        //     element.removeChild(balanceDataElement);
        // }

        return;
    } else {
        errorApiElement.style.display = "none";
    }

    console.log(data, "data");
    if (data && url === endpointurl && settings.PLANTYPE == null) {
        if (data.plan === "free") {
            settings.PLANTYPE = "free";
            chrome.storage.sync.set({ PLANTYPE: "free" });
            document.getElementById("PLANTYPE").value = "free";

            console.log("free", document.getElementById("PLANTYPE").value);

            document.querySelector(
                "#PLANTYPE option[value='free']"
            ).disabled = true;
        } else {
            chrome.storage.sync.set({ PLANTYPE: "pro" });
            document.getElementById("PLANTYPE").value = "pro";
        }
    }

    // const balanceDataElement = element.querySelector(".loader");
    // if (balanceDataElement) {
    //     element.removeChild(balanceDataElement);
    // }

    const newBalanceDataElement = document.createElement("div");
    newBalanceDataElement.id = "balance-data";

    fields.forEach((key) => {
        const value =
            key in data
                ? data[key]
                : data.Subscription && data.Subscription[key];
        const div = document.createElement("div");
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        div.className = "data-item";
        p1.textContent = key;
        p1.className = "data-item-key";
        p2.textContent = value;
        p2.className = "data-item-value";
        newBalanceDataElement.appendChild(div);
        div.appendChild(p1);
        div.appendChild(p2);
    });

    const existingBalanceDataElement = element.querySelector("#balance-data");
    if (existingBalanceDataElement) {
        element.replaceChild(newBalanceDataElement, existingBalanceDataElement);
    } else {
        element.appendChild(newBalanceDataElement);
    }

    cachedBalanceData = JSON.stringify(data);
};

const jsNotif = (message, duration) => {
    const notificationElement = document.createElement("div");
    notificationElement.style.cssText =
        "position:fixed;top:10%;left:0;background-color:rgba(0,0,0,.8);border-radius:4px;padding:16px;color:#fff;font:calc(14px + .5vw) 'Arial',sans-serif;font-weight:bold;text-transform:uppercase;letter-spacing:1px;z-index:9999;transition:all 1s;animation:slideIn 1s forwards";
    notificationElement.innerHTML = message;
    document.body.appendChild(notificationElement);

    const animationStyleElement = document.createElement("style");
    animationStyleElement.innerHTML =
        "@keyframes slideIn{0%{transform:translateX(-100%)}100%{transform:translateX(0)}}@keyframes slideOut{0%{transform:translateX(0)}100%{transform:translateX(100%)}}";
    document.head.appendChild(animationStyleElement);

    setTimeout(() => {
        notificationElement.style.animation = "slideOut 1s forwards";
        setTimeout(() => {
            document.body.removeChild(notificationElement);
        }, 1000);
    }, duration || 3000);
};

const balanceFields = [
    "Balance",
    "expire",
    "planName",
    "remaining",
    "used",
    "wallet_usages",
];

const endpointurl = "https://manage.nocaptchaai.com/api/user/get_endpoint";
const probalurl = "https://manage.nocaptchaai.com/balance";
const freebalurl = "https://free.nocaptchaai.com/balance";

const refreshData = async () => {

    const refreshButton = document.getElementById("refresh-button");
    refreshButton.innerHTML = '<img src="/icons/s.svg" alt="██▒▒▒▒▒▒▒▒ 50%" />';
    let plan;
    chrome.storage.sync.get(null, (settings) => {
        console.log(settings.APIKEY);
        plan = settings.PLANTYPE;
    });
    await fetchAndDisplayData(plan === "free" ? freebalurl : probalurl, "balance-section", balanceFields);
    await fetchAndDisplayData(endpointurl, "endpoint-section", ["endpoint", "free"]);

    refreshButton.innerHTML = "Refresh";
    refreshButton.style.fontSize = "16px";
    refreshButton.style.fontWeight = "bold";
};

document.addEventListener("DOMContentLoaded", () => {
    refreshData();

    const refreshButton = document.getElementById("refresh-button");
    refreshButton.addEventListener("click", refreshData);
});

// balance end
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const custom = document.getElementById("PLANTYPE");
custom.addEventListener("change", async () => {

    if (custom.value === "custom") {
        jsNotif("custom plan only available with cutsom endpoint", 2000);
        await sleep(2000);
        openSettingsModalBtn.click();
    }
});

const apikeyText = document.getElementById("apikey-text");
const apikeyInput = document.getElementById("apikey-input");
const editButton = document.getElementById("edit-button");
const saveButton = document.getElementById("save-button");
const deleteButton = document.getElementById("delete-button");


apikeyInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        saveButton.click(); // Trigger the click event of the save button
    }
});

// apikeyInput.addEventListener('mouseleave', function () {
//     saveButton.click(); // Trigger the click event of the save button
// });


const toggleEditMode = () => {
    apikeyText.style.display = "none";
    apikeyInput.style.display = "inline-block";
    editButton.style.display = "none";
    saveButton.style.display = "inline-block";
    deleteButton.style.display = "inline-block";
    apikeyInput.focus();
};

const toggleViewMode = () => {
    apikeyText.style.display = "inline-block";
    apikeyInput.style.display = "none";
    editButton.style.display = "inline-block";
    saveButton.style.display = "none";
    deleteButton.style.display = "none";
};

const saveApiKey = async () => {
    const newApiKey = apikeyInput.value;
    chrome.storage.sync.set({ APIKEY: newApiKey }, () => {
        console.log("API key saved");
    });
    refreshData();
    updateApiKeyDisplay(newApiKey);
};

const deleteApiKey = () => {
    chrome.storage.sync.remove("APIKEY", () => {
        console.log("API key removed");
    });
    apikeyText.textContent = "";
    apikeyInput.value = "";

    document.getElementById("balance-area").innerHTML = "Apikey Removed";
    saveApiKey();
    updateApiKeyDisplay("");
    // refreshData();
};

const updateApiKeyDisplay = (apikey) => {
    const partiallyHiddenApiKey =
        apikey.substring(0, 5) + "*".repeat(apikey.length - 5);
    apikeyText.textContent = partiallyHiddenApiKey;
    toggleViewMode();
    apikeyInput.style.display = "none";
};

// Add event listeners
editButton.addEventListener("click", toggleEditMode);
saveButton.addEventListener("click", saveApiKey);
deleteButton.addEventListener("click", deleteApiKey);

// Load the API key from local sync storage
window.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get("APIKEY", (data) => {
        if (data.APIKEY) {
            const savedApiKey = data.APIKEY;
            updateApiKeyDisplay(savedApiKey);
            apikeyInput.value = savedApiKey;
        }
    });
});

chrome.storage.sync.get(null, (settings) => {
    console.log(settings.APIKEY);
    // print all of items in defaultConfigs
});

// Toaster

function showToast(message, color, emoji, duration) {
    let toast = document.getElementById("toast");
    toast.style.backgroundColor = color;
    toast.innerHTML = `${emoji} ${message}`;
    toast.className = "show";
    setTimeout(function () {
        toast.className = toast.className.replace("show", "");
    }, duration);
}

// custom Endpoint

// const customEndpointInput = document.getElementById("customEndpoint");
// customEndpointInput.addEventListener("input", handleCustomEndpointChange);

// function handleCustomEndpointChange(event) {
//     const newEndpointValue = event.target.value;

//     browser.storage.sync
//         .set({ customEndpoint: newEndpointValue })
//         .then(() => {
//             console.log(
//                 "Custom endpoint updated in sync storage:",
//                 newEndpointValue
//             );
//         })
//         .catch((error) => {
//             console.error("Error updating sync storage:", error);
//         });
// }

const customEndpointInput = document.getElementById("customEndpoint");
customEndpointInput.addEventListener("input", handleCustomEndpointChange);

browser.storage.sync
    .get("customEndpoint")
    .then((result) => {
        const savedEndpointValue = result.customEndpoint;
        if (savedEndpointValue) {
            customEndpointInput.value = savedEndpointValue;
        }
    })
    .catch((error) => console.error("Error retrieving value:", error));

function handleCustomEndpointChange(event) {
    const newEndpointValue = event.target.value;
    browser.storage.sync
        .set({ customEndpoint: newEndpointValue })
        .catch((error) => console.error("Error updating value:", error));
}

// Export Settings

document.addEventListener("DOMContentLoaded", function () {
    const exp = document.getElementById("export");
    exp.addEventListener("click", function () {
        chrome.storage.sync.get(null, function (items) {
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

            // Use keys from defaultConfigs to get values from sync storage
            const settings = {};
            for (const key in defaultConfigs) {
                settings[key] = items[key] ?? defaultConfigs[key];
            }

            const data = JSON.stringify(settings, null, 2);
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.download = "settings.json";
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    });
});
