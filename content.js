console.log("GetYoMoneyUp loaded!");


let style = document.createElement("link");
style.rel = "stylesheet";
style.href = chrome.runtime.getURL("UIpopup.css");
document.head.appendChild(style);

function checkIfCheckout() {
    const cartKeywords = ["cart", "checkout"];
    return cartKeywords.some(keyword => window.location.href.includes(keyword));
}

function showPopup(message) {
    if (document.getElementById("custom-popup")) return; 
    let popup = document.createElement("div");
    popup.id = "custom-popup";
    popup.className = "custom-popup";
    popup.innerHTML = `
      <div class="popup-content">
        <p>${message}</p>
        <button id="save-later">Save for Later</button>
        <button id="close-popup">Close</button>
      </div>`;
    document.body.appendChild(popup);

    document.getElementById("close-popup").addEventListener("click", () => {
        popup.remove();
    });

    document.getElementById("save-later").addEventListener("click", () => {
        chrome.storage.local.get("laterList", (data) => {
            let list = data.laterList || [];
            list.push(window.location.href);
            chrome.storage.local.set({ laterList: list });
        });
        popup.remove();
        alert("Item saved for later!");
    });
}

document.addEventListener("click", (event) => {
    if (event.target.matches(".add-to-cart-button")) {
        event.preventDefault();
        showPopup("Are you really sure you need that?");
    }
});

function observeURLChanges() {
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            if (checkIfCheckout()) {
                setTimeout(() => {
                    showPopup("Think twice! Are you sure you want to hit purchase?");
                }, 1000);
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
if (checkIfCheckout()) {
    setTimeout(() => {
        showPopup("Think twice! Are you sure you want to hit purchase?");
    }, 1000);
}

observeURLChanges();
