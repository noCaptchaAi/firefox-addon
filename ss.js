const url = new URL("http://127.0.0.1:5500/config3.html?APIKEY=&PLANTYPE=&customEndpoint=&hCaptchaEnabled=true&reCaptchaEnabled=true&dataDomeEnabled=true&ocrEnabled=true&extensionEnabled=true&logsEnabled=false&fastAnimationMode=true&debugMode=false&hCaptchaAutoOpen=true&hCaptchaAutoSolve=true&hCaptchaAlwaysSolve=true&englishLanguage=true&hCaptchaGridSolveTime=7&hCaptchaMultiSolveTime=5&hCaptchaBoundingBoxSolveTime=5&reCaptchaAutoOpen=true&reCaptchaAutoSolve=true&reCaptchaAlwaysSolve=true&reCaptchaClickDelay=400&reCaptchaSubmitDelay=1&reCaptchaSolveType=image");

const searchParams = new URLSearchParams(url.search);

const paramsToStore = {};

searchParams.forEach((value, key) => {
  paramsToStore[key] = value?.length > 0 ? value.toLowerCase() : null;
  console.log(key, value);
});

// await chrome.storage.sync.set(paramsToStore);
