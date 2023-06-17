(async () => {
    // console.log('OCR.js loaded');
    let settings = await chrome.storage.sync.get(null);
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    if (settings.domainData == undefined) {
        console.log('domainData not found');
        settings.domainData = {};
    }

    async function isIMGANS(img, ans) {
        return (document.querySelector(img) != null && document.querySelector(ans) != null);
    }

    const img = settings.domainData[window.location.hostname + "-" + "ImageElementPicker"].target;
    const ans = settings.domainData[window.location.hostname + "-" + "AnswerElementPicker"].target;

    let isSolved = false;


    while (true) {
        await sleep(1000);
        if (settings.APIKEY == undefined || isSolved) return;

        const i = document.querySelector(img);
        const a = document.querySelector(ans);

        if (i != null && a != null && isIMGANS(img, ans)) {
            // console.log('domainData found');
            console.log(i, a);
            // console.log(settings.domainData);
            await getAnswer(img.src, ans.value);
        }

    }
    async function getAnswer(img, ans) {

        // console.log('getAnswer');
        // try {

        //     let req = await fetch("https://pro.nocaptchaai.com/solv", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "apikey": settings.APIKEY
        //         },
        //         body: JSON.stringify({
        //             method: "ocr",
        //             id: 'mtcap',
        //             image: img.src
        //         })
        //     });
        //     res = await req.json();
        //     console.log(res, "res");
        //     if (res.solved) {
        //         document.querySelector(ans).value = res.text;
        //         isSolved = true;

        //     }

        // } catch (error) {
        //     console.log(error);
        // }

        // if (success){
        //     isSolved = true;

        // }
    }
})();