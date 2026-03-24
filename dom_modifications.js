// DOM Modifications Script
// This script modifies the counter values on the Chapa Cash website

function modifyCounters() {
    // Function to modify the first counter (100 millones -> Medio millón) with typing animation
    function modifyFirstCounter() {
        const firstCounter = document.querySelector('.counter[data-to="100"]');
        if (firstCounter) {
            const parentH3 = firstCounter.closest('h3');
            if (parentH3) {
                const targetText = 'Medio millón';
                const duration = 2000; // 2 seconds, same as the 10 mil animation
                let charIndex = 0;
                const intervalTime = duration / targetText.length;

                parentH3.textContent = ''; // Clear existing text

                const typingInterval = setInterval(() => {
                    parentH3.textContent += targetText[charIndex];
                    charIndex++;
                    if (charIndex === targetText.length) {
                        clearInterval(typingInterval);
                        console.log('First counter modified: 100 millones -> Medio millón (typing animation)');
                    }
                }, intervalTime);
            }
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
                if (counter.getAttribute('data-to') === '100') {
                    // Skip animation for the 100 counter (we'll replace with static text)
                    modifyFirstCounter();
                    return;
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
                            const counter100 = node.querySelector ? node.querySelector('.counter[data-to="100"]') : null;
                            const counter40 = node.querySelector ? node.querySelector('.counter[data-to="40"]') : null;
                            
                            if (counter100) {
                                modifyFirstCounter();
                            }
                            if (counter40) {
                                modifySecondCounter();
                                // Trigger animation for the modified counter
                                setTimeout(() => {
                                    const modifiedCounter = document.querySelector('.counter[data-to="10"]');
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
            counter.textContent = value;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Execute modifications immediately
    modifyFirstCounter();
    modifySecondCounter();
    
    // Wait for the original rnz.setupCounters to potentially initialize, then trigger our animation
    setTimeout(() => {
        const modifiedCounter = document.querySelector('.counter[data-to="10"]');
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
