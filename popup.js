// Popup script for PR Conversation Reverser
document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleButton');
  const status = document.getElementById('status');
  
  // Check if we're on a GitHub PR/issue page
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    const url = currentTab.url;
    
    if (!url.includes('github.com') || (!url.includes('/pull/') && !url.includes('/issues/'))) {
      showStatus('Please navigate to a GitHub PR or issue page', 'error');
      toggleButton.disabled = true;
      return;
    }
    
    showStatus('Ready to toggle conversation order', 'info');
  });
  
  toggleButton.addEventListener('click', function() {
    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle' }, function(response) {
        if (chrome.runtime.lastError) {
          showStatus('Error: Please refresh the page and try again', 'error');
          return;
        }
        
        if (response && response.success) {
          const orderText = response.isReversed ? 'newest first' : 'oldest first';
          showStatus(`Conversation order: ${orderText}`, 'success');
          
          // Update button text
          toggleButton.textContent = response.isReversed ? 
            'Restore Original Order' : 'Reverse to Newest First';
        } else {
          showStatus('Could not toggle order. Try refreshing the page.', 'error');
        }
      });
    });
  });
  
  function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    
    // Hide status after 3 seconds for success/info messages
    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        status.style.display = 'none';
      }, 3000);
    }
  }
});
