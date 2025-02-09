console.log('This is a popup!');

document.addEventListener("DOMContentLoaded", () => {
    let listElement = document.getElementById("later-list");

    chrome.storage.local.get(["laterList"], (data) => {
        let list = data.laterList ?? [];  

        list.forEach((item) => {
            let li = document.createElement("li");
            let link = document.createElement("a");
            link.href = item;
            link.target = "_blank";
            
            // Extract domain and truncate the link
            let domain = new URL(item).hostname; 
            let shortText = item.length > 30 ? domain + "/..." : item; // Show domain + "..."

            link.textContent = shortText;
            link.title = item; // Tooltip shows full URL on hover

            li.appendChild(link);
            listElement.appendChild(li);
        });
    });
});
