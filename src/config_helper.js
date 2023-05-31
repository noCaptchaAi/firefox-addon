// Ensure API key exists
function validateApiKey(apiKey) {
  if (!apiKey) {
    throw new Error("empty apikey");
  }
}

// Fetch data from API endpoint
async function fetchData(apiKey, endpoint) {
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: apiKey,
    },
  });

  const json = await response.json();

  if (json.error) {
    handleApiError(json.error);
    return null;
  }

  return json;
}

// Handle API error
function handleApiError(error) {
  alert(`${error}\n noCaptchaAi Extension Config failed ✘`);
  chrome.storage.sync.set({ apikey: "" });
}

// Display success message
function displaySuccessMessage(plan) {
  alert(`noCaptchaAi Extension ${plan} plan \n Config Successful ✔️`);
}

// Process and apply the plan
function processPlan(json) {
  if (!json) return;

  switch (json.plan) {
    case "free":
      applyFreePlan();
      break;
    case "daily":
    case "unlimited":
    case "wallet":
      applyPaidPlan(json);
      break;
    default:
      break;
  }
}

// Apply the free plan
function refreshFrames() {
  displaySuccessMessage("free");
  const iframes = Array.from(document.querySelectorAll("[src*=newassets]"));
  for (const iframe of iframes) {
    const url = iframe.src;
    iframe.src = "about:blank";
    setTimeout(() => {
      iframe.src = url;
    }, 10);
  }
}

// Apply the paid plan
function applyPaidPlan(json) {
  displaySuccessMessage(json.plan);
  chrome.storage.sync.set({
    plantype: json.plan || s.plan,
    endpoint: json.endpoint || s.endpoint,
  });
}

(async () => {
  validateApiKey(settings.apikey);
  // console.log("apikey:", settings.apikey, settings.endpoint, settings.plan);
  const json = await fetchData(settings.apikey, get_endpoint);
  processPlan(json);
})();
