/*This script displays a financial insight and saves items to "Saved for Later."*/
console.log('This is a popup!');

document.addEventListener("DOMContentLoaded", () => {
    let listElement = document.getElementById("later-list");
  
    chrome.storage.local.get(["laterList"], (data) => {
      let list = data.laterList ?? [];  
  
      list.forEach((item) => {
        let li = document.createElement("li");
        let link = document.createElement("a");
        link.href = item;
        link.textContent = item;
        link.target = "_blank";
        li.appendChild(link);
        listElement.appendChild(li);
      });
    });
  });
  