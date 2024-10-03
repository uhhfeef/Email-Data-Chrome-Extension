/**
 * @fileoverview Background script for Gmail Interest Tracker extension.
 * @author afeef<br>
 * https://github.com/uhhfeef
 *
 * @description
 * This script listens for messages from the content script and saves the
 * email data to storage. It also exports the email data as a CSV file when
 * the export button is clicked.
 *
 * @note
 * Content remains persistent despite reloading service worker, updating
 * extension and reloading webpage. However, when the export button is clicked
 * for the first time in that reloaded service worker session, the old data is
 * lost.
 * CRITICAL: DO NOT RELOAD SERVICE WORKER
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveEmail") {
        console.log('inside saveEmail in bg');

        try {
            chrome.storage.local.get(['emailData'], function(result) {
                let emailData = result.emailData;
                if (!emailData) {
                    console.warn("emailData doesn't exist in storage, creating new one");
                    emailData = [];

                    // Send a message to the content script to alert that a new email data was created
                    chrome.runtime.sendMessage({action: "createdEmailData", data: emailData}); // 
                }

                emailData.push(request.data); 
                chrome.storage.local.set({emailData: emailData}, function() {
                    console.log('Email data saved to storage');
                    console.log(emailData);
                });
            })
        } catch (error) {
            console.error("Error saving email data to storage: ", error);
        }
    }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "manualExport") {
        exportToCSV();
    }
})

function exportToCSV() {

    // Retrieve email data from storage
    chrome.storage.local.get(['emailData'], function(result) {
        let csv = 'Sender,Subject,Body,TimeSpent,LinksClicked\n';

        // Loop through email data and add it to the CSV string
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
        });
    });
}        
    