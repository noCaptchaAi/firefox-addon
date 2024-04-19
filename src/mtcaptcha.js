(async () => {
  let isSolved = false;
  let retryCount = 0;
  const settings = await browser.storage.sync.get(null);
  const { APIKEY, extensionEnabled, logsEnabled } = settings;

  const logs = logsEnabled === "true";
  function log(arg) {
    logs && console.log(arg);
  }

  // console.clear();
  console.log("OCR.js loaded");

  var script = document.createElement("script");
  script.src = browser.runtime.getURL("assets/hooks/mtcap.js");
  (document.head || document.documentElement).appendChild(script);

  async function refreshMT() {
    await sleep(1000);
    return document.querySelector("#mtcap-statusbutton-1")?.click();
  }
  await refreshMT();

  // console.log(APIKEY, extensionEnabled, 'APIKEY');
  if (APIKEY == "" || extensionEnabled != "true") {
    injectNotify("✘ Please set APIKEY", 3000, false);
    return;
  }

  async function clickToAudio() {
    const audbtn = document.querySelector("#mtcap-audioctrlicon-1");
    return audbtn != null && audbtn?.click();
  }

  let audio,
    image,
    length = null;

  localStorage.setItem("solving", "false");
  let solving = JSON.parse(localStorage.getItem("solving"));

  window.addEventListener("message", async function (e) {
    if (e?.data?.type === "xhr" || e?.data?.type === "fetch") {
      e.data.url.includes("mtcv1/api/getchallenge.json") &&
        (async () => {
          let json = (await JSON.parse(e.data.data)) || {};
          length = json?.result?.challenge?.textChlg?.textlen;
          console.log(json, length, "length");
        })();
      length &&
        e.data.url.includes("mtcv1/api/getimage.json") &&
        (async () => {
          image = (await JSON.parse(e.data.data)) || {};
          console.log(image, "image");
          await clickToAudio();
        })();
      if ((length, image)) {
        e.data.url.includes("mtcv1/api/getaudio.json") &&
          (async () => {
            audio = (await JSON.parse(e.data.data)) || {};
            console.log(audio, "audio");

            console.log("all found", location.href);
            localStorage.setItem("solving", "true");
            if (retryCount != 0) await sleep(2000);
            await solveCaptcha(image, audio, length, e.data.url);
          })();
      } else {
        await sleep(2000);
        refreshMT();
      }

      // if ((length, image, audio)) {
      //   console.log("all found", location.href);
      //   localStorage.setItem("solving", "true");
      //   await solveCaptcha(image, audio, length, e.data.url);
      // }
    }
  });

  async function solveCaptcha(image, audio, length, url) {
    console.log("solveCaptcha ran");
    if (!(image, audio, length, url)) return;
    if (localStorage.getItem("solving") === true) return;

    retryCount++;
    if (retryCount > 10) {
      console.log("Maximum exceeded");
      injectNotify("✘ Maximum exceeded, refresh page to solve again");
      return;
    }
    // const res = await getAnswer(image, audio, length, url);
  
    if (res) {
      console.log(res, "solution");
      document.querySelector("#mtcap-inputtext-1").value = res.solution;
      clickElement(document.querySelector("#mtcap-inputtext-1"));
      await simulateTyping(
        document.querySelector("#mtcap-inputtext-1"),
        res.solution
      );

      const hasError = document.querySelector("#mtcap-invalid-msg-1");
      hasError && console.log(hasError, "hasError");

      isSolved = true;
      log("Answer typed: " + res.solution);
      injectNotify(`${res.message || "✘ server didn't respond, try later"}`);
      (audio = null), (image = null), (length = null);
    } else {
      await sleep(2000);
      injectNotify("✘ server didn't respond, try later");
      refreshMT();
    }
  }

  function injectNotify(text, duration = 10000) {
    const existingDiv = document.getElementById("alert-box");
    if (existingDiv) {
      existingDiv.remove();
    }

    const div = document.createElement("div");

    div.id = "alert-box";
    div.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    div.style.color = "#eee";
    div.style.borderRadius = "4px";
    div.style.display = "flex";
    div.style.flexDirection = "row";
    div.style.padding = "6px";

    div.innerHTML = `
    <div>
    <img src="https://avatars.githubusercontent.com/u/110127579?s=20&v=4" alt="notification" style="width: 24px; height: 24px; margin-right: 6px;"/>
    </div>

    <div id="notification-text" style="flex: 1;">${text}</div>
    
    <button id="close-btn" style="flex: 0; width:"50px; cursor:pointer" onclick="this.parentElement.style.display='none';">❌</button>
    `;

    const parentElement = document.querySelector(".mtcap-main");

    parentElement.appendChild(div);

    setTimeout(() => {
      div.remove();
    }, duration);
  }

  async function getAnswer(image, audio, length, url) {
    console.log("get answer");
    const matchChrome = navigator.userAgent?.match(/Chrome\/(\S+)/);
    const matchFirefox = navigator.userAgent?.match(/Firefox\/([0-9]+)/);
    const apiUrl = `https://${settings.PLANTYPE}.nocaptchaai.com/solve`;
    const requestBody = {
      method: "mtcaptcha",
      image,
      audio,
      length,
      softid: `firefoxExt_V${settings.version_data.local}`,
      meta: {
        ua: navigator.userAgent,
        ln: navigator.language || navigator.userLanguage,
        v: matchChrome ? matchChrome[1] : matchFirefox ? matchFirefox[1] : null,
        host: window.location.host,
        url,
      },
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: settings.APIKEY,
      },
      body: JSON.stringify(requestBody),
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      const responseData = await response.json();
      injectNotify(responseData.message);
      console.log(responseData, "responseData");

      (audio = null), (image = null), (length = null);
      return responseData.solution;
    } catch (error) {
      (audio = null), (image = null), (length = null);
      injectNotify("✘ Error while fetching answer");
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function simulateTyping(input, value) {
    function fireEvent(element, eventConstructor, eventOptions) {
      const event = new eventConstructor(eventOptions);
      element.dispatchEvent(event);
    }

    function fireMouseEvents(element) {
      ["mouseover", "mousedown", "mouseup", "click"].forEach((eventName) => {
        fireEvent(element, MouseEvent, {
          bubbles: true,
          cancelable: true,
          view: window,
          type: eventName,
        });
      });
    }

    fireMouseEvents(input);

    fireEvent(input, FocusEvent, {
      bubbles: true,
      cancelable: true,
      type: "focus",
    });

    const keydownEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      view: window,
      key: value,
      code: `Digit${value}`,
      location: 0,
    });

    const keypressEvent = new KeyboardEvent("keypress", {
      bubbles: true,
      cancelable: true,
      view: window,
      key: value,
      code: `Digit${value}`,
      location: 0,
    });

    const keyupEvent = new KeyboardEvent("keyup", {
      bubbles: true,
      cancelable: true,
      view: window,
      key: value,
      code: `Digit${value}`,
      location: 0,
    });

    input.dispatchEvent(keydownEvent);
    await sleep(Math.random() * 100 + 50); // Add a random delay to simulate typing

    try {
      input.dispatchEvent(keypressEvent);
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    } catch (error) {
      injectNotify("could not set answer. Check your css selector");
    }

    await sleep(Math.random() * 100 + 50); // Add a random delay to simulate key release
    input.dispatchEvent(keyupEvent);
  }

  function clickElement(element) {
    if (element && typeof element.dispatchEvent === "function") {
      const focusEvent = new FocusEvent("focus", {
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(focusEvent);

      const mouseDownEvent = new MouseEvent("mousedown", {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1,
      });
      element.dispatchEvent(mouseDownEvent);

      const mouseUpEvent = new MouseEvent("mouseup", {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 0,
      });
      element.dispatchEvent(mouseUpEvent);

      for (const eventName of ["mouseover", "mousedown", "mouseup", "click"]) {
        const eventObject = new MouseEvent(eventName, {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        element.dispatchEvent(eventObject);
      }
    } else {
      console.log("Invalid element or dispatchEvent is not available.");
    }
  }

  if (document.getElementById("mtcap-invalid-msg-1")) {
    clearTimeout(timer);
    handleTargetExistence();
  }
  const handleTargetExistence = () => {
    console.log(
      "Target element exists for more than 2 seconds, executing action..."
    );
  };

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.id === "mtcap-invalid-msg-1") {
          handleTargetExistence();
          observer.disconnect();
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
