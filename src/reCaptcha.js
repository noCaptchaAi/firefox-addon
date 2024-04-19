let stop = false;

(async () => {
  const settings = await browser.storage.sync.get(null);
  let logs = settings.logsEnabled === "true" ? true : false;

  function log(...args) {
    if (logs) {
      console.log(...args);
    }
  }

  // console.log("recap image");

  // let stop = false;

  async function processGridImages(grid, src) {
    if (stop) {
      console.log("stopped");
      return;
    }
    // console.log("i Ran");

    const cells = document.querySelectorAll(".rc-image-tile-wrapper");
    const images = {};

    async function tryFetchingImages(retries) {
      const base64Images = await Promise.all(
        Array.from(cells).map(async (cell) =>
          getBase64FromUrl(cell.querySelector("img").src)
        )
      );

      if (base64Images.length === 0 && retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return tryFetchingImages(retries - 1);
      }

      base64Images.forEach((uri, index) => {
        images[index] = uri;
      });

      return images;
    }

    switch (grid) {
      case "split_33":
        return tryFetchingImages(5);

      case "33":
        return await getBase64FromUrl(src);
      case "44":
        return await getBase64FromUrl(src);

      default:
        console.warn("Invalid grid type:", grid);
        return {};
    }
  }

  class Time {
    static now() {
      return Date.now();
    }
    static currentDate() {
      return new Date();
    }
    static sleep(t) {
      return new Promise((e) => setTimeout(e, t));
    }
    static async randomSleep(t, e) {
      const n = Math.floor(Math.random() * (e - t) + t);
      return await Time.sleep(n);
    }
  }

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

  async function getBase64FromUrl(url) {
    if (stop) return;
    // console.log(stop, "getBase64FromUrl");
    const response = await fetch(url);
    if (!response.ok)
      return console.log(
        `Failed to fetch URL. Status code: ${response.status}`
      );
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result)
          resolve(reader.result.replace(/^data:image\/(png|jpeg);base64,/, ""));
        else reject(console.log("Failed to convert to base64"));
      };
      reader.readAsDataURL(blob);
    });
  }

  // async function getBase64FromUrl(url) {
  //   const blob = await (await fetch(url)).blob();
  //   return new Promise(function (resolve, reject) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(blob);
  //     reader.addEventListener("loadend", function () {
  //       resolve(reader.result.replace(/^data:image\/(png|jpeg);base64,/, ""));
  //     });
  //     reader.addEventListener("error", function () {
  //       reject("❌ Failed to convert url to base64");
  //     });
  //   });
  // }

  function fireMouseEvents(element) {
    if (document.contains(element)) {
      ["mouseover", "mousedown", "mouseup", "click"].forEach((e) => {
        const evt = document.createEvent("MouseEvents");
        evt.initEvent(e, true, false);
        element.dispatchEvent(evt);
      });
    }
  }
  class RC {
    static query(sel, attr) {
      const el = document.querySelector(sel);
      return attr ? el?.getAttribute(attr) : el;
    }

    static queryAll(sel) {
      return document.querySelectorAll(sel);
    }

    static isWidgetFrame() {
      return !!this.query(".recaptcha-checkbox");
    }
    static isImageFrame() {
      return !!this.query("#rc-imageselect");
    }
    static isErrorSelect() {
      return (
        this.query(".rc-imageselect-error-select-more", "style") !== "none"
      );
    }
    static isErrorDynamic() {
      return (
        this.query(".rc-imageselect-error-dynamic-more", "style") !== "none"
      );
    }
    static isSubmitDisabled() {
      return this.query("#recaptcha-verify-button", "disabled") === true;
    }
    static isExpired() {
      return !!this.query(".recaptcha-checkbox-border");
    }
    static is11() {
      return this.queryAll(".rc-image-tile-11").length !== 0;
    }
    static isDynamic33() {
      return this.queryAll(".rc-imageselect-dynamic-selected").length !== 0;
    }
    static is33() {
      return this.queryAll(".rc-imageselect-tile").length === 9;
    }
    static is44() {
      return this.queryAll(".rc-imageselect-tile").length === 16;
    }

    static src11() {
      return this.query(".rc-image-tile-11", "src");
    }
    static src44() {
      return this.query(".rc-image-tile-44", "src");
    }
    static src33() {
      return this.query(".rc-image-tile-33", "src");
    }

    static openImageFrame() {
      fireMouseEvents(this.query("#recaptcha-anchor"));
    }
    static submit() {
      this.query("#recaptcha-verify-button")?.click();
    }
    static clicAudioBtn() {
      this.query("#recaptcha-audio-button")?.click();
    }
    static reload() {
      this.query("#recaptcha-reload-button")?.click();
    }

    // static isSolved() {
    //   return (
    //     this.query(".recaptcha-checkbox", "aria-checked") === "true" ||
    //     this.isSubmitDisabled()
    //   );
    // }

    static recapExpired() {
      const recap = document.querySelector("#recaptcha-anchor");
      return recap?.classList.contains("recaptcha-checkbox-expired");
    }

    static recapSolved() {
      let captcha = document.querySelector("#recaptcha-anchor");
      if (captcha) {
        return captcha.getAttribute("aria-checked") === "true";
      }
      return false;
    }

    static hasErrors() {
      return [
        ".rc-imageselect-error-select-more",
        ".rc-imageselect-error-dynamic-more",
        ".rc-imageselect-error-select-something",
      ].some((sel) => {
        const el = this.query(sel);
        return (
          el && getComputedStyle(el).display !== "none" && el.tabIndex === 0
        );
      });
    }

    static isRateLimited() {
      return !!this.query(".rc-doscaptcha-header");
    }

    static isCellSelected($cell) {
      return $cell?.classList.contains("rc-imageselect-tileselected");
    }

    static getTarget() {
      return this.query(
        ".rc-imageselect-desc strong, .rc-imageselect-desc-no-canonical strong",
        "innerText"
      );
    }

    static async refreshIframes() {
      try {
        const iframes = document.querySelectorAll("iframe");
        for (const iframe of iframes) {
          const originalSrc = iframe.src;
          iframe.src = "about:blank";
          await new Promise((resolve) => {
            iframe.onload = () => {
              iframe.onload = null; // Remove the event listener to prevent memory leaks
              iframe.src = originalSrc;
              resolve();
            };
          });
        }
      } catch (error) {
        console.log("Error refreshing iframes:", error);
        try {
          const iframes = document.querySelectorAll("iframe");
          for (const iframe of iframes) {
            const original = iframe.src;
            console.log(original);
            iframe.src = "about:blank";
            await new Promise((resolve) => setTimeout(resolve, 50)); // Use setTimeout for delay
            iframe.src = original;
          }
        } catch (error) {
          console.log("Error refreshing iframes:", error);
          const iframes = document.querySelectorAll("iframe");
          for (const iframe of iframes) {
            iframe.src = iframe.src;
          }
        }
      }
    }

    // static async onImagesReady() {
    //   while (
    //     !this.queryAll(".rc-imageselect-tile").length ||
    //     this.queryAll(".rc-imageselect-dynamic-selected").length
    //   ) {
    //     await new Promise((r) => setTimeout(r, 100));
    //   }
    //   return true;
    // }
  }

  let previousImages = null;

  let previous33Images = null;

  async function solve() {
    if (stop) {
      console.log("stopped");
      return;
    }

    const type = RC.is44()
      ? "44"
      : RC.is33()
      ? "33"
      : RC.is11()
      ? "split_33"
      : null;
    if (!type) return;
    const [target, src, grid] = await data();
    const images =
      type === "split_33"
        ? await processGridImages(grid, src)
        : { 0: await processGridImages(grid, src) };
    const imagesJSON = JSON.stringify(images);

    if (!imagesJSON) return;
    if (imagesJSON === previousImages) {
      return "skip";
    }

    previousImages = imagesJSON;

    // log(images, target, type);
    cellsClick(images, grid, target, type);
  }

  async function data() {
    const grid = RC.is44() ? "44" : RC.is33() ? "33" : null;
    if (!grid) return;

    const target = document.querySelector(
      ".rc-imageselect-instructions strong"
    )?.innerText;
    if (!target) return;

    const src = document.querySelector(`.rc-image-tile-${grid}`)?.src;
    if (!src) return;

    return [target, src, grid];
  }

  while (
    settings.PLANTYPE &&
    settings.APIKEY &&
    settings.extensionEnabled == "true" &&
    settings.reCaptchaEnabled == "true" &&
    settings.reCaptchaSolveType !== "audio"
  ) {
    await Time.sleep(1000);
    log("recaptcha loop");

    if (!stop && RC.isWidgetFrame() && settings.reCaptchaAutoOpen == "true") {
      // console.log("openImageFrame");
      RC.openImageFrame();
    }

    if (!stop && RC.isImageFrame() && settings.reCaptchaAutoSolve == "true") {
      const type = RC.is44() ? "44" : RC.is33() ? "33" : null;
      if (type === "33" || type === "44") {
        await sleep(1000);
        if ((await solve()) !== "skip") {
          // console.log(await solve(), "await solve()");
          await solve();
        }
      }
    } else if (RC.recapExpired()) {
      console.log("recaptcha expired, refreshing iframes");
      RC.refreshIframes();
      stop = false;
    } else if (RC.recapSolved()) {
      console.log("recaptcha solved");
      stop = true;
      // break;
    }
  }

  function submit() {
    fireMouseEvents(document.querySelector("#recaptcha-verify-button"));
  }

  async function req(images, target, type) {
    const baseurl = "https://recap.nocaptchaai.com/solve";
    const headers = {
      "Content-Type": "application/json",
      APIKEY: settings.APIKEY,
    };

    if (settings.logs == "true")
      console.log(
        "images",
        typeof images,
        images.length,
        images === null,
        images === undefined
      );
    if (!images) return;
    try {
      const response = await fetch(baseurl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          images,
          target,
          type,
          softid: `firefoxExt_V${settings.version_data.local}`,
          method: "recaptcha2",
        }),
      });
      if (response.status == 404 || !response.ok) {
        const h = await response.json();
        jsNotif(`✘ Error:- ${h.message}`, 10000);
        console.log("✘ Error: " + h.message);
      }
      return await response.json();
    } catch (error) {
      console.log(error, "catch");
      jsNotif("couldn't send network request");
      await sleep(2000);
      console.log("waited and re-ran req()");
      await req();
    }
  }

  async function cellsClick(image, grid, target, isDynamic, isMulti) {
    const htmlTarget = document.querySelector(
      ".rc-imageselect-desc-no-canonical strong"
    )?.textContent;

    if (!image) return;
    const response = await req(image, target || htmlTarget, grid);
    // jsNotif(response.status, response.message, 10000);
    // log(response);
    const cells = document.querySelectorAll(".rc-image-tile-wrapper");

    if (!cells) return;
    const solution = await handleSolveQueue(response);

    if (!solution) {
      return;
    }
    for (const index of solution) {
      fireMouseEvents(cells[index]);
      await sleep(settings.reCaptchaClickDelay);
    }

    if (RC.isDynamic33() === false) {
      log("dynamic", RC.isDynamic33());
      await sleep(settings.reCaptchaSubmitDelay * 1000);
      submit();
      if (RC.isErrorSelect() || RC.isErrorDynamic()) {
        log("error found, skipping");
        return RC.reload();
      }
    }

    if (isDynamic) {
      return split33(target, solution);
    }
    if (isMulti) {
      await sleep(settings.reCaptchaSubmitDelay * 1000);
      submit();
      await sleep(settings.reCaptchaSubmitDelay * 1000);
      return multi(target);
    }
    await sleep(settings.reCaptchaSubmitDelay * 1000);
    submit();
  }

  async function split33(target, array) {
    while (
      !stop &&
      document.querySelectorAll(".rc-image-tile-11").length < array.length
    ) {
      await sleep(150);
    }
    const cells = document.querySelectorAll(".rc-image-tile-wrapper img");
    const images = {};
    if (!array) return;
    for (const index of array) {
      if (index >= 0 && index < cells.length) {
        images[index] = await getBase64FromUrl(cells[index].src);
      } else {
        console.warn(`Index ${index} is out of range for cells array`);
      }
    }
    const imagesJSON = JSON.stringify(images);
    if (imagesJSON === JSON.stringify(previous33Images)) return;
    if (imagesJSON === "{}") return;
    const response = await req(images, target, "split_33");
    if (!response) return;

    const solution = await handleSolveQueue(response);
    if (!solution) return;

    log(response);
    if (solution.length == 0) {
      await sleep(settings.reCaptchaSubmitDelay * 1000);
      submit();
      if (RC.isErrorSelect() || RC.isErrorDynamic()) {
        log("error found, skipping");
        return RC.reload();
      } else {
        return;
      }
    }

    for (const index of solution) {
      fireMouseEvents(cells[index]);
      await sleep(settings.reCaptchaClickDelay);
    }
    await sleep(1000);
    split33(target, solution);
  }

  async function multi(target) {
    const htmlTarget = document.querySelector(
      ".rc-imageselect-desc-no-canonical strong"
    )?.textContent;
    log(htmlTarget);

    const cells = document.querySelectorAll(".rc-image-tile-wrapper img");
    const image = document.querySelector(".rc-image-tile-44")?.src;

    if (!image) return;
    const response = await req(
      await getBase64FromUrl(image),
      target || htmlTarget,
      "44"
    );
    if (!response) return;
    const solution = await handleSolveQueue(response);
    if (!solution) return;
    if (!solution.length) {
      // The 'solution' array is empty
      // console.log("no solution found, reloading");
      return RC.reload();
    }

    log(response);
    if (solution.length == 0) {
      await sleep(settings.reCaptchaSubmitDelay * 1000);
      return submit();
    }
    for (const index of solution) {
      await sleep(settings.reCaptchaClickDelay);
      fireMouseEvents(cells[index]);
    }

    await sleep(settings.reCaptchaSubmitDelay * 1000);
    submit();
    await sleep(settings.reCaptchaSubmitDelay * 1000);
    return multi(target);
  }

  async function handleSolveQueue(response) {
    if (response.status === "new") {
      const fetchedResponse = await fetch(response.url);
      if (!fetchedResponse.ok)
        return new Error(
          `Failed to fetch URL. Status code: ${response.status}`
        );
      const jsonResponse = await fetchedResponse.json();
      return jsonResponse.solution || null;
    } else {
      return response.solution;
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function log() {
    settings.logs && console.log.apply(this, arguments);
  }
})();
