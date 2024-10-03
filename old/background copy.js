let emailData = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "manualExport") {
      console.log('Manual export triggered');
      exportToCSV();
    }
    if (request.action === "saveEmail") {
      emailData.push(request.data);
      if (emailData.length >= 1) { // Save to storage every 10 emails
        chrome.storage.local.set({emailData: emailData}, function() {
          console.log('Email data saved to storage');
        });
      }
    }
});

// Function to export data as CSV
function exportToCSV() {
    chrome.storage.local.get(['emailData'], function(result) {
      console.log('Retrieved data:', result.emailData);
      if (result.emailData && result.emailData.length > 0) {
        let csv = 'Sender,Subject,Body,TimeSpent,LinksClicked\n';
        result.emailData.forEach(function(email) {
          csv += `"${email.sender}","${email.subject}","${email.body.replace(/"/g, '""')}",${email.timeSpent},${email.linksClicked}\n`;
        });
        
        // Encode the CSV string as a data URI
        const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        
        // Use chrome.downloads.download() API with the data URI
        chrome.downloads.download({
          url: dataUri,
          filename: 'email_data.csv',
          saveAs: false
        }, function(downloadId) {
          if (chrome.runtime.lastError) {
            console.error("Download failed:", chrome.runtime.lastError);
          } else {
            console.log("Download started, ID:", downloadId);
          }
        });
      } else {
        console.log('No data to export');
        // Notify the user that there's no data
        chrome.runtime.sendMessage({action: "noData"});
      }
    });
  }

// Set up a periodic export (e.g., every hour)
// chrome.alarms.create('exportData', { periodInMinutes: 60 });
// chrome.alarms.onAlarm.addListener((alarm) => {
//   if (alarm.name === 'exportData') {
//     exportToCSV();
//   }
// });