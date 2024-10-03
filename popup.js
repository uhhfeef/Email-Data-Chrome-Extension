document.getElementById('exportButton').addEventListener('click', exportClicked);

function exportClicked() {
    chrome.runtime.sendMessage({action: "manualExport"}); 
}



