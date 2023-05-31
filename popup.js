// refresh iframes
function refreshIframes() {
    browser.tabs.executeScript({
        code: "iframesReload();",
    });
}

// Handle Extension Configs

const inputElements = document.querySelectorAll(
    'input[type="checkbox"], input[type="number"], select'
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

let cachedBalanceData = null;

const fetchAndDisplayData = async (url, elementId, fields) => {
    const settings = await new Promise((resolve) => {
        chrome.storage.sync.get(null, (data) => {
            resolve(data);
        });
    });

    const element = document.getElementById(elementId);
    if (!element) {
        return;
    }
    element.innerHTML = '<div class="loader"></div>'; // Show loading icon

    const response = await fetch(url, {
        headers: {
            apikey: settings.APIKEY,
        },
    });

    const data = await response.json();
    console.log(data, "data");

    const balanceDataElement = element.querySelector(".loader");
    if (balanceDataElement) {
        element.removeChild(balanceDataElement);
    }

    const newBalanceDataElement = document.createElement("div");
    newBalanceDataElement.id = "balance-data";

    const c = document.getElementById("error-api");
    if (data.error) {
        c.style.display = "block";
        c.style.color = "red";
        c.style.fontSize = "20px";
        c.style.textAlign = "center";
        c.innerHTML = data.message;
    } else if (c.style.display === "block") {
        c.style.display = "none";
    }

    fields.forEach((key) => {
        const value =
            key in data
                ? data[key]
                : data.Subscription && data.Subscription[key];
        const div = document.createElement("div");
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        div.className = "data-item";
        // div.textContent = `${key}: ${value}`;
        p1.textContent = key;
        p1.className = "data-item-key";
        p2.textContent = value;
        p2.className = "data-item-value";
        newBalanceDataElement.appendChild(div);
        div.appendChild(p1);
        div.appendChild(p2);
    });

    element.appendChild(newBalanceDataElement);

    cachedBalanceData = JSON.stringify(data);
};

const balanceFields = [
    "Balance",
    "expire",
    "planName",
    "remaining",
    "used",
    "wallet_usages",
];

const refreshData = async () => {
    fetchAndDisplayData(
        "https://manage.nocaptchaai.com/balance",
        "balance-section",
        balanceFields
    );
    fetchAndDisplayData(
        "https://manage.nocaptchaai.com/api/user/get_endpoint",
        "endpoint-section",
        ["endpoint", "free"]
    );
};

document.addEventListener("DOMContentLoaded", () => {
    refreshData();

    const refreshButton = document.getElementById("refresh-button");
    refreshButton.addEventListener("click", refreshData);
});

// balance end

const apikeyText = document.getElementById("apikey-text");
const apikeyInput = document.getElementById("apikey-input");
const editButton = document.getElementById("edit-button");
const saveButton = document.getElementById("save-button");
const deleteButton = document.getElementById("delete-button");

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
    saveApiKey();
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
    // print all of items indefaultConfigs
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
