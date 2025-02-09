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

                // Close button should remove popup AND save closed state for this URL
                document.getElementById("close-button")?.addEventListener("click", () => {
                    showPopupEmpty(popup);
                   
                });

                document.getElementById("btn-save")?.addEventListener("click", () => {
                    saveForLater();
                    showPopupEmpty(popup);
                });

                document.getElementById("cart-button")?.addEventListener("click", () =>{
                    showSavedItems();
                    showPopupEmpty(popup);
                });
                document.getElementById("btn-no")?.addEventListener("click", () =>{
                    showPopup5(popup)});
                document.getElementById("btn-yes")?.addEventListener("click", () => {
                    showPopup2(popup);
                    // closedUrls.push(currentUrl);
                    // chrome.storage.local.set({ closedUrls });
                    // popup.remove();
                });
            })
            .catch(error => console.error("Error loading popup:", error));
    
}


function showPopup2(popup) {
    // Fetch 2.html to load the second popup content
    console.log("Loading 2.html inside the popup...");
  
        fetch(chrome.runtime.getURL("2.html"))
        .then(response => response.text())
        .then(html2 => {
            // let popup = document.createElement("div");
            popup.innerHTML = html2; // ✅ Replace the content of the popup with 2.html

            // Attach event listeners for the new popup (2.html)
            document.getElementById("close-button")?.addEventListener("click", () => showPopupEmpty(popup));
            document.getElementById("btn-save")?.addEventListener("click", () => {
                saveForLater();
                showPopupEmpty(popup);
            });
            document.getElementById("cart-button")?.addEventListener("click", showSavedItems);
            

            document.getElementById("btn-no")?.addEventListener("click", () => {
                showPopup5(popup)
            });

            document.getElementById("btn-yes")?.addEventListener("click", () => {
                showPopup3(popup)
            });
        })
        .catch(error => console.error("Error loading second popup:", error));
    // });
}
function showPopup3(popup) {
    // Fetch 2.html to load the second popup content
    console.log("Loading 3.html inside the popup...");
    fetch(chrome.runtime.getURL("3.html"))
        .then(response => response.text())
        .then(html3 => {
            // let popup = document.createElement("div");
            popup.innerHTML = html3; // ✅ Replace the content of the popup with 2.html

            // Attach event listeners for the new popup (2.html)
            document.getElementById("close-button")?.addEventListener("click", () => showPopupEmpty());
            
            document.getElementById("cart-button")?.addEventListener("click", showSavedItems);
            

            document.getElementById("cancel-button")?.addEventListener("click", () => {
                showPopup6(popup)
            });

            document.getElementById("confirm-button")?.addEventListener("click", () => {
                showPopup4(popup)
            });
        })
        .catch(error => console.error("Error loading second popup:", error));
}
function showPopupEmpty(popup) {
    console.log("Loading empty.html inside the popup...");
    fetch(chrome.runtime.getURL("empty.html"))
        .then(response => response.text())
        .then(htmle => {
            // let popup = document.createElement("div");
            popup.innerHTML = htmle; // ✅ Replace the content of the popup with 2.html

            // Attach event listeners for the new popup (2.html)
         
        })
        .catch(error => console.error("Error loading second popup:", error));
}

function showPopup4(popup) {
    // Fetch 4.html to load the second popup content
    console.log("Loading 4.html inside the popup...");
    fetch(chrome.runtime.getURL("4.html"))
        .then(response => response.text())
        .then(html4 => {
            // let popup = document.createElement("div");
            popup.innerHTML = html4; // ✅ Replace the content of the popup with 2.html

            // Attach event listeners for the new popup (2.html)
            document.getElementById("close-button")?.addEventListener("click", () => showPopupEmpty(popup));
            
            document.getElementById("cart-button")?.addEventListener("click", showSavedItems);

            document.getElementById("exit-button")?.addEventListener("click", () => {
                showPopupEmpty(popup);
            });
        })
        .catch(error => console.error("Error loading second popup:", error));
}

function showPopup5(popup) {
    // Fetch 2.html to load the second popup content
    console.log("Loading 5.html inside the popup...");
    fetch(chrome.runtime.getURL("5.html"))
        .then(response => response.text())
        .then(html4 => {
            // let popup = document.createElement("div");
            popup.innerHTML = html4; // ✅ Replace the content of the popup with 2.html

            // Attach event listeners for the new popup (2.html)
            document.getElementById("close-button")?.addEventListener("click", () => showPopupEmpty(popup));
            
            document.getElementById("cart-button")?.addEventListener("click", showSavedItems);

            document.getElementById("exit-button1")?.addEventListener("click", () => {
                showPopupEmpty(popup);
            });
        })
        .catch(error => console.error("Error loading second popup:", error));
}

function showPopup6(popup) {
    // Fetch 2.html to load the second popup content
    console.log("Loading 6.html inside the popup...");
    fetch(chrome.runtime.getURL("6.html"))
        .then(response => response.text())
        .then(html4 => {
            // let popup = document.createElement("div");
            popup.innerHTML = html4; // ✅ Replace the content of the popup with 2.html

            // Attach event listeners for the new popup (2.html)
            document.getElementById("close-button")?.addEventListener("click", () => showPopupEmpty(popup));
            
            document.getElementById("cart-button")?.addEventListener("click", showSavedItems);

            document.getElementById("exit-button1")?.addEventListener("click", () => {
                showPopupEmpty(popup);
            });
            document.getElementById("btn-save")?.addEventListener("click", () => {
                saveForLater();
                showPopupEmpty(popup);
            });
            
        })
        .catch(error => console.error("Error loading second popup:", error));
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
        let currentUrl = window.location.href;

        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            
            // ✅ Only show popup again if the new URL is a checkout/cart page
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
            <div class="modal-header">
                <button id="close-button" class="btn close-button">✕</button>
                <span class="site-name">getyomoneyup</span>
            </div> 

            <div class="popup-content">
                <h3>Saved for Later</h3>
                <ul id="saved-items">
                    ${list.length === 0 ? "<p>No saved items.</p>" : ""}
                </ul>
            </div>`;

        document.body.appendChild(popup);

        let savedItemsContainer = document.getElementById("saved-items");

        list.forEach((link, index) => {
            let shortText = link.length > 30 ? link.substring(0, 25) + "..." : link; // Truncate URL
            let domain = new URL(link).hostname; // Get the domain name
            
            let item = document.createElement("li");
            item.innerHTML = `<a href="${link}" target="_blank">${domain}/...</a> 
                              <button class="delete-btn" data-index="${index}">🗑️</button>`;
            savedItemsContainer.appendChild(item);
        });

        // Close button for saved items popup
        document.getElementById("close-button").addEventListener("click", () =>showPopupEmpty(popup));

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