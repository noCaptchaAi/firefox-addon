document.getElementById("imagePicker").addEventListener("click", function () {
  browser.runtime.sendMessage({ command: "ImageElementPicker" });
  console.log("imagePicker");
  window.close();
});

document.getElementById("answerPicker").addEventListener("click", function () {
  browser.runtime.sendMessage({ command: "AnswerElementPicker" });
  console.log("answerPicker");
  window.close();
});

browser.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.yourSyncStorageValue) {
    // Refresh hCaptcha iframes
    refreshhCaptchaIframes();
    reloadFrames();
    // refreshIframes();
  }
});

const ocrids = [
  "omgomg",
  "probot",
  "catch",
  "dell",
  "mtcap",
  "morocco",
  "amazon",
  "zefoy",
  "consulatepl",
  "webde",
  "visa1",
  "u1",
  "oxcheats",
  "caixa",
  "zoho",
  "protypers",
];

const selectElement = document.getElementById("mySelect");
ocrids.forEach((optionText) => {
  const optionElement = document.createElement("option");
  optionElement.textContent = optionText;
  selectElement.appendChild(optionElement);
});

// function refreshIframes() {
//   const iframes = document.querySelectorAll("iframe");
//   iframes.forEach(async (iframe) => {
//     const original = iframe.src;
//     console.log(original);
//     iframe.src = "about:blank";
//     await sleep(50);
//     iframe.src = original;
//   });
// }

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
            // console.log("Error refreshing hCaptcha iframes:", error);
          });
      }
    });
  });
}

function reloadFrames() {
  browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    browser.tabs.sendMessage(tabs[0].id, { action: "refresh_iframes" });
  });
}

const inputElements = document.querySelectorAll(
  'input[type="checkbox"], input[type="number"],input[type="text"], select'
);

// Retrieve values from browser.storage.sync for all input elements
function retrieveValuesFromStorage() {
  browser.storage.sync.get(null, (result) => {
    inputElements.forEach((element) => {
      const elementId = element.id;
      const elementType =
        element.nodeName.toLowerCase() === "select"
          ? "select"
          : element.getAttribute("type");

      if (elementType === "checkbox") {
        element.checked = result[elementId] === "true";
      } else {
        element.value = result[elementId] || "";
      }
      console.log(elementId, result[elementId]);
    });
  });
}

// Update values in browser.storage.sync when inputs change
function updateValuesInStorage() {
  inputElements.forEach((element) => {
    element.addEventListener("change", () => {
      const elementId = element.id;
      const elementType =
        element.nodeName.toLowerCase() === "select"
          ? "select"
          : element.getAttribute("type");
      const value =
        elementType === "checkbox" ? element.checked.toString() : element.value;
      const data = { [elementId]: value };

      browser.storage.sync.set(data, () => {
        console.log(`Updated ${elementId}:`, value);
      });
      refreshhCaptchaIframes();
      reloadFrames();
      // refreshIframes();
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

//     browser.storage.sync.get(elementId, (result) => {
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

//         browser.storage.sync.set(data, () => {
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
//     browser.storage.sync.get("extensionEnabled", function (data) {
//         console.log("Extension enabled:", data.extensionEnabled);
//         browser.storage.sync.set({ extensionEnabled: !data.extensionEnabled });
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

  openModalBtn?.addEventListener("click", openModal);
  closeModalBtn?.addEventListener("click", closeModal);
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

  openModalBtn?.addEventListener("click", openModal);
  closeModalBtn?.addEventListener("click", closeModal);
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

  openModalBtn?.addEventListener("click", openModal);
  closeModalBtn?.addEventListener("click", closeModal);
  window.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("blsModal");
  const openModalBtn = document.getElementById("blsModalOpenButton");
  const closeModalBtn = document.getElementById("blsModalCloseButton");

  const openModal = () => (modal.style.display = "block");
  const closeModal = () => (modal.style.display = "none");

  openModalBtn?.addEventListener("click", openModal);
  closeModalBtn?.addEventListener("click", closeModal);
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

  openModalBtn?.addEventListener("click", openModal);
  closeModalBtn?.addEventListener("click", closeModal);
  window.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
});

// balance

// let cachedBalanceData = null;

// const fetchAndDisplayData = async (url, elementId, fields) => {
//     const settings = await new Promise((resolve) => {
//         browser.storage.sync.get(null, (data) => {
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
//             browser.storage.sync.set({ PLANTYPE: "free" });
//             document.getElementById("PLANTYPE").value = "free";
//         } else {
//             browser.storage.sync.set({ PLANTYPE: "pro" });
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

//  ========================= apikey

// let cachedBalanceData = null;

// const fetchAndDisplayData = async (url, elementId, fields) => {
//   const settings = await new Promise((resolve) => {
//     browser.storage.sync.get(null, (data) => {
//       resolve(data);
//     });
//   });
//   const errorApiElement = document.getElementById("error-api");

//   const element = document.getElementById(elementId);
//   if ((element && !settings.APIKEY) || settings.APIKEY.length < 1) {
//     errorApiElement.style.display = "block";
//     errorApiElement.style.color = "red";
//     errorApiElement.style.height = "120px";
//     errorApiElement.style.fontSize = "20px";
//     errorApiElement.style.textAlign = "center";
//     errorApiElement.innerHTML = "Please enter APIKEY to start solving";
//     return;
//   }

//   const response = await fetch(url, {
//     headers: {
//       apikey: settings.APIKEY,
//     },
//   });

//   if (response.status === 403) {
//     errorApiElement.style.display = "block";
//     errorApiElement.style.color = "red";
//     errorApiElement.style.height = "100px";
//     errorApiElement.style.fontSize = "20px";
//     errorApiElement.style.marginTop = "10px";
//     errorApiElement.style.textAlign = "center";
//     errorApiElement.innerHTML =
//       "Failed to connect to api, try again or check config";
//     return;
//   }
//   const data = await response.json();

//   if (response.error) {
//     errorApiElement.style.display = "block";
//     errorApiElement.style.color = "red";
//     errorApiElement.style.height = "100px";
//     errorApiElement.style.fontSize = "20px";
//     errorApiElement.style.textAlign = "center";
//     errorApiElement.innerHTML = data.message;

//     alert(data.message);

//     // browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     //   const activeTab = tabs[0];
//     //   browser.tabs.sendMessage(activeTab.id, {
//     //     message: "Hello from popup.js!",
//     //   });
//     // });

//     // const balanceDataElement = element.querySelector(".loader");
//     // if (balanceDataElement) {
//     //     element.removeChild(balanceDataElement);
//     // }

//     return;
//   } else {
//     errorApiElement.style.display = "none";
//   }

//   // console.log(data, "data");
//   if (data.error) {
//     jsNotif(data.message, 5000);
//     errorApiElement.style.display = "block";
//     errorApiElement.style.color = "red";
//     errorApiElement.style.height = "100px";
//     errorApiElement.style.fontSize = "20px";
//     errorApiElement.style.textAlign = "center";
//     errorApiElement.innerHTML = data.message;
//     console.log(data.message);
//     return;

//   } else if (data && url === endpointurl && settings.PLANTYPE == null) {
//     if (data.plan === "free") {
//       settings.PLANTYPE = "free";
//       browser.storage.sync.set({ PLANTYPE: "free" });
//       document.getElementById("PLANTYPE").value = "free";

//       console.log("free", document.getElementById("PLANTYPE").value);

//       document.querySelector("#PLANTYPE option[value='free']").disabled = true;
//     } else {
//       browser.storage.sync.set({ PLANTYPE: "pro" });
//       document.getElementById("PLANTYPE").value = "pro";
//     }
//   }

//   // const balanceDataElement = element.querySelector(".loader");
//   // if (balanceDataElement) {
//   //     element.removeChild(balanceDataElement);
//   // }

//   const newBalanceDataElement = document.createElement("div");
//   newBalanceDataElement.id = "balance-data";

//   fields.forEach((key) => {
//     const value =
//       key in data ? data[key] : data.Subscription && data.Subscription[key];
//     const div = document.createElement("div");
//     const p1 = document.createElement("p");
//     const p2 = document.createElement("p");
//     div.className = "data-item";
//     p1.textContent = key;
//     p1.className = "data-item-key";
//     p2.textContent = value;
//     p2.className = "data-item-value";
//     newBalanceDataElement.appendChild(div);
//     div.appendChild(p1);
//     div.appendChild(p2);
//   });

//   const existingBalanceDataElement = element.querySelector("#balance-data");
//   if (existingBalanceDataElement) {
//     element.replaceChild(newBalanceDataElement, existingBalanceDataElement);
//   } else {
//     element.appendChild(newBalanceDataElement);
//   }

//   cachedBalanceData = JSON.stringify(data);
// };

// =========================== apikey

let cachedBalanceData = null;

const fetchAndDisplayData = async (url, elementId, fields) => {
  try {
    // Fetch settings from storage
    const settings = await new Promise((resolve) => {
      browser.storage.sync.get(null, (data) => resolve(data));
    });

    // Validate API Key
    if (!settings.APIKEY || settings.APIKEY.length < 1) {
      displayError(
        "Please enter noCaptchaAi.com APIKEY to see Balance",
        "flex",
        "red",
        "120px",
        "15px",
        "center",
        "center",
        "column"
      );
      return;
    }

    // Fetch data from API
    const response = await fetch(url, { headers: { apikey: settings.APIKEY } });

    // Handle HTTP errors
    if (!response.ok) {
      displayError(
        "Failed to connect to api, try again or check config",
        "block",
        "red",
        "100px",
        "10px",
        "center"
      );
      return;
    }

    // Parse JSON response
    const data = await response.json();

    // Handle API errors
    if (data.error) {
      displayError(data.message, "block", "red", "100px", "20px", "center");
      return;
    }

    const enterAPIKEY = document.getElementById("error-api");
    if (enterAPIKEY) {
      enterAPIKEY.remove();
    }

    // Update the UI with fetched data
    updateUI(elementId, fields, data);
    cachedBalanceData = JSON.stringify(data);
  } catch (error) {
    console.log("Error fetching JSON:", error);
    displayError(
      "An error occurred while fetching data.",
      "block",
      "red",
      "100px",
      "20px",
      "center"
    );
  }
};

// const fetchAndDisplayData = async (url, elementId, fields) => {
//   try {
//     const settings = await getSettings();

//     validateAPIKey(settings);

//     const data = await fetchDataFromAPI(url, settings);
//     if (!data) throw new Error("No data received from API");

//     updateUI(elementId, fields, data);
//     cachedBalanceData = JSON.stringify(data);
//   } catch (error) {
//     console.log("Error:", error);
//     displayError(
//       "An error occurred while fetching data.",
//       "block",
//       "red",
//       "100px",
//       "20px",
//       "center"
//     );
//   }
// };

async function getSettings() {
  return new Promise((resolve) => {
    browser.storage.sync.get(null, (data) => resolve(data));
  });
}

function validateAPIKey(settings) {
  if (!settings.APIKEY || settings.APIKEY.length < 1) {
    throw new Error("API Key is missing or invalid");
  }
}

async function fetchDataFromAPI(url, settings) {
  const response = await fetch(url, { headers: { apikey: settings.APIKEY } });
  if (!response.ok) {
    throw new Error("Failed to connect to API");
  }
  return response.json().catch(() => {
    throw new Error("Invalid JSON response");
  });
}

function displayError(
  message,
  displayStyle,
  color,
  height,
  fontSize,
  textAlign,
  justifyContent,
  flexDirection
) {
  const errorApiElement = document.getElementById("error-api");
  if (errorApiElement) {
    Object.assign(errorApiElement.style, {
      display: displayStyle,
      color,
      height,
      fontSize,
      textAlign,
      justifyContent,
      flexDirection,
    });
    errorApiElement.innerHTML = message;
  }
}

function updateUI(elementId, fields, data) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const newBalanceDataElement = document.createElement("div");
  newBalanceDataElement.id = "balance-data";

  fields.forEach((key) => {
    const value =
      key in data ? data[key] : data.Subscription && data.Subscription[key];
    const div = document.createElement("div");
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    div.className = "data-item";
    p1.textContent = key;
    p1.className = "data-item-key";
    p2.textContent = value;
    p2.className = "data-item-value";
    div.appendChild(p1);
    div.appendChild(p2);
    newBalanceDataElement.appendChild(div);
  });

  const existingBalanceDataElement = element.querySelector("#balance-data");
  if (existingBalanceDataElement) {
    element.replaceChild(newBalanceDataElement, existingBalanceDataElement);
  } else {
    element.appendChild(newBalanceDataElement);
  }
}

//  =========================================================

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
  "planName",
  "wallet_usages",
  "used",
  "remaining",
  "nextReset",
  "expire",
];

const endpointurl = "https://manage.nocaptchaai.com/api/user/get_endpoint";
const probalurl = "https://manage.nocaptchaai.com/balance";
const freebalurl = "https://free.nocaptchaai.com/balance";

const refreshData = async () => {
  let Local = await browser.storage.sync.get(null);
  const refreshButton = document.getElementById("refresh-button");
  refreshButton.innerHTML = "";
  refreshButton.innerHTML += '<svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_I8Q1{animation:spinner_qhi1 .75s linear infinite}.spinner_vrS7{animation-delay:-.375s}@keyframes spinner_qhi1{0%,100%{r:1.5px}50%{r:3px}}</style><circle class="spinner_I8Q1" cx="4" cy="12" r="1.5"/><circle class="spinner_I8Q1 spinner_vrS7" cx="12" cy="12" r="3"/><circle class="spinner_I8Q1" cx="20" cy="12" r="1.5"/></svg>';

  // console.log(plan, "planplan", plan === "free", Local.PLANTYPE);
  await fetchAndDisplayData(
    Local.PLANTYPE === "free" ? freebalurl : probalurl,
    "balance-section",
    balanceFields
  );
  await fetchAndDisplayData(endpointurl, "endpoint-section", [
    // "endpoint",
    "free",
  ]);

  // refreshButton.innerHTML = "Refresh";
  refreshButton.innerHTML = '<svg fill="none" stroke-width="2" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path d="M23 4 23 10 17 10"></path><path d="M1 20 1 14 7 14"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>' + " " + "Update Balance";
  refreshButton.style.fontSize = "14px";
  refreshButton.style.fontWeight = "bold";
  refreshButton.style.paddingBottom = "2px";
};

document.addEventListener("DOMContentLoaded", async () => {
  await refreshData();

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

apikeyInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
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
  browser.storage.sync.set({ APIKEY: newApiKey }, () => {
    console.log("API key saved", newApiKey);
  });
  const balancesection = document.getElementById("balance-section");
  balancesection.innerText = "";

  updateApiKeyDisplay(newApiKey);
  await refreshData();
  refreshhCaptchaIframes();
  reloadFrames();
};

const deleteApiKey = () => {
  browser.storage.sync.remove("APIKEY", () => {
    console.log("API key removed");
  });
  apikeyText.textContent = "";
  apikeyInput.value = "";

  const balancesection = document.getElementById("balance-section");
  const endpointsection = document.getElementById("endpoint-section");
  try {
    balancesection.innerText =
      "Apikey Removed. Please enter apikey to continue solving.";
    balancesection.style.fontSize = "14px";
    balancesection.style.color = "red";
    endpointsection.innerText = "";
  } catch (error) {
    console.log("couldn't update view");
  }

  saveApiKey();
  updateApiKeyDisplay("");
  // refreshData();
};

const updateApiKeyDisplay = (apikey) => {
  // const partiallyHiddenApiKey =
  //     apikey.substring(0, 5) + "*".repeat(apikey.length - 5);
  const partiallyHiddenApiKey =
    apikey && apikey.length >= 5
      ? apikey.substring(0, 5) + "*".repeat(apikey.length - 5)
      : apikey
      ? "*".repeat(apikey.length)
      : "";

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
  browser.storage.sync.get("APIKEY", (data) => {
    if (data.APIKEY) {
      const savedApiKey = data.APIKEY;
      updateApiKeyDisplay(savedApiKey);
      apikeyInput.value = savedApiKey;
    }
  });
});

browser.storage.sync.get(null, (settings) => {
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
//             console.log("Error updating sync storage:", error);
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
  .catch((error) => console.log("Error retrieving value:", error));

function handleCustomEndpointChange(event) {
  const newEndpointValue = event.target.value;
  browser.storage.sync
    .set({ customEndpoint: newEndpointValue })
    .catch((error) => console.log("Error updating value:", error));
}

// Export Settings

document.addEventListener("DOMContentLoaded", function () {
  const exp = document.getElementById("export");
  exp.addEventListener("click", function () {
    browser.storage.sync.get(null, function (items) {
      const defaultConfigs = {
        // Global
        APIKEY: null,
        PLANTYPE: null,
        customEndpoint: null,
        hCaptchaEnabled: true,
        reCaptchaEnabled: true,
        dataDomeEnabled: true,
        ocrEnabled: true,
        blsEnabled: true,
        ocrToastEnabled: true,
        extensionEnabled: true,
        logsEnabled: false,
        fastAnimationMode: true,
        debugMode: false,
        debugModeGridOnly: true,
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

//  OCR Settings

// Get the current tab's sync storage values
browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  const tab = tabs[0];
  if (tab) {
    const hostname = new URL(tab.url).hostname;

    browser.storage.sync.get("domainData").then((sync) => {
      try {
        if (!sync.domainData) {
          document.getElementById("domain").innerText =
            hostname + "\nNo data found";
          return;
        }

        const domainData = sync.domainData[hostname] || {};
        const { ocrid, image, answer } = domainData;

        console.log(hostname, ocrid, image, answer);

        document.getElementById("domain").innerText = hostname || "NO DATA";
        document.getElementById("ocrID").innerText = ocrid || "Enter OCR ID";
        document.getElementById("imagePickerInput").innerText =
          image || "Enter image csspath";
        document.getElementById("answerPickerInput").innerText =
          answer || "Enter input csspath";
      } catch (error) {
        console.log(error);
      }
    });
  }
});

// browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
//     const tab = tabs[0];
//     if (tab) {
//         const hostname = new URL(tab.url).hostname;
//         const imgKey = hostname;
//         const ansKey = hostname;
//         const idKey = hostname;

//         browser.storage.sync.get("domainData").then((sync) => {
//             try {
//                 const { target: img } = sync.domainData[imgKey] || {};
//                 const { target: ans } = sync.domainData[ansKey] || {};
//                 const { target: ocrid } = sync.domainData[idKey] || {};

//                 console.log(imgKey, ansKey, img, ans);

//                 document.getElementById("domain").innerText = hostname || "";
//                 document.getElementById("ocrID").innerText = ocrid || "";
//                 document.getElementById("imagePickerInput").innerText = img || "";
//                 document.getElementById("answerPickerInput").innerText = ans || "";
//             } catch (error) {
//                 console.log(error);
//             }
//         });
//     }
// });

// Store new values on change to sync storage
document
  .getElementById("imagePickerInput")
  .addEventListener("input", function () {
    updateStorage("image", this.value);
  });

document
  .getElementById("answerPickerInput")
  .addEventListener("input", function () {
    updateStorage("answer", this.value);
  });

document.getElementById("ocrID").addEventListener("input", function () {
  updateStorage("ocrid", this.value);
});

function updateStorage(field, value) {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const tab = tabs[0];
    if (tab) {
      const hostname = new URL(tab.url).hostname;

      // Get current data for the domain
      browser.storage.sync.get("domainData", function (result) {
        let allDomainData = result.domainData || {}; // if result.domainData is undefined, initialize it to an empty object
        let domainData = allDomainData[hostname] || {}; // if there is no data for this hostname, initialize it to an empty object

        // Update the field with new value
        domainData[field] = value;

        // Save the updated data back to allDomainData
        allDomainData[hostname] = domainData;

        // Save the updated data back to storage
        browser.storage.sync.set({ domainData: allDomainData }, function () {
          console.log(`Updated ${field} in storage for ${hostname}`);
          console.log(domainData);
        });
      });
    }
  });
}

// document.getElementById("imagePickerInput").addEventListener("input", function () {
//     browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
//         const tab = tabs[0];
//         if (tab) {
//             const hostname = new URL(tab.url).hostname;
//             const value = this.value;
//             const type = "ImageElementPicker";
//             const key = `${hostname}-${type}`;
//             console.log("ImageElementPicker", hostname, key, value);
//             storeValueInSyncStorage(key, value, type);
//         }
//     });
// });

// document.getElementById("answerPickerInput").addEventListener("input", function () {
//     browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
//         const tab = tabs[0];
//         if (tab) {
//             const hostname = new URL(tab.url).hostname;
//             const value = this.value;
//             const type = "AnswerElementPicker";
//             const key = `${hostname}-${type}`;
//             console.log("answerPickerInput", hostname, key, value);
//             storeValueInSyncStorage(key, value, type);
//         }
//     });
// });

// document.getElementById("ocrID").addEventListener("input", function () {
//     browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
//         const tab = tabs[0];
//         if (tab) {
//             const hostname = new URL(tab.url).hostname;
//             const value = this.value;
//             const type = "ocrid";
//             const key = `${hostname}-${type}`;
//             console.log("ocrid", hostname, key, value);
//             storeValueInSyncStorage(key, value, type);
//         }
//     });
// });

// function storeValueInSyncStorage(target, value, type) {
//     console.log("storeValueInSyncStorage");
//     browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
//         const tab = tabs[0];
//         if (tab) {
//             const hostname = new URL(tab.url).hostname;
//             browser.storage.sync.get("domainData", function (result) {
//                 const domainData = result.domainData || {};
//                 const updatedData = { ...domainData };
//                 const newDomainData = {
//                     [target]: {
//                         target: value,
//                     },
//                 };
//                 updatedData[hostname + "-" + type] = newDomainData;
//                 console.log("hostname-type", hostname + "-" + type);
//                 browser.storage.sync.set({ domainData: updatedData }, function () {
//                     // Print the updated data as "Saved data"
//                     console.log("updated data", type, target, value, updatedData);
//                 });
//             });
//         }
//     })

// }

function storeValueInSyncStorage(key, value, type) {
  console.log("storeValueInSyncStorage");
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const tab = tabs[0];
    if (tab) {
      const hostname = new URL(tab.url).hostname;
      browser.storage.sync.get("domainData", function (result) {
        const domainData = result.domainData || {};
        const updatedData = { ...domainData };
        const newDomainData = {
          target: value, // Adjusted here
        };
        updatedData[hostname + "-" + type] = newDomainData;
        console.log("hostname-type", hostname + "-" + type);
        browser.storage.sync.set({ domainData: updatedData }, function () {
          console.log("updated data", type, value, updatedData);
        });
      });
    }
  });
}

// send ocr id to element picker
document.getElementById("imagePicker").onclick = function () {
  sendMessageToContentScript();
};
document.getElementById("answerPicker").onclick = function () {
  sendMessageToContentScript();
};

function sendMessageToContentScript() {
  let ocrid = document.getElementById("ocrID")?.value;
  console.log(ocrid, "ocrid1");
  if (ocrid) {
    browser.storage.local.set({ ocrID: ocrid }, function () {
      console.log(ocrid, "ocrID is stored.");
    });
  }
}

//  export OCR JSON

document
  .getElementById("exportOCR")
  .addEventListener("click", function downloadDomainData() {
    browser.storage.sync.get("domainData", function (result) {
      let data = result.domainData || {};
      let dataStr = JSON.stringify(data);
      let dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      let exportFileDefaultName = "domainData.json";

      let linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    });
  });

// import OCR JSON or merge
document.getElementById("importButton").addEventListener("click", function () {
  let modal = document.getElementById("importModal");
  modal.setAttribute(
    "style",
    "display: flex; flex-direction:column; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background: rgba (0,0,0,.6); z-index: 9999; justify-content: center; align-items: center;"
  );

  let modalContent = document.getElementById("modalContent");
  // make modal content 80 width 60 percent height
  modalContent.setAttribute(
    "style",
    "width: 90%; height: 100%; background: white; padding: 10px; border-radius: 5px;"
  );
});

document
  .getElementById("closeModalButton")
  .addEventListener("click", function () {
    let modal = document.getElementById("importModal");
    modal.style.display = "none";
  });

// document.getElementById('replaceButton').addEventListener('click', function() {
//     let jsonInput = document.getElementById('jsonInput');
//     let newData = JSON.parse(jsonInput.value);
//     browser.storage.sync.set({ domainData: newData }, function() {
//         console.log("Data replaced");
//     });
// });

// document.getElementById('mergeButton').addEventListener('click', function() {
//     let jsonInput = document.getElementById('jsonInput');
//     let newData = JSON.parse(jsonInput.value);
//     browser.storage.sync.get('domainData', function(result) {
//         let existingData = result.domainData || {};
//         let mergedData = Object.assign({}, existingData, newData);
//         browser.storage.sync.set({ domainData: mergedData }, function() {
//             console.log("Data merged");
//         });
//     });
// });

document.getElementById("replaceButton").addEventListener("click", function () {
  let jsonInput = document.getElementById("jsonInput");
  let feedback = document.getElementById("feedback");
  try {
    let newData = JSON.parse(jsonInput.value);
    browser.storage.sync.set({ domainData: newData }, function () {
      feedback.innerText = "Data replaced successfully!";
      feedback.classList.add("feedback-show");
      setTimeout(function () {
        feedback.classList.remove("feedback-show");
      }, 3000);
    });
  } catch (error) {
    feedback.innerText = "Failed to replace data: " + error.message;
    feedback.classList.add("feedback-show");
    setTimeout(function () {
      feedback.classList.remove("feedback-show");
    }, 3000);
  }
});

document.getElementById("mergeButton").addEventListener("click", function () {
  let jsonInput = document.getElementById("jsonInput");
  let feedback = document.getElementById("feedback");
  try {
    let newData = JSON.parse(jsonInput.value);
    browser.storage.sync.get("domainData", function (result) {
      let existingData = result.domainData || {};
      let mergedData = Object.assign({}, existingData, newData);
      browser.storage.sync.set({ domainData: mergedData }, function () {
        feedback.innerText = "Data merged successfully!";
        feedback.classList.add("feedback-show");
        setTimeout(function () {
          feedback.classList.remove("feedback-show");
        }, 3000);
      });
    });
  } catch (error) {
    feedback.innerText = "Failed to merge data: " + error.message;
    feedback.classList.add("feedback-show");
    setTimeout(function () {
      feedback.classList.remove("feedback-show");
    }, 3000);
  }
});

// Check for Extension Update
const versionElement = document.getElementById("version");

async function fetchLatestRelease() {
  const repoUrl =
    "https://api.github.com/repos/noCaptchaAi/chrome/releases/latest";

  try {
    const response = await fetch(repoUrl);
    const data = await response.json();
    const latestVersion = data.tag_name;
    // const latestVersion = "v1.1";

    if (
      latestVersion &&
      latestVersion !== versionElement.innerText &&
      latestVersion > versionElement.innerText
    ) {
      versionElement.innerText = "⚡update " + latestVersion;
      versionElement.style.fontSize = ".8rem";
      versionElement.style.fontWeight = "bold";
      versionElement.title = "New update availble " + latestVersion;
      versionElement.href = data.html_url;
      versionElement.classList.add("glowing-text");
    }
  } catch (error) {
    console.log("Error fetching latest release:", error);
  }
}

fetchLatestRelease();
