(async () => {
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

    if (
        location.search.startsWith("?apikey=") &&
        location.href.startsWith("https://config.nocaptchaai.com")
    ) {
        let s = await chrome.storage.sync.get(null);
        const get_endpoint =
            "https://manage.nocaptchaai.com/api/user/get_endpoint";

        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        chrome.storage.sync.set({
            APIKEY: params.apikey?.length > 0 ? params.apikey : null,
            PLANTYPE: params.plan?.length > 0 ? params.plan : null,
            hcaptime: params.hcaptime?.length > 0 ? params.hcaptime : 5,
            endpoint: params.endpoint?.length > 0 ? params.endpoint : null,
            hcaptime_multi:
                params.hcaptime_multi != null ? params.hcaptime_multi : 1,
            hcaptime_bbox:
                params.hcaptime_bbox != null ? params.hcaptime_bbox : 1,
            hCap: params.hcap != null ? params.hcap : true,
            reCap: params.recap != null ? params.recap : true,
            OCR: params.ocr != null ? params.ocr : true,
            debug: params.debug != null ? params.debug : false,
        });

        chrome.storage.sync.get(null, (items) => console.table(items));

        let settings = await chrome.storage.sync.get(null);

        if (settings.apikey.length < 0) {
            jsNotif("empty apikey");
        } else {
            // console.log(settings.apikey, settings.endpoint, settings.plantype);
            (async () => {
                let res = await fetch(get_endpoint, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        apikey: settings.apikey,
                    },
                });
                res = await res.json();
                // console.log(res);
                if (res.error) {
                    jsNotif(
                        res.error + "\n noCaptchaAi Extension Config failed ✘"
                    );
                    chrome.storage.sync.set({ apikey: "" });
                } else if (res.plan === "free") {
                    jsNotif("noCaptchaAi Extension \n Config Successful ✔️");

                    const iframes = [
                        ...document.querySelectorAll("[src*=newassets]"),
                    ];
                    for (const iframe of iframes) {
                        const url = iframe.src;
                        iframe.src = "about:blank";
                        setTimeout(function () {
                            iframe.src = url;
                        }, 10);
                    }
                } else if (res.plan === "daily" || "unlimited" || "wallet") {
                    if (res.custom) {
                        chrome.storage.sync.set({
                            plantype: "custom",
                            endpoint: res.custom.includes(params.endpoint)
                                ? params.endpoint
                                : res.custom[0],
                        });
                        // console.log((await chrome.storage.sync.get("endpoint")).endpoint);
                        jsNotif(
                            `noCaptchaAi Extension Custom plan \n Config Successful ✔️`
                        );
                        return;
                    }
                    chrome.storage.sync.set({
                        plantype: "PRO",
                    });

                    jsNotif(
                        `noCaptchaAi Extension ${res.plan} plan \n Config Successful ✔️`
                    );
                }
            })();
        }
    }
})();
