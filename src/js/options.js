import "bootstrap/js/dist/carousel";

import "../css/options.css";

const button = document.getElementById("signin");
const donate = document.getElementById("donate");

button.onclick = () => {
    chrome.identity.launchWebAuthFlow(
        {
            url:
                "https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id=dv2j00xctf5qhix8y271pl0vnm20ny&redirect_uri=https://iecemifilihdioifbjkecacedfgfbfpl.chromiumapp.org/cb&scope=user:read:email",
            interactive: true,
        },
        (redirectUrl) => {
            const url = new URL(redirectUrl);

            const authCode = url.searchParams.get("code");

            chrome.storage.sync.set({
                authcode: authCode,
            });
            console.log(authCode);
            alert("Successfully signed in! You can now close the tab.");
        }
    );
};

donate.onclick = () => {
    window.open("https://paypal.me/alex4160", "_blank");
};
