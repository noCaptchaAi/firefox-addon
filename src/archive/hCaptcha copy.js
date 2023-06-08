// console.log("hCaptcha");

function iframesReload() {
    const iframes = document.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
        iframes[i].src = iframes[i].src;
    }
}

(async () => {
    // console.log("hCaptcha 2");
    let settings = await chrome.storage.sync.get(null);

    // chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    //   if (message.action == "refresh_iframes") {
    //     var iframes = document.getElementsByTagName("iframe");
    //     for (var i = 0; i < iframes.length; i++) {
    //       iframes[i].src = iframes[i].src;
    //     }
    //   }
    // });
    if (!settings.APIKEY || settings.extensionEnabled === false) return;
    // console.log(
    //     "APIKEY",
    //     settings.APIKEY.length,
    //     settings.PLANTYPE,
    //     await getApi("solve")
    // );

    // chrome.runtime.onMessage.addListener(function (request) {
    //     if (request.farewell) {
    //         console.log(request.farewell);
    //     }
    // });

    // if (!settings.PLANTYPE) {
    //     chrome.runtime.sendMessage({ greeting: "getPlanType" });
    // }

    function isMulti() {
        return document.querySelector(".task-answers") !== null;
    }
    function isGrid() {
        return document.querySelectorAll(".task-image .image")?.length === 9;
    }
    function isBbox() {
        return document.querySelector(".bounding-box-example") !== null;
    }
    function simulateButtonClick(element) {
        ["mouseover", "mousedown", "mouseup", "click"].forEach((eventType) => {
            const event = new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            element.dispatchEvent(event);
        });
    }

    async function getApi(v) {
        const k = settings.customEndpoint;
        if (settings.PLANTYPE === "custom") {
            return "https://" + k + "/" + v;
        }
        return "https://" + settings.PLANTYPE + ".nocaptchaai.com/" + v;
    }
    // if (settings.power === false) return;
    // if (settings.hCap === false) return;
    // utils
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    // if (window.top === window) {
    //   if(logsEnabled) console.log(
    //     "auto open= ",
    //     settings.hCaptchaAutoOpen + "auto solve= ",
    //     settings.hCaptchaAutoSolve + "loop running in bg"
    //   );
    // }
    function isWidget() {
        const rect = document.body.getBoundingClientRect();
        if (rect?.width === 0 || rect?.height === 0) {
            return false;
        }

        return document.querySelector("div.check") !== null;
    }

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function randTimer(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function isSolved() {
        try {
            const check = document.querySelector("div.check");
            return check && check.style.display === "block";
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    // function shouldRun() {
    //   return !navigator.onLine || stop || settings.APIKEY === undefined || "";
    // }
    const shouldRun = () => {
        return (
            !navigator.onLine ||
            stop ||
            !settings.APIKEY ||
            !settings.PLANTYPE ||
            !settings.extensionEnabled
        );
    };

    async function getBase64FromUrl(url) {
        const blob = await (await fetch(url)).blob();
        return new Promise(function (resolve) {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.addEventListener("loadend", function () {
                resolve(
                    reader.result.replace(/^data:image\/(png|jpeg);base64,/, "")
                );
            });
            reader.addEventListener("error", function () {
                if (logsEnabled)
                    console.log("❌ Failed to convert url to base64");
            });
        });
    }
    async function fetchBase64Urls(urls) {
        for (let url of urls) {
            try {
                const base64Url = await new Promise((resolve, reject) => {
                    chrome.runtime.sendMessage(
                        { action: "getBase64FromUrl", url: url },
                        function (response) {
                            if (response.error) {
                                reject(response.error);
                            } else {
                                resolve(response);
                            }
                        }
                    );
                });
                images[url] = base64Url;
            } catch (error) {
                console.log(`Failed to get base64Url for ${url}: ${error}`);
            }
        }
        return images;
    }

    // function getBase64FromUrl(imageUrl) {
    //   return new Promise((resolve, reject) => {
    //     chrome.runtime.sendMessage({ imageUrl }, response => {
    //       if (chrome.runtime.lastError) {
    //         reject(chrome.runtime.lastError);
    //         return;
    //       }

    //       if (response.error) {
    //         reject(new Error(response.error));
    //       } else {
    //         resolve(response.base64Uri);
    //       }
    //     });
    //   });
    // }

    let lang_xhr = "";
    const searchParams = new URLSearchParams(location.hash);

    let startTime;
    let stop = false;
    // essentials
    const headers = {
        "Content-Type": "application/json",
        APIKEY: settings.APIKEY,
    };
    // end essentials

    const logsEnabled = settings.logsEnabled;
    // start
    while (!shouldRun()) {
        await sleep(1000);
        // console.log("loop running");
        // console.log(
        //     "APIKEY",
        //     settings.APIKEY,
        //     settings.PLANTYPE,
        //     await getApi("solve")
        // );

        if (settings.hCaptchaAutoOpen && isWidget()) {
            // if (settings.hCaptchaAutoOpen) {
            // console.log("isWidget", isWidget(), settings.hCaptchaAutoOpen);

            // console.log("api", settings.APIKEY, settings.PLANTYPE);

            // if (isSolved()) {
            //   if (settings.debug) refreshIframes();
            //   if (settings.hCAlwaysSolve === false) break;
            // }
            // console.log("opening box");
            fireMouseEvents(document.querySelector("#checkbox"));
        } else if (settings.hCaptchaAutoSolve && $("h2.prompt-text") !== null) {
            // if (settings.logsEnabled)
            //     if (logsEnabled) console.log("opening box");

            await sleep(1000); // important don't remove
            await solve();
        }
    }

    function refreshIframes() {
        const iframes = document.querySelectorAll("iframe");
        iframes.forEach((iframe) => {
            iframe.src = iframe.src;
        });
    }

    async function getEn() {
        if (isBbox()) {
            await sleep(200);
            simulateButtonClick(
                document.querySelector(".display-language.button")
            );
            await sleep(100);
            simulateButtonClick(
                document.querySelector(
                    ".language-selector .option:nth-child(23)"
                )
            );
        } else if (isGrid()) {
            await sleep(100);
            simulateButtonClick(
                document.querySelector(
                    ".language-selector .option:nth-child(23)"
                )
            );
        } else if (isMulti()) {
            simulateButtonClick(
                document.querySelector(".display-language.button")
            );
            await sleep(200);
            simulateButtonClick(
                document.querySelector(
                    ".language-selector .option:nth-child(23)"
                )
            );
            await sleep(200);
        }
    }

    function skip() {
        simulateButtonClick(document.querySelector(".button-submit"));
    }

    async function solve() {
        console.log("solve");
        startTime = new Date();

        let previousTask = [];
        // await sleep(500);
        // if (!isMulti()) {
        // if (settings.debug && !isBbox()) {
        //   simulateButtonClick(document.querySelector(".button-submit"));
        //   return;
        // }

        if (
            settings.english &&
            (document.documentElement.lang || navigator.language) !== "en"
        ) {
            await getEn();
        }

        // if (logsEnabled) console.log(previousTask);
        if (!previousTask != []) return;

        const { target, cells, images, example, choices } = await onTaskReady();

        if (!settings.hCaptchaAutoSolve) {
            return;
        }

        const searchParams = new URLSearchParams(location.hash);
        const type = isMulti() ? "multi" : isBbox() ? "bbox" : "grid";
        // if (logsEnabled) console.log(type, target, cells, images, example, choices);

        const url = (await getApi("solve")).toLocaleLowerCase();

        const isBlocked = false;

        try {
            previousTask = images;
            console.log("images", images);
            let response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    images,
                    target,
                    method: "hcaptcha_base64",
                    type,
                    choices: isMulti() ? choices : [],
                    sitekey: searchParams.get("sitekey"),
                    site: searchParams.get("host"),
                    ln: document.documentElement.lang || navigator.language,
                    softid: "firefoxExt_V0.1",
                }),
            });

            console.log("status", await response.json());
            console.log("isGrid", isGrid());

            const STATUS = {
                SKIP: "skip",
                NEW: "new",
                SOLVED: "solved",
                FAILED: "falied",
            };

            const TYPE = {
                MULTI: "multi",
                GRID: "grid",
                BBOX: "bbox",
            };

            if (response.statusText === "forbidden") {
                isBlocked = true;
            }

            const {
                answer,
                message: msg,
                status,
                url: newUrl,
                error,
            } = await response.json();
            console.log("here2", answer, msg, status, newUrl, error);

            const clickTime = randTimer(250, 350);
            let clicks = 0;

            async function logAndNotify(message) {
                jsNotif("⚠ " + message);
            }

            if (error) {
                logAndNotify(msg);
            } else if (status === STATUS.SKIP && answer.length === 0) {
                logAndNotify(msg);
            } else if ([STATUS.NEW, STATUS.SOLVED].includes(status)) {
                if (isMulti()) {
                    const ans = answer;
                    if (msg) logAndNotify(msg);
                    await clickMatchingElement(ans);
                    clicks += 1;
                } else if (isGrid()) {
                    if (msg) logAndNotify(msg);
                    const response = await (await fetch(newUrl)).json();

                    console.log("response", response);
                    const indices =
                        status === STATUS.NEW
                            ? response.solution
                            : shuffle(response.solution);
                    for (const index of indices) {
                        simulateButtonClick(cells[index]);
                        await sleep(clickTime);
                    }
                } else if (isBbox()) {
                    if (msg) logAndNotify(msg);
                    const { answer: ans } = await (await fetch(newUrl)).json();
                    if (!ans) return;
                    if (ans.length === 2) {
                        await area(ans);
                        clicks += 1;
                    }
                }
            } else if (status === STATUS.FAILED) {
                logAndNotify(msg);
            }

            const ET = new Date() - startTime;
            const RT = isMulti()
                ? settings.hcaptime_multi * 1000 - ET
                : isBbox()
                ? settings.hcaptime_bbox * 1000 - ET
                : settings.hcaptime * 1000 - ET;

            if (RT < 0) {
                await sleep(300);
            }
            await sleep(RT);

            simulateButtonClick(document.querySelector(".button-submit"));
            startTime = 0;
            previousTask = [];
        } catch (error) {
            await fetch(url)
                .catch((error) => console.log(error))
                .then((data) => {
                    if (data.statusText === "Forbidden") {
                        jsNotif(
                            "⚠ Server blocked this IP, please wait 10 minutes for unblocked."
                        );
                        console.log("Error", data.statusText);
                        sleep(10000);
                        return;
                    }
                });
            // jsNotif("⚠ Error connect to API or server blocked IP");
            // console.log("⚠ Error connect to API or server blocked IP");
        }
    }
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function fireMouseEvents(element) {
        ["mouseover", "mousedown", "mouseup", "click"].forEach((eventName) => {
            if (element.fireEvent) {
                element.fireEvent("on" + eventName);
            } else {
                const eventObject = document.createEvent("MouseEvents");
                eventObject.initEvent(eventName, true, false);
                element.dispatchEvent(eventObject);
            }
        });
    }
    async function area(data) {
        function clickOnCanvas(canvas, x, y) {
            const rect = canvas.getBoundingClientRect();
            const events = ["mouseover", "mousedown", "mouseup", "click"];
            const options = {
                // clientX: x + 83, //rect.left
                clientX: x + rect.left,
                // clientY: y + 63, // rect.top
                clientY: y + rect.top,
                bubbles: true,
            };

            for (let i = 0; i < events.length; i++) {
                const event = new MouseEvent(events[i], options);
                canvas.dispatchEvent(event);
            }
        }
        const canvas = document.querySelector("canvas");
        canvas.addEventListener("mousedown", function (e) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
        });
        const [x, y] = data;
        clickOnCanvas(canvas, x, y);
    }

    async function clickMatchingElement(res) {
        for (const e of res) {
            const ele = [...document.querySelectorAll(".answer-text")].find(
                (el) => el.outerText === e
            );
            fireMouseEvents(ele);
            // await sleep(500);
            if (
                ![...document.querySelectorAll(".answer-example")].some(
                    (el) => el.style.backgroundColor === "rgb(116, 116, 116)"
                )
            ) {
                fireMouseEvents(ele);
            }
            // await sleep(500);
        }
    }

    async function sliceOG() {
        const originalCanvas = document.querySelector("canvas");
        if (!originalCanvas) return null;

        const [originalWidth, originalHeight] = [
            originalCanvas.width,
            originalCanvas.height,
        ];

        // Check if the original canvas has content
        const originalCtx = originalCanvas.getContext("2d");
        const originalImageData = originalCtx.getImageData(
            0,
            0,
            originalWidth,
            originalHeight
        );
        const allPixelsTransparentOrBlack = Array.from(
            originalImageData.data
        ).every((value, index) => index % 4 === 3 || value === 0);

        if (allPixelsTransparentOrBlack) {
            console.error("The original canvas has no valid content");
            return null;
        }

        const desiredWidth = parseInt(originalCanvas.style.width, 10);
        const desiredHeight = parseInt(originalCanvas.style.height, 10);

        // Check if the desired width and height are valid positive numbers
        if (desiredWidth <= 0 || desiredHeight <= 0) {
            console.error(
                "Desired width and height should be positive numbers"
            );
            return null;
        }

        const scaleFactor = Math.min(
            desiredWidth / originalWidth,
            desiredHeight / originalHeight
        );
        const [outputWidth, outputHeight] = [
            originalWidth * scaleFactor,
            originalHeight * scaleFactor,
        ];

        const outputCanvas = document.createElement("canvas");
        Object.assign(outputCanvas, {
            width: outputWidth,
            height: outputHeight,
        });

        const ctx = outputCanvas.getContext("2d");
        ctx.drawImage(
            originalCanvas,
            0,
            0,
            originalWidth,
            originalHeight,
            0,
            0,
            outputWidth,
            outputHeight
        );

        return outputCanvas
            .toDataURL("image/jpeg", 0.4)
            .replace(/^data:image\/(png|jpeg);base64,/, "");
    }

    function c() {
        const canvas = document.querySelector("canvas");
        if (!canvas) return null;
        const dataUrl = canvas.toDataURL("image/jpeg", 0.1);
        if (!/^data:image\/(png|jpeg);base64,([A-Za-z0-9+/=])+/.test(dataUrl))
            return null;
        const imageData = dataUrl.replace(
            /^data:image\/(png|jpeg);base64,/,
            ""
        );
        const image = new Image();
        image.src = "data:image/jpeg;base64," + imageData;
        return new Promise((resolve, reject) => {
            image.onload = () => {
                if (image.width > 0 && image.height > 0) {
                    resolve(imageData);
                } else {
                    reject(new Error("Corrupted image"));
                }
            };
            image.onerror = () => reject(new Error("Invalid image"));
        });
    }

    // process grid images
    async function fetchBase64UrlsFromCells(cells) {
        const cellsArray = Array.from(cells);
        const promises = cellsArray
            .map((img, i) => {
                const url = img.style.background.match(/url\("(.*)"/)?.[1];
                if (!url) return null;

                return new Promise((resolve, reject) => {
                    chrome.runtime.sendMessage(
                        { action: "getBase64FromUrl", url },
                        (base64Url) =>
                            base64Url
                                ? resolve([i, base64Url])
                                : reject(`Failed to get base64Url for ${url}`)
                    );
                });
            })
            .filter(Boolean); // remove null promises

        const imagePairs = await Promise.allSettled(promises);

        const images = Object.fromEntries(
            imagePairs
                .filter((result) => result.status === "fulfilled")
                .map((result) => result.value)
        );

        console.log("iergthfrdmages", images);

        return images;
    }

    function onTaskReady(i = 500) {
        return new Promise(async (resolve) => {
            const check_interval = setInterval(async function () {
                let targetText =
                    document.querySelector(".prompt-text")?.textContent;
                if (!targetText) return;

                let cells = null;
                let images = {};
                let example = {};
                let choices = [];

                if (isGrid()) {
                    cells = document.querySelectorAll(".task-image .image");
                    if (cells.length !== 9) return;

                    await fetchBase64UrlsFromCells(cells)
                        .then((imgs) => {
                            images = imgs;
                        })
                        .catch(console.error);

                    console.log("images", images);
                } else if (isMulti()) {
                    const bg =
                        document.querySelector(".task-image .image").style
                            .background;
                    if (!bg) return;
                    let singleImg = "";
                    try {
                        singleImg =
                            (await getBase64FromUrl(
                                bg.match(/url\("(.*)"/)?.at(1)
                            )) || "";
                    } catch (e) {}
                    if (!example) return;

                    Object.assign(images, {
                        [Object.keys(images).length]: singleImg,
                    });

                    const answerTextElements =
                        document.querySelectorAll(".answer-text");
                    choices = Array.from(answerTextElements).map(
                        (el) => el.outerText
                    );
                } else if (isBbox()) {
                    const canvasImg = await sliceOG();
                    if (!canvasImg) return;
                    Object.assign(images, {
                        [Object.keys(images).length]: canvasImg,
                    });
                }

                clearInterval(check_interval);
                return resolve({
                    target: targetText,
                    cells,
                    images,
                    example,
                    choices,
                });
            }, i);
        });
    }

    // end
})();

const jsNotif = (m, d) => {
    const t = document.createElement("div");
    (t.style.cssText =
        "position:fixed;top:10%;left:0;background-color:rgba(0,0,0,.8);border-radius:4px;padding:16px;color:#fff;font:calc(14px + .5vw) 'Arial',sans-serif;font-weight:bold;text-transform:uppercase;letter-spacing:1px;z-index:9999;transition:all 1s;animation:slideIn 1s forwards"),
        (t.innerHTML = m),
        document.body.appendChild(t);
    const o = document.createElement("style");
    (o.innerHTML =
        "@keyframes slideIn{0%{transform:translateX(-100%)}100%{transform:translateX(0)}}@keyframes slideOut{0%{transform:translateX(0)}100%{transform:translateX(100%)}}"),
        document.head.appendChild(o);
    setTimeout(() => {
        (t.style.animation = "slideOut 1s forwards"),
            setTimeout(() => {
                document.body.removeChild(t);
            }, 1e3);
    }, d || 3e3);
};
