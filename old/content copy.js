let startTime, currentEmail;

// Function to extract email body
function getEmailBody() {
  const bodyElement = document.querySelector('.a3s.aiL');
  return bodyElement ? bodyElement.innerText : '';
}

// Listen for email opens
document.addEventListener('click', function(e) {
  if (e.target.closest('.zA')) {
    console.log('Email opened');
    startTime = Date.now();
    const emailRow = e.target.closest('.zA');
    currentEmail = {
      sender: emailRow.querySelector('.yP, .zF').getAttribute('email'),
      subject: emailRow.querySelector('.y6').innerText,
      body: '', // We'll fill this when the email loads
      timeSpent: 0,
      linksClicked: 0
    };
    console.log(currentEmail);
  }
});

// Listen for email body load
const observer = new MutationObserver(function(mutations) {
  if (currentEmail && !currentEmail.body) {
    currentEmail.body = getEmailBody();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Listen for email closes
document.addEventListener('click', function(e) {
  if (e.target.closest('.asa') && currentEmail) {
    currentEmail.timeSpent = (Date.now() - startTime) / 1000; // Convert to seconds
    saveEmailData(currentEmail);
    currentEmail = null;
    console.log('Email closed');
  }
});

// Listen for link clicks
document.addEventListener('click', function(e) {
  if (e.target.tagName === 'A' && currentEmail) {
    console.log('Link clicked');
    currentEmail.linksClicked++;
  }
});

function saveEmailData(emailData) {
  chrome.runtime.sendMessage({action: "saveEmail", data: emailData});
}