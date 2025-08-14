// GitHub PR Conversation Reverser Content Script
class PRConversationReverser {
  constructor() {
    this.isReversed = false;
    this.originalOrder = null;
    this.init();
  }

  init() {
    // Check if we're on a PR or issue page
    if (this.isGitHubPROrIssue()) {
      this.setupObserver();
      this.reverseConversation();
    }
  }

  isGitHubPROrIssue() {
    const path = window.location.pathname;
    return path.includes('/pull/') || path.includes('/issues/');
  }

  setupObserver() {
    // Watch for dynamic content changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if new conversation items were added
          const hasConversationItems = Array.from(mutation.addedNodes).some(node => 
            node.nodeType === Node.ELEMENT_NODE && 
            (node.querySelector?.('.timeline-comment') || 
             node.classList?.contains('timeline-comment'))
          );
          
          if (hasConversationItems) {
            // Delay to ensure all content is loaded
            setTimeout(() => this.reverseConversation(), 100);
          }
        }
      });
    });

    // Start observing
    const targetNode = document.querySelector('#discussion_bucket') || 
                      document.querySelector('.js-discussion') ||
                      document.body;
    
    if (targetNode) {
      observer.observe(targetNode, {
        childList: true,
        subtree: true
      });
    }
  }

  getConversationContainer() {
    // Try different selectors for conversation containers
    return document.querySelector('#discussion_bucket .js-discussion') ||
           document.querySelector('.js-discussion') ||
           document.querySelector('[data-testid="issue-timeline"]') ||
           document.querySelector('.timeline-comment-wrapper').parentElement;
  }

  getConversationItems() {
    const container = this.getConversationContainer();
    if (!container) return [];

    // Get all timeline items (comments, reviews, commits, etc.)
    const items = Array.from(container.children).filter(item => {
      // Exclude our own indicator
      if (item.id === 'pr-reverser-indicator') return false;
      
      // Include timeline comments, review comments, and other conversation elements
      return item.classList.contains('timeline-comment-wrapper') ||
             item.classList.contains('timeline-comment') ||
             item.classList.contains('js-timeline-item') ||
             item.querySelector('.timeline-comment') ||
             item.querySelector('.review-comment') ||
             (item.tagName === 'DIV' && item.querySelector('[data-testid]'));
    });

    return items;
  }

  reverseConversation() {
    try {
      const container = this.getConversationContainer();
      if (!container) {
        console.log('PR Reverser: Conversation container not found');
        return;
      }

      const items = this.getConversationItems();
      if (items.length === 0) {
        console.log('PR Reverser: No conversation items found');
        return;
      }

      console.log(`PR Reverser: Found ${items.length} conversation items`);

      // Store original order if not already stored
      if (!this.originalOrder) {
        this.originalOrder = [...items]; // Simply store the elements in their current order
      }

      if (!this.isReversed) {
        // Reverse the order - move items from bottom to top
        const reversedItems = [...items].reverse();
        
        // Remove all items first
        items.forEach(item => item.remove());
        
        // Add them back in reversed order
        reversedItems.forEach(item => {
          container.appendChild(item);
        });

        this.isReversed = true;
        this.addReverseIndicator();
        console.log('PR Reverser: Conversation order reversed');
      }
    } catch (error) {
      console.error('PR Reverser: Error reversing conversation:', error);
    }
  }

  restoreOriginalOrder() {
    try {
      if (!this.originalOrder) return;

      const container = this.getConversationContainer();
      if (!container) return;

      // Simple approach: remove all items and add them back in original order
      const originalElements = [...this.originalOrder]; // Copy the array
      
      // Remove all items
      originalElements.forEach(element => {
        if (element.parentNode) {
          element.remove();
        }
      });

      // Add them back in original order
      originalElements.forEach(element => {
        container.appendChild(element);
      });

      this.isReversed = false;
      this.removeReverseIndicator();
      console.log('PR Reverser: Original conversation order restored');
    } catch (error) {
      console.error('PR Reverser: Error restoring original order:', error);
    }
  }

  toggleOrder() {
    console.log(`PR Reverser: Toggle called. Current state: ${this.isReversed ? 'reversed' : 'original'}`);
    
    if (this.isReversed) {
      this.restoreOriginalOrder();
    } else {
      this.reverseConversation();
    }
    
    console.log(`PR Reverser: After toggle. New state: ${this.isReversed ? 'reversed' : 'original'}`);
  }

  addReverseIndicator() {
    // Remove existing indicator
    this.removeReverseIndicator();

    // Add indicator that conversation is reversed
    const indicator = document.createElement('div');
    indicator.id = 'pr-reverser-indicator';
    indicator.className = 'pr-reverser-indicator';
    indicator.innerHTML = `
      <span>📄</span>
      <span>Conversation order reversed - newest first</span>
      <button id="pr-reverser-toggle" title="Toggle conversation order">↕️</button>
    `;

    // Add click handler for toggle button
    indicator.querySelector('#pr-reverser-toggle').addEventListener('click', () => {
      this.toggleOrder();
    });

    // Insert at the top of the conversation
    const container = this.getConversationContainer();
    if (container && container.firstChild) {
      container.insertBefore(indicator, container.firstChild);
    }
  }

  removeReverseIndicator() {
    const indicator = document.getElementById('pr-reverser-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
}

// Initialize when page loads
let reverser;

function initReverser() {
  // Clean up previous instance
  if (reverser) {
    reverser.removeReverseIndicator();
  }
  
  reverser = new PRConversationReverser();
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReverser);
} else {
  initReverser();
}

// Handle GitHub's single-page app navigation
let currentPath = window.location.pathname;
const observer = new MutationObserver(() => {
  if (window.location.pathname !== currentPath) {
    currentPath = window.location.pathname;
    // Delay to ensure new content is loaded
    setTimeout(initReverser, 500);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Listen for messages from popup
chrome.runtime.onMessage?.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    if (reverser) {
      reverser.toggleOrder();
      sendResponse({ success: true, isReversed: reverser.isReversed });
    }
  }
});
