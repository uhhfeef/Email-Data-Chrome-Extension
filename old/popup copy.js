document.getElementById('exportButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "manualExport"});
    document.getElementById('status').textContent = 'Exporting...';
  });
  
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
if (request.action === "noData") {
    document.getElementById('status').textContent = 'No data to export. Try interacting with some emails first.';
}
});