let startTime, email;

// Listen for email opens
document.addEventListener('click', function(e) {
    const emailRow = e.target.closest('.zA');

    if (emailRow) {
        console.log('Email opened');

        const sender = emailRow.querySelector('.yW').innerText; // Extract sender name
        const senderEmail = emailRow.querySelector('.yP, .zF').getAttribute('email'); // Extract sender email
        startTime = Date.now(); // Set start time

        email = {
            sender: sender,
            senderEmail: senderEmail,
            subject: emailRow.querySelector('.y6').innerText,
            body: '',
            timeSpent: 0,
            linksClicked: 0
        }
    }
});

// Function to extract email body
function getEmailBody() {
    const bodyElement = document.querySelector('.a3s.aiL');
    return bodyElement ? bodyElement.innerText : '';
}


// Listen for clicks on links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && email) {
        email.linksClicked++;
        console.log(email.linksClicked);
    }
})

// Listen for hash changes
window.addEventListener('hashchange', function() {
    console.log('Hash changed to: ' + location.hash);
    if (location.hash === '#inbox') {
        emailClosed();
    }
});

// Function to handle email close
function emailClosed() {
    email.timeSpent = (Date.now() - startTime) / 1000; // Convert to seconds
        console.log('Email closed');
        console.log(email);

        // Send to bg.js
        saveEmailData();
}

// Function to save email data to storage via bg.js
function saveEmailData() {
    chrome.runtime.sendMessage({action: "saveEmail", data: email});
    // alert('Data saved successfully!');
    console.log('Data saved successfully!');
}



// Mutation observer configuration for the element to observe
const targetElement = document.body;

// Create a new MutationObserver instance
const observer = new MutationObserver(function callback(mutationsList, observer) {
    // Loop through the mutationsList to process each mutation
    for (let mutation of mutationsList) {
        if (email && !email.body) {
            email.body = getEmailBody();
            console.log(email.body);
        }
      }
    }
);

// Start observing the target element
observer.observe(targetElement, { childList: true, subtree: true });


chrome.runtime.addEventListener('message', function(request, sender, sendResponse) {
    if (request.action === "createdEmailData") {
        alert('WARNING: New data created');
    }
})