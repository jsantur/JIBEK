// DOM Modifications Script
// This script modifies the counter values on the Chapa Cash website

function modifyCounters() {
    // Function to modify the first counter (100 millones -> 500 mil with counter animation)
    function modifyFirstCounter() {
        const firstCounter = document.querySelector('.counter[data-to="100"]');
        if (firstCounter) {
            // Change the data-to attribute to make it animate to 500 instead of 100
            firstCounter.setAttribute('data-to', '500');
            // Reset the text content to start from 0 for proper animation
            firstCounter.textContent = '0';
            console.log('First counter modified: 100 millones -> 500 mil (with animation)');
        }
    }

    // Function to modify the second counter (40 mil -> 10 mil with animation)
    function modifySecondCounter() {
        const secondCounter = document.querySelector('.counter[data-to="40"]');
        if (secondCounter) {
            // Change the data-to attribute to make it animate to 10 instead of 40
            secondCounter.setAttribute('data-to', '10');
            // Reset the text content to start from 0 for proper animation
            secondCounter.textContent = '0';
            console.log('Second counter modified: 40 mil -> 10 mil (with animation)');
        }
    }

    // Function to intercept and modify counter animations
    function interceptCounterAnimations() {
        // Override the rnz.startCounter function if it exists
        if (window.rnz && window.rnz.startCounter) {
            const originalStartCounter = window.rnz.startCounter;
            window.rnz.startCounter = function(counter) {
                // Check if this is one of our target counters
                if (counter.getAttribute('data-to') === '500') {
                    // Let the 500 counter animate normally (we changed it from 100 to 500)
                    return originalStartCounter(counter);
                } else if (counter.getAttribute('data-to') === '10') {
                    // Let the 10 counter animate normally (we already changed it from 40 to 10)
                    return originalStartCounter(counter);
                } else {
                    // Let other counters animate normally
                    return originalStartCounter(counter);
                }
            };
        }

        // Monitor for dynamically added counter elements
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            // Check if this node or its children contain our target counters
                            const counter500 = node.querySelector ? node.querySelector('.counter[data-to="500"]') : null;
                            const counter40 = node.querySelector ? node.querySelector('.counter[data-to="40"]') : null;
                            
                            if (counter500) {
                                modifyFirstCounter();
                            }
                            if (counter40) {
                                modifySecondCounter();
                                // Trigger animation for the modified counter
                                setTimeout(() => {
                                    const modifiedCounter = document.querySelector('.counter[data-to="500"]');
                                    if (modifiedCounter && modifiedCounter.textContent === '0') {
                                        triggerCounterAnimation(modifiedCounter);
                                    }
                                }, 100);
                            }
                        }
                    });
                }
            });
        });

        // Start observing the entire document
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Function to trigger counter animation manually (compatible with rnz.setupCounters)
    function triggerCounterAnimation(counter) {
        // Use the same animation logic as the original rnz.setupCounters
        let startTime = null;
        const duration = 2000; // 2 segundos (same as original)
        const target = parseInt(counter.getAttribute("data-to"), 10);
        
        function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const value = Math.floor(progress * target);
            
            // For the 500 counter, show the number during animation and "+500 mil" at the end
            if (target === 500) {
                if (progress < 1) {
                    counter.textContent = value;
                } else {
                    counter.textContent = '+500 mil';
                }
            } else {
                counter.textContent = value;
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                if (target !== 500) {
                    counter.textContent = target;
                }
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Execute modifications immediately
    modifyFirstCounter();
    modifySecondCounter();
    
    // Wait for the original rnz.setupCounters to potentially initialize, then trigger our animation
    setTimeout(() => {
        const modifiedCounter = document.querySelector('.counter[data-to="500"]');
        if (modifiedCounter && modifiedCounter.textContent === '0') {
            // If the counter is still at 0, trigger our animation
            triggerCounterAnimation(modifiedCounter);
        }
    }, 500);
    
    // Set up animation interception
    interceptCounterAnimations();

    // Also try again after a short delay to handle any delayed loading
    setTimeout(() => {
        modifyFirstCounter();
        modifySecondCounter();
    }, 100);

    // And again after a longer delay for slow-loading content
    setTimeout(() => {
        modifyFirstCounter();
        modifySecondCounter();
    }, 1000);
}

// Run the modifications when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', modifyCounters);
} else {
    modifyCounters();
}

// Also run when window is fully loaded to catch any late-loading content
window.addEventListener('load', modifyCounters);

console.log('DOM modifications script loaded');
