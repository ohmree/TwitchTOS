import "../img/icon128.png";

chrome.runtime.onInstalled.addListener((_object) => {
    chrome.tabs.create({ url: "/options.html" }, (_tab) => {});
});

function refresh() {
    chrome.storage.sync.get(["access_token"], (result) => {
        const url = `https://twitchtos.herokuapp.com/refresh?access_token=${result.access_token}`;
        fetch(url)
            .then((r) => r.text())
            .then((result) => {
                if (result == "bruh") {
                    chrome.storage.sync.set({ logged_in: false });
                } else {
                    chrome.storage.sync.set({ access_token: result });
                    console.log(`Refreshing the thing ${result}`);
                }
            });
    });
}

setInterval(refresh, 1000 * 500);

chrome.storage.onChanged.addListener((changes, _namespace) => {
    for (const key in changes) {
        const storageChange = changes[key];
        if (key == "authcode") {
            const authCode = storageChange.newValue;
            fetch(`https://twitchtos.herokuapp.com/auth?authcode=${authCode}`)
                .then((r) => r.text())
                .then((result) => {
                    chrome.storage.sync.set({ access_token: result });
                    chrome.storage.sync.set({ logged_in: true });
                    console.log("Logged in");
                });
        }
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo && changeInfo.status == "complete") {
        chrome.tabs.sendMessage(tabId, { data: tab }, () => {});
    }
});
