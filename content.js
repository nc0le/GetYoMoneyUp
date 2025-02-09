console.log("GetYoMoneyUp loaded!");

// Load CSS dynamically
let style = document.createElement("link");
style.rel = "stylesheet";
style.href = chrome.runtime.getURL("UIpopup.css");
document.head.appendChild(style);

/* Checkout detection */
function checkIfCheckout() {
    const cartKeywords = ["cart", "bag", "basket", "checkout", "order-summary", "payment"];
    return cartKeywords.some(keyword => window.location.href.toLowerCase().includes(keyword));
}

/* Show the confirmation popup */
function showPopup(message) {
    if (document.getElementById("custom-popup")) return; // Prevent duplicate popups

    fetch(chrome.runtime.getURL("1.html"))
        .then(response => response.text())
        .then(html => {
            let popup = document.createElement("div");
            popup.id = "custom-popup";
            popup.className = "custom-popup";
            popup.innerHTML = html;
            document.body.appendChild(popup);

            // Attach event listeners AFTER inserting the popup
            document.getElementById("close-button")?.addEventListener("click", () => popup.remove());
            document.getElementById("btn-save")?.addEventListener("click", () => {
                saveForLater();
                popup.remove(); // Close popup after saving
            });
            document.getElementById("cart-button")?.addEventListener("click", showSavedItems);
        })
        .catch(error => console.error("Error loading popup:", error));
}

/* Detects when user clicks an "Add to Cart" button */
document.addEventListener("click", (event) => {
    if (event.target.matches("cart-button")) {
        event.preventDefault();
        showPopup("Are you really sure you need that?");
    }
});

/* Observe URL changes for checkout detection */
function observeURLChanges() {
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            if (checkIfCheckout()) {
                setTimeout(() => showPopup("Think twice! Are you sure you want to hit purchase?"), 1000);
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

/* Fallback: Check every 2 seconds */
setInterval(() => {
    if (checkIfCheckout()) showPopup("Think twice! Are you sure you want to hit purchase?");
}, 2000);

/* Run immediately if already on a checkout page */
if (checkIfCheckout()) {
    setTimeout(() => showPopup("Think twice! Are you sure you want to hit purchase?"), 1000);
}

observeURLChanges();

/* Save for Later Functionality */
function saveForLater() {
    chrome.storage.local.get("laterList", (data) => {
        let list = data.laterList || [];
        if (!list.includes(window.location.href)) {
            list.push(window.location.href);
            chrome.storage.local.set({ laterList: list }, () => {
                alert("Item saved for later!");
            });
        } else {
            alert("Item is already in your saved list!");
        }
    });
}

/* Show Saved Items */
function showSavedItems() {
    chrome.storage.local.get("laterList", (data) => {
        let list = data.laterList || [];

        // Remove existing saved items popup if open
        document.getElementById("saved-popup")?.remove();

        let popup = document.createElement("div");
        popup.id = "saved-popup";
        popup.className = "custom-popup";
        popup.innerHTML = `
            <div class="popup-content">
                <h3>Saved for Later</h3>
                <ul id="saved-items">
                    ${list.length === 0 ? "<p>No saved items.</p>" : ""}
                </ul>
                <button id="close-saved">Close</button>
            </div>`;
        document.body.appendChild(popup);

        let savedItemsContainer = document.getElementById("saved-items");

        list.forEach((link, index) => {
            let item = document.createElement("li");
            item.innerHTML = `<a href="${link}" target="_blank">${link}</a> 
                              <button class="delete-btn" data-index="${index}">🗑️</button>`;
            savedItemsContainer.appendChild(item);
        });

        // Close button for saved items popup
        document.getElementById("close-saved").addEventListener("click", () => popup.remove());

        // Attach event listeners to delete buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                let index = event.target.getAttribute("data-index");
                deleteSavedItem(index);
                popup.remove();
                setTimeout(showSavedItems, 100); // Refresh the list
            });
        });
    });
}

/* Delete a Saved Item */
function deleteSavedItem(index) {
    chrome.storage.local.get("laterList", (data) => {
        let list = data.laterList || [];
        list.splice(index, 1); // Remove the item
        chrome.storage.local.set({ laterList: list }, () => {
            console.log("Item removed from saved list.");
        });
    });
}
