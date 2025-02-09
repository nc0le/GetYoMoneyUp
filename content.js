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
     <section class="purchase-modal">
    <div class="modal-container">
        <header class="modal-header">
        <div class="header-content">
        <div class="modal-header">
            <button class="close-button">✕</button>
            <span class="site-name">getyomoneyup</span>
            <button class="cart-button">🛒</button>
        </div>
       </div>
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/5908bb3fc4274044aed8528e1ce2987a/23bdda4877b74da786b8ffe93956e2bb9e54ad0f0839f1ec39c61e892d166b7d?placeholderIfAbsent=true" class="header-image" alt="Header illustration" />
        </div>
        </header>

        <h2 class="modal-title">Are you <span class="highlight">SURE</span> you want to<br>buy this product?</h2>

        <nav class="action-buttons">
        <button class="btn btn-yes">Yes</button>
        <button class="btn btn-save">Save for Later</button>
        <button class="btn btn-no">No</button>
        </nav>
    </div>
    </section>`;
    document.body.appendChild(popup);

    // document.getElementById("close-button").addEventListener("click", () => {
    //     popup.remove();
    // });
    document.getElementById("btn-no").addEventListener("click", () => {
        popup.remove();
    });

    document.getElementById("btn-save").addEventListener("click", () => {
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