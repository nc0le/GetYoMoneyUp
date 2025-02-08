/*This script runs when a user is on an e-commerce site. 
It listens for checkout interactions and sends a message to the background script.*/

console.log("GetYoMoneyUp loaded!");

let style = document.createElement("link");
style.rel = "stylesheet";
style.href = chrome.runtime.getURL("UIpopup.css");
document.head.appendChild(style);


document.addEventListener("click", (event) => {
    if (event.target.matches(".add-to-cart-button")) {
      event.preventDefault();
      showPopup("Are you really sure you need that?");
    } else if (window.location.href.includes("/cart")) {
      setTimeout(() => {
        showPopup("Think twice! Are you sure you want to hit purchase?");
      }, 1000);
    }
  });
  
  function showPopup(message) {
    let popup = document.createElement("div");
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
  